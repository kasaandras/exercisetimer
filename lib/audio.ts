import { CUES, scheduleTone, type CueName } from './cues'
import type { CueEvent } from './program'

/** How far ahead cues are committed to the audio clock. */
const WINDOW_SECONDS = 30
/** How often that window is topped up. */
const TOPUP_MS = 10_000
/** Small lead so the first tone is never scheduled in the past. */
const START_LEAD = 0.12

export type EngineState = 'idle' | 'running' | 'paused' | 'interrupted' | 'finished'

/**
 * Drives the cue track off the Web Audio clock.
 *
 * Every tone is committed with an absolute `osc.start(t)` ahead of time, so
 * timing is sample-accurate and survives a busy main thread. Nothing here is
 * driven by setInterval noticing that a threshold was crossed — the only job
 * of the timer is to top up the scheduling window.
 *
 * The visual clock reads `position` (derived from the audio clock), never the
 * other way round, so sound and display cannot disagree.
 */
export class CueEngine {
  private ctx: AudioContext | null = null
  private events: CueEvent[] = []
  private duration = 0
  /** ctx.currentTime that corresponds to session position 0. */
  private anchor = 0
  private heldPosition = 0
  private nextIndex = 0
  private live: OscillatorNode[] = []
  private timer: ReturnType<typeof setInterval> | null = null
  private state: EngineState = 'idle'

  onStateChange: ((state: EngineState) => void) | null = null

  /** Must be called from a user gesture the first time. */
  ensureContext(): AudioContext {
    if (!this.ctx) {
      type WithWebkit = typeof globalThis & { webkitAudioContext?: typeof AudioContext }
      const Ctor = window.AudioContext ?? (globalThis as WithWebkit).webkitAudioContext
      this.ctx = new Ctor!()
      this.ctx.onstatechange = () => {
        // iOS suspends the context when the screen locks or the tab goes away.
        // Surface that as an interruption instead of drifting on silently.
        if (this.state === 'running' && this.ctx && this.ctx.state !== 'running') {
          this.interrupt()
        }
      }
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  get currentState(): EngineState {
    return this.state
  }

  /** Session position in seconds, read off the audio clock. */
  get position(): number {
    if (this.state === 'running' && this.ctx) {
      return Math.min(Math.max(this.ctx.currentTime - this.anchor, 0), this.duration)
    }
    return this.heldPosition
  }

  get sessionDuration(): number {
    return this.duration
  }

  load(events: CueEvent[], duration: number): void {
    this.cancelScheduled()
    this.events = events
    this.duration = duration
    this.heldPosition = 0
    this.nextIndex = 0
    this.setState('idle')
  }

  start(): void {
    if (this.state === 'running') return
    this.playFrom(this.state === 'finished' ? 0 : this.heldPosition)
  }

  /** Re-anchor to `position` and commit the cues that follow it. */
  private playFrom(position: number): void {
    const ctx = this.ensureContext()
    this.cancelScheduled()

    const from = Math.min(Math.max(position, 0), this.duration)
    this.anchor = ctx.currentTime + START_LEAD - from
    // Skip anything already in the past; a pip whose moment has gone must not
    // fire late, it would contradict the clock.
    this.nextIndex = this.events.findIndex((e) => e.at >= from)
    if (this.nextIndex === -1) this.nextIndex = this.events.length

    this.setState('running')
    this.pump()
    this.timer = setInterval(() => this.pump(), TOPUP_MS)
  }

  /** Commit every cue that falls inside the scheduling window. */
  private pump(): void {
    if (!this.ctx || this.state !== 'running') return
    const horizon = this.position + WINDOW_SECONDS

    while (this.nextIndex < this.events.length && this.events[this.nextIndex].at <= horizon) {
      const event = this.events[this.nextIndex]
      const node = scheduleTone(this.ctx, CUES[event.cue], this.anchor + event.at)
      node.onended = () => {
        this.live = this.live.filter((n) => n !== node)
      }
      this.live.push(node)
      this.nextIndex++
    }

    if (this.position >= this.duration && this.nextIndex >= this.events.length) {
      this.finish()
    }
  }

  pause(): void {
    if (this.state !== 'running') return
    this.heldPosition = this.position
    this.cancelScheduled()
    this.setState('paused')
  }

  /** The context went away underneath us; hold the real elapsed position. */
  private interrupt(): void {
    this.heldPosition = this.position
    this.cancelScheduled()
    this.setState('interrupted')
  }

  /** Called by the display loop the moment the clock reaches the end. */
  finish(): void {
    this.heldPosition = this.duration
    this.stopTimer()
    this.setState('finished')
  }

  reset(): void {
    this.cancelScheduled()
    this.heldPosition = 0
    this.nextIndex = 0
    this.setState('idle')
  }

  /** Drop every committed node so a paused session goes properly silent. */
  private cancelScheduled(): void {
    this.stopTimer()
    for (const node of this.live) {
      node.onended = null
      try {
        node.stop()
      } catch {
        // Already stopped; nothing to do.
      }
      node.disconnect()
    }
    this.live = []
  }

  private stopTimer(): void {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  private setState(state: EngineState): void {
    this.state = state
    this.onStateChange?.(state)
  }

  /** One-off cue for the cue-key page. */
  preview(name: CueName): void {
    const ctx = this.ensureContext()
    if (name === 'pip') {
      const t = ctx.currentTime + 0.01
      scheduleTone(ctx, CUES.pip, t)
      scheduleTone(ctx, CUES.pip, t + 0.55)
      scheduleTone(ctx, CUES.pip, t + 1.1)
      return
    }
    scheduleTone(ctx, CUES[name], ctx.currentTime + 0.01)
  }

  dispose(): void {
    this.cancelScheduled()
    void this.ctx?.close()
    this.ctx = null
  }
}
