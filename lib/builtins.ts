import type { Lang } from './i18n'
import type { Block, Program, Round } from './program'

/**
 * "Kíméletes Keringésfokozó" — the two session plans, transcribed from the
 * source document and translated for the languages the app speaks.
 *
 * Every visible string lives in COPY, so a session can be presented in any of
 * the three languages without the structure or the timings changing. The
 * durations are defined once, below, and are identical across languages.
 */

type Entry = { name: string; note?: string }

type ExKey =
  | 'lepdeles' | 'karkorzes' | 'torzsfordulat' | 'csipokorzes' | 'oldallepes' | 'terdemeles'
  | 'helybenFutas' | 'fekvotamasz' | 'oldallepesSarok' | 'labszarTartas'
  | 'atvezetes' | 'pihen'
  | 'lassuSeta' | 'oldallepesLassan' | 'mellkasnyitas' | 'combfeszito'
  | 'labnyujtas' | 'vadlinyujtas' | 'ulveKileges' | 'vallnyujtas'
  | 'sarokfelrugas' | 'gyorsOldallepes' | 'guggolotartas' | 'boxStep'
  | 'kitores' | 'felhuzas' | 'oldallepesBicepsz'

type Copy = {
  /** The opening block: cue cards for whoever is presenting. */
  intro: { name: string; note: string; points: string[] }
  section: {
    intro: string
    warmUp: string
    main: (n: number) => string
    block: (n: number) => string
    coolDown: string
  }
  /** Prefixes that make the second session's block structure legible. */
  role: { cardio: string; strength: string; hold: string }
  ex: Record<ExKey, Entry>
}

const hu: Copy = {
  intro: {
    name: 'Köszöntő, összefoglaló',
    note: 'Beszélj orvosoddal, mielőtt belekezdesz; szédülés, nehézlégzés esetén hagyd abba.',
    points: [
      'Köszöntés, a videó hossza és felépítése',
      'Orvosi konzultáció mozgás előtt',
      'Leállás és orvoshoz fordulás tünet esetén',
      'Szükséges eszközök',
      'Folyamatos légzés, levegő-visszatartás tilos',
      'Könnyített változat minden gyakorlathoz',
      'Saját tempó',
    ],
  },
  section: {
    intro: 'Bevezető',
    warmUp: 'Bemelegítés',
    main: (n) => `Fő rész — ${n}. kör`,
    block: (n) => `${n}. blokk`,
    coolDown: 'Levezetés',
  },
  role: { cardio: 'Kardió', strength: 'Erő', hold: 'Tartás' },
  ex: {
    lepdeles: { name: 'Könnyű lépdelés', note: 'Nyugodt tempó, karok lazán.' },
    karkorzes: { name: 'Karkörzés', note: 'Kis körökkel indul, majd nagyobb.' },
    torzsfordulat: { name: 'Törzsfordítás', note: 'Csípő előre néz, csak a váll fordul.' },
    csipokorzes: { name: 'Csípőkörzés', note: 'Fej viszonylag mozdulatlan.' },
    oldallepes: { name: 'Oldallépés', note: 'Talp végig a földön.' },
    terdemeles: { name: 'Tempós térdemelés', note: 'Törzs egyenes; könnyítés: kisebb emelés.' },
    helybenFutas: { name: 'Helyben futás', note: 'Könnyítés: lassabb tempó.' },
    fekvotamasz: {
      name: 'Magas fekvőtámasz padon/kanapén',
      note: '8–10 fekvőtámasz is elég, fokozatosan építsd fel. Kilégzés a tolásra. Könnyítés: falnyomás.',
    },
    oldallepesSarok: { name: 'Oldallépés sarokemeléssel', note: 'Bicepszhajlítással.' },
    labszarTartas: { name: 'Lábszár izometrikus tartás', note: 'Fal közelében; egyenletes légzés.' },
    atvezetes: { name: 'Átvezetés', note: 'Biztonságos testhelyzetváltás.' },
    pihen: { name: 'Pihenő', note: 'Pulzus csökkenése, ivás.' },
    lassuSeta: { name: 'Lassú séta', note: 'Mozogj tovább, ne állj meg.' },
    oldallepesLassan: { name: 'Oldallépés lassan', note: 'Csökkenő tempó.' },
    mellkasnyitas: { name: 'Mellkasnyitás karokkal', note: 'Lapockák hátra.' },
    combfeszito: { name: 'Combfeszítő nyújtása', note: '30 mp / láb; falnak támaszkodva.' },
    labnyujtas: { name: 'Lábnyújtás szőnyegen', note: 'Egyenes háttal előredőlés.' },
    vadlinyujtas: { name: 'Vádlinyújtás', note: 'Padnak dőlve.' },
    ulveKileges: { name: 'Ülve, hosszú kilégzés', note: 'Kb. 6 légvétel/perc.' },
    vallnyujtas: { name: 'Vállnyújtás', note: 'Kar a test előtt át, váll lent.' },
    sarokfelrugas: { name: 'sarokfelrúgás helyben', note: 'Könnyítés: lassú helyben járás.' },
    gyorsOldallepes: { name: 'gyors oldallépés karhúzással', note: 'Könnyítés: lassabb, karhúzás nélkül.' },
    guggolotartas: { name: 'magas guggolótartás', note: 'Fal közelében; térd nem lép a lábujjak elé.' },
    boxStep: { name: 'box step tempósan', note: 'Négy sarokpont, előre–hátra.' },
    kitores: { name: 'kitörés hátra váltott lábbal', note: 'Könnyítés: kisebb lépés, padra támaszkodás.' },
    felhuzas: {
      name: 'felhúzás gumiszalaggal vagy súlyzóval',
      note: 'Könyök vállmagasságig, kéz nem a szegycsont fölé.',
    },
    oldallepesBicepsz: { name: 'oldallépés bicepszhajlítással', note: 'Talp a földön marad.' },
  },
}

