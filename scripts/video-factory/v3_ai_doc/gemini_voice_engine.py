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
V2_DIR = Path(__file__).resolve().parent.parent / "v2_netflix"
if str(V2_DIR) not in sys.path:
    sys.path.insert(0, str(V2_DIR))
from audio_engine import synthesize_music_and_sfx  # noqa: E402

SR = 48000
DEFAULT_MODEL = "gemini-3.1-flash-tts-preview"
DEFAULT_VOICE = "Charon"

TRANSCRIPT_BODY = (
    "One hundred and forty knots down a wet runway. "
    "One engine just failed. "
    "You have less than one second: fly, or slam the brakes. "
    "At V1, the runway splits in two. "
    "Before it, you stop inside the paved stopway — that is ASDA. "
    "Past it, you rotate and climb through the clearway — that is TODA. "
    "Push V1 higher, and stopping takes longer. "
    "Drop V1 lower, and flying on one engine takes longer. "
    "Where those two curves collide is your Balanced Field Length. "
    "Pilot call. EASA exam trap. "
    "Engine fails two knots before V1 — stop, or go? "
    "Three... Two... One. "
    "Stop. Reject the takeoff immediately. "
    "Save this rule: V1 is never below VMCG, "
    "never above VR, and never above brake energy VMBE."
)

DIRECTOR_PROMPT = (
    "Speak with gripping, brisk Netflix aviation documentary narration in around 50 seconds: "
    "warm, deep human baritone authority, crisp airline-captain enunciation "
    "(V1 as vee-one, ASDA as az-dah, TODA as toe-dah, EASA as ee-ah-sah, "
    "VMCG as vee-M-C-G, VR as vee-R, VMBE as vee-M-B-E), natural human breaths, "
    "tight momentum, never dragging and never robotic:\n\n"
    f"{TRANSCRIPT_BODY}"
)

# Stripped ultra-safe backup prompt if safety filter or header leakage occurs
CONCISE_PROMPT = (
    "Speak clearly and briskly like a calm Netflix documentary narrator:\n\n"
    f"{TRANSCRIPT_BODY}"
)

FORBIDDEN_HEADER_WORDS = {
    "profile", "narrator", "pronunciation", "transcript", "director",
    "az-dah", "toe-dah", "ee-ah-sah", "robotic", "speak", "gripping",
    "brisk", "briskly", "netflix", "authority", "enunciation", "dragging",
}


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


