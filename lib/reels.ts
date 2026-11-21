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
 * The wall sit challenge in English, translated from his approved Hungarian takes (2026-11-09),
 * each line placed where he said it in Hungarian, so the English take keeps the same rhythm.
 * The first line waits until 1.2 s so the start tone has died away.
 * Intro from IMG_2621 (recording time - 17.04 s), demo from IMG_2628 (recording time - 6.16 s).
 */
export const WALL_SIT_INTRO_EN: [number, string][] = [
  [1.2, "Hi everyone! Today I'd like to invite you to a 90-day wall sit challenge."],
  [8.05, "During this challenge, we'll do this hold for two minutes every day."],
  [14.5, 'I should mention that two minutes is a really long time.'],
  [17.4, "So at the start, it's completely fine to do one minute, or one and a half."],
  [22.8, "It's also fine to do three rounds of thirty seconds,"],
  [26.2, "or, if that's too much, three rounds of twenty seconds."],
  [31.75, 'Another option, if you want to make it easier,'],
  [35.75, 'is to hold a higher position, so your thighs have less work to do.'],
  [41.95, "Let me show you how it's done."],
]

export const WALL_SIT_DEMO_EN: [number, string][] = [
  [1.2, "I'm standing about 25 to 30 centimeters from the wall,"],
  [4.3, 'with my feet shoulder-width apart.'],
  [8.25, 'Then I lean back against the wall,'],
  [11.25, 'and slide down a little.'],
  [13.4, 'This is a fairly high position, which is perfectly fine for beginners.'],
  [17.6, 'But if you want a real challenge, slide down lower.'],
  [22.75, 'That makes it harder,'],
  [25, "and it's going to be really tough to hold for two minutes."],
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
          { id: 'ws-intro', name: c.intro, seconds: 25, kind: 'prep', note: c.introNote },
          { id: 'ws-hold', name: c.hold, seconds: 120, kind: 'work', note: c.holdNote },
          { id: 'ws-end', name: c.end, seconds: 15, kind: 'rest', note: c.endNote, quietEnd: true },
        ],
      },
    ],
  }
}

type HoldCopy = { name: string; intro: string; introNote: string; rest: string; restNote: string; end: string; endNote: string; holds: [string, string][] }

const HOLDS_COPY: Record<Lang, HoldCopy> = {
  hu: {
    name: 'Tartás-kihívás — 5 × 30 mp',
    intro: 'Bevezető',
    introNote: 'Első: plank. Helyezkedj el alkaron.',
    rest: 'Pihenő',
    restNote: 'Válts a következő gyakorlatra.',
    end: 'Kész',
    endNote: 'Lassan állj fel, és rázd meg a karod, lábad.',
    holds: [
      ['Plank', 'Alkaron, a test egy egyenes vonal, folyamatosan lélegezz.'],
      ['Oldalsó plank', 'Félidőben válts oldalt.'],
      ['Csípőemelés tartva', 'Háton fekve, csípő fent, szorítsd a farizmod.'],
      ['Szuperman', 'Hason fekve, kar és láb kicsit fent, nézz a földre.'],
      ['Lábujjhegyen állás', 'Állj fel lábujjhegyre, és tartsd.'],
    ],
  },
  en: {
    name: 'Hold challenge — 5 × 30 s',
    intro: 'Intro',
    introNote: 'First: plank. Get down on your forearms.',
    rest: 'Rest',
    restNote: 'Get ready for the next hold.',
    end: 'Done',
    endNote: 'Get up slowly and shake out your arms and legs.',
    holds: [
      ['Plank', 'On your forearms, body in one straight line, keep breathing.'],
      ['Side plank', 'Switch sides halfway.'],
      ['Glute bridge hold', 'On your back, hips up, squeeze your glutes.'],
      ['Superman hold', 'Face down, arms and legs just off the floor, look down.'],
      ['Calf raise hold', 'Rise onto your toes and hold.'],
    ],
  },
  es: {
    name: 'Reto de isométricos — 5 × 30 s',
    intro: 'Introducción',
    introNote: 'Primero: plancha. Colócate sobre los antebrazos.',
    rest: 'Descanso',
    restNote: 'Prepárate para el siguiente.',
    end: 'Listo',
    endNote: 'Levántate despacio y sacude brazos y piernas.',
    holds: [
      ['Plancha', 'Sobre los antebrazos, cuerpo en línea recta, sigue respirando.'],
      ['Plancha lateral', 'Cambia de lado a la mitad.'],
      ['Puente de glúteos', 'Boca arriba, cadera arriba, aprieta los glúteos.'],
      ['Superman', 'Boca abajo, brazos y piernas un poco elevados, mira al suelo.'],
      ['Elevación de talones', 'Ponte de puntillas y mantén.'],
    ],
  },
}

/**
 * Five 30 s holds with 10 s rests, filmed silent: a 25 s intro to get into the first
 * position (its tone at 0:00 is the cut mark), the usual countdown into each hold,
 * and a quiet end with no more sound.
 */
