#!/usr/bin/env python3
"""Original, deterministic Rasenschach XI music. No audio samples or preset loops.

Usage: python3 tools/generate-soundtrack.py --masters /path/to/wav-masters
Produces three loop-ready Ogg/Vorbis files in public/music and optional PCM masters.
Requires NumPy and FFmpeg with libvorbis. The score and synthesizer live here.
"""
import argparse
import subprocess
import wave
from pathlib import Path

import numpy as np

RATE = 22050
OUT = Path(__file__).resolve().parents[1] / "public" / "music"
CHORDS = ((52, 55, 59, 62), (48, 52, 55, 59), (43, 47, 50, 54), (50, 52, 57, 62))
SCORES = {
    "ankommen": dict(bpm=80, seed=405, movement=.70, melody=.83),
    "karriere": dict(bpm=78, seed=918, movement=.47, melody=.32),
    "endspurt": dict(bpm=90, seed=1205, movement=.91, melody=.52),
}


def hz(midi):
    return 440 * 2 ** ((midi - 69) / 12)


class Score:
    def __init__(self, bpm, seed, movement, melody):
        self.beat = 60 / bpm
        self.duration = 64 * 4 * self.beat
        self.samples = np.zeros(round(self.duration * RATE), dtype=np.float32)
        self.rng = np.random.default_rng(seed)
        self.movement, self.melody = movement, melody

    def add(self, start, signal):
        at = round(start * RATE)
        if len(signal) > len(self.samples):
            raise ValueError("A note exceeded the entire loop")
        size = len(self.samples)
        at %= size
        n = min(size - at, len(signal))
        self.samples[at:at + n] += signal[:n].astype(np.float32)
        if n < len(signal):
            self.samples[:len(signal) - n] += signal[n:].astype(np.float32)

    def instrument(self, start, duration, note, volume, kind):
        t = np.arange(round(duration * RATE), dtype=np.float64) / RATE
        f = hz(note)
        if kind == "pad":
            # A slightly wandering, muted electric organ; no stock samples.
            p = 2 * np.pi * f * t
            w = (np.sin(p) + .19 * np.sin(2 * p + .07 * np.sin(2 * np.pi * .31 * t))
                 + .09 * np.sin(p * 1.003)) / 1.28
            env = np.minimum(1, t / .55) * np.minimum(1, (duration - t) / .95)
            w *= env * (1 + .035 * np.sin(2 * np.pi * .14 * t))
        elif kind == "keys":
            p = 2 * np.pi * f * t
            w = (np.sin(p) + .22 * np.sin(2 * p) + .045 * np.sin(3 * p)) / 1.26
            w *= np.minimum(1, t / .014) * np.exp(-t / (duration * .53))
            w *= np.minimum(1, (duration - t) / .08)
        elif kind == "bass":
            p = 2 * np.pi * f * t
            w = (np.sin(p) + .16 * np.sin(2 * p)) / 1.16
            w *= np.minimum(1, t / .025) * np.exp(-t / (duration * .62))
            w *= np.minimum(1, (duration - t) / .055)
        else:  # brushed shaker; noise is generated locally with fixed seed
            noise = self.rng.standard_normal(len(t))
            w = np.diff(noise, prepend=noise[0]); w /= max(np.max(np.abs(w)), 1)
            w *= np.sin(np.pi * t / duration) ** 2
        self.add(start, volume * w)

    def bar(self, b):
        start = b * 4 * self.beat
        chord = CHORDS[(b // 4) % 4]
        # Four distinct sixteen-bar paragraphs; breaks leave space to read.
        quiet = 24 <= b < 32 or 56 <= b < 60
        section = [1, .87, 1.08, .79][b // 16]
        self.instrument(start, 4 * self.beat + .92, chord[0] + 12, .032 * section, "pad")
        self.instrument(start, 4 * self.beat + .92, chord[2] + 12, .022 * section, "pad")
        self.instrument(start, 4 * self.beat + .92, chord[3] + 12, .017 * section, "pad")
        for beat in ([0, 2] if quiet else [0, 1.5, 2.5]):
            note = chord[0] - 12 if beat == 0 else chord[0]
            self.instrument(start + beat * self.beat, self.beat * .85,
                            note, .075 if beat == 0 else .04, "bass")
        if not quiet:
            for beat in ([1, 3] if b % 2 else [1, 2.75]):
                self.instrument(start + beat * self.beat, .65 * self.beat,
                                chord[(b + int(beat)) % 4] + 12,
                                (.030 if b % 4 else .038) * self.movement, "keys")
            if b % 4 != 3:
                for beat in (0, 1.5, 2.5, 3.5):
                    self.instrument(start + beat * self.beat, .09,
                                    0, .010 * self.movement, "shaker")
        # One five-note signature appears at the beginning, return, and coda.
        # Most bars carry no melody; the career bed is particularly sparse.
        if b in ((0, 1, 32, 33, 60, 61) if self.melody > .7 else
                 (16, 48) if self.melody > .4 else (0, 32)):
            for i, note in enumerate((64, 67, 69, 67, 62)):
                self.instrument(start + (i * .54 + .28) * self.beat,
                                .55 * self.beat, note, .034 * self.melody, "keys")

    def render(self):
        for b in range(64):
            self.bar(b)
        # De-click the compressed loop at the exact wrap with 12 ms edge fades.
        # No silent bars or copied phrases are used to extend the runtime.
        n = round(.012 * RATE)
        fade = np.sin(np.linspace(0, np.pi / 2, n)) ** 2
        self.samples[:n] *= fade
        self.samples[-n:] *= fade[::-1]
        peak = max(np.max(np.abs(self.samples)), 1e-8)
        rms = np.sqrt(np.mean(self.samples ** 2))
        gain = min(.085 / max(rms, 1e-8), .51 / peak)
        return self.samples * gain


def encode(name, samples, masters):
    pcm = (np.clip(samples, -.99, .99) * 32767).astype("<i2").tobytes()
    if masters:
        masters.mkdir(parents=True, exist_ok=True)
        with wave.open(str(masters / (name + ".wav")), "wb") as output:
            output.setnchannels(1); output.setsampwidth(2); output.setframerate(RATE)
            output.writeframes(pcm)
    OUT.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                    "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                    "-codec:a", "libvorbis", "-b:a", "56k", str(OUT / (name + ".ogg"))],
                   input=pcm, check=True)
    print(f"{name}: {len(samples) / RATE:.1f}s; peak {np.max(np.abs(samples)):.3f}; "
          f"RMS {np.sqrt(np.mean(samples ** 2)):.3f}; "
          f"{(OUT / (name + '.ogg')).stat().st_size // 1024} KiB")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--masters", type=Path, help="directory for uncompressed PCM masters")
    args = parser.parse_args()
    for title, options in SCORES.items():
        track = Score(**options)
        encode(title, track.render(), args.masters)
