#!/usr/bin/env python3
"""
Netflix-Style Documentary Audio Engine for ATPLVector v2 Reels.

Combines:
1. Local Kokoro-82M neural narrator (`bm_george` deep British documentary voice, GPU/CPU)
   with automatic fallback to Edge TTS `en-US-AndrewMultilingualNeural`.
2. Phrase-by-phrase pacing with natural documentary breath pauses & exact millisecond timeline.
3. Custom 48 kHz stereo dark D-minor documentary score (sub-bass pulse + analog string pad + tension riser).
4. Word/beat-synced aviation SFX (Master Caution dual-chime, air-whooshes, mouse click, 3-2-1 sonar ticks, verdict sub-boom).
5. FFmpeg Broadcast Voice Mastering + Sidechain Auto-Ducked Mix (-14 LUFS).
"""

import argparse
import asyncio
import json
import math
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf

SR = 48000

# 6-Act Netflix Documentary Script for PERF_TAKEOFF
# Broken into tight rhythmic documentary sub-phrases so every visual cut/cue lands cleanly.
PHRASES = [
    # ACT 1: Cold Open (Dusk Runway & Engine Failure)
    {"id": "1a", "act": 1, "text": "One hundred and forty knots down a wet runway.", "pause_after": 0.25},
    {"id": "1b", "act": 1, "text": "One engine just failed.", "pause_after": 0.35},
    {"id": "1c", "act": 1, "text": "You have less than one second. Fly, or slam the brakes.", "pause_after": 0.48},

    # ACT 2: 3D Isometric Clay Airport Diorama
    {"id": "2a", "act": 2, "text": "At V1, the runway splits in two.", "pause_after": 0.24},
    {"id": "2b", "act": 2, "text": "Before it, you stop inside the paved stopway. That is ASDA.", "pause_after": 0.24},
    {"id": "2c", "act": 2, "text": "Past it, you rotate and climb through the clearway. That is TODA.", "pause_after": 0.45},

    # ACT 3: Netflix Investigative Evidence Board
    {"id": "3a", "act": 3, "text": "Push V1 higher, and stopping takes longer.", "pause_after": 0.20},
    {"id": "3b", "act": 3, "text": "Drop V1 lower, and flying on one engine takes longer.", "pause_after": 0.26},
    {"id": "3c", "act": 3, "text": "Where those two curves collide is your Balanced Field Length.", "pause_after": 0.50},

    # ACT 4: Viral Interactive Pilot Call Quiz + 3s Countdown
    {"id": "4a", "act": 4, "text": "Pilot call. EASA exam trap.", "pause_after": 0.22},
    {"id": "4b", "act": 4, "text": "Engine fails two knots before V1. Stop, or go?", "pause_after": 0.35},
    {"id": "4c", "act": 4, "text": "Three.", "pause_after": 0.55},
    {"id": "4d", "act": 4, "text": "Two.", "pause_after": 0.55},
    {"id": "4e", "act": 4, "text": "One.", "pause_after": 0.65},

    # ACT 5: The Verdict + Saveable EASA Cheat Code
    {"id": "5a", "act": 5, "text": "Stop. Reject the takeoff immediately.", "pause_after": 0.32},
    {"id": "5b", "act": 5, "text": "Save this rule: V1 is never below VMCG,", "pause_after": 0.14},
    {"id": "5c", "act": 5, "text": "never above VR,", "pause_after": 0.14},
    {"id": "5d", "act": 5, "text": "and never above brake energy VMBE.", "pause_after": 0.50},
]


def _resample_audio(y: np.ndarray, orig_sr: int, target_sr: int) -> np.ndarray:
    if orig_sr == target_sr or len(y) == 0:
        return y
    new_len = int(round(len(y) * (target_sr / orig_sr)))
    xp = np.linspace(0, 1, len(y), dtype=np.float64)
    xq = np.linspace(0, 1, new_len, dtype=np.float64)
    return np.interp(xq, xp, y).astype(np.float32)


def _trim_silence(y: np.ndarray, thresh: float = 0.008) -> np.ndarray:
    idx = np.where(np.abs(y) > thresh)[0]
    if len(idx) == 0:
        return y
    pad = int(0.04 * SR)
    s = max(0, int(idx[0]) - pad)
    e = min(len(y), int(idx[-1]) + pad)
    return y[s:e]


