import { CUES, scheduleTone } from './cues'
import type { CueEvent } from './program'

const SAMPLE_RATE = 44_100
/** Silence before the first tone, so editors have a handle to trim against. */
export const LEAD_IN_SECONDS = 2
/** Tail so the final tone is not clipped by the end of the file. */
const TAIL_SECONDS = 2

function encodeWav(buffer: AudioBuffer): Blob {
  const samples = buffer.getChannelData(0)
  const count = samples.length
  const bytes = new ArrayBuffer(44 + count * 2)
  const view = new DataView(bytes)

  const ascii = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i))
  }

  ascii(0, 'RIFF')
  view.setUint32(4, 36 + count * 2, true)
  ascii(8, 'WAVE')
  ascii(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, buffer.sampleRate, true)
  view.setUint32(28, buffer.sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  ascii(36, 'data')
  view.setUint32(40, count * 2, true)

  for (let i = 0, at = 44; i < count; i++, at += 2) {
    const x = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(at, x < 0 ? x * 0x8000 : x * 0x7fff, true)
  }

  return new Blob([bytes], { type: 'audio/wav' })
}

function slugify(name: string): string {
  const ascii = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return ascii.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'cue-track'
}

/**
 * Render the cue track on its own, for dropping under footage on a timeline.
 *
 * Without a lead-in the first tone sits exactly at t=0 so it can be snapped to
 * a marker; with one, every cue shifts by the same amount and the offset stays
 * constant for the whole session.
 */
export async function renderCueTrack(
  events: CueEvent[],
  duration: number,
  programName: string,
  leadIn = 0,
): Promise<{ blob: Blob; filename: string; seconds: number }> {
  type WithWebkit = typeof globalThis & { webkitOfflineAudioContext?: typeof OfflineAudioContext }
  const Ctor = window.OfflineAudioContext ?? (globalThis as WithWebkit).webkitOfflineAudioContext
  if (!Ctor) throw new Error('OfflineAudioContext is not available in this browser')

  const seconds = leadIn + duration + TAIL_SECONDS
  const ctx = new Ctor(1, Math.ceil(seconds * SAMPLE_RATE), SAMPLE_RATE)

  for (const event of events) {
    scheduleTone(ctx, CUES[event.cue], leadIn + event.at)
  }

  const rendered = await ctx.startRendering()
  const suffix = leadIn > 0 ? `-lead${leadIn}s` : ''
  return {
    blob: encodeWav(rendered),
    filename: `${slugify(programName)}-cues${suffix}.wav`,
    seconds,
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}
