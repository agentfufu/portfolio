#!/usr/bin/env python3
"""
Writes each image's real pixel size into data.js (w/h on gallery entries,
coverW/coverH on projects) so the browser can reserve space before the file loads.
Run after adding images. Needs Pillow.
"""
import io
import os
import re
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is missing. Install it with:  pip install Pillow")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "assets/js/data.js")

src = io.open(DATA, encoding="utf-8").read()

changed = missing = ok = 0


def stamper(key, wkey, hkey):
    """Build a re.sub callback that stamps one image key on its own line."""

    def stamp(m):
        global changed, missing, ok
        indent, path, tail = m.group(1), m.group(2), m.group(3)
        full = os.path.join(ROOT, path.replace("/", os.sep))
        if not os.path.exists(full):
            print("  missing file, skipped: %s" % path)
            missing += 1
            return m.group(0)
        w, h = Image.open(full).size
        # Drop the size keys already on the line, then re-add the measured pair.
        for k in (wkey, hkey):
            tail = re.sub(r"\s*\b%s:\s*\d+\s*," % k, "", tail)
        new = '%s%s: "%s", %s: %d, %s: %d,%s' % (indent, key, path, wkey, w, hkey, h, tail)
        if new == m.group(0):
            ok += 1
        else:
            changed += 1
        return new

    return stamp


def section(name):
    """Character range of one top-level array in data.js, so keys can't collide."""
    start = src.find("const %s" % name)
    if start == -1:
        sys.exit("No %s array found in data.js" % name)
    end = src.find("\nconst ", start + 1)
    return start, (len(src) if end == -1 else end)


for name, key, wkey, hkey in (
    ("GALLERY", "src", "w", "h"),
    ("PROJECTS", "cover", "coverW", "coverH"),
):
    a, b = section(name)
    patched = re.sub(r'( *)%s: "([^"]+)",(.*)' % key, stamper(key, wkey, hkey), src[a:b])
    src = src[:a] + patched + src[b:]

if changed:
    io.open(DATA, "w", encoding="utf-8", newline="\n").write(src)

print("stamped %d entr%s, %d already correct, %d missing file(s)"
      % (changed, "y" if changed == 1 else "ies", ok, missing))