def synthesize_phrases_kokoro(work_dir: Path) -> list[dict]:
    from kokoro import KPipeline

    print("[Voice] Initializing local Kokoro-82M ('bm_george' documentary baritone)...", flush=True)
    pipe = KPipeline(lang_code="b", repo_id="hexgrad/Kokoro-82M")

    # Phonetic pronunciations so Kokoro reads aviation acronyms like a real Training Captain
    phonetic_map = {
        "V1": "Vee One",
        "ASDA": "Az-dah",
        "TODA": "Toe-dah",
        "EASA": "Ee-ah-sah",
        "VMCG": "Vee M C G",
        "VR": "Vee R",
        "VMBE": "Vee M B E",
    }

    items = []
    for ph in PHRASES:
        spoken = ph["text"]
        for k, v in phonetic_map.items():
            spoken = spoken.replace(k, v)
        chunks = []
        for _, _, audio in pipe(spoken, voice="bm_george", speed=0.95):
            chunks.append(audio)
        raw = np.concatenate(chunks) if chunks else np.zeros(24000, dtype=np.float32)
        y48 = _resample_audio(raw, 24000, SR)
        y48 = _trim_silence(y48)
        wav_p = work_dir / f"ph_{ph['id']}.wav"
        sf.write(str(wav_p), y48, SR, subtype="PCM_16")
        dur = len(y48) / SR
        items.append({**ph, "wav": str(wav_p), "dur": dur})
        print(f"   [{ph['id']}] {dur:.2f}s | {ph['text']}", flush=True)
    return items


async def synthesize_phrases_edge_fallback(work_dir: Path) -> list[dict]:
    import edge_tts

    print("[Voice] Fallback to Edge TTS (en-US-AndrewMultilingualNeural)...", flush=True)
    items = []
    for ph in PHRASES:
        mp3_p = work_dir / f"ph_{ph['id']}.mp3"
        wav_p = work_dir / f"ph_{ph['id']}.wav"
        comm = edge_tts.Communicate(ph["text"], "en-US-AndrewMultilingualNeural", rate="-3%", pitch="-3Hz")
        await comm.save(str(mp3_p))
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(mp3_p), "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", str(wav_p)],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        y, _ = sf.read(str(wav_p), dtype="float32")
        y = _trim_silence(y)
        sf.write(str(wav_p), y, SR, subtype="PCM_16")
        dur = len(y) / SR
        items.append({**ph, "wav": str(wav_p), "dur": dur})
    return items


