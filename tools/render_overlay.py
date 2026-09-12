#!/usr/bin/env python3
"""Render a transparent lower-third overlay for a Cue Timer session.

Driven by the same timeline that produces the cue WAV, so the countdown on
screen and the beeps in the audio cannot drift apart.

    npm run timeline -- kk-sorozat-1 > timeline.json
    tools/.venv/bin/python tools/render_overlay.py timeline.json out.mov

The presenter's talking points are deliberately not drawn: they are cue cards
for whoever is on camera, not something the audience should read.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1920, 1080

INK = (234, 243, 240, 255)
MUTED = (157, 186, 182, 255)
PANEL = (13, 42, 46, 225)
KIND_COLOUR = {
    "work": (244, 178, 60, 255),
    "rest": (124, 192, 214, 255),
    "prep": (194, 210, 206, 255),
}

PANEL_X0, PANEL_X1 = 60, W - 60
PANEL_Y0, PANEL_Y1 = 796, 1012
PAD = 34
ACCENT_W = 8

REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


F_NAME = font(BOLD, 54)
F_NOTE = font(REGULAR, 32)
F_CLOCK = font(REGULAR, 108)
F_NEXT = font(REGULAR, 28)
F_LABEL = font(BOLD, 22)


def clock(seconds: float) -> str:
    whole = max(0, int(seconds + 0.999))
    return f"{whole // 60}:{whole % 60:02d}"


def wrap(text: str, f: ImageFont.FreeTypeFont, width: int) -> list[str]:
    lines: list[str] = []
    line = ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if f.getlength(trial) <= width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def segment_at(segments: list[dict], t: float) -> dict | None:
    for s in segments:
        if t < s["endsAt"]:
            return s
    return None


def draw_frame(segments: list[dict], t: float) -> Image.Image:
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    seg = segment_at(segments, t)
    if seg is None:
        return img

    d = ImageDraw.Draw(img)
    accent = KIND_COLOUR.get(seg["kind"], INK)
    remaining = seg["endsAt"] - t

    # Panel, with a coloured edge so work and rest differ without relying on
    # the text alone.
    d.rounded_rectangle([PANEL_X0, PANEL_Y0, PANEL_X1, PANEL_Y1], radius=16, fill=PANEL)
    d.rounded_rectangle(
        [PANEL_X0, PANEL_Y0, PANEL_X0 + ACCENT_W + 10, PANEL_Y1], radius=16, fill=accent
    )
    d.rectangle([PANEL_X0 + ACCENT_W, PANEL_Y0, PANEL_X0 + ACCENT_W + 12, PANEL_Y1], fill=PANEL)

    # Countdown, right-aligned, its own column.
    clock_text = clock(remaining)
    clock_w = F_CLOCK.getlength(clock_text)
    clock_x = PANEL_X1 - PAD - clock_w
    d.text((clock_x, PANEL_Y0 + 52), clock_text, font=F_CLOCK, fill=INK, anchor="lt")

    text_x = PANEL_X0 + ACCENT_W + PAD
    text_w = int(clock_x - text_x - 40)

    # Exercise name, truncated rather than wrapped: the panel is a fixed height.
    name = seg["name"]
    while F_NAME.getlength(name) > text_w and len(name) > 4:
        name = name[:-2]
    if name != seg["name"]:
        name = name.rstrip() + "…"
    d.text((text_x, PANEL_Y0 + 30), name, font=F_NAME, fill=INK, anchor="lt")

    if seg.get("note"):
        for i, line in enumerate(wrap(seg["note"], F_NOTE, text_w)[:2]):
            d.text((text_x, PANEL_Y0 + 100 + i * 40), line, font=F_NOTE, fill=MUTED, anchor="lt")

    # What is coming, above the panel.
    nxt = segment_at(segments, seg["endsAt"] + 0.001)
    if nxt is not None:
        d.text((PANEL_X0, PANEL_Y0 - 44), "KÖVETKEZIK", font=F_LABEL, fill=MUTED, anchor="lt")
        d.text(
            (PANEL_X0 + 150, PANEL_Y0 - 42),
            f"{nxt['name']}  ·  {clock(nxt['seconds'])}",
            font=F_NEXT,
            fill=INK,
            anchor="lt",
        )
    return img


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("timeline", type=Path)
    ap.add_argument("output", type=Path)
    ap.add_argument("--from", dest="start", type=float, default=0.0)
    ap.add_argument("--to", dest="end", type=float, default=None)
    ap.add_argument("--fps", type=int, default=30, help="output frame rate")
    ap.add_argument("--keep-frames", action="store_true")
    args = ap.parse_args()

    data = json.loads(args.timeline.read_text(encoding="utf-8"))
    segments = data["segments"]
    end = args.end if args.end is not None else data["duration"]
    count = int(end - args.start)
    if count <= 0:
        sys.exit("Nothing to render for that range.")

    tmp = Path(tempfile.mkdtemp(prefix="cue-overlay-"))
    print(f"Rendering {count} s of overlay for {data['name']}", file=sys.stderr)
    try:
        # One frame per second: nothing on the panel changes faster than that.
        for i in range(count):
            draw_frame(segments, args.start + i).save(tmp / f"f{i:05d}.png")
            if i % 60 == 0:
                print(f"\r  {i}/{count} s", end="", file=sys.stderr)
        print(f"\r  {count}/{count} s", file=sys.stderr)

        # QuickTime RLE keeps the alpha channel and is lossless; a mostly
        # transparent frame compresses to very little.
        subprocess.run(
            [
                "ffmpeg", "-y", "-loglevel", "error",
                "-framerate", "1", "-i", str(tmp / "f%05d.png"),
                "-c:v", "qtrle", "-pix_fmt", "argb",
                "-r", str(args.fps),
                str(args.output),
            ],
            check=True,
        )
    finally:
        if args.keep_frames:
            print(f"frames kept in {tmp}", file=sys.stderr)
        else:
            shutil.rmtree(tmp, ignore_errors=True)

    size = args.output.stat().st_size / 1_048_576
    print(f"\n{args.output}  —  {count} s, {size:.1f} MB, alpha preserved", file=sys.stderr)


if __name__ == "__main__":
    main()
