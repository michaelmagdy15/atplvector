#!/usr/bin/env python3
"""
Cinematic Human Voice & Netflix Documentary Audio Engine for ATPLVector v3.

Pipeline:
1. Calls Google Gemini 3.1 Flash TTS (`gemini-3.1-flash-tts-preview`) in ONE
   continuous dramatic documentary monologue (`Charon` voice) so breathing,
   cadence, gravitas, and tension sound genuinely human.
2. Runs local `faster_whisper` (`base.en`, word_timestamps=True) on the single-take
   narration to extract exact millisecond word boundaries and verify zero leaked
   stage-direction prompt headers.
3. Synthesizes a 48 kHz dark D-minor documentary music score and beat-synced
   aviation/UI SFX, applies clean broadcast voice mastering, and mixes with
   FFmpeg sidechain auto-ducking (-14 LUFS) into `master_audio.wav`.
"""

from __future__ import annotations

import argparse
import io
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

# Reuse copyright-safe score + SFX synthesizer from v2 without duplicating math
THIS_DIR = Path(__file__).resolve().parent
V2_DIR = THIS_DIR.parent / "v2_netflix"
for _p in (THIS_DIR, V2_DIR):
    if str(_p) not in sys.path:
        sys.path.insert(0, str(_p))
from audio_engine import synthesize_music_and_sfx  # noqa: E402
from v3_topic_specs import get_topic_spec  # noqa: E402

SR = 48000
DEFAULT_MODEL = "gemini-3.1-flash-tts-preview"
DEFAULT_VOICE = "Charon"
MODEL_CASCADE = (
    "gemini-3.1-flash-tts-preview",
    "gemini-2.5-flash-preview-tts",
    "gemini-3.8-flash-tts",
)

FORBIDDEN_HEADER_WORDS = {
    "profile", "narrator", "pronunciation", "transcript", "director",
    "az-dah", "toe-dah", "ee-ah-sah", "robotic", "speak", "gripping",
    "brisk", "briskly", "netflix", "authority", "enunciation", "dragging",
    "read", "aloud",
}


def build_model_attempts(spec: dict, primary_model: str) -> list[tuple[str, str, str]]:
    """Build ordered (model, label, prompt) attempts across the 3 Gemini TTS models."""
    hints = spec.get("pronunciation_hints") or "EASA as ee-ah-sah"
    body = spec["transcript"]

    prompts_by_model = {
        "gemini-3.1-flash-tts-preview": [
            (
                "director_profile",
                "Speak with gripping, brisk Netflix aviation documentary narration in around 50 seconds: "
                f"warm, deep human baritone authority, crisp airline-captain enunciation ({hints}), "
                "natural human breaths, tight momentum, never dragging and never robotic:\n\n"
                f"{body}",
            ),
            ("concise_fallback", f"Speak clearly and briskly like a calm Netflix documentary narrator:\n\n{body}"),
        ],
        "gemini-2.5-flash-tts": [],
        "gemini-2.5-flash-preview-tts": [
            (
                "read_aloud_style",
                f"Read aloud in a gripping, brisk Netflix aviation documentary voice (~50 seconds, crisp airline-captain pronunciation: {hints}):\n\n{body}",
            ),
            ("read_aloud_concise", f"Read aloud in a calm, authoritative Netflix documentary voice:\n\n{body}"),
        ],
        "gemini-3.8-flash-tts": [
            # Strictly bare transcript for 3.8 so headers/instructions are never spoken aloud
            ("bare_transcript", body),
        ],
    }

    order = [primary_model] + [m for m in MODEL_CASCADE if m != primary_model]
    attempts: list[tuple[str, str, str]] = []
    for mdl in order:
        pairs = prompts_by_model.get(mdl) or [("bare_transcript", body)]
        for lbl, txt in pairs:
            attempts.append((mdl, lbl, txt))
    return attempts


def _resample_audio(y: np.ndarray, orig_sr: int, target_sr: int) -> np.ndarray:
    if orig_sr == target_sr or len(y) == 0:
        return y.astype(np.float32)
    if y.ndim > 1:
        y = np.mean(y, axis=1)
    new_len = int(round(len(y) * (target_sr / orig_sr)))
    xp = np.linspace(0.0, 1.0, len(y), dtype=np.float64)
    xq = np.linspace(0.0, 1.0, new_len, dtype=np.float64)
    return np.interp(xq, xp, y).astype(np.float32)