def build_voice_track(items: list[dict], work_dir: Path) -> tuple[Path, dict]:
    lead_in = 0.45
    outro_dur = 2.00

    # Assemble voice waveform with exact documentary pauses
    parts = [np.zeros(int(lead_in * SR), dtype=np.float32)]
    cur_t = lead_in
    timeline_phrases = {}

    for it in items:
        y, _ = sf.read(it["wav"], dtype="float32")
        start_t = cur_t
        end_t = start_t + len(y) / SR
        timeline_phrases[it["id"]] = {
            "act": it["act"],
            "text": it["text"],
            "start": round(start_t, 3),
            "end": round(end_t, 3),
        }
        parts.append(y)
        cur_t = end_t
        pause = it["pause_after"]
        parts.append(np.zeros(int(pause * SR), dtype=np.float32))
        cur_t += pause

    act6_start = cur_t
    parts.append(np.zeros(int(outro_dur * SR), dtype=np.float32))
    total_dur = act6_start + outro_dur

    raw_voice_path = work_dir / "voice_raw.wav"
    master_voice_path = work_dir / "voice_mastered.wav"
    voice_arr = np.concatenate(parts)
    sf.write(str(raw_voice_path), voice_arr, SR, subtype="PCM_16")

    # Apply Cinema Broadcast Voice Mastering Chain (warm 125 Hz chest resonance + presence + dynamics + -14 LUFS)
    print("[Voice] Applying Netflix documentary broadcast EQ & mastering...", flush=True)
    subprocess.run(
        [
            "ffmpeg", "-y", "-i", str(raw_voice_path),
            "-af", (
                "highpass=f=65,"
                "equalizer=f=125:t=q:w=1.2:g=3.2,"
                "equalizer=f=3100:t=q:w=1.5:g=1.8,"
                "acompressor=threshold=-18dB:ratio=2.8:attack=12:release=140,"
                "loudnorm=I=-14:TP=-1.5:LRA=9"
            ),
            "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le", str(master_voice_path),
        ],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )

    # Derive exact Act boundary & cue timestamps
    p = timeline_phrases
    timeline = {
        "total_duration": round(total_dur, 3),
        "acts": {
            "1": {"start": 0.0, "end": round((p["1c"]["end"] + p["2a"]["start"]) * 0.5, 3)},
            "2": {"start": round((p["1c"]["end"] + p["2a"]["start"]) * 0.5, 3), "end": round((p["2c"]["end"] + p["3a"]["start"]) * 0.5, 3)},
            "3": {"start": round((p["2c"]["end"] + p["3a"]["start"]) * 0.5, 3), "end": round((p["3c"]["end"] + p["4a"]["start"]) * 0.5, 3)},
            "4": {"start": round((p["3c"]["end"] + p["4a"]["start"]) * 0.5, 3), "end": round((p["4e"]["end"] + p["5a"]["start"]) * 0.5, 3)},
            "5": {"start": round((p["4e"]["end"] + p["5a"]["start"]) * 0.5, 3), "end": round(act6_start, 3)},
            "6": {"start": round(act6_start, 3), "end": round(total_dur, 3)},
        },
        "cues": {
            "eng_fail": p["1b"]["start"],
            "asda_reveal": p["2b"]["start"],
            "toda_reveal": p["2c"]["start"],
            "asdr_draw": p["3a"]["start"],
            "todr_draw": p["3b"]["start"],
            "v1_collide": p["3c"]["start"] + 0.55,
            "quiz_3": p["4c"]["start"],
            "quiz_2": p["4d"]["start"],
            "quiz_1": p["4e"]["start"],
            "verdict_stop": p["5a"]["start"],
            "rule_1": p["5b"]["start"] + 0.35,
            "rule_2": p["5c"]["start"],
            "rule_3": p["5d"]["start"],
            "outro": round(act6_start, 3),
        },
        "phrases": timeline_phrases,
    }
    return master_voice_path, timeline


