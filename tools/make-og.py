#!/usr/bin/env python3
"""
Renders assets/img/og.png (1200x630), the link preview image.
Reads name, role and headline from data.js. Needs Pillow.
"""
import os
import re
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Pillow is missing. Install it with:  pip install Pillow")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1200, 630

BG      = (11, 12, 15)
SURFACE = (20, 22, 27)
LINE    = (38, 42, 51)
INK     = (237, 238, 242)
INK_2   = (185, 189, 201)
INK_3   = (131, 136, 151)
ACCENT  = (255, 146, 69)
ACCENT_INK = (26, 13, 2)


def field(src, key, default=""):
    """Pull a single quoted string out of the SITE block in data.js."""
    m = re.search(r'^\s*%s\s*:\s*"((?:[^"\\]|\\.)*)"' % re.escape(key), src, re.M)
    if not m:
        return default
    # Decode backslash escapes without destroying real non-ASCII characters
    # (a plain .encode() here turns an em dash into mojibake).
    return m.group(1).encode("latin-1", "backslashreplace").decode("unicode_escape")


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
location = field(data, "location", "")

# The headline carries <em> tags for the web; strip them for the image.
headline = re.sub(r"<[^>]+>", "", field(data, "headline", ""))

f_name  = font("segoeuib.ttf", 82)
f_role  = font("seguisb.ttf", 40)
f_line  = font("segoeui.ttf", 27)
f_mark  = font("segoeuib.ttf", 44)
f_small = font("consola.ttf", 24)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# --- faint blueprint grid, same idea as the hero section on the site --------
for x in range(0, W, 40):
    d.line([(x, 0), (x, H)], fill=(17, 19, 24), width=1)
for y in range(0, H, 40):
    d.line([(0, y), (W, y)], fill=(17, 19, 24), width=1)

# --- warm glow behind the top-left, drawn as widening translucent bands -----
glow = Image.new("RGB", (W, H), BG)
gd = ImageDraw.Draw(glow)
for i in range(52, 0, -1):
    r = i * 15
    t = i / 52.0
    gd.ellipse(
        [-260 - r // 3, -320 - r // 3, -260 + r, -320 + r],
        fill=(
            int(BG[0] + (ACCENT[0] - BG[0]) * 0.16 * (1 - t)),
            int(BG[1] + (ACCENT[1] - BG[1]) * 0.16 * (1 - t)),
            int(BG[2] + (ACCENT[2] - BG[2]) * 0.16 * (1 - t)),
        ),
    )
img = Image.blend(img, glow, 0.55)
d = ImageDraw.Draw(img)

PAD = 88

# --- brand mark -------------------------------------------------------------
d.rounded_rectangle([PAD, 74, PAD + 84, 158], radius=20, fill=ACCENT)
bb = d.textbbox((0, 0), initials, font=f_mark)
d.text(
    (PAD + 42 - (bb[2] - bb[0]) / 2, 116 - (bb[3] - bb[1]) / 2 - bb[1]),
    initials,
    font=f_mark,
    fill=ACCENT_INK,
)

# --- status pill ------------------------------------------------------------
label = "PORTFOLIO"
bb = d.textbbox((0, 0), label, font=f_small)
pw = (bb[2] - bb[0]) + 40
d.rounded_rectangle([PAD + 108, 92, PAD + 108 + pw, 140], radius=24, fill=SURFACE, outline=LINE)
d.text((PAD + 128, 116 - (bb[3] - bb[1]) / 2 - bb[1]), label, font=f_small, fill=INK_3)

# --- name + role ------------------------------------------------------------
d.text((PAD, 268), name, font=f_name, fill=INK)
d.text((PAD, 372), role, font=f_role, fill=ACCENT)

# --- one wrapped line of positioning ----------------------------------------
if headline:
    words, lines, cur = headline.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if d.textlength(trial, font=f_line) > W - PAD * 2:
            lines.append(cur)
            cur = w
        else:
            cur = trial
    lines.append(cur)
    for i, ln in enumerate(lines[:2]):
        d.text((PAD, 444 + i * 38), ln, font=f_line, fill=INK_2)

# --- footer rule + meta -----------------------------------------------------
d.line([(PAD, H - 96), (W - PAD, H - 96)], fill=LINE, width=1)
foot = "  /  ".join(x for x in (location, "Unreal Engine 4 & 5", "C++ / Blueprint") if x)
d.text((PAD, H - 72), foot, font=f_small, fill=INK_3)

# accent tick in the bottom-right corner
d.rounded_rectangle([W - PAD - 56, H - 76, W - PAD, H - 68], radius=4, fill=ACCENT)

out = os.path.join(ROOT, "assets/img/og.png")
img.save(out, "PNG", optimize=True)
print("wrote %s  (%d x %d, %.0f KB)" % (out, W, H, os.path.getsize(out) / 1024))
