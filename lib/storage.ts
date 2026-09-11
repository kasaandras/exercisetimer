import { normaliseProgram, type Program } from './program'

const KEY = 'cue-timer.programs.v1'

function readAll(): Program[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(normaliseProgram).filter((p): p is Program => p !== null)
  } catch {
    // Private mode, cleared storage, or a corrupt entry — start empty rather
    // than breaking the app.
    return []
  }
}

function writeAll(programs: Program[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(programs))
  } catch {
    // Nothing useful to do if storage is unavailable; the session still runs.
  }
}

export const programStore = {
  list: readAll,
  save(program: Program): Program[] {
    const all = readAll()
    const index = all.findIndex((p) => p.id === program.id)
    if (index >= 0) all[index] = program
    else all.push(program)
    writeAll(all)
    return all
  },
  remove(id: string): Program[] {
    const all = readAll().filter((p) => p.id !== id)
    writeAll(all)
    return all
  },
}

/* ---- Share links: the program travels in the URL hash, so a link is enough ---- */

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(text: string): Uint8Array {
  const padded = text.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}

export function encodeProgram(program: Program): string {
  const json = JSON.stringify(program)
  return toBase64Url(new TextEncoder().encode(json))
}

export function decodeProgram(encoded: string): Program | null {
  try {
    const json = new TextDecoder().decode(fromBase64Url(encoded))
    return normaliseProgram(JSON.parse(json))
  } catch {
    return null
  }
}

export function shareUrl(program: Program): string {
  const { origin, pathname } = window.location
  return `${origin}${pathname}#p=${encodeProgram(program)}`
}