def synthesize_music_and_sfx(timeline: dict, work_dir: Path) -> tuple[Path, Path]:
    """Generate 100% copyright-safe D-minor Netflix tension underscore + frame-synced aviation SFX."""
    print("[Audio] Synthesizing D-minor Netflix documentary score & synced aviation SFX...", flush=True)
    dur = timeline["total_duration"]
    n = int(math.ceil(dur * SR))
    t = np.linspace(0, dur, n, endpoint=False, dtype=np.float64)

    # ── 1. Dark Minimalist Documentary Score (Stereo) ──────────────────────
    # Warm slow string pad progression: Dm -> Bb -> F -> C -> Dm -> Dm (subtle resolution)
    acts = timeline["acts"]
    bass_freqs = np.full(n, 73.42)  # D2
    pad_chords = [
        (0.0, acts["2"]["start"], [146.83, 220.00, 261.63, 349.23], 73.42),   # Dm7
        (acts["2"]["start"], acts["3"]["start"], [116.54, 174.61, 220.00, 293.66], 58.27),  # Bbmaj7
        (acts["3"]["start"], acts["4"]["start"], [130.81, 174.61, 220.00, 329.63], 65.41),  # F/C
        (acts["4"]["start"], acts["5"]["start"], [146.83, 207.65, 261.63, 329.63], 73.42),  # Tension Dm(#4/dim)
        (acts["5"]["start"], dur, [146.83, 220.00, 293.66, 440.00], 73.42),   # Resolving D5/Dm add9
    ]

    pad_l = np.zeros(n, dtype=np.float64)
    pad_r = np.zeros(n, dtype=np.float64)

    for s_t, e_t, freqs, bf in pad_chords:
        i0 = max(0, int((s_t - 0.35) * SR))
        i1 = min(n, int((e_t + 0.35) * SR))
        if i1 <= i0:
            continue
        seg_t = t[i0:i1]
        env = np.ones(i1 - i0, dtype=np.float64)
        fade = min(len(env) // 3, int(0.6 * SR))
        if fade > 10:
            env[:fade] *= np.linspace(0, 1, fade)
            env[-fade:] *= np.linspace(1, 0, fade)

        # Warm detuned analog pad voices
        sl = np.zeros(i1 - i0)
        sr = np.zeros(i1 - i0)
        for fi, f0 in enumerate(freqs):
            det = 1.0 + 0.0022 * ((fi % 2) * 2 - 1)
            sl += 0.22 * np.sin(2 * np.pi * f0 * seg_t + 0.2 * np.sin(2 * np.pi * 0.18 * seg_t))
            sr += 0.22 * np.sin(2 * np.pi * (f0 * det) * seg_t + 0.2 * np.cos(2 * np.pi * 0.21 * seg_t))
            # Soft warm 2nd harmonic
            sl += 0.05 * np.sin(2 * np.pi * (f0 * 2.0) * seg_t)
            sr += 0.05 * np.sin(2 * np.pi * (f0 * 2.0 * det) * seg_t)

        # Sub-bass 68 BPM heartbeat pulse
        beat_hz = 68.0 / 60.0
        pulse = (0.5 + 0.5 * np.sin(2 * np.pi * beat_hz * seg_t - np.pi / 2)) ** 2.6
        sub = 0.32 * pulse * np.sin(2 * np.pi * bf * seg_t)

        pad_l[i0:i1] += (sl + sub) * env
        pad_r[i0:i1] += (sr + sub) * env

    # Gentle fade-in and fade-out at edges
    f_in = int(0.8 * SR)
    f_out = int(1.0 * SR)
    pad_l[:f_in] *= np.linspace(0, 1, f_in)
    pad_r[:f_in] *= np.linspace(0, 1, f_in)
    pad_l[-f_out:] *= np.linspace(1, 0, f_out)
    pad_r[-f_out:] *= np.linspace(1, 0, f_out)

    music = np.stack([pad_l, pad_r], axis=-1).astype(np.float32) * 0.45
    music_path = work_dir / "music_bed.wav"
    sf.write(str(music_path), music, SR, subtype="PCM_16")

    # ── 2. Frame-Synced Aviation & Cinema SFX Layer ────────────────────────
    sfx_l = np.zeros(n, dtype=np.float64)
    sfx_r = np.zeros(n, dtype=np.float64)
    rng = np.random.default_rng(99)

    def add_sfx(time_s: float, arr: np.ndarray, gain: float = 0.5, pan: float = 0.0):
        idx = int(time_s * SR)
        end = min(n, idx + len(arr))
        if end <= idx or idx < 0:
            return
        gl = gain * (1.0 - max(0.0, pan) * 0.4)
        gr = gain * (1.0 - max(0.0, -pan) * 0.4)
        sfx_l[idx:end] += arr[:end - idx] * gl
        sfx_r[idx:end] += arr[:end - idx] * gr

    # Subtle jet rumble bed during Act 1 takeoff roll
    act1_len = int(acts["1"]["end"] * SR)
    if act1_len > 100:
        tt = np.linspace(0, acts["1"]["end"], act1_len)
        noise = rng.normal(0, 1, act1_len)
        # Moving lowpass rumble via cumsum-smoothing difference
        k = np.ones(45) / 45.0
        rumble = np.convolve(noise, k, mode="same")
        turbine = 0.14 * np.sin(2 * np.pi * (110 + 18 * tt) * tt) + 0.35 * rumble
        env_r = np.linspace(0.3, 1.0, act1_len)
        env_r[-int(0.4 * SR):] *= np.linspace(1, 0, int(0.4 * SR))
        add_sfx(0.0, turbine * env_r, gain=0.22)

    # Master Caution / Engine Failure dual chime at eng_fail cue
    cues = timeline["cues"]
    lt_c = np.linspace(0, 0.55, int(0.55 * SR))
    chime = (
        np.sin(2 * np.pi * 880 * lt_c) * np.exp(-lt_c * 8.0) * (lt_c < 0.22)
        + np.sin(2 * np.pi * 740 * lt_c) * np.exp(-np.maximum(0, lt_c - 0.18) * 7.5) * (lt_c >= 0.18)
    )
    add_sfx(cues["eng_fail"] - 0.12, chime, gain=0.28)

    # Smooth filtered air-whooshes at Act transitions
    for act_k in ("2", "3", "4", "5", "6"):
        wt = np.linspace(0, 0.55, int(0.55 * SR))
        w_noise = rng.normal(0, 1, len(wt))
        w_lp = np.convolve(w_noise, np.ones(65) / 65.0, mode="same")
        w_env = np.sin(np.pi * wt / 0.55) ** 2
        add_sfx(max(0.0, acts[act_k]["start"] - 0.25), w_lp * w_env, gain=0.30)

    # Crisp UI mouse click when cursor hits V1 intersection in Act 3
    ct = np.linspace(0, 0.045, int(0.045 * SR))
    click = np.sin(2 * np.pi * 1650 * ct) * np.exp(-ct * 140)
    add_sfx(cues["v1_collide"], click, gain=0.35)

    # Sonar countdown ticks on "Three", "Two", "One" in Act 4
    for qt in (cues["quiz_3"], cues["quiz_2"], cues["quiz_1"]):
        st = np.linspace(0, 0.18, int(0.18 * SR))
        tick = np.sin(2 * np.pi * 1046.5 * st) * np.exp(-st * 26.0)
        add_sfx(qt, tick, gain=0.28)

    # Deep Netflix sub-bass boom on Verdict ("STOP. REJECT...")
    bt = np.linspace(0, 1.4, int(1.4 * SR))
    freq_sweep = 95.0 * np.exp(-bt * 3.8) + 38.0
    phase = 2 * np.pi * np.cumsum(freq_sweep) / SR
    boom = np.sin(phase) * np.exp(-bt * 2.3)
    add_sfx(cues["verdict_stop"] - 0.05, boom, gain=0.58)

    # Warm crystalline chime on Act 6 ATPLVector outro sting
    ot = np.linspace(0, 1.5, int(1.5 * SR))
    chord_sting = (
        0.4 * np.sin(2 * np.pi * 587.33 * ot)
        + 0.35 * np.sin(2 * np.pi * 880.00 * ot)
        + 0.25 * np.sin(2 * np.pi * 1174.66 * ot)
    ) * np.exp(-ot * 2.1)
    add_sfx(cues["outro"] + 0.05, chord_sting, gain=0.24)

    sfx = np.stack([sfx_l, sfx_r], axis=-1).clip(-0.98, 0.98).astype(np.float32)
    sfx_path = work_dir / "sfx_layer.wav"
    sf.write(str(sfx_path), sfx, SR, subtype="PCM_16")
    return music_path, sfx_path


def mix_master_audio(voice_path: Path, music_path: Path, sfx_path: Path, work_dir: Path) -> Path:
    master_out = work_dir / "master_audio.wav"
    print("[Mix] Sidechain auto-ducking score beneath cinema voice & blending SFX...", flush=True)
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-i", str(voice_path),
            "-i", str(music_path),
            "-i", str(sfx_path),
            "-filter_complex",
            (
                "[0:a]asplit=2[v_sc][v_mix];"
                "[1:a]volume=0.38[m_pre];"
                "[m_pre][v_sc]sidechaincompress=threshold=0.015:ratio=5.5:attack=35:release=420[m_ducked];"
                "[2:a]volume=0.85[sfx_lvl];"
                "[v_mix][m_ducked][sfx_lvl]amix=inputs=3:normalize=0:duration=first,"
                "loudnorm=I=-14:TP=-1.2:LRA=8[out]"
            ),
            "-map", "[out]", "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le",
            str(master_out),
        ],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    return master_out


async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default=r"G:\ATPLVECTOR_Videos\v2_Netflix\_work")
    args = parser.parse_args()
    work_dir = Path(args.out)
    work_dir.mkdir(parents=True, exist_ok=True)

    engine_used = "kokoro-bm_george"
    try:
        items = synthesize_phrases_kokoro(work_dir)
    except Exception as e:
        print(f"[Voice] Kokoro failed ({e}), using Edge Neural fallback.", flush=True)
        engine_used = "edge-AndrewMultilingualNeural"
        items = await synthesize_phrases_edge_fallback(work_dir)

    voice_path, timeline = build_voice_track(items, work_dir)
    timeline["voice_engine"] = engine_used
    music_path, sfx_path = synthesize_music_and_sfx(timeline, work_dir)
    master_wav = mix_master_audio(voice_path, music_path, sfx_path, work_dir)
    timeline["master_audio"] = str(master_wav)

    tl_path = work_dir / "timeline.json"
    tl_path.write_text(json.dumps(timeline, indent=2), encoding="utf-8")
    print(
        f"[Audio] DONE! Engine={engine_used} | Total={timeline['total_duration']}s | {master_wav}",
        flush=True,
    )


if __name__ == "__main__":
    asyncio.run(main())