const en: Copy = {
  intro: {
    name: 'Welcome and overview',
    note: 'Talk to your doctor before you start; stop if you feel dizzy or short of breath.',
    points: [
      'Welcome, how long the video is and how it is built up',
      'Talk to your doctor before exercising',
      'Stop and see a doctor if symptoms appear',
      'Equipment you will need',
      'Keep breathing — never hold your breath',
      'An easier variant for every exercise',
      'Work at your own pace',
    ],
  },
  section: {
    intro: 'Intro',
    warmUp: 'Warm-up',
    main: (n) => `Main part — round ${n}`,
    block: (n) => `Block ${n}`,
    coolDown: 'Cool-down',
  },
  role: { cardio: 'Cardio', strength: 'Strength', hold: 'Hold' },
  ex: {
    lepdeles: { name: 'Easy marching', note: 'Relaxed pace, arms loose.' },
    karkorzes: { name: 'Arm circles', note: 'Start small, then go wider.' },
    torzsfordulat: { name: 'Torso twists', note: 'Hips face forward, only the shoulders turn.' },
    csipokorzes: { name: 'Hip circles', note: 'Keep your head fairly still.' },
    oldallepes: { name: 'Side steps', note: 'Soles stay on the floor throughout.' },
    terdemeles: { name: 'Brisk knee lifts', note: 'Torso upright; easier: lift less high.' },
    helybenFutas: { name: 'Running on the spot', note: 'Easier: slow the pace down.' },
    fekvotamasz: {
      name: 'Incline push-ups on a bench or sofa',
      note: '8–10 push-ups is plenty, build up gradually. Breathe out as you push. Easier: push against a wall.',
    },
    oldallepesSarok: { name: 'Side steps with heel raise', note: 'With a biceps curl.' },
    labszarTartas: { name: 'Isometric calf hold', note: 'Stay near a wall; breathe steadily.' },
    atvezetes: { name: 'Changeover', note: 'Change position safely.' },
    pihen: { name: 'Rest', note: 'Let your pulse come down, have a drink.' },
    lassuSeta: { name: 'Slow walk', note: 'Keep moving, do not stop.' },
    oldallepesLassan: { name: 'Slow side steps', note: 'Let the pace drop.' },
    mellkasnyitas: { name: 'Chest opener with arms', note: 'Draw your shoulder blades back.' },
    combfeszito: { name: 'Quad stretch', note: '30 s per leg; lean on the wall.' },
    labnyujtas: { name: 'Seated leg stretch on the mat', note: 'Lean forward with a straight back.' },
    vadlinyujtas: { name: 'Calf stretch', note: 'Leaning on the bench.' },
    ulveKileges: { name: 'Seated, long exhale', note: 'About 6 breaths a minute.' },
    vallnyujtas: { name: 'Shoulder stretch', note: 'Arm across the body, shoulder down.' },
    sarokfelrugas: { name: 'heel flicks on the spot', note: 'Easier: slow marching on the spot.' },
    gyorsOldallepes: { name: 'fast side steps with arm pull', note: 'Easier: slower, without the arm pull.' },
    guggolotartas: { name: 'high squat hold', note: 'Near a wall; knees stay behind your toes.' },
    boxStep: { name: 'box step, brisk', note: 'Four corners, forward and back.' },
    kitores: { name: 'reverse lunges, alternating legs', note: 'Easier: shorter step, hold the bench.' },
    felhuzas: {
      name: 'upright row with a band or dumbbell',
      note: 'Elbows to shoulder height, hands no higher than your breastbone.',
    },
    oldallepesBicepsz: { name: 'side steps with biceps curl', note: 'Soles stay on the floor.' },
  },
}

