import type { Program } from './program'

/**
 * Short marketing reels, read from the prompter: [seconds into the reel, line].
 *
 * Paced for a slow, natural delivery (about two words a second, with a breath between
 * thoughts), so the 40 s reel ends with a few seconds of room. The comic effects are added
 * afterwards on the finished video, so the planned seconds here are only a starting point
 * for the effect cue file; the real ones come from the recording.
 */
export const REEL1_FEHERKOPENY: [number, string][] = [
  [0.5, 'Van egy jelenség, aminek külön neve van: fehérköpeny-hatás.'],
  [5, 'A rendelőben mért vérnyomásod lehet más, mint otthon,'],
  // Effect: big eye + boom on "figyelnek".
  [9, 'csak attól, hogy ott ülsz, és figyelnek.'],
  // Effect: pop on "Lazítson!".
  [13, 'Főleg, ha közben azt mondják: „Lazítson!”'],
  [17.5, 'Szóval a hangulatod hatással lehet a számaidra.'],
  [21.5, 'Én most egy appot építek, a BePal-t,'],
  [24.5, 'hogy otthon, nyugodtan naplózhasd a vérnyomásodat, a kávét, az alvást és a mozgást.'],
  [31, 'Az iPhone app novemberben jön.'],
  [34, 'Iratkozz fel a várólistára, a link a profilomban!'],
]

const REEL_SECONDS = 40

/**
 * One reel as a prompter session: a 5 s get-ready (its pips and start tone fall before the
 * first word, and give the edit a sync mark), then the lines, ending without a finish tone
 * so nothing sounds under the last words.
 */
function reelProgram(id: string, name: string, lines: [number, string][]): Program {
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
            seconds: REEL_SECONDS,
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
  return [reelProgram('reel-1-feherkopeny', 'BePal reel 1 — fehérköpeny-hatás', REEL1_FEHERKOPENY)]
}
