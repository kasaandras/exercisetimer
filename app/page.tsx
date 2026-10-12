'use client'

import { useEffect, useMemo } from 'react'
import { BREATH_OUT_SECONDS, BreathRing } from '@/components/BreathRing'
import { useSettings } from '@/components/Providers'
import { useActiveProgram } from '@/lib/active'
import { formatClock } from '@/lib/program'
import { useSession } from '@/lib/useSession'

export default function RunPage() {
  const { t, lang } = useSettings()
  const { program, fromLink } = useActiveProgram(lang)

  if (!program) {
    return (
      <main className="wrap">
        <h1>{t.appName}</h1>
        <p className="lead">{t.tagline}</p>
      </main>
    )
  }

  return (
    <Runner
      key={program.id}
      program={program}
      fromLink={fromLink}
      t={t}
    />
  )
}

type RunnerProps = {
  program: NonNullable<ReturnType<typeof useActiveProgram>['program']>
  fromLink: boolean
  t: ReturnType<typeof useSettings>['t']
}

function Runner({ program, fromLink, t }: RunnerProps) {
  const { view, segments, toggle, reset } = useSession(program, t.getReady)
  const { state, segment, nextSegment, remaining, remainingTotal, litPips } = view

  const finished = state === 'finished'
  // A breathing block splits into breathing in and breathing out, shown as a ring.
  const breath =
    !finished && segment?.breathIn
      ? (() => {
          const elapsed = Math.min(segment.seconds - Math.ceil(remaining), segment.seconds - 1)
          const inhaling = elapsed < segment.breathIn!
          return {
            breathIn: segment.breathIn!,
            elapsed,
            inhaling,
            left: inhaling ? segment.breathIn! - elapsed : segment.seconds - elapsed,
          }
        })()
      : null
  const kindLabel = breath
    ? breath.inhaling
      ? t.breatheIn
      : breath.elapsed < breath.breathIn + BREATH_OUT_SECONDS ? t.breatheOut : t.noseBreathing
    : segment?.kind === 'work' ? t.kindWork : segment?.kind === 'rest' ? t.kindRest : t.getReady
  // Breathing in takes the work colour, breathing out the calm rest colour.
  const accent = finished ? 'done' : breath ? (breath.inhaling ? 'work' : 'rest') : (segment?.kind ?? 'ready')
  // A block with a read-aloud script needs the room more than the clock does.
  const scripted = !finished && (segment?.points?.join(' ').length ?? 0) > 300

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || tag === 'BUTTON') return
      if (e.code === 'Space') {
        e.preventDefault()
        toggle()
      }
      if (e.key === 'r' || e.key === 'R') reset()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [toggle, reset])

  const startLabel =
    state === 'running' ? t.pause : state === 'paused' || state === 'interrupted' ? t.resume : t.start

  // A program with prompter lines gets the prompter layout throughout, so the screen does
  // not jump between layouts from one block to the next.
  const prompting = useMemo(() => segments.some((s) => s.prompt?.length), [segments])

  if (prompting) {
    const lines = segment?.prompt ?? []
    const elapsed = segment && !finished ? segment.seconds - remaining : 0
    let index = -1
    lines.forEach((line, i) => {
      if (line.at <= elapsed + 0.5) index = i
    })
    // Before a block's first line comes due, show it already (dimmed) so it can be read ahead.
    const current = index >= 0 ? lines[index] : lines[0]
    const upcoming = index < 0 && current !== undefined
    const next = index >= 0 ? (lines[index + 1] ?? nextSegment?.prompt?.[0]) : lines[1] ?? nextSegment?.prompt?.[0]
    return (
      <main
        className="wrap run prompter"
        style={{ ['--accent' as string]: `var(--${accent})` }}
        aria-label={program.name}
      >
        <div className="prompterHead">
          <span className="prompterName">{finished ? t.sessionComplete : (segment?.name ?? t.ready)}</span>
          <span className="prompterClock" role="timer" aria-live="off">
            {formatClock(finished ? 0 : remaining)}
          </span>
        </div>
        {breath && segment && !lines.length ? (
          <div className="prompterRing">
            <BreathRing
              seconds={segment.seconds}
              breathIn={breath.breathIn}
              elapsed={breath.elapsed}
              label={kindLabel}
              left={breath.left}
            />
          </div>
        ) : (
          <p className={upcoming ? 'prompterLine upcoming' : 'prompterLine'} aria-live="polite">
            {finished ? '' : (current?.text ?? segment?.name ?? '')}
          </p>
        )}
        <p className="prompterNext">{!finished && next ? `→ ${next.text}` : ''}</p>
        <div className="row prompterControls">
          <button onClick={toggle}>{startLabel}</button>
          <button className="ghost" onClick={reset}>{t.reset}</button>
          <span className="prompterMeta">{t.leftInSession(formatClock(finished ? 0 : remainingTotal))}</span>
        </div>
        {state === 'interrupted' && <p className="notice">{t.interrupted}</p>}
      </main>
    )
  }

  return (
    <main className="wrap run">
      {fromLink && <p className="toast">{t.importedProgram}</p>}

      <div className={scripted ? 'runGrid scripted' : 'runGrid'}>
        <div className="runMain">

      <section
        className="stage"
        style={{ ['--accent' as string]: `var(--${accent})` }}
        aria-label={program.name}
      >
        <div className="phase">
          <span className="phaseName">
            {finished ? t.sessionComplete : (segment?.name ?? t.ready)}
          </span>
          {segment && !finished && <span className="kindTag">{kindLabel}</span>}
        </div>

        {/* The clock is the one thing that must read from across a room. */}
        {breath && segment ? (
          <div className="clockRow">
            <div className="clock" role="timer" aria-live="off">
              {formatClock(remaining)}
            </div>
            <BreathRing
              seconds={segment.seconds}
              breathIn={breath.breathIn}
              elapsed={breath.elapsed}
              label={kindLabel}
              left={breath.left}
            />
          </div>
        ) : (
          <div className="clock" role="timer" aria-live="off">
            {formatClock(finished ? 0 : remaining)}
          </div>
        )}

        <div className="pips" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <i key={i} className={!finished && litPips > i ? 'lit' : undefined} />
          ))}
          <span className="lbl">{state === 'running' ? t.countingDown : t.countdownPips}</span>
        </div>

        <p className="meta">
          {segment && segment.roundOrdinal > 0 && !finished && (
            <>
              {segment.roundName}
              {segment.roundTotal > 1 && ` · ${segment.roundOrdinal}/${segment.roundTotal}`}
              {' — '}
            </>
          )}
          {t.leftInSession(formatClock(finished ? 0 : remainingTotal))}
        </p>
      </section>

      {/* Screen-reader announcement of the block, since the clock is silent. */}
      <p className="visually-hidden" role="status" aria-live="polite">
        {finished
          ? t.sessionComplete
          : segment
            ? `${kindLabel}: ${segment.name}${segment.note ? `. ${segment.note}` : ''}`
            : t.ready}
      </p>

      <div className="track" aria-hidden="true">
        {Array.from({ length: segment?.roundTotal ?? view.passCount }, (_, i) => {
          const n = i + 1
          const current = segment?.roundOrdinal ?? 0
          return <b key={i} className={finished || n < current ? 'done' : n === current ? 'now' : undefined} />
        })}
      </div>

      <div className="row">
        <button onClick={toggle}>{startLabel}</button>
        <button className="ghost" onClick={reset}>{t.reset}</button>
      </div>

      {state === 'interrupted' && <p className="notice">{t.interrupted}</p>}
        </div>

        <div className="runSide">
      {/* What to do now and what is coming, in smaller type beside the clock.
          Shown before the session starts too, so the first move is known. */}
      {!finished && segment && (
        <aside className="brief">
          <div className="briefCell">
            <span className="briefLabel">{t.labelNow}</span>
            {segment.points ? (
              <ul className={scripted ? 'briefPoints dense' : 'briefPoints'}>
                {segment.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : segment.note ? (
              <p className="briefNote strong">{segment.note}</p>
            ) : (
              <span className="briefName">{segment.name}</span>
            )}
          </div>
          <div className="briefCell muted-cell">
            <span className="briefLabel">{t.labelNext}</span>
            {nextSegment ? (
              <>
                <span className="briefName">
                  {nextSegment.name} · {formatClock(nextSegment.seconds)}
                </span>
                {nextSegment.note && <p className="briefNote">{nextSegment.note}</p>}
              </>
            ) : (
              <span className="briefName">{t.nothingNext}</span>
            )}
          </div>
        </aside>
      )}

        </div>
      </div>
    </main>
  )
}
