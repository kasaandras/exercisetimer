'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSettings } from '@/components/Providers'
import { allPrograms, setActiveProgramId } from '@/lib/active'
import {
  expandProgram,
  formatClock,
  makeId,
  planCues,
  totalSeconds,
  type Block,
  type BlockKind,
  type Program,
} from '@/lib/program'
import { programStore, shareUrl } from '@/lib/storage'
import { downloadBlob, renderCueTrack, LEAD_IN_SECONDS } from '@/lib/wav'

export default function ProgramsPage() {
  const { t, lang } = useSettings()
  const router = useRouter()
  const [programs, setPrograms] = useState<Program[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [draft, setDraft] = useState<Program | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setPrograms(allPrograms(lang))
    setSavedIds(new Set(programStore.list().map((p) => p.id)))
  }, [lang])

  useEffect(refresh, [refresh])

  const use = (program: Program) => {
    setActiveProgramId(program.id)
    router.push('/')
  }

  const duplicate = (program: Program) => {
    const copy: Program = {
      ...program,
      id: makeId(),
      name: `${program.name} (2)`,
      rounds: program.rounds.map((r) => ({ ...r, blocks: r.blocks.map((b) => ({ ...b, id: makeId() })) })),
    }
    programStore.save(copy)
    refresh()
    setDraft(copy)
  }

  const remove = (program: Program) => {
    if (!window.confirm(t.deleteConfirm(program.name))) return
    programStore.remove(program.id)
    refresh()
  }

  const share = async (program: Program) => {
    const url = shareUrl(program)
    try {
      await navigator.clipboard.writeText(url)
      setToast(t.linkCopied)
    } catch {
      window.location.hash = `p=${url.split('#p=')[1]}`
      setToast(t.copyFailed)
    }
  }

  if (draft) {
    return (
      <Editor
        draft={draft}
        setDraft={setDraft}
        onSave={(program) => {
          programStore.save(program)
          setDraft(null)
          refresh()
        }}
        onCancel={() => setDraft(null)}
        t={t}
      />
    )
  }

  return (
    <main className="wrap">
      <h1>{t.programsTitle}</h1>
      <p className="lead">{t.programsIntro}</p>
      {toast && <p className="toast">{toast}</p>}

      <div className="row" style={{ marginBottom: 18 }}>
        <button onClick={() => setDraft(blankProgram(t.newProgram, t.roundCircuit, t.blockExercise, t.blockBreak))}>
          {t.newProgram}
        </button>
      </div>

      {programs.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          isSaved={savedIds.has(program.id)}
          onUse={() => use(program)}
          onEdit={() => setDraft(structuredClone(program))}
          onDuplicate={() => duplicate(program)}
          onDelete={() => remove(program)}
          onShare={() => void share(program)}
          onToast={setToast}
          t={t}
        />
      ))}
    </main>
  )
}

function blankProgram(name: string, roundName: string, workName: string, restName: string): Program {
  return {
    id: makeId(),
    name,
    prepSeconds: 10,
    repeatRounds: 4,
    rounds: [
      {
        name: roundName,
        blocks: [
          { id: makeId(), name: workName, seconds: 45, kind: 'work' },
          { id: makeId(), name: restName, seconds: 15, kind: 'rest' },
        ],
      },
    ],
  }
}

type CardProps = {
  program: Program
  isSaved: boolean
  onUse: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
  onShare: () => void
  onToast: (message: string) => void
  t: ReturnType<typeof useSettings>['t']
}

