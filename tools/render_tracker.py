#!/usr/bin/env python3
"""Render a small bottom-left session tracker as a transparent frame sequence.

Takes a video-time timeline (segments already shifted to match the recording)
and writes one RGBA PNG per second. Where no segment covers a moment — the
goodbye at the end, for instance — nothing is drawn at all.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1920, 1080

INK = (234, 243, 240, 255)
MUTED = (163, 190, 186, 255)
PANEL = (13, 42, 46, 219)
TRACK = (29, 84, 89, 255)
KIND = {
    "work": (244, 178, 60, 255),
    "rest": (124, 192, 214, 255),
    "prep": (194, 210, 206, 255),
}

# A corner card, deliberately small: it sits on footage, it is not the subject.
# It grows upward from a fixed bottom margin, so its height can follow its
# content without the card appearing to move.
X0 = 56
CARD_W = 596
BOTTOM = 1024
X1 = X0 + CARD_W
PAD, ACCENT = 22, 7

REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
F_NAMES = [ImageFont.truetype(BOLD, px) for px in (30, 28, 26, 24)]
F_CLOCK = ImageFont.truetype(REG, 50)
F_NOTE = ImageFont.truetype(REG, 21)
F_NEXT = ImageFont.truetype(REG, 19)
F_LABEL = ImageFont.truetype(BOLD, 15)


def clock(seconds: float) -> str:
    whole = max(0, int(seconds + 0.999))
    return f"{whole // 60}:{whole % 60:02d}"


def wrap(text: str, font: ImageFont.FreeTypeFont, width: float, max_lines: int) -> list[str]:
    lines: list[str] = []
    line = ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if font.getlength(trial) <= width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
            if len(lines) == max_lines:
                break
    if line and len(lines) < max_lines:
        lines.append(line)
    if lines and font.getlength(" ".join(lines)) < font.getlength(text):
        last = lines[-1]
        while last and font.getlength(last + "…") > width:
            last = last[:-1]
        lines[-1] = last.rstrip() + "…"
    return lines


def fit(text: str, font: ImageFont.FreeTypeFont, width: float) -> str:
    if font.getlength(text) <= width:
        return text
    while text and font.getlength(text + "…") > width:
        text = text[:-1]
    return text.rstrip() + "…"


def segment_at(segments: list[dict], t: float) -> dict | None:
    for s in segments:
        if s["startsAt"] <= t < s["endsAt"]:
            return s
    return None


def draw(segments: list[dict], t: float) -> Image.Image:
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    seg = segment_at(segments, t)
    if seg is None:
        return img  # nothing scheduled here — leave the frame clean

    d = ImageDraw.Draw(img)
    accent = KIND.get(seg["kind"], INK)
    remaining = seg["endsAt"] - t
    nxt = segment_at(segments, seg["endsAt"] + 0.001)
    note = seg.get("note")

    inner = CARD_W - ACCENT - 2 * PAD
    note_lines = wrap(note, F_NOTE, inner, 2) if note else []

    # Only pay for the rows this block actually has.
    height = 16 + 70 + len(note_lines) * 27 + (30 if nxt else 0) + 26
    y0 = BOTTOM - height
    y1 = BOTTOM

    d.rounded_rectangle([X0, y0, X1, y1], radius=14, fill=PANEL)
    d.rounded_rectangle([X0, y0, X0 + ACCENT + 12, y1], radius=14, fill=accent)
    d.rectangle([X0 + ACCENT, y0, X0 + ACCENT + 14, y1], fill=PANEL)

    left = X0 + ACCENT + PAD
    clock_text = clock(remaining)
    clock_x = X1 - PAD - F_CLOCK.getlength(clock_text)
    d.text((clock_x, y0 + 16), clock_text, font=F_CLOCK, fill=INK, anchor="lt")

    # Drop a size or two rather than truncate: the full exercise name matters.
    name_w = clock_x - left - 18
    f_name = next((f for f in F_NAMES if f.getlength(seg["name"]) <= name_w), F_NAMES[-1])
    d.text((left, y0 + 24), fit(seg["name"], f_name, name_w), font=f_name, fill=INK, anchor="lt")

    row = y0 + 70
    for line in note_lines:
        d.text((left, row), line, font=F_NOTE, fill=MUTED, anchor="lt")
        row += 27
    if nxt is not None:
        d.text((left, row + 3), "KÖVETKEZIK", font=F_LABEL, fill=MUTED, anchor="lt")
        d.text((left + 112, row), fit(f"{nxt['name']}  ·  {clock(nxt['seconds'])}",
               F_NEXT, inner - 118), font=F_NEXT, fill=INK, anchor="lt")
        row += 30

    # How far through the current block, so progress is readable at a glance.
    bar_y = y1 - 20
    bar_x1 = X1 - PAD
    done = 1 - remaining / max(seg["endsAt"] - seg["startsAt"], 1e-6)
    d.rounded_rectangle([left, bar_y, bar_x1, bar_y + 5], radius=3, fill=TRACK)
    if done > 0:
        d.rounded_rectangle([left, bar_y, left + (bar_x1 - left) * done, bar_y + 5],
                            radius=3, fill=accent)
    return img


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("timeline", type=Path)
    ap.add_argument("outdir", type=Path)
    ap.add_argument("--from", dest="start", type=float, default=0.0)
    ap.add_argument("--to", dest="end", type=float, default=None)
    args = ap.parse_args()

    data = json.loads(args.timeline.read_text(encoding="utf-8"))
    segments = data["segments"]
    end = args.end if args.end is not None else data["duration"]
    args.outdir.mkdir(parents=True, exist_ok=True)

    count = int(end - args.start)
    for i in range(count):
        draw(segments, args.start + i).save(args.outdir / f"f{i:05d}.png")
        if i % 120 == 0:
            print(f"\r  {i}/{count}", end="", flush=True)
    print(f"\r  {count}/{count} frames in {args.outdir}")


if __name__ == "__main__":
    main()
