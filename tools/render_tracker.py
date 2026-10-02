#!/usr/bin/env python3
"""Render a small bottom-left session tracker as a transparent frame sequence.

Takes a video-time timeline (segments already shifted to match the recording)
and writes one RGBA PNG per second. Where no segment covers a moment — the
goodbye at the end, for instance — nothing is drawn at all.

The card is narrow and grows upward: at half the width it used to be, it keeps
the footage clear, and nothing is truncated to fit — the name, the instruction
and what is coming next all wrap to as many lines as they need.
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
CARD_W = 300
BOTTOM = 1024
X1 = X0 + CARD_W
PAD, ACCENT = 22, 7

REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
F_NAME = ImageFont.truetype(BOLD, 28)
F_CLOCK = ImageFont.truetype(REG, 58)
F_NOTE = ImageFont.truetype(REG, 21)
F_NEXT = ImageFont.truetype(REG, 19)
F_LABEL = ImageFont.truetype(BOLD, 15)

NAME_LH, NOTE_LH, NEXT_LH = 34, 27, 24


def clock(seconds: float) -> str:
    whole = max(0, int(seconds + 0.999))
    return f"{whole // 60}:{whole % 60:02d}"


def wrap(text: str, font: ImageFont.FreeTypeFont, width: float) -> list[str]:
    """Wrap to as many lines as it takes — the card grows, the text is never cut."""
    lines: list[str] = []
    line = ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if font.getlength(trial) <= width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def segment_at(segments: list[dict], t: float) -> dict | None:
    for s in segments:
        if s["startsAt"] <= t < s["endsAt"]:
            return s
    return None


def draw(segments: list[dict], t: float, next_label: str = "KÖVETKEZIK") -> Image.Image:
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    seg = segment_at(segments, t)
    if seg is None:
        return img  # nothing scheduled here — leave the frame clean

    d = ImageDraw.Draw(img)
    accent = KIND.get(seg["kind"], INK)
    remaining = seg["endsAt"] - t
    nxt = segment_at(segments, seg["endsAt"] + 0.001)
    inner = CARD_W - ACCENT - 2 * PAD

    name_lines = wrap(seg["name"], F_NAME, inner)
    note_lines = wrap(seg["note"], F_NOTE, inner) if seg.get("note") else []
    next_lines = (
        wrap(f"{nxt['name']}  ·  {clock(nxt['seconds'])}", F_NEXT, inner) if nxt else []
    )

    # Only pay for the rows this block actually has.
    height = (
        16 + len(name_lines) * NAME_LH + 8 + F_CLOCK.size + 14
        + len(note_lines) * NOTE_LH
        + (10 + F_LABEL.size + 4 + len(next_lines) * NEXT_LH if nxt else 0)
        + 14 + 5 + 16
    )
    y0, y1 = BOTTOM - height, BOTTOM

    d.rounded_rectangle([X0, y0, X1, y1], radius=14, fill=PANEL)
    d.rounded_rectangle([X0, y0, X0 + ACCENT + 12, y1], radius=14, fill=accent)
    d.rectangle([X0 + ACCENT, y0, X0 + ACCENT + 14, y1], fill=PANEL)

    left, row = X0 + ACCENT + PAD, y0 + 16
    for line in name_lines:
        d.text((left, row), line, font=F_NAME, fill=INK, anchor="lt")
        row += NAME_LH

    # The clock gets its own row: it is what a person glances at mid-exercise.
    row += 8
    d.text((left, row), clock(remaining), font=F_CLOCK, fill=INK, anchor="lt")
    row += F_CLOCK.size + 14

    for line in note_lines:
        d.text((left, row), line, font=F_NOTE, fill=MUTED, anchor="lt")
        row += NOTE_LH

    if nxt is not None:
        row += 10
        d.text((left, row), next_label, font=F_LABEL, fill=MUTED, anchor="lt")
        row += F_LABEL.size + 4
        for line in next_lines:
            d.text((left, row), line, font=F_NEXT, fill=INK, anchor="lt")
            row += NEXT_LH

    # How far through the current block, so progress is readable at a glance.
    row += 14
    bar_x1 = X1 - PAD
    done = 1 - remaining / max(seg["endsAt"] - seg["startsAt"], 1e-6)
    d.rounded_rectangle([left, row, bar_x1, row + 5], radius=3, fill=TRACK)
    if done > 0:
        d.rounded_rectangle([left, row, left + (bar_x1 - left) * done, row + 5],
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
    next_label = data.get("nextLabel", "KÖVETKEZIK")
    end = args.end if args.end is not None else data["duration"]
    args.outdir.mkdir(parents=True, exist_ok=True)

    count = int(end - args.start)
    for i in range(count):
        draw(segments, args.start + i, next_label).save(args.outdir / f"f{i:05d}.png")
        if i % 120 == 0:
            print(f"\r  {i}/{count}", end="", flush=True)
    print(f"\r  {count}/{count} frames in {args.outdir}")


if __name__ == "__main__":
    main()