const holdChallenge = (lang: Lang): Program => {
  const c = HOLDS_COPY[lang]
  const blocks: Program['rounds'][number]['blocks'] = [
    { id: 'hc-intro', name: c.intro, seconds: 25, kind: 'prep', note: c.introNote },
  ]
  c.holds.forEach(([name, note], i) => {
    if (i > 0) blocks.push({ id: `hc-rest-${i}`, name: c.rest, seconds: 10, kind: 'rest', note: `${c.restNote} ${name}.` })
    blocks.push({ id: `hc-hold-${i + 1}`, name, seconds: 30, kind: 'work', note })
  })
  blocks.push({ id: 'hc-end', name: c.end, seconds: 15, kind: 'rest', note: c.endNote, quietEnd: true })
  return {
    id: 'reel-hold-challenge-5x30',
    name: c.name,
    prepSeconds: 0,
    repeatRounds: 1,
    sound: 'soft',
    rounds: [{ name: c.name, blocks }],
  }
}

type TaiChiCopy = {
  name: string
  intro: string
  change: string
  next: string
  end: string
  speech: [number, string][]
  goodbye: string
  moves: [string, string][]
}

/** Intro lines, timed for a slow, natural pace with a pause after each. */
const TAI_CHI_EN_SPEECH: [number, string][] = [
  [1.5, "Hi everyone! Today we're going to do a tai chi style warm-up together."],
  [10.5, 'There are ten simple moves, a minute each, with a short break in between.'],
  [18.5, "It's good first thing in the morning, or as a warm-up before a workout or a walk."],
  [28.5, 'It gets your joints moving, warms up your muscles, and lets you work on your balance.'],
  [37.5, "Before you start: if you have a health condition, or you haven't exercised in a while, talk to your doctor first."],
  [49, 'If you feel dizzy, feel pain, or get out of breath, stop and rest.'],
  [57.5, "Go at your own pace. You don't have to go as low as I do."],
  [66.5, "The first move has small hops. If you'd rather not jump, just lift your heels."],
  [75, "In the corner of the screen, you'll always see the next move coming up."],
  [83.5, "Stand up, give yourself a bit of room, and let's begin!"],
]

const TAI_CHI_COPY: Record<Lang, TaiChiCopy> = {
  hu: {
    name: 'Reggeli tai chi — 10 gyakorlat',
    intro: 'Bevezető',
    change: 'Váltás',
    next: 'Következő:',
    end: 'Kész',
    speech: [
      [1.5, 'Sziasztok! Ma egy tai chi jellegű átmozgatást csinálunk együtt.'],
      [10, 'Tíz egyszerű gyakorlat jön, mindegyik egy percig tart, közöttük rövid szünettel.'],
      [18.5, 'Jó reggel, ébredés után, vagy bemelegítésnek egy edzés vagy séta előtt.'],
      [27.5, 'Átmozgatja az ízületeket, felmelegíti az izmokat, és közben az egyensúlyodra is figyelsz.'],
      [37, 'Mielőtt elkezded: ha valamilyen betegséged van, vagy régóta nem mozogtál, beszélj előbb az orvosoddal.'],
      [48, 'Ha szédülsz, fájdalmat érzel, vagy kifulladsz, állj meg, és pihenj.'],
      [56, 'Mindent a saját tempódban csinálj. Nem kell olyan mélyre menni, mint én.'],
      [65.5, 'Az első gyakorlatban van szökdelés. Ha nem szeretnél ugrani, csak emelgesd a sarkadat.'],
      [75.5, 'A képernyő sarkában mindig látod, melyik gyakorlat jön következőnek.'],
      [83, 'Állj fel, legyen körülötted egy kis hely, és kezdjük!'],
    ],
    goodbye: 'Köszönöm, hogy velem tartottál. Sziasztok!',
    moves: [
      ['Nyirokmozgató szökdelés', 'Kicsi, puha szökdelés, a test laza. Könnyítés: sarokemelés, ugrás nélkül.'],
      ['Egész test hullám', 'Karok fel, majd lazán le, enyhe térdhajlítással, hullámszerűen.'],
      ['Törzsfordítás', 'Lazán fordulj jobbra-balra, a karok követik a törzset.'],
      ['Karlendítés', 'Karok lazán előre-hátra, térd enyhén hajlítva.'],
      ['Laza karok', 'Rázd meg lazán a karjaidat, a váll lent marad.'],
      ['Golflendítés', 'Összefogott kézzel lendíts lazán egyik oldalról a másikra.'],
      ['Helyben járás', 'Nyugodt tempó, karok lazán.'],
      ['Szélmalom', 'Nagy, lassú karkörzés, egyik kar a másik után.'],
      ['Balett guggolás', 'Széles terpesz, lábujjak kifelé, lassú guggolás. Könnyítés: kisebb guggolás.'],
      ['Lovaglóállás', 'Széles terpesz, térd enyhén hajlítva, hát egyenes, nyugodt légzés.'],
    ],
  },
  en: {
    name: 'Morning tai chi — 10 moves',
    intro: 'Intro',
    change: 'Change',
    next: 'Next:',
    end: 'Done',
    speech: TAI_CHI_EN_SPEECH,
    goodbye: 'Thanks for joining me. Bye!',
    moves: [
      ['Lymphatic hops', 'Small, soft bounces, body loose. Easier: heel lifts, no jumping.'],
      ['Full body wave', 'Arms up, then roll down with soft knees, like a wave.'],
      ['Trunk twists', 'Turn gently left and right, let your arms follow.'],
      ['Arm swings', 'Arms swing loosely forward and back, knees soft.'],
      ['Loose arms', 'Shake your arms out loosely, shoulders down.'],
      ['Golf swings', 'Hands together, swing gently from one side to the other.'],
      ['Marching on the spot', 'Easy pace, arms loose.'],
      ['Windmills', 'Big, slow arm circles, one arm after the other.'],
      ['Ballet squats', 'Wide stance, toes out, squat slowly. Easier: a smaller squat.'],
      ['Horse stance', 'Wide stance, knees softly bent, back straight, breathe calmly.'],
    ],
  },
  es: {
    name: 'Tai chi matutino — 10 ejercicios',
    intro: 'Introducción',
    change: 'Cambio',
    next: 'Siguiente:',
    end: 'Listo',
    speech: TAI_CHI_EN_SPEECH,
    goodbye: 'Gracias por acompañarme. ¡Adiós!',
    moves: [
      ['Saltitos linfáticos', 'Saltitos pequeños y suaves, cuerpo suelto. Más fácil: elevar talones, sin saltar.'],
      ['Onda corporal', 'Brazos arriba, luego baja suave con rodillas flexionadas, como una ola.'],
      ['Giros de tronco', 'Gira suave a izquierda y derecha, los brazos siguen al tronco.'],
      ['Balanceo de brazos', 'Brazos sueltos adelante y atrás, rodillas suaves.'],
      ['Brazos sueltos', 'Sacude los brazos sueltos, hombros abajo.'],
      ['Swing de golf', 'Manos juntas, balancea suave de un lado al otro.'],
      ['Marcha en el sitio', 'Ritmo tranquilo, brazos sueltos.'],
      ['Molinos', 'Círculos grandes y lentos con los brazos, uno tras otro.'],
      ['Sentadillas de ballet', 'Piernas abiertas, puntas hacia fuera, baja despacio. Más fácil: baja menos.'],
      ['Postura del caballo', 'Piernas abiertas, rodillas un poco flexionadas, espalda recta, respira tranquilo.'],
    ],
  },
}

