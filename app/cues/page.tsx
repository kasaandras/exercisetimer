'use client'

import { useEffect, useRef } from 'react'
import { useSettings } from '@/components/Providers'
import { CueEngine } from '@/lib/audio'
import { CUES, type CueName } from '@/lib/cues'

export default function CuesPage() {
  const { t } = useSettings()
  const engineRef = useRef<CueEngine | null>(null)

  useEffect(() => {
    engineRef.current = new CueEngine()
    return () => {
      engineRef.current?.dispose()
      engineRef.current = null
    }
  }, [])

  const rows: { cue: CueName; name: string; meaning: string }[] = [
    { cue: 'pip', name: t.cuePips, meaning: t.cuePipsMeaning },
    { cue: 'work', name: t.cueWork, meaning: t.cueWorkMeaning },
    { cue: 'rest', name: t.cueRest, meaning: t.cueRestMeaning },
    { cue: 'done', name: t.cueDone, meaning: t.cueDoneMeaning },
  ]

  return (
    <main className="wrap">
      <h1>{t.cuesTitle}</h1>
      <p className="lead">{t.cuesIntro}</p>

      {rows.map((row) => (
        <div className="cueRow" key={row.cue}>
          <div>
            <div className="name">{row.name}</div>
            <div className="meaning">{row.meaning}</div>
            <div className="meaning">
              {Math.round(CUES[row.cue].freq)} Hz
            </div>
          </div>
          <button
            className="tiny ghost"
            onClick={() => engineRef.current?.preview(row.cue)}
            aria-label={`${t.play}: ${row.name}`}
          >
            {t.play}
          </button>
        </div>
      ))}

      <p className="lead" style={{ marginTop: 26 }}>{t.cuesNote}</p>
    </main>
  )
}