def _transcribe_words(y48: np.ndarray) -> list[dict]:
    from faster_whisper import WhisperModel

    y16 = _resample_audio(y48, SR, 16000)
    wm = WhisperModel("base.en", device="cpu", compute_type="int8")
    segments, _ = wm.transcribe(
        y16,
        word_timestamps=True,
        initial_prompt=(
            "One hundred and forty knots down a wet runway. V1, ASDA, TODA, "
            "stopway, clearway, Balanced Field Length, EASA, VMCG, VR, VMBE."
        ),
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


def _build_monotonic_timeline(words: list[dict], speech_end: float) -> dict:
    """Locate every Act boundary & visual cue monotonically from Whisper alignment."""
    if not words:
        raise RuntimeError("Whisper returned zero aligned words.")

    # Sequential monotonic anchor lookup matching TRANSCRIPT_BODY order
    cursor = 0

    def take(targets: tuple[str, ...], fallback_frac: float, min_idx_offset: int = 1) -> tuple[float, float]:
        nonlocal cursor
        found = _find_word(words, targets, cursor)
        if found:
            idx, w = found
            cursor = idx + min_idx_offset
            return float(w["start"]), float(w["end"])
        est = max(0.4, min(speech_end - 0.5, 0.4 + fallback_frac * (speech_end - 0.4)))
        return round(est, 3), round(est + 0.25, 3)

    w_140 = _find_word(words, ("140", "one", "hundred", "knots"), 0)
    t_open_start = float(w_140[1]["start"]) if w_140 else float(words[0]["start"])

    eng_s, eng_e = take(("engine",), 0.09)
    fly_s, fly_e = take(("fly",), 0.16)
    brakes_s, brakes_e = take(("brakes", "brake"), 0.20)

    # Act 2
    at_s, _ = take(("at", "runway"), 0.22)
    splits_s, splits_e = take(("splits", "split"), 0.25)
    before_s, before_e = take(("before",), 0.28)
    stopway_s, stopway_e = take(("stopway", "stop"), 0.34)
    past_s, past_e = take(("past", "passed"), 0.39)
    clearway_s, clearway_e = take(("clearway",), 0.45)

    # Act 3
    push_s, _ = take(("push",), 0.49)
    drop_s, _ = take(("drop",), 0.55)
    collide_s, collide_e = take(("collide", "intersect", "meet"), 0.62)
    length_s, length_e = take(("length",), 0.65)

    # Act 4
    pilot_s, _ = take(("pilot",), 0.68)
    go_s, go_e = take(("go",), 0.74)
    q3_s, q3_e = take(("three", "3"), 0.77)
    q2_s, q2_e = take(("two", "2"), 0.80)
    q1_s, q1_e = take(("one", "1"), 0.83)

    # Act 5
    stop_v_s, stop_v_e = take(("stop",), 0.86)
    below_s, below_e = take(("below",), 0.91)
    above_vr_s, above_vr_e = take(("above",), 0.94)
    brake_e_s, brake_e_e = take(("brake", "energy"), 0.97)

    def mid(t_prev_end: float, t_next_start: float) -> float:
        if t_next_start > t_prev_end:
            return round((t_prev_end + t_next_start) * 0.5, 3)
        return round(t_prev_end + 0.15, 3)

    act1_end = mid(brakes_e, min(at_s, splits_s))
    act2_start = act1_end
    act2_end = mid(max(clearway_e, past_e + 1.2), push_s)
    act3_start = act2_end
    act3_end = mid(length_e, pilot_s)
    act4_start = act3_end
    act4_end = mid(q1_e, stop_v_s)
    act5_start = act4_end
    act6_start = round(max(speech_end, words[-1]["end"]) + 0.55, 3)
    outro_dur = 2.20
    total_dur = round(act6_start + outro_dur, 3)

    # Enforce strict monotonic cue safety
    cues = {
        "open": round(t_open_start, 3),
        "eng_fail": round(max(0.8, eng_s - 0.15), 3),
        "fly_or_stop": round(fly_s, 3),
        "asda_reveal": round(before_s, 3),
        "toda_reveal": round(past_s, 3),
        "asdr_draw": round(push_s, 3),
        "todr_draw": round(drop_s, 3),
        "v1_collide": round(collide_s, 3),
        "quiz_3": round(q3_s, 3),
        "quiz_2": round(max(q3_s + 0.35, q2_s), 3),
        "quiz_1": round(max(q2_s + 0.35, q1_s), 3),
        "verdict_stop": round(stop_v_s, 3),
        "rule_1": round(max(stop_v_e + 0.4, below_s - 0.25), 3),
        "rule_2": round(max(below_e + 0.3, above_vr_s - 0.15), 3),
        "rule_3": round(max(above_vr_e + 0.3, brake_e_s - 0.15), 3),
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

    # Validate sanity
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
    parser.add_argument("--out", default=r"G:\ATPLVECTOR_Videos\v3_AI\_work")
    parser.add_argument("--voice", default=DEFAULT_VOICE)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    work_dir = Path(args.out)
    work_dir.mkdir(parents=True, exist_ok=True)
    top_dir = work_dir.parent

    tl_path = work_dir / "timeline.json"
    master_out = work_dir / "master_audio.wav"
    if tl_path.exists() and master_out.exists() and not args.force:
        print(f"[Audio] Reusing existing {master_out} (pass --force to regenerate).", flush=True)
        return

    raw_voice_path = work_dir / "voice_raw.wav"
    voice_sample_out = top_dir / "PERF_TAKEOFF_v3_voice.wav"
    master_voice_path = work_dir / "voice_mastered.wav"
    log_path = work_dir / "ffmpeg_audio.log"
    if log_path.exists():
        log_path.unlink()

    prompts_to_try = [
        ("director_profile", DIRECTOR_PROMPT),
        ("concise_fallback", CONCISE_PROMPT),
    ]

    words: list[dict] = []
    padded_y = None
    speech_dur = 0.0

    for label, prompt_txt in prompts_to_try:
        print(f"[Voice] Requesting {args.model} (voice={args.voice}, mode={label})...", flush=True)
        try:
            y_src, src_sr = _generate_gemini_tts(prompt_txt, args.model, args.voice)
        except RuntimeError as exc:
            print(f"[Warn] Prompt mode {label} returned error ({exc}); trying fallback...", flush=True)
            continue
        y_trim = _trim_silence(y_src, src_sr, thresh_db=-42.0)
        y_trim = _clamp_long_pauses(y_trim, src_sr, max_gap_s=0.62, target_gap_s=0.45)
        y48 = _resample_audio(y_trim, src_sr, SR)

        lead_in = np.zeros(int(0.40 * SR), dtype=np.float32)
        tail_pad = np.zeros(int(3.20 * SR), dtype=np.float32)
        padded_y = np.concatenate([lead_in, y48, tail_pad]).astype(np.float32)
        speech_dur = 0.40 + len(y48) / SR

        print(f"[Align] Running faster_whisper word alignment on {len(y48)/SR:.2f}s narration...", flush=True)
        words = _transcribe_words(padded_y)
        leaked = _has_prompt_leakage(words)
        if leaked:
            print(f"[Warn] Detected leaked prompt tokens {leaked} under {label}; retrying concise prompt...", flush=True)
            continue
        break
    else:
        raise RuntimeError(
            "Gemini TTS failed or leaked prompt headers even after concise retry; aborting."
        )

    assert padded_y is not None
    sf.write(str(raw_voice_path), padded_y, SR, subtype="PCM_16")
    # Save a standalone preview copy of the pure narration for easy user review
    sf.write(str(voice_sample_out), padded_y[:int((speech_dur + 0.35) * SR)], SR, subtype="PCM_16")

    timeline = _build_monotonic_timeline(words, speech_dur)
    timeline["voice_engine"] = f"{args.model}:{args.voice}"
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
