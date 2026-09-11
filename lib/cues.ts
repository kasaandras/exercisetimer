/**
 * The cue vocabulary.
 *
 * These values come from the reference prototype and are treated as spec: the
 * pitch differences are what let a listener tell *what* changed without
 * looking at the screen. Do not "tidy" them into a single beep.
 */

export type CueName = 'pip' | 'work' | 'rest' | 'prep' | 'done'

export type Cue = {
  freq: number
  dur: number
  type: OscillatorType
  gain: number
}

export const CUES: Record<CueName, Cue> = {
  pip: { freq: 920, dur: 0.11, type: 'triangle', gain: 0.3 },
  work: { freq: 1320, dur: 0.7, type: 'sine', gain: 0.34 },
  rest: { freq: 520, dur: 0.7, type: 'sine', gain: 0.34 },
  prep: { freq: 784, dur: 0.45, type: 'sine', gain: 0.26 },
  done: { freq: 1568, dur: 1.3, type: 'sine', gain: 0.32 },
}

const ATTACK = 0.008
const RELEASE = 0.05

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
  gain.gain.linearRampToValueAtTime(cue.gain, t + ATTACK)
  gain.gain.setValueAtTime(cue.gain, t + Math.max(cue.dur - RELEASE, 0.02))
  gain.gain.linearRampToValueAtTime(0, t + cue.dur)

  osc.connect(gain)
  gain.connect(destination)
  osc.start(t)
  osc.stop(t + cue.dur + 0.03)

  return osc
}
