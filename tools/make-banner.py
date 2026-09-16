#!/usr/bin/env python3
"""
make-banner.py - renders assets/img/linkedin-banner.png, the 1584x396 cover
image at the top of a LinkedIn profile.

    python tools/make-banner.py

Same visual language as the link preview card (make-og.py), so a recruiter
jumping from LinkedIn to the site lands somewhere that looks like the same
person.

Two things drive the layout:

  - The profile photo sits over the BOTTOM-LEFT of the banner on desktop, so
    that corner is left deliberately empty.
  - Mobile crops the sides, so nothing important goes near the left or right
    edge either.

Everything that matters therefore lives in the middle band. Name and role are
read from data.js; the credits line is spelled out below - edit CREDITS when
you ship something new.
"""
import os
import re
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Pillow is missing. Install it with:  pip install Pillow")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1584, 396

BG         = (11, 12, 15)
GRID       = (17, 19, 24)
LINE       = (38, 42, 51)
INK        = (237, 238, 242)
INK_2      = (185, 189, 201)
INK_3      = (131, 136, 151)
ACCENT     = (255, 146, 69)
ACCENT_INK = (26, 13, 2)

CREDITS = "Wildlife Warfare   ·   ATurd - Abuser Escape   ·   Fates Call: A New Beginning"

# The profile photo covers roughly this much of the bottom-left on desktop.
TEXT_X = 470


def field(src, key, default=""):
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
name     = field(data, "name", "Your Name")
initials = field(data, "initials", "YN")
role     = field(data, "role", "Unreal Engine Developer")

f_name = font("segoeuib.ttf", 62)
f_role = font("seguisb.ttf", 31)
f_cred = font("segoeui.ttf", 21)
f_mark = font("segoeuib.ttf", 40)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# --- faint blueprint grid, same as the hero section on the site -------------
for x in range(0, W, 40):
    d.line([(x, 0), (x, H)], fill=GRID, width=1)
for y in range(0, H, 40):
    d.line([(0, y), (W, y)], fill=GRID, width=1)

# --- warm glow off the right edge, away from the profile photo --------------
glow = Image.new("RGB", (W, H), BG)
gd = ImageDraw.Draw(glow)
for i in range(52, 0, -1):
    r = i * 16
    t = i / 52.0
    gd.ellipse(
        [W - 120 - r, 40 - r // 2, W - 120 + r, 40 + r],
        fill=(
            int(BG[0] + (ACCENT[0] - BG[0]) * 0.18 * (1 - t)),
            int(BG[1] + (ACCENT[1] - BG[1]) * 0.18 * (1 - t)),
            int(BG[2] + (ACCENT[2] - BG[2]) * 0.18 * (1 - t)),
        ),
    )
img = Image.blend(img, glow, 0.55)
d = ImageDraw.Draw(img)

# --- brand mark, level with the name ----------------------------------------
mark_y = 150
d.rounded_rectangle([TEXT_X - 118, mark_y, TEXT_X - 40, mark_y + 78], radius=19, fill=ACCENT)
bb = d.textbbox((0, 0), initials, font=f_mark)
d.text(
    (TEXT_X - 79 - (bb[2] - bb[0]) / 2 - bb[0],
     mark_y + 39 - (bb[3] - bb[1]) / 2 - bb[1]),
    initials,
    font=f_mark,
    fill=ACCENT_INK,
)

# --- name, role, credits ----------------------------------------------------
d.text((TEXT_X, 138), name, font=f_name, fill=INK)
d.text((TEXT_X, 216), role, font=f_role, fill=ACCENT)

d.line([(TEXT_X, 272), (TEXT_X + 700, 272)], fill=LINE, width=1)
d.text((TEXT_X, 288), "SHIPPED ON STEAM", font=font("consola.ttf", 17), fill=INK_3)
d.text((TEXT_X + 190, 287), CREDITS, font=f_cred, fill=INK_2)

out = os.path.join(ROOT, "assets/img/linkedin-banner.png")
img.save(out, "PNG", optimize=True)
print("wrote %s  (%d x %d, %.0f KB)" % (out, W, H, os.path.getsize(out) / 1024))
