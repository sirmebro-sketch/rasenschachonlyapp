#!/usr/bin/env python3
"""Original Rasenschach XI UI cues. Requires numpy and ffmpeg/libmp3lame.

Deterministic synthesis; no samples, recordings, borrowed melodies or licenses.
Run from the repository root: python3 tools/generate-sounds.py
"""
from pathlib import Path
import subprocess
import numpy as np

RATE = 44100
OUT = Path(__file__).resolve().parents[1] / "public" / "sounds"
RNG = np.random.default_rng(11092026)


class Cue:
    def __init__(self, duration):
        self.samples = np.zeros(round(duration * RATE), dtype=np.float64)

    def tone(self, start, duration, hz, amp=1, kind="bell", end_hz=None):
        n = round(duration * RATE)
        t = np.arange(n) / RATE
        if end_hz is None:
            phase = 2 * np.pi * hz * t
        else:
            phase = 2 * np.pi * (hz * t + (end_hz - hz) * t * t / (2 * duration))
        if kind == "bell":
            wave = (np.sin(phase) + .24 * np.sin(2 * phase) +
                    .11 * np.sin(3 * phase) + .04 * np.sin(5 * phase)) / 1.39
            env = (1 - np.exp(-t * 300)) * np.exp(-t / (duration * .36))
        elif kind == "soft":
            wave = (np.sin(phase) + .13 * np.sin(2 * phase)) / 1.13
            env = np.sin(np.pi * np.minimum(t / duration, 1)) ** .8
        else:  # Rounded bass/footfall: the pitch sweep supplies the attack.
            wave = np.sin(phase) + .18 * np.sin(2 * phase)
            env = (1 - np.exp(-t * 200)) * np.exp(-t / (duration * .22))
        self.add(start, amp * wave * env)
        return self

    def rustle(self, start, duration, amp=.13):
        n = round(duration * RATE)
        t = np.arange(n) / RATE
        noise = RNG.standard_normal(n)
        noise = np.diff(noise, prepend=noise[0])  # No broadband crowd recording.
        noise /= max(np.max(np.abs(noise)), 1)
        env = np.sin(np.pi * np.minimum(t / duration, 1)) ** 2
        self.add(start, amp * noise * env)
        return self

    def add(self, start, wave):
        at = round(start * RATE)
        end = min(len(self.samples), at + len(wave))
        self.samples[at:end] += wave[:end - at]

    def write(self, name):
        # Gentle saturation, a short fade and conservative phone-speaker headroom.
        x = np.tanh(self.samples * 1.25)
        fade = min(180, len(x) // 4)
        x[:fade] *= np.linspace(0, 1, fade)
        x[-fade:] *= np.linspace(1, 0, fade)
        x *= .65 / max(np.max(np.abs(x)), 1e-8)
        pcm = (x * 32767).astype("<i2").tobytes()
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                        "-f", "s16le", "-ar", str(RATE), "-ac", "1", "-i", "pipe:0",
                        "-codec:a", "libmp3lame", "-b:a", "64k", str(OUT / (name + ".mp3"))],
                       input=pcm, check=True)


def render():
    OUT.mkdir(parents=True, exist_ok=True)
    # E minor pentatonic binds the navigation, match and collector cues together.
    Cue(.11).tone(0, .085, 659, .32, end_hz=523).write("tap")
    Cue(.19).tone(0, .14, 392, .32).tone(.052, .12, 494, .23).write("navigate")
    Cue(.28).tone(0, .13, 330, .4).tone(.08, .17, 494, .3).write("confirm")
    Cue(.32).tone(0, .18, 196, .42, "bass", 88).tone(.09, .18, 392, .22).write("training")
    Cue(.34).rustle(0, .15, .18).tone(.05, .23, 294, .34).tone(.12, .18, 392, .22).write("event")
    Cue(.36).tone(0, .20, 330, .32).tone(.11, .22, 220, .3).write("setback")
    Cue(.39).tone(0, .29, 880, .17, "soft", 1050).tone(.07, .24, 1320, .12, "soft", 1400).write("whistle")
    Cue(.78).tone(0, .21, 147, .42, "bass", 70).rustle(.12, .35, .25).tone(.35, .31, 392, .32).tone(.49, .25, 494, .26).write("season")
    Cue(.71).tone(0, .22, 196, .46, "bass", 92).tone(.12, .28, 392, .28).tone(.24, .30, 587, .35).tone(.39, .27, 784, .28).write("goal")
    Cue(1.22).tone(0, .31, 196, .47, "bass", 78).tone(.13, .38, 392, .27).tone(.28, .42, 494, .31).tone(.45, .53, 587, .37).tone(.65, .46, 784, .27).rustle(.50, .43, .16).write("trophy")
    Cue(.82).rustle(0, .31, .26).tone(.04, .18, 98, .53, "bass", 48).tone(.30, .36, 330, .32).tone(.48, .27, 494, .29).write("pack")
    Cue(.52).rustle(0, .19, .19).tone(.11, .35, 392, .39).tone(.21, .27, 659, .25).write("reveal")
    Cue(.97).tone(0, .30, 196, .37, "bass", 105).rustle(.12, .29, .15).tone(.28, .41, 392, .36).tone(.44, .39, 587, .31).tone(.62, .30, 784, .25).write("wildcard")
    Cue(.57).tone(0, .18, 330, .32).tone(.16, .25, 392, .32).tone(.29, .23, 587, .27).write("transfer")
    Cue(.38).rustle(0, .16, .16).tone(.06, .27, 392, .31).tone(.13, .24, 587, .21).write("flip")
    Cue(1.71).tone(0, .50, 196, .28, "soft").tone(.27, .53, 294, .23, "soft").tone(.56, .72, 392, .3, "soft").tone(.82, .66, 494, .24).tone(1.07, .55, 659, .18).write("farewell")


if __name__ == "__main__":
    render()
