'use client'

import { useRouter } from 'next/navigation'
import { useSettings } from '@/components/Providers'
import { setActiveProgramId } from '@/lib/active'
import { expandProgram, formatClock, totalSeconds } from '@/lib/program'
import { reelPrograms } from '@/lib/reels'

export default function ReelsPage() {
  const { t } = useSettings()
  const router = useRouter()

  return (
    <main className="wrap">
      <h1>{t.reelsTitle}</h1>
      <p className="lead">{t.reelsIntro}</p>

      {reelPrograms().map((program) => {
        const take = program.rounds[0]?.blocks[0]
        return (
          <article className="card" key={program.id}>
            <h3>{program.name}</h3>
            <p className="sub">{t.totalLength(formatClock(totalSeconds(expandProgram(program))))}</p>
            <ol className="reelLines">
              {take?.prompt?.map((line) => (
                <li key={line.at}>
                  <span className="reelAt">{formatClock(line.at)}</span> {line.text}
                </li>
              ))}
            </ol>
            <div className="row">
              <button
                onClick={() => {
                  setActiveProgramId(program.id)
                  router.push('/')
                }}
              >
                {t.use}
              </button>
            </div>
          </article>
        )
      })}
    </main>
  )
}
