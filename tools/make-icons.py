#!/usr/bin/env python3
"""
make-icons.py - renders the PNG app icons that site.webmanifest and iOS point at.

    python tools/make-icons.py

The SVG favicon covers browser tabs, but nothing else: Android's "add to home
screen", iOS's apple-touch-icon and the install prompt all need real PNGs, and
silently fall back to a screenshot of the page without them.

Initials and accent colour are read from assets/js/data.js, so this stays in
step with the rest of the site - re-run it if you change either.

Writes: assets/img/icon-192.png, icon-512.png, apple-touch-icon.png
"""
import os
import re
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Pillow is missing. Install it with:  pip install Pillow")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ACCENT     = (255, 146, 69)
ACCENT_INK = (26, 13, 2)


def field(src, key, default=""):
    """Pull a single quoted string out of the SITE block in data.js."""
    m = re.search(r'^\s*%s\s*:\s*"([^"]*)"' % re.escape(key), src, re.M)
    return m.group(1) if m else default


def font(name, size):
    for path in (
        os.path.join(os.environ.get("WINDIR", r"C:\Windows"), "Fonts", name),
        os.path.join("/usr/share/fonts/truetype/dejavu", name),
    ):
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


data = open(os.path.join(ROOT, "assets/js/data.js"), encoding="utf-8").read()
initials = field(data, "initials", "YN")


def draw(size, path):
    """Full-bleed accent square with the initials centred.

    Full-bleed on purpose: Android masks maskable icons to a circle or a
    squircle, so anything drawn near the edge gets cut. The letters sit inside
    the middle 40%, which is well inside the safe zone.
    """
    img = Image.new("RGB", (size, size), ACCENT)
    d = ImageDraw.Draw(img)
    f = font("segoeuib.ttf", int(size * 0.42))
    bb = d.textbbox((0, 0), initials, font=f)
    d.text(
        (size / 2 - (bb[2] - bb[0]) / 2 - bb[0],
         size / 2 - (bb[3] - bb[1]) / 2 - bb[1]),
        initials,
        font=f,
        fill=ACCENT_INK,
    )
    out = os.path.join(ROOT, path)
    img.save(out, "PNG", optimize=True)
    print("wrote %s  (%d x %d, %.0f KB)" % (out, size, size, os.path.getsize(out) / 1024))


draw(192, "assets/img/icon-192.png")
draw(512, "assets/img/icon-512.png")
draw(180, "assets/img/apple-touch-icon.png")
