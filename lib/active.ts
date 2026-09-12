'use client'

import { useEffect, useState } from 'react'
import { builtinPrograms } from './builtins'
import { examplePrograms } from './examples'
import { dictionaries, type Lang } from './i18n'
import type { Program } from './program'
import { decodeProgram, programStore } from './storage'

const ACTIVE_KEY = 'cue-timer.active'

export function setActiveProgramId(id: string): void {
  try {
    window.localStorage.setItem(ACTIVE_KEY, id)
  } catch {
    // Selection just will not persist between visits.
  }
}

/** What ships with the app: the real sessions first, then the samples. */
export function shippedPrograms(lang: Lang): Program[] {
  return [...builtinPrograms(lang), ...examplePrograms(dictionaries[lang])]
}

/** Saved programs first, then everything shipped, deduplicated by id. */
export function allPrograms(lang: Lang): Program[] {
  const saved = programStore.list()
  const savedIds = new Set(saved.map((p) => p.id))
  return [...saved, ...shippedPrograms(lang).filter((p) => !savedIds.has(p.id))]
}

/**
 * Resolve which program the Run screen should show: a shared link wins, then
 * the last explicit choice, then the first example so the app is usable
 * without picking anything.
 */
export function useActiveProgram(lang: Lang): { program: Program | null; fromLink: boolean } {
  // Seed with the first shipped example so the timer is on screen from the
  // very first paint. Examples are deterministic, so this matches the
  // prerendered markup; storage and share links are applied just after.
  const [program, setProgram] = useState<Program | null>(() => shippedPrograms(lang)[0] ?? null)
  const [fromLink, setFromLink] = useState(false)

  useEffect(() => {
    const hash = window.location.hash
    const match = /^#p=(.+)$/.exec(hash)
    if (match) {
      const shared = decodeProgram(match[1])
      if (shared) {
        setProgram(shared)
        setFromLink(true)
        return
      }
    }

    const list = allPrograms(lang)
    let chosen: Program | undefined
    try {
      const id = window.localStorage.getItem(ACTIVE_KEY)
      chosen = list.find((p) => p.id === id)
    } catch {
      chosen = undefined
    }
    setProgram(chosen ?? list[0] ?? null)
    setFromLink(false)
  }, [lang])

  return { program, fromLink }
}