const es: Copy = {
  intro: {
    name: 'Bienvenida y resumen',
    note: 'Habla con tu médico antes de empezar; para si sientes mareo o falta de aire.',
    points: [
      'Bienvenida, duración y estructura del vídeo',
      'Consulta médica antes de hacer ejercicio',
      'Parar y acudir al médico si aparecen síntomas',
      'Material necesario',
      'Respiración continua, nunca contengas la respiración',
      'Variante más fácil para cada ejercicio',
      'A tu propio ritmo',
    ],
  },
  section: {
    intro: 'Introducción',
    warmUp: 'Calentamiento',
    main: (n) => `Parte principal — ronda ${n}`,
    block: (n) => `Bloque ${n}`,
    coolDown: 'Vuelta a la calma',
  },
  role: { cardio: 'Cardio', strength: 'Fuerza', hold: 'Isométrico' },
  ex: {
    lepdeles: { name: 'Marcha suave', note: 'Ritmo tranquilo, brazos sueltos.' },
    karkorzes: { name: 'Círculos de brazos', note: 'Empieza con círculos pequeños y ve ampliando.' },
    torzsfordulat: { name: 'Giros de torso', note: 'Las caderas al frente, giran solo los hombros.' },
    csipokorzes: { name: 'Círculos de cadera', note: 'Mantén la cabeza bastante quieta.' },
    oldallepes: { name: 'Pasos laterales', note: 'Las plantas no se despegan del suelo.' },
    terdemeles: { name: 'Elevación de rodillas con ritmo', note: 'Tronco recto; más fácil: eleva menos.' },
    helybenFutas: { name: 'Carrera en el sitio', note: 'Más fácil: baja el ritmo.' },
    fekvotamasz: {
      name: 'Flexiones inclinadas en banco o sofá',
      note: 'Con 8–10 flexiones basta, ve aumentando poco a poco. Espira al empujar. Más fácil: empuja contra la pared.',
    },
    oldallepesSarok: { name: 'Pasos laterales con elevación de talón', note: 'Con curl de bíceps.' },
    labszarTartas: { name: 'Isométrico de pantorrilla', note: 'Cerca de la pared; respiración constante.' },
    atvezetes: { name: 'Transición', note: 'Cambia de posición con seguridad.' },
    pihen: { name: 'Descanso', note: 'Deja que baje el pulso, bebe agua.' },
    lassuSeta: { name: 'Caminata lenta', note: 'Sigue moviéndote, no te pares.' },
    oldallepesLassan: { name: 'Pasos laterales lentos', note: 'Ritmo descendente.' },
    mellkasnyitas: { name: 'Apertura de pecho con brazos', note: 'Lleva los omóplatos atrás.' },
    combfeszito: { name: 'Estiramiento de cuádriceps', note: '30 s por pierna; apóyate en la pared.' },
    labnyujtas: { name: 'Estiramiento de piernas en la esterilla', note: 'Inclínate hacia delante con la espalda recta.' },
    vadlinyujtas: { name: 'Estiramiento de gemelos', note: 'Apoyado en el banco.' },
    ulveKileges: { name: 'Sentado, espiración larga', note: 'Unas 6 respiraciones por minuto.' },
    vallnyujtas: { name: 'Estiramiento de hombro', note: 'Brazo cruzado por delante, hombro bajo.' },
    sarokfelrugas: { name: 'talones al glúteo en el sitio', note: 'Más fácil: marcha lenta en el sitio.' },
    gyorsOldallepes: { name: 'pasos laterales rápidos con tracción de brazos', note: 'Más fácil: más lento, sin tracción.' },
    guggolotartas: { name: 'sentadilla isométrica alta', note: 'Cerca de la pared; las rodillas no pasan los dedos del pie.' },
    boxStep: { name: 'box step con ritmo', note: 'Cuatro esquinas, adelante y atrás.' },
    kitores: { name: 'zancadas hacia atrás alternando piernas', note: 'Más fácil: paso más corto, apóyate en el banco.' },
    felhuzas: {
      name: 'remo vertical con banda o mancuerna',
      note: 'Codos a la altura del hombro, manos no por encima del esternón.',
    },
    oldallepesBicepsz: { name: 'pasos laterales con curl de bíceps', note: 'Las plantas no se despegan del suelo.' },
  },
}

const COPY: Record<Lang, Copy> = { hu, en, es }

let seq = 0
const block = (kind: Block['kind'], entry: Entry, seconds: number, prefix?: string): Block => ({
  id: `kk-${seq++}`,
  name: prefix ? `${prefix}: ${entry.name}` : entry.name,
  seconds,
  kind,
  note: entry.note,
})

/**
 * Lay exercises out with a 15 s changeover between each, which is where the
 * time to move is actually needed. There is none before the break: it starts
 * the moment the last exercise of the round ends.
 */
