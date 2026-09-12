'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useSettings } from '@/components/Providers'
import { useActiveProgram } from '@/lib/active'
import { speechTag } from '@/lib/i18n'
import { formatClock } from '@/lib/program'
import { useSession } from '@/lib/useSession'

export default function RunPage() {
  const { t, lang, speak, setSpeak } = useSettings()
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
      speak={speak}
      setSpeak={setSpeak}
      speechLang={speechTag(lang)}
      t={t}
    />
  )
}

type RunnerProps = {
  program: NonNullable<ReturnType<typeof useActiveProgram>['program']>
  fromLink: boolean
  speak: boolean
  setSpeak: (value: boolean) => void
  speechLang: string
  t: ReturnType<typeof useSettings>['t']
}

function Runner({ program, fromLink, speak, setSpeak, speechLang, t }: RunnerProps) {
  const { view, toggle, reset } = useSession(program, speak, speechLang, t.getReady)
  const { state, segment, nextSegment, remaining, remainingTotal, litPips } = view

  const finished = state === 'finished'
  const kindLabel =
    segment?.kind === 'work' ? t.kindWork : segment?.kind === 'rest' ? t.kindRest : t.getReady
  const accent = finished ? 'done' : (segment?.kind ?? 'ready')

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

  return (
    <main className="wrap">
      {fromLink && <p className="toast">{t.importedProgram}</p>}

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
        <div className="clock" role="timer" aria-live="off">
          {formatClock(finished ? 0 : remaining)}
        </div>

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

      {/* What to do now and what is coming, in smaller type beside the clock.
          Shown before the session starts too, so the first move is known. */}
      {!finished && segment && (
        <aside className="brief">
          <div className="briefCell">
            <span className="briefLabel">{t.labelNow}</span>
            {segment.points ? (
              <ul className="briefPoints">
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

      <div className="check">
        <input
          id="speak"
          type="checkbox"
          checked={speak}
          onChange={(e) => setSpeak(e.target.checked)}
        />
        <label htmlFor="speak">{t.speakNames}</label>
      </div>

      <p className="meta">
        {program.name} — {t.totalLength(formatClock(view.duration))}.{' '}
        <Link href="/programs">{t.navPrograms}</Link>
      </p>
      <p className="meta">{t.keepScreenOn}</p>
    </main>
  )
}