def _trim_silence(y: np.ndarray, sr: int, thresh_db: float = -42.0) -> np.ndarray:
    thresh = 10.0 ** (thresh_db / 20.0)
    idx = np.where(np.abs(y) > thresh)[0]
    if len(idx) == 0:
        return y
    pad = int(0.06 * sr)
    s = max(0, int(idx[0]) - pad)
    e = min(len(y), int(idx[-1]) + pad)
    return y[s:e]


def _clamp_long_pauses(y: np.ndarray, sr: int, max_gap_s: float = 0.62, target_gap_s: float = 0.45) -> np.ndarray:
    """Shorten overly long silent pauses without clipping natural breaths."""
    thresh = 10.0 ** (-44.0 / 20.0)
    win = int(0.02 * sr)
    env = np.convolve(np.abs(y), np.ones(win) / win, mode="same")
    silent = env < thresh
    max_samples = int(max_gap_s * sr)
    keep_edge = int(target_gap_s * 0.5 * sr)

    out_chunks: list[np.ndarray] = []
    n = len(y)
    i = 0
    while i < n:
        if not silent[i]:
            j = i
            while j < n and not silent[j]:
                j += 1
            out_chunks.append(y[i:j])
            i = j
        else:
            j = i
            while j < n and silent[j]:
                j += 1
            if (j - i) > max_samples and i > 0 and j < n:
                out_chunks.append(y[i : i + keep_edge])
                out_chunks.append(y[j - keep_edge : j])
            else:
                out_chunks.append(y[i:j])
            i = j
    return np.concatenate(out_chunks).astype(np.float32) if out_chunks else y


def _decode_inline_audio(part) -> tuple[np.ndarray, int]:
    mime = (part.inline_data.mime_type or "").lower()
    raw = part.inline_data.data
    if "wav" in mime:
        y, sr = sf.read(io.BytesIO(raw), dtype="float32")
        if y.ndim > 1:
            y = np.mean(y, axis=1)
        return y.astype(np.float32), int(sr)
    # Default Gemini audio/l16; rate=24000; channels=1
    m = re.search(r"rate=(\d+)", mime)
    sr = int(m.group(1)) if m else 24000
    y = np.frombuffer(raw, dtype="<i2").astype(np.float32) / 32768.0
    return y, sr


def _generate_gemini_tts(prompt: str, model: str, voice: str) -> tuple[np.ndarray, int]:
    from google import genai
    from google.genai import types

    api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("Missing GOOGLE_API_KEY / GEMINI_API_KEY in environment.")

    client = genai.Client(api_key=api_key)
    resp = client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=voice)
                )
            ),
        ),
    )
    cand = resp.candidates[0] if resp.candidates else None
    if not cand or not cand.content or not cand.content.parts:
        raise RuntimeError(f"Gemini TTS returned empty content for model={model}.")

    audio_part = None
    for p in cand.content.parts:
        if getattr(p, "inline_data", None) and p.inline_data.data:
            audio_part = p
            break
    if audio_part is None:
        raise RuntimeError(f"Gemini TTS response had no inline audio data (parts={len(cand.content.parts)}).")

    return _decode_inline_audio(audio_part)


def _transcribe_words(y48: np.ndarray, initial_prompt: str) -> list[dict]:
    from faster_whisper import WhisperModel

    y16 = _resample_audio(y48, SR, 16000)
    wm = WhisperModel("base.en", device="cpu", compute_type="int8")
    segments, _ = wm.transcribe(
        y16,
        word_timestamps=True,
        initial_prompt=initial_prompt,
    )
    words = []
    for seg in segments:
        for w in seg.words or []:
            tok = re.sub(r"[^a-z0-9\-]", "", w.word.lower())
            words.append({
                "word": w.word.strip(),
                "norm": tok,
                "start": round(float(w.start), 3),
                "end": round(float(w.end), 3),
            })
    return words


