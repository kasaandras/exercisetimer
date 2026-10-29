import type { Program } from './program'

/**
 * Short marketing reels, read from the prompter: [seconds into the reel, line].
 *
 * Reel 1 is András's own wording, transcribed from his practice take (IMG_1618, 2026-10-29),
 * each line placed where he said it, breaks included, so it runs 55 s rather than 40. The
 * comic effects are added afterwards on the finished video, from the real recording's times.
 */
export const REEL1_FEHERKOPENY: [number, string][] = [
  [0, 'Előfordult már veled az, hogy orvosi rendelésen jóval magasabb értéket mértek, mint amire számítottál?'],
  [7.5, 'Ezt az effektust fehérköpeny-hatásnak hívjuk.'],
  [11.4, 'Ilyenkor nem csak a pulzus,'],
  [13.5, 'hanem a vérnyomás is megnőhet az orvosi helyzet által okozott stressz miatt.'],
  // Effect: pop on "Lazíts!".
  [21.2, 'Az sem segít, hogyha rád szólnak, hogy „Lazíts!”,'],
  [24.5, 'hiszen ebben az esetben legtöbbször nem tudod ellazítani magadat.'],
  [28.9, 'A hangulatod és egyéb szokásaid hatással lehetnek a vérnyomásodra.'],
  [35.1, 'Én most egy applikációt fejlesztek, a neve BePal,'],
  [38.5, 'hogy otthon nyugodtan naplózhasd a vérnyomásod, a kávét, az alvást, a mozgást'],
  [42, 'és minden egyebet, amit szeretnél,'],
  [43.9, 'és megmutasd ezeket az orvosodnak.'],
  [48.6, 'Az iPhone-applikáció novemberben jön.'],
  [50.6, 'Iratkozz fel a várólistára, link a profilomban!'],
]

/**
 * One reel as a prompter session: a 5 s get-ready (its pips and start tone fall before the
 * first word, and give the edit a sync mark), then the lines, ending without a finish tone
 * so nothing sounds under the last words.
 */
function reelProgram(id: string, name: string, seconds: number, lines: [number, string][]): Program {
  return {
    id,
    name,
    prepSeconds: 5,
    repeatRounds: 1,
    rounds: [
      {
        name,
        blocks: [
          {
            id: `${id}-take`,
            name,
            seconds,
            kind: 'work',
            quietEnd: true,
            prompt: lines.map(([at, text]) => ({ at, text })),
          },
        ],
      },
    ],
  }
}

export function reelPrograms(): Program[] {
  return [reelProgram('reel-1-feherkopeny', 'BePal reel 1 — fehérköpeny-hatás', 55, REEL1_FEHERKOPENY)]
}

/** Reels live on their own tab, not in the program list. */
export function isReel(program: Program): boolean {
  return program.id.startsWith('reel-')
}
