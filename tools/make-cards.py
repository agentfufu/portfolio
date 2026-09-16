#!/usr/bin/env python3
"""
make-cards.py - generates a cover card for every project in data.js that
doesn't have a real image yet.

    python tools/make-cards.py            # only makes missing ones
    python tools/make-cards.py --force    # redraws all of them

These are stand-ins, not the goal. A real screenshot of the thing you built
beats a generated card every time - drop a .jpg into assets/img/projects/ and
point the project's `cover` at it, and this script will leave it alone.
"""
import os
import re
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Pillow is missing. Install it with:  pip install Pillow")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1200, 750

BG      = (14, 16, 20)
SURFACE = (26, 29, 36)
LINE    = (38, 42, 51)
INK     = (237, 238, 242)
INK_2   = (185, 189, 201)
INK_3   = (131, 136, 151)
ACCENT  = (255, 146, 69)


def font(name, size):
    path = os.path.join(os.environ.get("WINDIR", r"C:\Windows"), "Fonts", name)
    return ImageFont.truetype(path, size) if os.path.exists(path) else ImageFont.load_default()


def projects_from_data():
    """Pull slug/title/role/tags/cover out of the PROJECTS array in data.js."""
    src = open(os.path.join(ROOT, "assets/js/data.js"), encoding="utf-8").read()
    start = src.index("const PROJECTS")
    block = src[start:src.index("\n/* -- Devlog", start)]

    out = []
    for chunk in block.split("\n  {\n")[1:]:
        def one(key):
            m = re.search(r'\b%s:\s*"((?:[^"\\]|\\.)*)"' % key, chunk)
            return m.group(1) if m else ""

        tags = re.search(r"\btags:\s*\[(.*?)\]", chunk, re.S)
        out.append({
            "title": one("title"),
            "role":  one("role"),
            "cover": one("cover"),
            "tags":  re.findall(r'"([^"]+)"', tags.group(1)) if tags else [],
        })
    return out


def wrap(d, text, fnt, width):
    lines, cur = [], ""
    for word in text.split():
        trial = (cur + " " + word).strip()
        if d.textlength(trial, font=fnt) > width and cur:
            lines.append(cur)
            cur = word
        else:
            cur = trial
    if cur:
        lines.append(cur)
    return lines


def draw_card(p, path):
    f_title = font("segoeuib.ttf", 66)
    f_role  = font("seguisb.ttf", 30)
    f_tag   = font("consola.ttf", 22)

    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    for x in range(0, W, 50):
        d.line([(x, 0), (x, H)], fill=(19, 21, 26))
    for y in range(0, H, 50):
        d.line([(0, y), (W, y)], fill=(19, 21, 26))

    # diagonal accent wash in the bottom-right, kept very low contrast
    for i in range(300):
        t = i / 300.0
        d.line(
            [(W - 520 + i * 1.8, H), (W - 120 + i * 1.8, H - 420)],
            fill=(
                int(BG[0] + (ACCENT[0] - BG[0]) * 0.05 * (1 - t)),
                int(BG[1] + (ACCENT[1] - BG[1]) * 0.05 * (1 - t)),
                int(BG[2] + (ACCENT[2] - BG[2]) * 0.05 * (1 - t)),
            ),
            width=3,
        )

    PAD = 78
    d.rectangle([PAD, 96, PAD + 64, 102], fill=ACCENT)      # accent rule

    lines = wrap(d, p["title"], f_title, W - PAD * 2 - 40)[:3]
    y = 168
    for ln in lines:
        d.text((PAD, y), ln, font=f_title, fill=INK)
        y += 80

    if p["role"]:
        d.text((PAD, y + 16), p["role"], font=f_role, fill=ACCENT)

    # tag pills along the bottom
    x = PAD
    for tag in p["tags"][:4]:
        tw = d.textlength(tag, font=f_tag)
        if x + tw + 40 > W - PAD:
            break
        d.rounded_rectangle([x, H - 128, x + tw + 38, H - 76], radius=26,
                            fill=SURFACE, outline=LINE)
        d.text((x + 19, H - 113), tag, font=f_tag, fill=INK_2)
        x += tw + 52

    d.line([(PAD, H - 46), (W - PAD, H - 46)], fill=LINE)
    d.text((PAD, H - 38), "UNREAL ENGINE", font=f_tag, fill=INK_3)

    img.save(path, "PNG", optimize=True)


force = "--force" in sys.argv
made = skipped = 0

for p in projects_from_data():
    cover = p["cover"]
    if not cover.lower().endswith(".png"):
        print("skip  %-34s (uses %s)" % (p["title"], os.path.basename(cover)))
        skipped += 1
        continue

    path = os.path.join(ROOT, cover.replace("/", os.sep))
    if os.path.exists(path) and not force:
        print("keep  %-34s %s" % (p["title"], cover))
        skipped += 1
        continue

    os.makedirs(os.path.dirname(path), exist_ok=True)
    draw_card(p, path)
    print("wrote %-34s %s" % (p["title"], cover))
    made += 1

print("\n%d written, %d left alone" % (made, skipped))
