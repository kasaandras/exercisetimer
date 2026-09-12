'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CueEngine, type EngineState } from './audio'
import {
  expandProgram,
  planCues,
  segmentAt,
  totalSeconds,
  type Program,
  type Segment,
} from './program'

export type SessionView = {
  state: EngineState
  /** Seconds left in the current block. */
  remaining: number
  /** Seconds left in the whole session. */
  remainingTotal: number
  segment: Segment | null
  nextSegment: Segment | null
  litPips: number
  pass: number
  passCount: number
  duration: number
}

const PIP_OFFSETS = [3, 2, 1]

export function useSession(program: Program, prepLabel: string) {
  const engineRef = useRef<CueEngine | null>(null)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  const segments = useMemo(() => expandProgram(program, prepLabel), [program, prepLabel])
  const duration = useMemo(() => totalSeconds(segments), [segments])
  const events = useMemo(() => planCues(segments), [segments])

  const [view, setView] = useState<SessionView>(() => ({
    state: 'idle',
    remaining: segments[0]?.seconds ?? 0,
    remainingTotal: duration,
    segment: segments[0] ?? null,
    nextSegment: segments[1] ?? null,
    litPips: 0,
    pass: segments[0]?.pass ?? 0,
    passCount: segments[0]?.passCount ?? 1,
    duration,
  }))

  if (engineRef.current === null && typeof window !== 'undefined') {
    engineRef.current = new CueEngine()
  }

  // Reload the engine whenever the program changes.
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return
    engine.load(events, duration)
    setView({
      state: 'idle',
      remaining: segments[0]?.seconds ?? 0,
      remainingTotal: duration,
      segment: segments[0] ?? null,
      nextSegment: segments[1] ?? null,
      litPips: 0,
      pass: segments[0]?.pass ?? 0,
      passCount: segments[0]?.passCount ?? 1,
      duration,
    })
  }, [events, duration, segments])

  const releaseWakeLock = useCallback(() => {
    void wakeLockRef.current?.release().catch(() => {})
    wakeLockRef.current = null
  }, [])

  const requestWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator) || wakeLockRef.current) return
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen')
    } catch {
      // Unsupported or refused; the UI shows the "keep the screen on" hint.
    }
  }, [])

  /* The display loop. It reads the audio clock and never writes to it, so the
     numbers on screen can never disagree with what is being heard. */
  useEffect(() => {
    const engine = engineRef.current
    if (!engine) return
    let frame = 0

    const tick = () => {
      frame = requestAnimationFrame(tick)
      const state = engine.currentState
      const position = engine.position

      if (state === 'running' && position >= duration) engine.finish()

      const segment = segmentAt(segments, position)
      const index = segment ? segments.indexOf(segment) : -1
      const next = index >= 0 ? (segments[index + 1] ?? null) : null
      const remaining = segment ? segment.endsAt - position : 0
      const lit = segment
        ? PIP_OFFSETS.filter((k) => position >= segment.endsAt - k).length
        : 0

      setView((prev) => {
        // Only re-render when something visible actually changed.
        if (
          prev.state === engine.currentState &&
          Math.ceil(prev.remaining) === Math.ceil(remaining) &&
          prev.segment === segment &&
          prev.litPips === lit
        ) {
          return prev
        }
        return {
          state: engine.currentState,
          remaining,
          remainingTotal: Math.max(duration - position, 0),
          segment,
          nextSegment: next,
          litPips: lit,
          pass: segment?.pass ?? prev.pass,
          passCount: segment?.passCount ?? prev.passCount,
          duration,
        }
      })
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [segments, duration])

  // Hold the screen awake only while actually running.
  useEffect(() => {
    if (view.state === 'running') void requestWakeLock()
    else releaseWakeLock()
  }, [view.state, requestWakeLock, releaseWakeLock])

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && engineRef.current?.currentState === 'running') {
        void requestWakeLock()
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [requestWakeLock])

  useEffect(() => {
    return () => {
      releaseWakeLock()
      engineRef.current?.dispose()
      engineRef.current = null
    }
  }, [releaseWakeLock])

  const toggle = useCallback(() => {
    const engine = engineRef.current
    if (!engine) return
    if (engine.currentState === 'running') engine.pause()
    else engine.start()
  }, [])

  const reset = useCallback(() => {
    engineRef.current?.reset()
  }, [])

  const preview = useCallback((cue: Parameters<CueEngine['preview']>[0]) => {
    engineRef.current?.preview(cue)
  }, [])

  return { view, segments, events, duration, toggle, reset, preview }
}
