/**
 * The cue vocabulary.
 *
 * These values come from the reference prototype and are treated as spec: the
 * pitch differences are what let a listener tell *what* changed without
 * looking at the screen. Do not "tidy" them into a single beep.
 */

export type CueName = 'pip' | 'work' | 'rest' | 'prep' | 'done' | 'exhale'

export type Cue = {
  freq: number
  dur: number
  type: OscillatorType
  gain: number
  /** Strike and fade away like a small bell, instead of a held tone. */
  bell?: boolean
}

/** Workouts use the standard cues; calm sessions such as breathing use the soft set. */
export type CuePalette = 'standard' | 'soft'

export const CUES: Record<CueName, Cue> = {
  pip: { freq: 920, dur: 0.11, type: 'triangle', gain: 0.3 },
  work: { freq: 1320, dur: 0.7, type: 'sine', gain: 0.34 },
  rest: { freq: 520, dur: 0.7, type: 'sine', gain: 0.34 },
  prep: { freq: 784, dur: 0.45, type: 'sine', gain: 0.26 },
  done: { freq: 1568, dur: 1.3, type: 'sine', gain: 0.32 },
  exhale: { freq: 660, dur: 0.7, type: 'sine', gain: 0.3 },
}

/**
 * The soft set: bell-like sine chimes that fade out instead of holding, at
 * lower pitches and levels. The same idea as the standard cues, high means
 * "go" and low means "let go", so breathing in rings a fifth above breathing out.
 */
export const SOFT_CUES: Record<CueName, Cue> = {
  pip: { freq: 880, dur: 0.45, type: 'sine', gain: 0.1, bell: true },
  work: { freq: 659.25, dur: 2.2, type: 'sine', gain: 0.3, bell: true },
  exhale: { freq: 440, dur: 2.2, type: 'sine', gain: 0.28, bell: true },
  rest: { freq: 440, dur: 2.2, type: 'sine', gain: 0.28, bell: true },
  prep: { freq: 523.25, dur: 1.8, type: 'sine', gain: 0.22, bell: true },
  done: { freq: 783.99, dur: 3, type: 'sine', gain: 0.28, bell: true },
}

export const PALETTES: Record<CuePalette, Record<CueName, Cue>> = { standard: CUES, soft: SOFT_CUES }

const ATTACK = 0.008
const RELEASE = 0.05
const BELL_ATTACK = 0.02

/**
 * Schedule one cue on `ctx` at absolute time `at` (in that context's clock).
 *
 * The gain envelope matters: ramping in over 8 ms and out over the last 50 ms
 * is what stops every tone from clicking. Works on both AudioContext and
 * OfflineAudioContext, which is how the WAV export reuses the same engine.
 */
export function scheduleTone(
  ctx: BaseAudioContext,
  cue: Cue,
  at: number,
  destination: AudioNode = ctx.destination,
): OscillatorNode {
  const t = Math.max(at, 0)
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = cue.type
  osc.frequency.setValueAtTime(cue.freq, t)

  gain.gain.setValueAtTime(0, t)
  if (cue.bell) {
    // A soft strike, then an exponential fade: no hard edge anywhere.
    gain.gain.linearRampToValueAtTime(cue.gain, t + BELL_ATTACK)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + cue.dur)
  } else {
    gain.gain.linearRampToValueAtTime(cue.gain, t + ATTACK)
    gain.gain.setValueAtTime(cue.gain, t + Math.max(cue.dur - RELEASE, 0.02))
    gain.gain.linearRampToValueAtTime(0, t + cue.dur)
  }

  osc.connect(gain)
  gain.connect(destination)
  osc.start(t)
  osc.stop(t + cue.dur + 0.03)

  return osc
}
