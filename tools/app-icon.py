#!/usr/bin/env python3
"""Build the full-bleed Android launcher icon from the committed artwork source.

Requires Pillow:
    python -m pip install Pillow

Run from repository root:
    python tools/app-icon.py

Android owns the outer launcher mask. Do not add an inset badge or safe-zone
border to the artwork itself.
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
RES = ROOT / "android/app/src/main/res"
SOURCE = ROOT / "artwork/app-icon-source.webp"
SIZE = 192

FULL = RES / "drawable-nodpi/app_icon_fullbleed_image.webp"
ROUND = RES / "drawable-nodpi/app_icon_round_image.webp"

ADAPTIVE = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/app_icon_fullbleed"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
"""

BITMAP_FULL = """<?xml version="1.0" encoding="utf-8"?>
<bitmap xmlns:android="http://schemas.android.com/apk/res/android"
    android:src="@drawable/app_icon_fullbleed_image"
    android:gravity="fill"
    android:filter="true"/>
"""

BITMAP_ROUND = """<?xml version="1.0" encoding="utf-8"?>
<bitmap xmlns:android="http://schemas.android.com/apk/res/android"
    android:src="@drawable/app_icon_round_image"
    android:gravity="fill"
    android:filter="true"/>
"""

TRANSPARENT_FOREGROUND = """<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path android:fillColor="#00000000" android:pathData="M0,0h108v108h-108z"/>
</vector>
"""


def square_crop(image: Image.Image) -> Image.Image:
    width, height = image.size
    side = min(width, height)
    left = (width - side) // 2
    top = (height - side) // 2
    return image.crop((left, top, left + side, top + side))


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Icon source missing: {SOURCE}")

    image = square_crop(Image.open(SOURCE).convert("RGB"))
    if image.size != (SIZE, SIZE):
        image = image.resize((SIZE, SIZE), Image.Resampling.LANCZOS)

    FULL.parent.mkdir(parents=True, exist_ok=True)
    image.save(FULL, "WEBP", quality=90, method=6)

    rgba = image.convert("RGBA")
    alpha = Image.new("L", (SIZE, SIZE), 0)
    ImageDraw.Draw(alpha).ellipse((0, 0, SIZE - 1, SIZE - 1), fill=255)
    rgba.putalpha(alpha)
    rgba.save(ROUND, "WEBP", lossless=True, method=6)

    (RES / "mipmap").mkdir(parents=True, exist_ok=True)
    (RES / "mipmap/ic_launcher.xml").write_text(BITMAP_FULL, encoding="utf-8")
    (RES / "mipmap/ic_launcher_round.xml").write_text(BITMAP_ROUND, encoding="utf-8")
    (RES / "mipmap-anydpi-v26/ic_launcher.xml").write_text(ADAPTIVE, encoding="utf-8")
    (RES / "mipmap-anydpi-v26/ic_launcher_round.xml").write_text(ADAPTIVE, encoding="utf-8")
    (RES / "drawable-v24/ic_launcher_foreground.xml").write_text(
        TRANSPARENT_FOREGROUND, encoding="utf-8"
    )

    for density in ("mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"):
        for name in ("ic_launcher.png", "ic_launcher_round.png"):
            path = RES / f"mipmap-{density}/{name}"
            if path.exists():
                path.unlink()

    print("Wrote full-bleed adaptive icon and legacy square/round launcher resources.")


if __name__ == "__main__":
    main()