/**
 * Morning tai chi follow-along (2026-11-21): a 100 s spoken intro read from the prompter
 * (doctor line, what it is good for; speech ends about 91 s so the pips stay clear of it),
 * then the ten qigong moves, 60 s each with 10 s changes, filmed silent and dubbed later.
 * The change cards name the next move, which the edit shows in the corner circle.
 * Soft tones; the tone at 0:00 is the cut mark. Ends on a quiet 20 s goodbye.
 */
const taiChiMorning = (lang: Lang): Program => {
  const c = TAI_CHI_COPY[lang]
  const blocks: Program['rounds'][number]['blocks'] = [
    {
      id: 'tc-intro',
      name: c.intro,
      seconds: 100,
      kind: 'prep',
      prompt: c.speech.map(([at, text]) => ({ at, text })),
    },
  ]
  c.moves.forEach(([name, note], i) => {
    if (i > 0) {
      const text = `${c.next} ${name}`
      blocks.push({ id: `tc-change-${i}`, name: c.change, seconds: 10, kind: 'rest', note: text, prompt: [{ at: 0, text }] })
    }
    blocks.push({ id: `tc-move-${i + 1}`, name, seconds: 60, kind: 'work', note, prompt: [{ at: 0, text: note }] })
  })
  blocks.push({
    id: 'tc-end',
    name: c.end,
    seconds: 20,
    kind: 'rest',
    note: c.goodbye,
    prompt: [{ at: 2, text: c.goodbye }],
    quietEnd: true,
  })
  return {
    id: 'reel-tai-chi-morning',
    name: c.name,
    prepSeconds: 0,
    repeatRounds: 1,
    sound: 'soft',
    rounds: [{ name: c.name, blocks }],
  }
}

export function reelPrograms(lang: Lang = 'hu'): Program[] {
  return [
    taiChiMorning(lang),
    wallSit(lang),
    holdChallenge(lang),
    reelProgram('reel-wall-sit-intro-en', 'Wall sit challenge — intro (English)', 46, WALL_SIT_INTRO_EN),
    reelProgram('reel-wall-sit-demo-en', 'Wall sit challenge — demo (English)', 31, WALL_SIT_DEMO_EN),
    reelProgram('reel-1-feherkopeny', 'BePal reel 1 — fehérköpeny-hatás', 55, REEL1_FEHERKOPENY),
    reelProgram('reel-1-white-coat-en', 'BePal reel 1 — white coat effect (English)', 62, REEL1_WHITE_COAT_EN),
  ]
}

/** Reels live on their own tab, not in the program list. */
export function isReel(program: Program): boolean {
  return program.id.startsWith('reel-')
}