function ProgramCard({ program, isSaved, onUse, onEdit, onDuplicate, onDelete, onShare, onToast, t }: CardProps) {
  const [leadIn, setLeadIn] = useState(false)
  const [busy, setBusy] = useState(false)
  const segments = expandProgram(program)
  const duration = totalSeconds(segments)

  const exportWav = async () => {
    setBusy(true)
    onToast(t.exportRendering)
    try {
      const { blob, filename, seconds } = await renderCueTrack(
        planCues(segments),
        duration,
        program.name,
        leadIn ? LEAD_IN_SECONDS : 0,
      )
      downloadBlob(blob, filename)
      onToast(t.exportSaved(formatClock(seconds)))
    } catch {
      onToast(t.exportFailed)
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="card">
      <h3>{program.name}</h3>
      <p className="sub">
        {t.totalLength(formatClock(duration))} — {segments.length} × {t.blockName.toLowerCase()},{' '}
        {t.roundOf(program.repeatRounds, program.repeatRounds)}
      </p>
      <div className="row">
        <button onClick={onUse}>{t.use}</button>
        <button className="ghost tiny" onClick={onEdit}>{t.edit}</button>
        <button className="ghost tiny" onClick={onDuplicate}>{t.duplicate}</button>
        <button className="ghost tiny" onClick={onShare}>{t.share}</button>
        {isSaved && <button className="danger tiny" onClick={onDelete}>{t.del}</button>}
      </div>

      <h2 style={{ fontSize: 15, marginTop: 22 }}>{t.exportTitle}</h2>
      <p className="sub">{t.exportIntro}</p>
      <div className="check">
        <input
          id={`lead-${program.id}`}
          type="checkbox"
          checked={leadIn}
          onChange={(e) => setLeadIn(e.target.checked)}
        />
        <label htmlFor={`lead-${program.id}`}>{t.leadInLabel}</label>
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <button className="ghost tiny" onClick={() => void exportWav()} disabled={busy}>
          {busy ? t.exportRendering : t.exportButton}
        </button>
      </div>
    </article>
  )
}

type EditorProps = {
  draft: Program
  setDraft: (program: Program) => void
  onSave: (program: Program) => void
  onCancel: () => void
  t: ReturnType<typeof useSettings>['t']
}

function Editor({ draft, setDraft, onSave, onCancel, t }: EditorProps) {
  const patch = (changes: Partial<Program>) => setDraft({ ...draft, ...changes })

  const patchBlock = (roundIndex: number, blockIndex: number, changes: Partial<Block>) => {
    const rounds = draft.rounds.map((round, ri) =>
      ri !== roundIndex
        ? round
        : { ...round, blocks: round.blocks.map((b, bi) => (bi === blockIndex ? { ...b, ...changes } : b)) },
    )
    patch({ rounds })
  }

  const addBlock = (roundIndex: number) => {
    const rounds = draft.rounds.map((round, ri) =>
      ri !== roundIndex
        ? round
        : { ...round, blocks: [...round.blocks, { id: makeId(), name: t.blockExercise, seconds: 45, kind: 'work' as BlockKind }] },
    )
    patch({ rounds })
  }

  const removeBlock = (roundIndex: number, blockIndex: number) => {
    const rounds = draft.rounds.map((round, ri) =>
      ri !== roundIndex ? round : { ...round, blocks: round.blocks.filter((_, bi) => bi !== blockIndex) },
    )
    patch({ rounds: rounds.filter((r) => r.blocks.length > 0) })
  }

  const duration = totalSeconds(expandProgram(draft))
  const valid = draft.rounds.some((r) => r.blocks.length > 0)

  return (
    <main className="wrap">
      <h1>{draft.name || t.newProgram}</h1>
      <p className="lead">{t.totalLength(formatClock(duration))}</p>

      <div className="stack">
        <div>
          <label htmlFor="pname">{t.programName}</label>
          <input id="pname" type="text" value={draft.name} onChange={(e) => patch({ name: e.target.value })} />
        </div>

        <div className="fields">
          <div>
            <label htmlFor="prep">{t.prepSeconds}</label>
            <input
              id="prep"
              type="number"
              min={0}
              max={600}
              value={draft.prepSeconds}
              onChange={(e) => patch({ prepSeconds: clamp(e.target.value, 0, 600) })}
            />
          </div>
          <div>
            <label htmlFor="repeat">{t.repeatRounds}</label>
            <input
              id="repeat"
              type="number"
              min={1}
              max={99}
              value={draft.repeatRounds}
              onChange={(e) => patch({ repeatRounds: clamp(e.target.value, 1, 99) })}
            />
          </div>
        </div>
      </div>

      {draft.rounds.map((round, ri) => (
        <section key={ri} style={{ marginTop: 26 }}>
          <h2>{round.name || t.roundLabel(ri + 1)}</h2>
          {round.blocks.map((block, bi) => (
            <div className="blockRow" key={block.id}>
              <div>
                <label htmlFor={`n-${block.id}`}>{t.blockName}</label>
                <input
                  id={`n-${block.id}`}
                  type="text"
                  value={block.name}
                  onChange={(e) => patchBlock(ri, bi, { name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor={`s-${block.id}`}>{t.seconds}</label>
                <input
                  id={`s-${block.id}`}
                  type="number"
                  min={1}
                  max={3600}
                  value={block.seconds}
                  onChange={(e) => patchBlock(ri, bi, { seconds: clamp(e.target.value, 1, 3600) })}
                />
              </div>
              <div>
                <label htmlFor={`k-${block.id}`}>{t.kind}</label>
                <select
                  id={`k-${block.id}`}
                  value={block.kind}
                  onChange={(e) => patchBlock(ri, bi, { kind: e.target.value as BlockKind })}
                >
                  <option value="work">{t.kindWork}</option>
                  <option value="rest">{t.kindRest}</option>
                </select>
              </div>
              <button className="danger tiny" onClick={() => removeBlock(ri, bi)} aria-label={`${t.removeBlock}: ${block.name}`}>
                ✕
              </button>
            </div>
          ))}
          <button className="ghost tiny" onClick={() => addBlock(ri)}>{t.addBlock}</button>
        </section>
      ))}

      <div className="row" style={{ marginTop: 28 }}>
        <button onClick={() => onSave(draft)} disabled={!valid}>{t.save}</button>
        <button className="ghost" onClick={onCancel}>{t.cancel}</button>
      </div>
    </main>
  )
}

function clamp(value: string, lo: number, hi: number): number {
  const n = Number.parseInt(value, 10)
  if (Number.isNaN(n)) return lo
  return Math.min(Math.max(n, lo), hi)
}
