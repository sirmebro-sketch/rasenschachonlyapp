#!/usr/bin/env python3
"""Install the approved Rasenschach XI launcher artwork.

Canonical source: artwork/app-icon-source.webp (432x432, square).
Run from repository root: python tools/app-icon.py

Android adaptive icons may crop their outer layer differently per launcher.
The complete artwork is therefore placed once in the foreground with a 15dp
safe-area inset on the 108dp adaptive canvas. A dark stadium-like background
fills the complete launcher mask; the artwork itself is never duplicated.
"""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
RES = ROOT / "android/app/src/main/res"
SOURCE = ROOT / "artwork/app-icon-source.webp"


def validate_webp(data: bytes) -> None:
    if len(data) < 30 or data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise SystemExit("artwork/app-icon-source.webp ist keine gueltige WebP-Datei.")

    declared_size = int.from_bytes(data[4:8], "little") + 8
    if declared_size != len(data):
        raise SystemExit(
            "artwork/app-icon-source.webp ist unvollstaendig: "
            f"RIFF erwartet {declared_size} Bytes, vorhanden sind {len(data)}."
        )

    frame = data.find(b"\x9d\x01\x2a")
    if frame < 0 or frame + 7 > len(data):
        raise SystemExit("WebP-Bildmasse konnten nicht gelesen werden.")

    width = int.from_bytes(data[frame + 3:frame + 5], "little") & 0x3FFF
    height = int.from_bytes(data[frame + 5:frame + 7], "little") & 0x3FFF
    if (width, height) != (432, 432):
        raise SystemExit(
            f"App-Icon muss 432x432 Pixel haben, gefunden: {width}x{height}."
        )


if not SOURCE.is_file():
    raise SystemExit(f"Fehlt: {SOURCE}")

data = SOURCE.read_bytes()
validate_webp(data)

nodpi = RES / "drawable-nodpi"
nodpi.mkdir(parents=True, exist_ok=True)
shutil.copyfile(SOURCE, nodpi / "app_icon_source.webp")

drawable_v24 = RES / "drawable-v24"
drawable_v24.mkdir(parents=True, exist_ok=True)
(drawable_v24 / "ic_launcher_foreground.xml").write_text("""<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:left="15dp"
        android:top="15dp"
        android:right="15dp"
        android:bottom="15dp">
        <bitmap
            android:src="@drawable/app_icon_source"
            android:gravity="fill"
            android:filter="true" />
    </item>
</layer-list>
""", encoding="utf-8")

drawable = RES / "drawable"
drawable.mkdir(parents=True, exist_ok=True)
(drawable / "app_icon_background.xml").write_text("""<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <solid android:color="#081018" />
</shape>
""", encoding="utf-8")

anydpi = RES / "mipmap-anydpi"
anydpi.mkdir(parents=True, exist_ok=True)
legacy = """<?xml version="1.0" encoding="utf-8"?>
<bitmap xmlns:android="http://schemas.android.com/apk/res/android"
    android:src="@drawable/app_icon_source"
    android:gravity="fill"
    android:filter="true" />
"""
(anydpi / "ic_launcher.xml").write_text(legacy, encoding="utf-8")
(anydpi / "ic_launcher_round.xml").write_text(legacy, encoding="utf-8")

adaptive = """<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/app_icon_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
"""
v26 = RES / "mipmap-anydpi-v26"
(v26 / "ic_launcher.xml").write_text(adaptive, encoding="utf-8")
(v26 / "ic_launcher_round.xml").write_text(adaptive, encoding="utf-8")

for density in ("mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"):
    for name in ("ic_launcher.png", "ic_launcher_round.png"):
        old = RES / f"mipmap-{density}" / name
        if old.exists():
            old.unlink()

(ROOT / "artwork/app-icon.svg").write_text("""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 432 432" width="432" height="432">
  <image href="app-icon-source.webp" x="0" y="0" width="432" height="432" preserveAspectRatio="xMidYMid slice"/>
</svg>
""", encoding="utf-8")

print("Installed and validated Rasenschach XI launcher artwork with adaptive safe area.")
