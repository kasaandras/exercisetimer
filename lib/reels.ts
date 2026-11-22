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

type HoldCopy = { name: string; intro: string; introNote: string; rest: string; restNote: string; end: string; endNote: string; side1: string; side2: string; switchName: string; switchNote: string; holds: [string, string, boolean?][] }

const HOLDS_COPY: Record<Lang, HoldCopy> = {
  hu: {
    name: 'Izometrikus tartás — 5 × 30 mp',
    intro: 'Bevezető',
    introNote: 'Első: plank. Helyezkedj el alkaron.',
    rest: 'Pihenő',
    restNote: 'Válts a következő gyakorlatra.',
    end: 'Kész',
    endNote: 'Lassan állj fel, és rázd meg a karod, lábad.',
    side1: 'egyik oldal',
    side2: 'másik oldal',
    switchName: 'Oldalváltás',
    switchNote: 'Fordulj át a másik oldaladra.',
    holds: [
      ['Plank', 'Alkaron, a test egy egyenes vonal, folyamatosan lélegezz.'],
      ['Oldalsó plank', 'Tenyéren, csípő fent, a felső kar felfelé nyújtva.', true],
      ['Szuperman', 'Hason fekve, kar és láb kicsit fent, nézz a földre.'],
      ['Csípőemelés tartva', 'Háton fekve, csípő fent, szorítsd a farizmod.'],
      ['Lábujjhegyen állás', 'Állj fel lábujjhegyre, és tartsd.'],
    ],
  },
  en: {
    name: 'Isometric holds — 5 × 30 s',
    intro: 'Intro',
    introNote: 'First: plank. Get down on your forearms.',
    rest: 'Rest',
    restNote: 'Get ready for the next hold.',
    end: 'Done',
    endNote: 'Get up slowly and shake out your arms and legs.',
    side1: 'first side',
    side2: 'other side',
    switchName: 'Switch sides',
    switchNote: 'Roll over onto your other side.',
    holds: [
      ['Plank', 'On your forearms, body in one straight line, keep breathing.'],
      ['Side plank', 'On your hand, hips up, top arm reaching up.', true],
      ['Superman hold', 'Face down, arms and legs just off the floor, look down.'],
      ['Glute bridge hold', 'On your back, hips up, squeeze your glutes.'],
      ['Calf raise hold', 'Rise onto your toes and hold.'],
    ],
  },
  es: {
    name: 'Isométricos — 5 × 30 s',
    intro: 'Introducción',
    introNote: 'Primero: plancha. Colócate sobre los antebrazos.',
    rest: 'Descanso',
    restNote: 'Prepárate para el siguiente.',
    end: 'Listo',
    endNote: 'Levántate despacio y sacude brazos y piernas.',
    side1: 'primer lado',
    side2: 'otro lado',
    switchName: 'Cambio de lado',
    switchNote: 'Gírate hacia el otro lado.',
    holds: [
      ['Plancha', 'Sobre los antebrazos, cuerpo en línea recta, sigue respirando.'],
      ['Plancha lateral', 'Sobre la mano, cadera arriba, el otro brazo hacia arriba.', true],
      ['Superman', 'Boca abajo, brazos y piernas un poco elevados, mira al suelo.'],
      ['Puente de glúteos', 'Boca arriba, cadera arriba, aprieta los glúteos.'],
      ['Elevación de talones', 'Ponte de puntillas y mantén.'],
    ],
  },
}

/**
 * Five 30 s isometric holds with 15 s rests (15 s, his call 2026-11-21), filmed silent.
 * His changes 2026-11-22: the side plank is 15 s a side with a 5 s switch between, and the
 * superman comes before the glute bridge (the bridge was hard straight after the side plank).
 * Then: a 25 s intro to get into the first
 * position (its tone at 0:00 is the cut mark), the usual countdown into each hold,
 * and a quiet end with no more sound.
 */