const circuit = (c: Copy, exercises: Block[], breakSeconds = 0): Block[] => {
  const blocks: Block[] = []
  exercises.forEach((exercise, i) => {
    blocks.push(exercise)
    if (i < exercises.length - 1) blocks.push(block('rest', c.ex.atvezetes, 15))
  })
  if (breakSeconds > 0) blocks.push(block('rest', c.ex.pihen, breakSeconds))
  return blocks
}

const intro = (c: Copy): Round => ({
  name: c.section.intro,
  blocks: [
    // A full minute: seven talking points, including the medical warnings.
    { ...block('prep', { name: c.intro.name, note: c.intro.note }, 60), points: c.intro.points },
  ],
})

/** Six exercises, rising tempo — 3:40. Identical in both sessions. */
const warmUp = (c: Copy): Round => ({
  name: c.section.warmUp,
  blocks: [
    block('work', c.ex.lepdeles, 60),
    block('work', c.ex.karkorzes, 30),
    block('work', c.ex.torzsfordulat, 30),
    block('work', c.ex.csipokorzes, 30),
    block('work', c.ex.oldallepes, 40),
    block('work', c.ex.terdemeles, 30),
  ],
})

/** The shared cool-down — 5:30. Always finishes seated on a long exhale. */
const coolDownStart = (c: Copy): Block[] => [
  block('work', c.ex.lassuSeta, 60),
  block('work', c.ex.oldallepesLassan, 45),
  block('work', c.ex.mellkasnyitas, 30),
]
const coolDownEnd = (c: Copy): Block[] => [
  block('work', c.ex.combfeszito, 60),
  block('work', c.ex.labnyujtas, 45),
  block('work', c.ex.vadlinyujtas, 30),
  block('work', c.ex.ulveKileges, 60),
]

/** One pass of the first session's main circuit. */
const mainRound = (c: Copy, index: number, withRest: boolean): Round => ({
  name: c.section.main(index),
  // The document places the 60 s break after rounds 1 and 2 only.
  blocks: circuit(
    c,
    [
      block('work', c.ex.helybenFutas, 45),
      block('work', c.ex.fekvotamasz, 45),
      block('work', c.ex.oldallepesSarok, 45),
      block('work', c.ex.labszarTartas, 45),
    ],
    withRest ? 60 : 0,
  ),
})

const sorozat1 = (lang: Lang): Program => {
  const c = COPY[lang]
  return {
    id: 'kk-sorozat-1',
    name: 'Kíméletes Keringésfokozó — 1. sorozat',
    prepSeconds: 0,
    repeatRounds: 1,
    rounds: [
      intro(c),
      warmUp(c),
      mainRound(c, 1, true),
      mainRound(c, 2, true),
      mainRound(c, 3, false),
      { name: c.section.coolDown, blocks: [...coolDownStart(c), ...coolDownEnd(c)] },
    ],
  }
}

// Rep-based in the document ("10 ism."); timed at 45 s to match what the first
// session gives the same movements.
const REPS = 45

/** Second session: cardio — strength/hold — cardio — break, three times. */
const sessionBlock = (c: Copy, index: number, blocks: Block[]): Round => ({
  name: c.section.block(index),
  blocks: circuit(c, blocks, 60),
})

const sorozat2 = (lang: Lang): Program => {
  const c = COPY[lang]
  return {
    id: 'kk-sorozat-2',
    name: 'Kíméletes Keringésfokozó — 2. sorozat',
    prepSeconds: 0,
    repeatRounds: 1,
    rounds: [
      intro(c),
      warmUp(c),
      sessionBlock(c, 1, [
        block('work', c.ex.sarokfelrugas, 45, c.role.cardio),
        block('work', c.ex.fekvotamasz, REPS, c.role.strength),
        block('work', c.ex.gyorsOldallepes, 45, c.role.cardio),
      ]),
      sessionBlock(c, 2, [
        block('work', c.ex.terdemeles, 45, c.role.cardio),
        block('work', c.ex.guggolotartas, 45, c.role.hold),
        block('work', c.ex.boxStep, 45, c.role.cardio),
      ]),
      sessionBlock(c, 3, [
        block('work', c.ex.kitores, 45, c.role.cardio),
        block('work', c.ex.felhuzas, REPS, c.role.strength),
        block('work', c.ex.oldallepesBicepsz, 45, c.role.cardio),
      ]),
      {
        name: c.section.coolDown,
        blocks: [
          ...coolDownStart(c),
          // The second session adds a shoulder stretch, before the seated
          // finish so the rule "always ends seated" still holds.
          block('work', c.ex.vallnyujtas, 30),
          ...coolDownEnd(c),
        ],
      },
    ],
  }
}

export function builtinPrograms(lang: Lang = 'hu'): Program[] {
  return [sorozat1(lang), sorozat2(lang)]
}
