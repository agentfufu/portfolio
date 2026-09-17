#!/usr/bin/env python3
"""
Renders resume.html to assets/cv/cv.pdf with headless Edge/Chrome.
Run after changing anything that shows on the resume.
"""
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = "file:///" + os.path.join(ROOT, "resume.html").replace(os.sep, "/")
OUT = os.path.join(ROOT, "assets", "cv", "cv.pdf")

CANDIDATES = [
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
]
browser = next((p for p in CANDIDATES if os.path.exists(p)), None)
if not browser:
    sys.exit("No Edge or Chrome found. Open resume.html and print it to PDF by hand.")

os.makedirs(os.path.dirname(OUT), exist_ok=True)
subprocess.run([
    browser,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--virtual-time-budget=4000",     # give data.js time to render
    "--print-to-pdf=" + OUT,
    SRC,
], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

print("wrote %s  (%.0f KB)" % (OUT, os.path.getsize(OUT) / 1024))