def _has_prompt_leakage(words: list[dict]) -> list[str]:
    head = words[:12]
    leaked = [w["norm"] for w in head if w["norm"] in FORBIDDEN_HEADER_WORDS]
    # Also guard if Whisper hears "audio profile" right at start
    norms = [w["norm"] for w in head]
    if "audio" in norms[:4] and ("profile" in norms[:6] or "narrator" in norms[:8]):
        leaked.append("audio+profile")
    return leaked


def _find_word(words: list[dict], targets: tuple[str, ...], min_idx: int = 0) -> tuple[int, dict] | None:
    for i in range(max(0, min_idx), len(words)):
        if words[i]["norm"] in targets:
            return i, words[i]
    return None


def _build_monotonic_timeline(words: list[dict], speech_end: float, anchors: dict) -> dict:
    """Locate every Act boundary & visual cue monotonically from Whisper alignment."""
    if not words:
        raise RuntimeError("Whisper returned zero aligned words.")

    cursor = 0

    def take(targets: tuple[str, ...], fallback_frac: float, advance: int = 1) -> tuple[float, float]:
        nonlocal cursor
        found = _find_word(words, targets, cursor)
        if found:
            idx, w = found
            cursor = idx + advance
            return float(w["start"]), float(w["end"])
        est = max(0.4, min(speech_end - 0.5, 0.4 + fallback_frac * (speech_end - 0.4)))
        return round(est, 3), round(est + 0.25, 3)

    t_open_start = float(words[0]["start"])

    # Act 1 cues
    eng_s, _ = take(anchors["eng_fail"], 0.08)
    fly_s, fly_e = take(anchors["fly_or_stop"], 0.14)
    if anchors["act1_end"] == anchors["fly_or_stop"]:
        act1_e_t = fly_e
    else:
        _, act1_e_t = take(anchors["act1_end"], 0.19)

    # Act 2 cues
    act2_s_t, _ = take(anchors["act2_start"], 0.22)
    asda_s, _ = take(anchors["asda_reveal"], 0.27)
    toda_s, toda_e = take(anchors["toda_reveal"], 0.35)
    if anchors["act2_end"] == anchors["toda_reveal"]:
        act2_e_t = toda_e
    else:
        _, act2_e_t = take(anchors["act2_end"], 0.43)

    # Act 3 cues
    act3_s_t, _ = take(anchors["act3_start"], 0.46, advance=0)
    asdr_s, _ = take(anchors["asdr_draw"], 0.49)
    todr_s, _ = take(anchors["todr_draw"], 0.56)
    col_s, col_e = take(anchors["v1_collide"], 0.62)
    if anchors["act3_end"] == anchors["v1_collide"]:
        act3_e_t = col_e
    else:
        _, act3_e_t = take(anchors["act3_end"], 0.65)

    # Act 4 cues
    act4_s_t, _ = take(anchors["act4_start"], 0.68)
    _ = take(anchors["quiz_go"], 0.74)
    q3_s, _ = take(anchors["quiz_3"], 0.77)
    q2_s, _ = take(anchors["quiz_2"], 0.80)
    q1_s, q1_e = take(anchors["quiz_1"], 0.83)

    # Act 5 cues
    verdict_s, verdict_e = take(anchors["verdict_stop"], 0.86)
    r1_s, r1_e = take(anchors["rule_1"], 0.90)
    r2_s, r2_e = take(anchors["rule_2"], 0.94)
    r3_s, _ = take(anchors["rule_3"], 0.97)

    def mid(t_prev_end: float, t_next_start: float) -> float:
        if t_next_start > t_prev_end:
            return round((t_prev_end + t_next_start) * 0.5, 3)
        return round(t_prev_end + 0.12, 3)

    act1_end = max(fly_s + 0.6, mid(act1_e_t, act2_s_t))
    act2_start = act1_end
    act2_end = max(toda_s + 0.8, mid(max(act2_e_t, toda_e + 0.8), act3_s_t))
    act3_start = act2_end
    act3_end = max(col_s + 0.6, mid(act3_e_t, act4_s_t))
    act4_start = act3_end
    act4_end = max(q1_s + 0.35, mid(q1_e, verdict_s))
    act5_start = act4_end
    act6_start = round(max(speech_end, words[-1]["end"]) + 0.55, 3)
    outro_dur = 2.20
    total_dur = round(act6_start + outro_dur, 3)

    cues = {
        "open": round(t_open_start, 3),
        "eng_fail": round(max(0.8, eng_s - 0.15), 3),
        "fly_or_stop": round(min(act1_end - 0.6, fly_s), 3),
        "asda_reveal": round(max(act2_start + 0.25, asda_s), 3),
        "toda_reveal": round(min(act2_end - 0.6, max(act2_start + 1.1, toda_s)), 3),
        "asdr_draw": round(max(act3_start + 0.25, asdr_s), 3),
        "todr_draw": round(max(act3_start + 1.0, todr_s), 3),
        "v1_collide": round(min(act3_end - 0.6, max(act3_start + 2.0, col_s)), 3),
        "quiz_3": round(q3_s, 3),
        "quiz_2": round(max(q3_s + 0.35, q2_s), 3),
        "quiz_1": round(max(q2_s + 0.35, q1_s), 3),
        "verdict_stop": round(verdict_s, 3),
        "rule_1": round(max(verdict_e + 0.35, r1_s - 0.20), 3),
        "rule_2": round(max(r1_e + 0.25, r2_s - 0.15), 3),
        "rule_3": round(max(r2_e + 0.25, r3_s - 0.15), 3),
        "outro": act6_start,
    }

    acts = {
        "1": {"start": 0.0, "end": act1_end},
        "2": {"start": act2_start, "end": act2_end},
        "3": {"start": act3_start, "end": act3_end},
        "4": {"start": act4_start, "end": act4_end},
        "5": {"start": act5_start, "end": act6_start},
        "6": {"start": act6_start, "end": total_dur},
    }

    for k, seg in acts.items():
        if seg["end"] <= seg["start"] + 1.0:
            raise RuntimeError(f"Invalid Act {k} duration: {seg}")

    return {
        "total_duration": total_dur,
        "acts": acts,
        "cues": cues,
        "words": words,
    }


