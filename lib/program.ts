import type { CueName } from './cues'

export type BlockKind = 'work' | 'rest' | 'prep'

export type Block = {
  id: string
  name: string
  seconds: number
  kind: BlockKind
  /** Coaching note: form cue, breathing, or the easier variant. */
  note?: string
}

export type Round = {
  name: string
  blocks: Block[]
}

export type Program = {
  id: string
  name: string
  prepSeconds: number
  rounds: Round[]
  repeatRounds: number
}

/** One block laid out on the session timeline, with absolute offsets from t0. */
export type Segment = {
  name: string
  kind: BlockKind
  seconds: number
  note?: string
  startsAt: number
  endsAt: number
  /** 1-based pass through the circuit; 0 for the prep segment. */
  pass: number
  passCount: number
  roundName: string
  /** 1-based position of this round across the whole session; 0 for prep. */
  roundOrdinal: number
  roundTotal: number
}

export type CueEvent = { at: number; cue: CueName }

export function makeId(): string {
  return Math.random().toString(36).slice(2, 10)
}

/**
 * Flatten a program into the ordered list of segments it actually plays:
 * an optional prep block, then every round's blocks, repeated `repeatRounds`
 * times. Offsets are absolute seconds from the start of the session.
 */
export function expandProgram(program: Program, prepLabel = 'Get ready'): Segment[] {
  const segments: Segment[] = []
  const passCount = Math.max(1, Math.floor(program.repeatRounds))
  const roundTotal = passCount * program.rounds.length
  let at = 0
  let roundOrdinal = 0

  const push = (
    name: string,
    kind: BlockKind,
    seconds: number,
    pass: number,
    roundName: string,
    note?: string,
  ) => {
    if (seconds <= 0) return
    segments.push({
      name,
      kind,
      seconds,
      note,
      startsAt: at,
      endsAt: at + seconds,
      pass,
      passCount,
      roundName,
      roundOrdinal,
      roundTotal,
    })
    at += seconds
  }

  if (program.prepSeconds > 0) {
    push(prepLabel, 'prep', program.prepSeconds, 0, '')
  }

  for (let pass = 1; pass <= passCount; pass++) {
    for (const round of program.rounds) {
      roundOrdinal++
      for (const block of round.blocks) {
        push(block.name, block.kind, block.seconds, pass, round.name, block.note)
      }
    }
  }

  // A break followed immediately by "session finished" is dead air, so the
  // session always ends on the last piece of work.
  while (segments.length > 0 && segments[segments.length - 1].kind === 'rest') {
    segments.pop()
  }

  return segments
}

/**
 * Every cue in the session as an absolute offset from t0.
 *
 * Each segment opens with the tone for its kind, and the three pips sit at
 * T-3/T-2/T-1 before that segment *ends*, counting the listener into whatever
 * comes next. The session closes with the rising `done` tone.
 */
export function planCues(segments: Segment[]): CueEvent[] {
  const events: CueEvent[] = []

  for (const segment of segments) {
    events.push({ at: segment.startsAt, cue: segment.kind })
    for (let k = 3; k >= 1; k--) {
      const at = segment.endsAt - k
      // Skip pips that would land before the segment it counts down.
      if (at >= segment.startsAt) events.push({ at, cue: 'pip' })
    }
  }

  if (segments.length > 0) {
    events.push({ at: segments[segments.length - 1].endsAt, cue: 'done' })
  }

  return events.sort((a, b) => a.at - b.at)
}

export function totalSeconds(segments: Segment[]): number {
  return segments.length === 0 ? 0 : segments[segments.length - 1].endsAt
}

/** The segment covering `position` seconds, or null past the end. */
export function segmentAt(segments: Segment[], position: number): Segment | null {
  for (const segment of segments) {
    if (position < segment.endsAt) return segment
  }
  return null
}

export function formatClock(seconds: number): string {
  const whole = Math.max(Math.ceil(seconds), 0)
  const m = Math.floor(whole / 60)
  const s = whole % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const KINDS: BlockKind[] = ['work', 'rest', 'prep']

/**
 * Coerce untrusted input (a share link or a stale localStorage entry) into a
 * usable Program. Anything unrecognised is dropped rather than trusted.
 */
export function normaliseProgram(input: unknown): Program | null {
  if (typeof input !== 'object' || input === null) return null
  const raw = input as Record<string, unknown>

  const clampSeconds = (value: unknown, fallback: number) => {
    const n = typeof value === 'number' ? value : Number(value)
    if (!Number.isFinite(n)) return fallback
    return Math.min(Math.max(Math.round(n), 0), 3600)
  }

  const rounds: Round[] = Array.isArray(raw.rounds)
    ? raw.rounds
        .map((round): Round | null => {
          if (typeof round !== 'object' || round === null) return null
          const r = round as Record<string, unknown>
          const blocks: Block[] = Array.isArray(r.blocks)
            ? r.blocks
                .map((block): Block | null => {
                  if (typeof block !== 'object' || block === null) return null
                  const b = block as Record<string, unknown>
                  const kind = KINDS.includes(b.kind as BlockKind)
                    ? (b.kind as BlockKind)
                    : 'work'
                  const seconds = clampSeconds(b.seconds, 30)
                  if (seconds <= 0) return null
                  return {
                    id: typeof b.id === 'string' ? b.id : makeId(),
                    name: typeof b.name === 'string' ? b.name.slice(0, 80) : 'Block',
                    seconds,
                    kind,
                    note: typeof b.note === 'string' ? b.note.slice(0, 240) : undefined,
                  }
                })
                .filter((b): b is Block => b !== null)
            : []
          if (blocks.length === 0) return null
          return {
            name: typeof r.name === 'string' ? r.name.slice(0, 80) : 'Round',
            blocks,
          }
        })
        .filter((r): r is Round => r !== null)
    : []

  if (rounds.length === 0) return null

  const repeat = Number(raw.repeatRounds)
  return {
    id: typeof raw.id === 'string' ? raw.id : makeId(),
    name: typeof raw.name === 'string' ? raw.name.slice(0, 120) : 'Shared program',
    prepSeconds: clampSeconds(raw.prepSeconds, 10),
    rounds,
    repeatRounds: Number.isFinite(repeat) ? Math.min(Math.max(Math.round(repeat), 1), 99) : 1,
  }
}
