/**
 * Checks the cue plan against the definition of done: correct ordering, pips
 * exactly at T-3/T-2/T-1 before every boundary, and no stray or duplicated
 * events. Run with `npm run verify`.
 */
import { expandProgram, planCues, totalSeconds, formatClock } from '../lib/program.ts'
import { builtinPrograms } from '../lib/builtins.ts'
import { examplePrograms } from '../lib/examples.ts'
import { dictionaries } from '../lib/i18n.ts'

let failures = 0
const check = (label: string, ok: boolean, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${detail ? ` — ${detail}` : ''}`)
}

for (const program of [...examplePrograms(dictionaries.en), ...builtinPrograms()]) {
  const segments = expandProgram(program)
  const events = planCues(segments)
  const total = totalSeconds(segments)

  console.log(`\n${program.name} — ${formatClock(total)}, ${segments.length} blocks, ${events.length} cues`)

  check('ends on work, not a break', segments[segments.length - 1].kind !== 'rest',
    `last block is ${segments[segments.length - 1].kind}`)

  check('events are in chronological order',
    events.every((e, i) => i === 0 || events[i - 1].at <= e.at))

  check('segments are contiguous with no gaps',
    segments.every((s, i) => i === 0 || Math.abs(segments[i - 1].endsAt - s.startsAt) < 1e-9))

  // Every segment must open with the tone for its kind.
  // A quiet block is the exception: it must open with no tone at all.
  const toneAt = (s: (typeof segments)[number]) =>
    events.some((e) => Math.abs(e.at - s.startsAt) < 1e-9 && e.cue === s.kind)
  const opens = segments.every((s) => (s.quiet ? !toneAt(s) : toneAt(s)))
  check('every block opens with its own tone, quiet blocks with none', opens)

  // Three pips before each boundary, except where the block is too short,
  // and none at all into a quiet block.
  let pipProblems: string[] = []
  segments.forEach((s, i) => {
    const intoQuiet = segments[i + 1]?.quiet === true || s.quietEnd === true
    for (let k = 3; k >= 1; k--) {
      const at = s.endsAt - k
      if (at < s.startsAt) continue
      const found = events.some((e) => e.cue === 'pip' && Math.abs(e.at - at) < 1e-9)
      if (found === intoQuiet) pipProblems.push(`${s.name} T-${k}`)
    }
  })
  check('three pips before every boundary, none into a quiet block', pipProblems.length === 0, pipProblems.join(', '))

  // A session that ends on a quiet-ended block has no finish tone at all.
  const dones = events.filter((e) => e.cue === 'done')
  const quietFinish = segments[segments.length - 1]?.quietEnd === true
  check('exactly one finish tone at the end, none after a quiet ending',
    quietFinish
      ? dones.length === 0
      : dones.length === 1 && Math.abs(events[events.length - 1].at - total) < 1e-9)

  // Two cues landing on the same instant would collide audibly.
  const collisions = events.filter((e, i) =>
    i > 0 && Math.abs(events[i - 1].at - e.at) < 1e-9 && events[i - 1].cue === e.cue)
  check('no duplicated cues at the same instant', collisions.length === 0,
    collisions.map((c) => `${c.cue}@${c.at}`).join(', '))
}

console.log(failures === 0 ? '\nAll cue checks passed.' : `\n${failures} check(s) failed.`)
process.exit(failures === 0 ? 0 : 1)