def _master_voice(raw_voice_path: Path, master_voice_path: Path, log_path: Path) -> None:
    print("[Voice] Applying natural Netflix broadcast mastering...", flush=True)
    with open(log_path, "ab") as logf:
        subprocess.run(
            [
                "ffmpeg", "-y", "-i", str(raw_voice_path),
                "-af", (
                    "highpass=f=65,"
                    "equalizer=f=120:t=q:w=1.2:g=2.0,"
                    "equalizer=f=3200:t=q:w=1.5:g=1.2,"
                    "acompressor=threshold=-19dB:ratio=2.2:attack=15:release=150,"
                    "loudnorm=I=-14:TP=-1.5:LRA=9"
                ),
                "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le",
                str(master_voice_path),
            ],
            check=True, stdout=subprocess.DEVNULL, stderr=logf,
        )


def _mix_final_audio(
    voice_path: Path, music_path: Path, sfx_path: Path, out_wav: Path, log_path: Path
) -> None:
    print("[Mix] Sidechain auto-ducking D-minor score beneath Gemini voice & SFX...", flush=True)
    with open(log_path, "ab") as logf:
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-i", str(voice_path),
                "-i", str(music_path),
                "-i", str(sfx_path),
                "-filter_complex", (
                    "[0:a]asplit=2[v_sc][v_mix];"
                    "[1:a]volume=0.34[m_pre];"
                    "[m_pre][v_sc]sidechaincompress=threshold=0.014:ratio=5.0:attack=35:release=420[m_ducked];"
                    "[2:a]volume=0.82[sfx_lvl];"
                    "[v_mix][m_ducked][sfx_lvl]amix=inputs=3:normalize=0:duration=first,"
                    "loudnorm=I=-14:TP=-1.2:LRA=8[out]"
                ),
                "-map", "[out]", "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le",
                str(out_wav),
            ],
            check=True, stdout=subprocess.DEVNULL, stderr=logf,
        )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--topic", default="PERF_TAKEOFF")
    parser.add_argument("--out", default=r"G:\ATPLVECTOR_Videos\v3_AI\_work")
    parser.add_argument("--voice", default=DEFAULT_VOICE)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    spec = get_topic_spec(args.topic)
    work_dir = Path(args.out)
    work_dir.mkdir(parents=True, exist_ok=True)
    top_dir = work_dir.parent

    tl_path = work_dir / "timeline.json"
    master_out = work_dir / "master_audio.wav"
    if tl_path.exists() and master_out.exists() and not args.force:
        print(f"[Audio] Reusing existing {master_out} (pass --force to regenerate).", flush=True)
        return

    raw_voice_path = work_dir / "voice_raw.wav"
    voice_sample_out = top_dir / f"{spec['view']}_v3_voice.wav"
    master_voice_path = work_dir / "voice_mastered.wav"
    log_path = work_dir / "ffmpeg_audio.log"
    if log_path.exists():
        log_path.unlink()

    attempts = build_model_attempts(spec, args.model)

    words: list[dict] = []
    padded_y = None
    speech_dur = 0.0
    active_model = args.model
    exhausted_models: set[str] = set()

    for mdl, label, prompt_txt in attempts:
        if mdl in exhausted_models:
            continue
        print(f"[Voice] [{spec['view']}] Requesting {mdl} (voice={args.voice}, mode={label})...", flush=True)
        try:
            y_src, src_sr = _generate_gemini_tts(prompt_txt, mdl, args.voice)
        except Exception as exc:
            err_s = str(exc)
            if "429" in err_s or "RESOURCE_EXHAUSTED" in err_s or "quota" in err_s.lower():
                print(f"[Warn] Model {mdl} quota exhausted (429); advancing to next Gemini TTS model...", flush=True)
                exhausted_models.add(mdl)
            else:
                print(f"[Warn] {mdl} ({label}) failed ({err_s[:160]}); trying next fallback...", flush=True)
            continue
        y_trim = _trim_silence(y_src, src_sr, thresh_db=-42.0)
        y_trim = _clamp_long_pauses(y_trim, src_sr, max_gap_s=0.62, target_gap_s=0.45)
        y48 = _resample_audio(y_trim, src_sr, SR)

        lead_in = np.zeros(int(0.40 * SR), dtype=np.float32)
        tail_pad = np.zeros(int(3.20 * SR), dtype=np.float32)
        padded_y = np.concatenate([lead_in, y48, tail_pad]).astype(np.float32)
        speech_dur = 0.40 + len(y48) / SR

        print(f"[Align] Running faster_whisper word alignment on {len(y48)/SR:.2f}s narration...", flush=True)
        words = _transcribe_words(padded_y, spec.get("whisper_prompt") or spec["title"])
        leaked = _has_prompt_leakage(words)
        if leaked:
            print(f"[Warn] Detected leaked prompt tokens {leaked} on {mdl} ({label}); trying next fallback...", flush=True)
            continue
        active_model = mdl
        break
    else:
        raise RuntimeError(
            "All Gemini TTS cascade models failed, exhausted quota, or leaked headers; aborting."
        )

    assert padded_y is not None
    sf.write(str(raw_voice_path), padded_y, SR, subtype="PCM_16")
    # Save a standalone preview copy of the pure narration for easy user review
    sf.write(str(voice_sample_out), padded_y[:int((speech_dur + 0.35) * SR)], SR, subtype="PCM_16")

    timeline = _build_monotonic_timeline(words, speech_dur, spec["anchors"])
    timeline["topic"] = spec["view"]
    timeline["voice_engine"] = f"{active_model}:{args.voice}"
    timeline["speech_duration"] = round(speech_dur, 3)

    _master_voice(raw_voice_path, master_voice_path, log_path)
    music_path, sfx_path = synthesize_music_and_sfx(timeline, work_dir)
    _mix_final_audio(master_voice_path, music_path, sfx_path, master_out, log_path)

    timeline["master_audio"] = str(master_out)
    timeline["voice_sample"] = str(voice_sample_out)
    tl_path.write_text(json.dumps(timeline, indent=2), encoding="utf-8")

    print("\n[Timeline Summary]", flush=True)
    for k, s in timeline["acts"].items():
        print(f"  Act {k}: {s['start']:6.2f}s -> {s['end']:6.2f}s ({s['end']-s['start']:.2f}s)", flush=True)
    print(f"  Total Duration: {timeline['total_duration']:.2f}s", flush=True)
    print(f"  Word count aligned: {len(words)}", flush=True)
    print(f"  Standalone voice sample: {voice_sample_out}", flush=True)
    print(f"  Master audio: {master_out}", flush=True)


if __name__ == "__main__":
    main()