const holdChallenge = (lang: Lang): Program => {
  const c = HOLDS_COPY[lang]
  const blocks: Program['rounds'][number]['blocks'] = [
    { id: 'hc-intro', name: c.intro, seconds: 25, kind: 'prep', note: c.introNote },
  ]
  c.holds.forEach(([name, note, sides], i) => {
    if (i > 0) blocks.push({ id: `hc-rest-${i}`, name: c.rest, seconds: 15, kind: 'rest', note: `${c.restNote} ${name}.` })
    if (sides) {
      blocks.push({ id: `hc-hold-${i + 1}a`, name: `${name} — ${c.side1}`, seconds: 15, kind: 'work', note })
      blocks.push({ id: `hc-switch-${i + 1}`, name: c.switchName, seconds: 5, kind: 'rest', note: c.switchNote })
      blocks.push({ id: `hc-hold-${i + 1}b`, name: `${name} — ${c.side2}`, seconds: 15, kind: 'work', note })
    } else {
      blocks.push({ id: `hc-hold-${i + 1}`, name, seconds: 30, kind: 'work', note })
    }
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

type Holds3Copy = {
  name: string; intro: string; introNote: string; rest: string; restNote: string; round: (n: number) => string
  roundBreak: string; roundBreakNote: (n: number) => string; end: string; endNote: string; holds: [string, string][]
}

const HOLDS3_COPY: Record<Lang, Holds3Copy> = {
  hu: {
    name: 'Izometrikus tartás — 3 kör',
    intro: 'Bevezető',
    introNote: 'Első: plank. Helyezkedj el alkaron.',
    rest: 'Pihenő',
    restNote: 'Válts a következő gyakorlatra.',
    round: (n) => `${n}. kör`,
    roundBreak: 'Körszünet',
    roundBreakNote: (n) => `Pihenj egy kicsit. Következik a ${n}. kör: plank.`,
    end: 'Kész',
    endNote: 'Lassan állj fel, és rázd meg a karod, lábad.',
    holds: [
      ['Plank', 'Alkaron, a test egy egyenes vonal, folyamatosan lélegezz.'],
      ['Medvetartás', 'Tenyéren és lábujjhegyen, a térd pár centire a föld fölött, a hát egyenes.'],
      ['Dead bug tartás', 'Háton fekve, karok fel, térd 90 fokban a csípő fölött, a derekad a földön.'],
      ['Csípőemelés tartva', 'Háton fekve, csípő fent, szorítsd a farizmod.'],
      ['Guggolás tartva', 'Guggolj le és tartsd, ha még nehéz, elég a félguggolás. Karok előre, a súly a sarkadon.'],
    ],
  },
  en: {
    name: 'Isometric holds — 3 rounds',
    intro: 'Intro',
    introNote: 'First: plank. Get down on your forearms.',
    rest: 'Rest',
    restNote: 'Get ready for the next hold.',
    round: (n) => `Round ${n}`,
    roundBreak: 'Round break',
    roundBreakNote: (n) => `Have a short rest. Round ${n} is next: plank.`,
    end: 'Done',
    endNote: 'Get up slowly and shake out your arms and legs.',
    holds: [
      ['Plank', 'On your forearms, body in one straight line, keep breathing.'],
      ['Bear crawl hold', 'Hands and toes, knees just off the floor, back flat.'],
      ['Dead bug hold', 'On your back, arms up, knees bent over your hips, lower back on the floor.'],
      ['Glute bridge hold', 'On your back, hips up, squeeze your glutes.'],
      ['Squat hold', 'Squat down and hold; a half squat is fine too. Arms forward, weight in your heels.'],
    ],
  },
  es: {
    name: 'Isométricos — 3 rondas',
    intro: 'Introducción',
    introNote: 'Primero: plancha. Colócate sobre los antebrazos.',
    rest: 'Descanso',
    restNote: 'Prepárate para el siguiente.',
    round: (n) => `Ronda ${n}`,
    roundBreak: 'Descanso entre rondas',
    roundBreakNote: (n) => `Descansa un poco. Sigue la ronda ${n}: plancha.`,
    end: 'Listo',
    endNote: 'Levántate despacio y sacude brazos y piernas.',
    holds: [
      ['Plancha', 'Sobre los antebrazos, cuerpo en línea recta, sigue respirando.'],
      ['Oso estático', 'Manos y puntas de los pies, rodillas a unos centímetros del suelo, espalda recta.'],
      ['Dead bug', 'Boca arriba, brazos arriba, rodillas dobladas sobre la cadera, zona lumbar pegada al suelo.'],
      ['Puente de glúteos', 'Boca arriba, cadera arriba, aprieta los glúteos.'],
      ['Sentadilla isométrica', 'Baja y mantén; media sentadilla también vale. Brazos al frente, peso en los talones.'],
    ],
  },
}

/**
 * Three rounds of five 30 s isometric holds (his plan 2026-11-22): plank, bear crawl hold, dead bug,
 * glute bridge, squat hold; dead bug before the bridge (his call: less dizzy right after the bear crawl); 15 s rests, 45 s between rounds. Filmed silent like the 5-hold video: a 25 s intro
 * to get into the first position (its tone at 0:00 is the cut mark) and a quiet end. Total 12:40.
 */
const holds3Rounds = (lang: Lang): Program => {
  const c = HOLDS3_COPY[lang]
  const rounds: Program['rounds'] = [
    { name: c.intro, blocks: [{ id: 'h3-intro', name: c.intro, seconds: 25, kind: 'prep', note: c.introNote }] },
  ]
  for (let r = 1; r <= 3; r++) {
    const blocks: Program['rounds'][number]['blocks'] = []
    c.holds.forEach(([name, note], i) => {
      if (i > 0) blocks.push({ id: `h3-r${r}-rest-${i}`, name: c.rest, seconds: 15, kind: 'rest', note: `${c.restNote} ${name}.` })
      blocks.push({ id: `h3-r${r}-hold-${i + 1}`, name, seconds: 30, kind: 'work', note })
    })
    if (r < 3) blocks.push({ id: `h3-r${r}-break`, name: c.roundBreak, seconds: 45, kind: 'rest', note: c.roundBreakNote(r + 1) })
    else blocks.push({ id: 'h3-end', name: c.end, seconds: 15, kind: 'rest', note: c.endNote, quietEnd: true })
    rounds.push({ name: c.round(r), blocks })
  }
  return {
    id: 'reel-holds-3rounds',
    name: c.name,
    prepSeconds: 0,
    repeatRounds: 1,
    sound: 'soft',
    rounds,
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
      ['Nyirokmozgató szökdelés', 'Piciket ugrálunk, a kezünket is mozgatjuk. Ha nem szeretnél ugrálni, csak emelgesd a lábad.'],
      ['Egész test hullám', 'Karok fel, majd lazán le, enyhe térdhajlítással, hullámszerűen.'],
      ['Törzsfordítás', 'Kezek összekulcsolva elöl, forgasd a törzsed lendületesen.'],
      ['Karemelés', 'Egyik kar a másik után, ritmusosan, lendületesen.'],
      ['Laza karok', 'Rázd meg lazán a karjaidat, a váll lent marad.'],
      ['Golflendítés', 'A karok átlósan lendülnek át a test előtt, oldalt váltva.'],
      ['Térdemelés', 'Emeld a térded, fogd meg két kézzel, majd lendítsd a karokat oldalra.'],
      ['Szélmalom', 'Széles terpesz, hajolj előre, és nyúlj a kezeddel a másik lábad felé, váltott oldallal.'],
      ['Balett guggolás', 'Guggolj le karok keresztben, felálláskor karok fel és oldalra. Könnyítés: kisebb guggolás.'],
      ['Lovaglóállás', 'Széles terpesz, guggolj le és tartsd, kezek imatartásban a mellkas előtt.'],
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
      ['Trunk twists', 'Hands clasped in front, turn your upper body with some swing.'],
      ['Arm raises', 'One arm after the other, rhythmic and lively.'],
      ['Loose arms', 'Shake your arms out loosely, shoulders down.'],
      ['Golf swings', 'Swing your arms across your body on a diagonal, switching sides.'],
      ['Knee lifts', 'Lift a knee and hold it with both hands, then swing your arms out.'],
      ['Windmills', 'Feet wide, bend forward and reach toward the opposite foot, switching sides.'],
      ['Ballet squats', 'Squat with arms crossed, then rise with arms up and out. Easier: a smaller squat.'],
      ['Horse stance', 'Feet wide, squat down and hold, hands in a prayer position at your chest.'],
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
      ['Giros de tronco', 'Manos juntas delante, gira el tronco con impulso.'],
      ['Elevación de brazos', 'Un brazo tras otro, con ritmo y energía.'],
      ['Brazos sueltos', 'Sacude los brazos sueltos, hombros abajo.'],
      ['Swing de golf', 'Balancea los brazos en diagonal por delante del cuerpo, cambiando de lado.'],
      ['Elevación de rodillas', 'Sube la rodilla y sujétala con las manos, luego abre los brazos.'],
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

/**
 * Hungarian intro: his own wording from the first standing take IMG_2827 (2026-11-21, deleted
 * for space), lightly cleaned up, at the same timings as HOLDS_INTRO_EN, for the re-record.
 */
export const HOLDS_INTRO_HU: [number, string][] = [
  [1.1, 'Sziasztok! Ma izometrikus gyakorlatokat fogunk együtt végezni.'],
  [5.1, 'Öt gyakorlat következik, mindegyiket harminc másodpercen keresztül tartjuk,'],
  [9.9, 'és közöttük tizenöt másodperc szünet lesz.'],
  [13.1, 'Az izometrikus gyakorlatok hozzájárulhatnak a vérnyomás csökkenéséhez,'],
  [17.4, 'viszont ehhez legalább hetente háromszor-négyszer kell végezni, hat héten keresztül.'],
  [22.1, 'Ezeknél a gyakorlatoknál nem mozogsz, hanem megtartasz egy bizonyos helyzetet,'],
  [26.7, 'és ezzel nagy izmokat dolgoztatsz, például a törzsizmaidat, a farizmodat vagy akár a vádlidat.'],
  [34.2, 'Szükséged lesz egy kis helyre és egy jógaszőnyegre.'],
  [37.8, 'Mielőtt belekezdesz, kérlek, beszélj az orvosoddal,'],
  [40.1, 'főleg, ha bármilyen betegséged van, vagy régóta nem mozogtál.'],
  [44.8, 'Tartás közben ne tartsd vissza a levegőt, folyamatosan lélegezz.'],
  [51.3, 'Ha fájdalmat érzel, szédülsz, vagy elfogy a levegőd, állj meg és pihenj.'],
  [56.5, 'Ha eleinte sok a harminc másodperces tartás, tartsd rövidebb ideig,'],
  [62.2, 'a plankot pedig nyugodtan csinálhatod térden is.'],
  [66.3, 'Kezdjük is! Az első feladat a plank.'],
]

/**
 * English intro, translated from his Hungarian take IMG_2827 (2026-11-21, standing), which he
 * ad-libbed. Each line sits where he said it in Hungarian (recording time - 5.0 s, the start
 * tone). The blood-pressure line stays in both languages: his call 2026-11-21.
 */
export const HOLDS_INTRO_EN: [number, string][] = [
  [1.1, "Hi everyone! Today we're going to do some isometric exercises together."],
  [5.1, 'There are five exercises. We hold each one for thirty seconds,'],
  [9.9, 'with a fifteen-second break in between.'],
  [13.1, 'Isometric exercises may help lower blood pressure,'],
  [17.4, 'but for that you need to do them at least three or four times a week for six weeks.'],
  [22.1, "In this type of exercise you don't move, you hold a certain position,"],
  [26.7, 'and that way you work big muscles, like your core, your glutes, or even your calves.'],
  [34.2, "You'll need a bit of room and a yoga mat."],
  [37.8, 'Before you start, please talk to your doctor,'],
  [40.1, "especially if you have any health condition, or you haven't exercised in a while."],
  [44.8, "During the holds, please don't hold your breath. Keep breathing."],
  [51.3, 'If you feel pain, feel dizzy, or get out of breath, stop and rest.'],
  [56.5, 'If thirty seconds is too much at first, hold for less,'],
  [62.2, 'and you can do the plank on your knees.'],
  [66.3, "Let's get started. The first one is the plank."],
]

/**
 * Body wave retake (2026-11-21): his tummy showed in the first take, so this one move is re-filmed and
 * dropped into IMG_2802 at raw 80-140. Same timing as the original so the existing dub fits: front view
 * first, turn to the side at 13 s ("Most mutatom oldalról" ends just before), up on the toes from 22 s.
 */
const bodyWaveRetake = (): Program => ({
  id: 'reel-tai-chi-wave-retake',
  name: 'Tai chi — egész test hullám újra',
  prepSeconds: 10,
  repeatRounds: 1,
  rounds: [
    {
      name: 'Egész test hullám',
      blocks: [
        {
          id: 'tcw-wave',
          name: 'Egész test hullám',
          seconds: 60,
          kind: 'work',
          quietEnd: true,
          prompt: [
            { at: 0, text: 'Szemből: karok fel, majd le, közben picit guggolj.' },
            { at: 13, text: 'Most fordulj oldalra.' },
            { at: 22, text: 'Lábujjhegyre, amikor felnyújtod a karod.' },
            { at: 55, text: 'Még 5 másodperc.' },
          ],
        },
      ],
    },
  ],
})

/** Isometric holds — 3 rounds: intro prompters (his OK 2026-11-22), adapted from his 5-hold intro, plus the line that the
 * workout was filmed silent and voiced afterwards, but done together. Standing (or seated chest-up), then the activity. */
export const HOLDS3_INTRO_HU: [number, string][] = [
  [1.5, "Sziasztok! Ma izometrikus gyakorlatokat fogunk együtt végezni, ezúttal három körben."],
  [9, "Egy körben öt gyakorlat van: plank, medvetartás, dead bug, csípőemelés és guggolás tartva."],
  [17.5, "Mindegyiket harminc másodpercig tartjuk, közöttük tizenöt másodperc szünettel, a körök között pedig negyvenöt másodperc pihenő van. Az edzés nagyjából tizenhárom perc."],
  [31.5, "Az izometrikus gyakorlatok hozzájárulhatnak a vérnyomás csökkenéséhez, viszont ehhez legalább hetente háromszor-négyszer kell végezni, legalább hat héten keresztül."],
  [45, "Ezeknél a gyakorlatoknál nem mozogsz, hanem megtartasz egy bizonyos helyzetet, és közben nagy izmokat dolgoztatsz: a törzsizmaidat, a farizmodat és a combodat."],
  [58.5, "Egy kis helyre és egy jógaszőnyegre lesz szükséged."],
  [63.5, "Mielőtt belekezdesz, kérlek, beszélj az orvosoddal, főleg, ha bármilyen betegséged van, vagy régóta nem mozogtál."],
  [73.5, "Tartás közben ne tartsd vissza a levegőt, folyamatosan, nyugodtan lélegezz."],
  [80.5, "Ha fájdalmat érzel, szédülsz, vagy elfogy a levegőd, állj meg és pihenj."],
  [87.5, "Ha eleinte sok a harminc másodperc, tarts rövidebb ideig, mondjuk húsz másodpercig. A plankot és a medvetartást térden is csinálhatod."],
  [99, "Az edzés alatt nem beszélek, mert így jobban tudtam a gyakorlatokra figyelni. A hangot utólag mondtam rá, de minden tartást együtt csinálunk végig."],
  [111.5, "Kezdjük is! Az első gyakorlat a plank."],
]

export const HOLDS3_INTRO_EN: [number, string][] = [
  [1.2, "Hi everyone! Today we're doing isometric exercises together again, and this time it'll be a bit harder, in three rounds."],
  [9.2, "Each round has five exercises: plank, bear crawl hold, dead bug, glute bridge and squat hold."],
  [19.4, "We hold each one for thirty seconds, with a fifteen-second break in between, and a forty-five-second rest between rounds, so the workout takes about thirteen minutes."],
  [31.9, "As I said in the previous isometric video, these exercises may help lower blood pressure, but for that you need to do them at least three or four times a week, for at least six weeks."],
  [42.9, "Of course, this doesn't happen for everyone. It's the result of a clinical study, so it's worth keeping that in mind."],
  [49.4, "In these exercises you don't move, you hold certain positions, and you work big muscles, like your core, your glutes or your thighs."],
  [59.8, "What will you need? A bit of room and a yoga mat. Before you start, please talk to your doctor, especially if you have a health condition or haven't exercised in a while."],
  [76, "During the holds, don't hold your breath. Keep breathing calmly. If you feel pain, feel dizzy, or get out of breath, please stop and rest a little."],
  [87.3, "If thirty seconds is too much at first, hold for less, say twenty seconds. You can also do the plank on your knees."],
  [98.7, "I didn't talk during the workout, so I could focus on the exercises. I added my voice afterwards,"],
  [105.9, "but we do every hold together, and the video is uncut."],
  [110, "So let's get started. Our first exercise is the plank."],
]

export function reelPrograms(lang: Lang = 'hu'): Program[] {
  return [
    taiChiMorning(lang),
    bodyWaveRetake(),
    reelProgram('reel-tai-chi-intro-en', 'Morning tai chi — intro (English)', 92, TAI_CHI_INTRO_EN),
    wallSit(lang),
    holds3Rounds(lang),
    reelProgram('reel-holds3-intro-hu', 'Izometrikus tartás — 3 kör — bevezető (magyar)', 118, HOLDS3_INTRO_HU),
    reelProgram('reel-holds3-intro-en', 'Isometric holds — 3 rounds — intro (English)', 117, HOLDS3_INTRO_EN),
    holdChallenge(lang),
    reelProgram('reel-holds-intro-hu', 'Izometrikus tartás — bevezető (magyar)', 73, HOLDS_INTRO_HU),
    reelProgram('reel-holds-intro-en', 'Isometric holds — intro (English)', 73, HOLDS_INTRO_EN),
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
