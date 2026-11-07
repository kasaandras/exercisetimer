import type { Lang } from './i18n'
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
 * Reel 1 in English, translated from his final Hungarian take (IMG_1667, 2026-10-29), each line
 * placed where he said it in Hungarian (recording time - 9.2 s, the start tone), so the English
 * take keeps the same rhythm. The first line waits until 1.2 s so the start tone has died away.
 */
export const REEL1_WHITE_COAT_EN: [number, string][] = [
  [1.2, "Have you ever had a much higher blood pressure reading at the doctor's than you expected?"],
  [7.1, "That could be what's called the white coat effect."],
  [10.2, 'In that moment, not just your heart rate but your blood pressure can go up too,'],
  [13.5, "from the stress of being at the doctor's."],
  // Effect: pop + sleeping cat on "relax".
  [16.8, "And of course it doesn't help when someone tells you: “Relax, just let go!”"],
  [22.4, "Because it's really hard to relax in a doctor's office."],
  [25.8, "Your mood, your habits, even what you've eaten or drunk can affect your blood pressure."],
  [31.9, "We're building an app called BePal."],
  [35.1, 'It helps you log your blood pressure calmly at home,'],
  [39.3, 'along with coffee, sleep, exercise, and anything else you like.'],
  [43.5, 'Then you can talk it all through with your doctor,'],
  [46.5, 'who can help you work out what changes to your lifestyle you need.'],
  [50.4, 'The iPhone app arrives in November.'],
  [53, 'Join the waitlist: the link is in my profile.'],
  [55.5, 'And your first month of premium is free.'],
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

const WALL_SIT_COPY: Record<Lang, { name: string; intro: string; introNote: string; hold: string; holdNote: string; end: string; endNote: string }> = {
  hu: {
    name: 'Falülés — 2 perc',
    intro: 'Bevezető',
    introNote: 'Hát a falnak, lábak vállszélességben, csússz le lassan.',
    hold: 'Falülés',
    holdNote: 'Térd a boka fölött, folyamatosan lélegezz. Könnyítés: csússz kevésbé mélyre.',
    end: 'Kész',
    endNote: 'Állj fel lassan, és rázd meg a lábad.',
  },
  en: {
    name: 'Wall sit — 2 minutes',
    intro: 'Intro',
    introNote: 'Back against the wall, feet shoulder-width apart, slide down slowly.',
    hold: 'Wall sit',
    holdNote: 'Knees over your ankles, keep breathing. Easier: don’t slide down as far.',
    end: 'Done',
    endNote: 'Stand up slowly and shake out your legs.',
  },
  es: {
    name: 'Sentadilla en pared — 2 minutos',
    intro: 'Introducción',
    introNote: 'Espalda contra la pared, pies a la anchura de los hombros, baja despacio.',
    hold: 'Sentadilla en pared',
    holdNote: 'Rodillas sobre los tobillos, sigue respirando. Más fácil: baja menos.',
    end: 'Listo',
    endNote: 'Levántate despacio y sacude las piernas.',
  },
}

/**
 * The daily wall sit, in the soft tones: a tone at 0:00 to cut the video on, the
 * usual countdown into the start tone, the same countdown into the stop tone,
 * then it runs out with no more sound.
 */
const wallSit = (lang: Lang): Program => {
  const c = WALL_SIT_COPY[lang]
  return {
    id: 'reel-wall-sit-2min',
    name: c.name,
    prepSeconds: 0,
    repeatRounds: 1,
    sound: 'soft',
    rounds: [
      {
        name: c.hold,
        blocks: [
          { id: 'ws-intro', name: c.intro, seconds: 40, kind: 'prep', note: c.introNote },
          { id: 'ws-hold', name: c.hold, seconds: 120, kind: 'work', note: c.holdNote },
          { id: 'ws-end', name: c.end, seconds: 15, kind: 'rest', note: c.endNote, quietEnd: true },
        ],
      },
    ],
  }
}

export function reelPrograms(lang: Lang = 'hu'): Program[] {
  return [
    wallSit(lang),
    reelProgram('reel-1-feherkopeny', 'BePal reel 1 — fehérköpeny-hatás', 55, REEL1_FEHERKOPENY),
    reelProgram('reel-1-white-coat-en', 'BePal reel 1 — white coat effect (English)', 62, REEL1_WHITE_COAT_EN),
  ]
}

/** Reels live on their own tab, not in the program list. */
export function isReel(program: Program): boolean {
  return program.id.startsWith('reel-')
}
