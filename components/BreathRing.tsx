/**
 * One breathing block as a ring of one-second pieces: the breathing-in part
 * first, then the breathing-out part, starting at twelve o'clock. Pieces light
 * up as the seconds pass, so the half minute reads at a glance as "how far
 * into breathing in am I, and when do I let go".
 *
 * Whole seconds on purpose: the video overlay renders one frame per second,
 * and this ring is meant to be drawn the same way there.
 */

/**
 * After the low chime the ring says "breathe out" only this long, then "nose breathing":
 * a normal breath out, not a long one stretched over the whole half (András, 2026-10-12).
 */
export const BREATH_OUT_SECONDS = 3

const SIZE = 200
const R = 86
const STROKE = 16
/** Gap between pieces, in degrees. */
const GAP = 2.2
/** Extra gap where breathing in turns into breathing out, and at the top. */
const SPLIT_GAP = 6

type Props = {
  seconds: number
  breathIn: number
  /** Whole seconds already finished in this block. */
  elapsed: number
  label: string
  /** Seconds left in the current part. */
  left: number
}

const point = (deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180
  return `${(SIZE / 2 + R * Math.cos(a)).toFixed(2)} ${(SIZE / 2 + R * Math.sin(a)).toFixed(2)}`
}

export function BreathRing({ seconds, breathIn, elapsed, label, left }: Props) {
  const step = 360 / seconds
  const inhaling = elapsed < breathIn
  return (
    <div className={inhaling ? 'breathRing in' : 'breathRing out'}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        {Array.from({ length: seconds }, (_, i) => {
          // Wider gaps at the two boundaries, so the ring reads as two parts.
          const startGap = i === 0 || i === breathIn ? SPLIT_GAP : GAP
          const endGap = i === seconds - 1 || i === breathIn - 1 ? SPLIT_GAP : GAP
          const a0 = i * step + startGap / 2
          const a1 = (i + 1) * step - endGap / 2
          const part = i < breathIn ? 'in' : 'out'
          const state = i < elapsed ? 'past' : i === elapsed ? 'now' : 'todo'
          return (
            <path
              key={i}
              className={`piece ${part} ${state}`}
              d={`M ${point(a0)} A ${R} ${R} 0 0 1 ${point(a1)}`}
              strokeWidth={STROKE}
            />
          )
        })}
      </svg>
      <div className="breathCentre">
        <span className="breathLabel">{label}</span>
        <span className="breathLeft">{left}</span>
      </div>
    </div>
  )
}
