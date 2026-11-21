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

/**
 * Tai chi intro in English, translated from his Hungarian take (IMG_2780, 2026-11-21), which
 * he ad-libbed beyond the script. Each line sits where he said it in Hungarian (recording
 * time - 1.63 s), so the English take keeps the same rhythm; first line at 1.2 s.
 */
export const TAI_CHI_INTRO_EN: [number, string][] = [
  [1.2, "Hi everyone! Today we're going to do a tai chi style warm-up together."],
  [6.38, 'This routine has become really popular online lately,'],
  [9.4, "so I thought we'd make a video of it and show it to you."],
  [13.68, 'There are ten simple moves. We do each one for a minute, with short breaks in between.'],
  [20.32, 'It can be good in the morning after you wake up, or as a warm-up before a workout or a walk,'],
  [27.18, 'but it works well on its own too, because it gets your joints moving,'],
  [32.88, 'warms up your muscles, and you also have to keep your balance, which is very important.'],
  [38.82, "Before you start, if you have any health condition, or you haven't exercised in a while,"],
  [44.58, 'please talk to your doctor. In fact, I always suggest going through the moves with them,'],
  [49.38, 'because some of them may not be right for you.'],
  [51.46, 'If you feel dizzy, feel pain, or get out of breath, please stop and rest.'],
  [57.64, "Go at your own pace. You don't have to go as low as I do, as you'll see in the video"],
  [63.52, "in one or two of the moves. You don't have to go fast either. Speed comes on its own later."],
  [68.26, "In the first move we'll do small hops. If you'd rather not jump, just lift your heels."],
  [74.78, 'In the corner of the screen, you can always see which move is coming next,'],
  [79.08, 'which helps you get ready for what comes after.'],
  [83.56, "Please stand up, give yourself a bit of room, and let's begin!"],
]

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

/** Intro lines, each up for its own length plus a 1 s pause (tightened 2026-11-21, his call). */
const TAI_CHI_EN_SPEECH: [number, string][] = [
  [1.5, "Hi everyone! Today we're going to do a tai chi style warm-up together."],
  [7.5, 'There are ten simple moves, a minute each, with a short break in between.'],
  [14, "It's good first thing in the morning, or as a warm-up before a workout or a walk."],
  [21.5, 'It gets your joints moving, warms up your muscles, and lets you work on your balance.'],
  [28.5, "Before you start: if you have a health condition, or you haven't exercised in a while, talk to your doctor first."],
  [37.5, 'If you feel dizzy, feel pain, or get out of breath, stop and rest.'],
  [44, "Go at your own pace. You don't have to go as low as I do."],
  [51, "The first move has small hops. If you'd rather not jump, just lift your heels."],
  [57.5, "In the corner of the screen, you'll always see the next move coming up."],
  [64, "Stand up, give yourself a bit of room, and let's begin!"],
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
      [7, 'Tíz egyszerű gyakorlat jön, mindegyik egy percig tart, közöttük rövid szünettel.'],
      [13, 'Jó reggel, ébredés után, vagy bemelegítésnek egy edzés vagy séta előtt.'],
      [19.5, 'Átmozgatja az ízületeket, felmelegíti az izmokat, és közben az egyensúlyodra is figyelsz.'],
      [26, 'Mielőtt elkezded: ha valamilyen betegséged van, vagy régóta nem mozogtál, beszélj előbb az orvosoddal.'],
      [33.5, 'Ha szédülsz, fájdalmat érzel, vagy kifulladsz, állj meg, és pihenj.'],
      [39.5, 'Mindent a saját tempódban csinálj. Nem kell olyan mélyre menni, mint én.'],
      [46, 'Az első gyakorlatban van szökdelés. Ha nem szeretnél ugrani, csak emelgesd a sarkadat.'],
      [53.5, 'A képernyő sarkában mindig látod, melyik gyakorlat jön következőnek.'],
      [58.5, 'Állj fel, legyen körülötted egy kis hely, és kezdjük!'],
    ],
    goodbye: 'Köszönöm, hogy velem tartottál. Sziasztok!',
    moves: [
      ['Nyirokmozgató szökdelés', 'Kicsi, puha szökdelés, a test laza. Könnyítés: sarokemelés, ugrás nélkül.'],
      ['Egész test hullám', 'Karok fel, majd lazán le, enyhe térdhajlítással, hullámszerűen.'],
      ['Törzsfordítás', 'Lazán fordulj jobbra-balra, a karok követik a törzset.'],
      ['Nagy karkörzés', 'Egyik kar a másik után, nagy körökben, a test lazán követi.'],
      ['Laza karok', 'Rázd meg lazán a karjaidat, a váll lent marad.'],
      ['Golflendítés', 'A karok átlósan lendülnek át a test előtt, oldalt váltva.'],
      ['Térdemelés', 'Váltott lábbal emeld a térded, karok oldalra nyújtva.'],
      ['Szélmalom', 'Széles terpesz, hajolj előre, és nyúlj a kezeddel a másik lábad felé, váltott oldallal.'],
      ['Balett guggolás', 'Guggolj le karok keresztben, felálláskor karok fel és oldalra. Könnyítés: kisebb guggolás.'],
      ['Lovaglóállás', 'Széles terpesz, térd hajlítva, kezek összetéve a mellkas előtt, nyugodt légzés.'],
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
      ['Big arm circles', 'One arm after the other in big circles, let your body follow.'],
      ['Loose arms', 'Shake your arms out loosely, shoulders down.'],
      ['Golf swings', 'Swing your arms across your body on a diagonal, switching sides.'],
      ['Knee lifts', 'Lift one knee, then the other, arms out to the sides.'],
      ['Windmills', 'Feet wide, bend forward and reach toward the opposite foot, switching sides.'],
      ['Ballet squats', 'Squat with arms crossed, then rise with arms up and out. Easier: a smaller squat.'],
      ['Horse stance', 'Feet wide, knees bent, hands together at your chest, breathe calmly.'],
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
      ['Círculos de brazos', 'Un brazo tras otro en círculos grandes, el cuerpo acompaña.'],
      ['Brazos sueltos', 'Sacude los brazos sueltos, hombros abajo.'],
      ['Swing de golf', 'Balancea los brazos en diagonal por delante del cuerpo, cambiando de lado.'],
      ['Elevación de rodillas', 'Sube una rodilla y luego la otra, brazos abiertos.'],
      ['Molinos', 'Piernas abiertas, inclínate y lleva la mano hacia el pie contrario, alternando.'],
      ['Sentadillas de ballet', 'Baja con los brazos cruzados y sube con los brazos arriba y abiertos. Más fácil: baja menos.'],
      ['Postura del caballo', 'Piernas abiertas, rodillas flexionadas, manos juntas ante el pecho, respira tranquilo.'],
    ],
  },
}

/**
 * Morning tai chi follow-along (2026-11-21): a 75 s spoken intro read from the prompter
 * (doctor line, what it is good for; speech ends about 64 s HU / 69 s EN so the pips stay clear of it),
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
      seconds: 75,
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
    reelProgram('reel-tai-chi-intro-en', 'Morning tai chi — intro (English)', 92, TAI_CHI_INTRO_EN),
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
