#!/usr/bin/env python3
"""
make-cv.py - renders resume.html to assets/cv/cv.pdf, the file behind the
"Download CV" buttons.

    python tools/make-cv.py

It opens the local resume page in a headless Edge or Chrome, lets the
JavaScript render the content from data.js, and prints it to PDF. So the CV
is generated from the same data as the site and can never drift from it.

Re-run it after any change to data.js that shows on the resume page: a new
job, a date, a project, the email.
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
