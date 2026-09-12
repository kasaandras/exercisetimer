/**
 * Dump a programme's timeline as JSON for the video overlay renderer.
 *
 * The overlay and the exported WAV are both generated from this same
 * expansion, so the on-screen countdown and the cues cannot drift apart.
 *
 *   npm run timeline -- kk-sorozat-1 > timeline.json
 *   npm run timeline -- kk-sorozat-1 en > timeline-en.json
 */
import { expandProgram, planCues, totalSeconds } from '../lib/program.ts'
import { builtinPrograms } from '../lib/builtins.ts'
import { examplePrograms } from '../lib/examples.ts'
import { dictionaries } from '../lib/i18n.ts'

const id = process.argv[2] ?? 'kk-sorozat-1'
const lang = (process.argv[3] ?? 'hu') as 'hu' | 'en' | 'es'
const all = [...builtinPrograms(lang), ...examplePrograms(dictionaries[lang])]
const program = all.find((p) => p.id === id)

if (!program) {
  console.error(`No programme with id "${id}". Available:`)
  for (const p of all) console.error(`  ${p.id}  ${p.name}`)
  process.exit(1)
}

const segments = expandProgram(program)
console.log(
  JSON.stringify(
    {
      id: program.id,
      name: program.name,
      duration: totalSeconds(segments),
      cues: planCues(segments),
      segments: segments.map((s) => ({
        name: s.name,
        kind: s.kind,
        seconds: s.seconds,
        startsAt: s.startsAt,
        endsAt: s.endsAt,
        note: s.note ?? null,
        points: s.points ?? null,
        roundName: s.roundName,
        roundOrdinal: s.roundOrdinal,
        roundTotal: s.roundTotal,
      })),
    },
    null,
    2,
  ),
)
