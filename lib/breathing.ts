import { BREATHING_PROMPTER_EN } from './breathingPrompterEn.ts'
import type { Lang } from './i18n'
import type { Block, Program } from './program'

/**
 * Resistance breathing (IMST) with a simple 6-level breathing trainer.
 *
 * The routine follows the YOGABODY practice András chose as the reference:
 * five minutes without breaks, one slow, strong breath in through the trainer
 * every 30 seconds, calm nose breathing in between, twice a day. Each half
 * minute is split in two: 15 s breathing in (trying it, András could keep a
 * steady breath in going for 12-14 s), then 15 s: a normal breath out (not stretched —
 * András, after watching his first take back) and calm nose breathing until the next one. (The trials, e.g. Craighead et al. 2021, use 5 sets of 6 breaths with
 * rests instead; this follows the video on purpose.) A dial with six steps
 * shows no percentage, so the copy teaches the level as a feeling: the long
 * breath in is hard but doable.
 *
 * One take, like the handgrip: welcome and level-finding first, then the
 * practice, so the app's "Skip intro" can drop repeat users onto breath 1.
 * Calm session, so the soft bell cues: a higher chime to start breathing in,
 * a lower one to let go, soft pips before each breath as the cue to put the
 * trainer to your mouth. No rest blocks anywhere.
 *
 * 7:45 in all. Every visible string is in COPY; the timings are below, once.
 */

type Script = { name: string; note: string; points?: string[] }

type Copy = {
  program: string
  section: { intro: string; practice: string; outro: string }
  intro: Script
  setup: Script
  breath: string
  breathNote: string
  breathPoints: string[]
  /** One extra line per breath, in order, like the tips he gives in the video. */
  tips: string[]
  outro: Script
}

const hu: Copy = {
  program: 'Légzőtréner — légzőizom-edzés',
  section: { intro: 'Bevezető', practice: 'Gyakorlás', outro: 'Levezetés' },
  intro: {
    name: 'Köszöntő',
    note: 'Kezdés előtt beszélj az orvosoddal. Ne változtass a gyógyszereiden. Ha szédülsz vagy fáj a fejed, állj meg.',
    points: [
      'Szia! Ma a légzőizmaidat edzzük egy egyszerű légzőtrénerrel. Végig ülve csináljuk.',
      'Olyan ez, mint egy kis súlyzó a rekeszizmodnak: erősen beszívod a levegőt egy kis ellenállással szemben.',
      'Kutatások szerint ha hetekig rendszeresen csinálod, segíthet lejjebb vinni a vérnyomást.',
      'Kezdés előtt beszélj az orvosoddal, főleg ha tüdő- vagy fülproblémád van, vagy nemrég műtöttek.',
      'Öt percig gyakorolunk szünet nélkül: félpercenként egy lassú, erős belégzés a trénerbe.',
      'Utána fújd ki normálisan, ne nyújtsd el, és lélegezz tovább nyugodtan az orrodon át a következő hangig.',
      'Ha szédülsz vagy fáj a fejed, lassíts: percenként egy belégzés is elég.',
    ],
  },
  setup: {
    name: 'A jó fokozat',
    note: 'A jó fokozat: a hosszú belégzés nehéz, de még végig megy.',
    points: [
      'Ülj le kényelmesen, egyenes háttal, a talpad legyen a földön.',
      'Ennek a trénernek hat fokozata van. Az első alkalommal az egyesen kezdj.',
      'Zárd körbe az ajkaddal a szájrészt, és szívd be lassan és erősen, amíg bírod.',
      'Ha könnyű volt, tekerd egy fokkal feljebb, és próbáld újra.',
      'Az a jó fokozat, ahol a belégzés nehéz, de még végig megy. Kb. a maximumod háromnegyede.',
      'Utána mindig ezen csináld. Ha egy-két hét után könnyű, lépj egyet feljebb.',
    ],
  },
  breath: 'kör',
  breathNote: 'Magas hang: szívd be lassan, erősen. Mély hang: fújd ki normálisan, aztán orrlégzés.',
  breathPoints: [
    'Magas hang: szájrész be, és szívd be lassan, erősen, egyenletesen.',
    'Mély hang: fújd ki normálisan, ne nyújtsd el.',
    'Utána csukott szájjal, nyugodtan lélegezz az orrodon át a következő hangig.',
    'A kör első fele a belégzés, a második az orrlégzés.',
  ],
  tips: [
    'Két belégzés között csukd be a szád, és az orrodon át lélegezz.',
    'A nyakadban és a mellkasodban is érezheted, de a munka lent legyen, a rekeszizmodban.',
    'A kilégzés laza, a belégzés a munka.',
    'Ha szédülsz vagy fáj a fejed, lassíts: percenként egy is elég.',
    'Félidő!',
    'Gondolj hasi légzésre: lassan és mélyen.',
    'Lassan ritmusba jössz. A tested maradjon nyugodt és laza.',
    'A vállad maradjon lent, lazán.',
    'Még kettő!',
    'Az utolsó!',
  ],
  outro: {
    name: 'Elköszönés',
    note: 'Naponta kétszer: reggel és este.',
    points: [
      'Szép munka! Tedd le a trénert, és lélegezz nyugodtan.',
      'Naponta kétszer csináld, reggel és este, legalább hat hétig.',
      'Öblítsd el a szájrészt, és tedd el.',
      'Köszönöm, hogy velem tartottál!',
    ],
  },
}

const en: Copy = {
  program: 'Breathing trainer workout',
  section: { intro: 'Intro', practice: 'Practice', outro: 'Wrap-up' },
  intro: {
    name: 'Welcome',
    note: 'Talk to your doctor before you start. Don\'t change your medication. Stop if you feel dizzy or get a headache.',
    points: [
      'Hi! Today we\'re training your breathing muscles with a simple breathing trainer. We\'ll stay seated the whole time.',
      'Think of it as a small dumbbell for your diaphragm: you breathe in hard against a little resistance.',
      'Studies show that doing it regularly for a few weeks can help bring your blood pressure down.',
      'Talk to your doctor before you start, especially if you have lung or ear problems, or had surgery recently.',
      'We\'ll practise for five minutes without a break: one slow, strong breath in through the trainer every half minute.',
      'Then breathe out normally, don\'t stretch it out, and keep breathing calmly through your nose until the next chime.',
      'If you feel dizzy or get a headache, slow down: one breath a minute is plenty.',
    ],
  },
  setup: {
    name: 'Find your level',
    note: 'The right level: the long breath in is hard, but you can finish it.',
    points: [
      'Sit comfortably with your back straight and your feet flat on the floor.',
      'This trainer has six levels. The first time, start on level one.',
      'Close your lips around the mouthpiece and breathe in slowly and hard, for as long as you can.',
      'If that was easy, turn it up one level and try again.',
      'The right level is where the breath is hard, but you can still finish it. About three quarters of your best.',
      'Stay on that level. If it feels easy after a week or two, go up one.',
    ],
  },
  breath: 'Breath',
  breathNote: 'High chime: breathe in slowly and hard. Low chime: breathe out normally, then nose breathing.',
  breathPoints: [
    'High chime: mouthpiece in, and breathe in slowly, hard and steady.',
    'Low chime: breathe out normally. Don\'t stretch it out.',
    'Then close your mouth and breathe calmly through your nose until the next chime.',
    'The first half of the ring is breathing in, the second half nose breathing.',
  ],
  tips: [
    'Between breaths, keep your mouth closed and breathe through your nose.',
    'You may feel it in your neck and chest, but keep the work low, in your diaphragm.',
    'Breathing out is easy. Breathing in is the work.',
    'If you feel dizzy or get a headache, slow down: one a minute is plenty.',
    'Halfway!',
    'Think belly breathing: slow and low.',
    'You\'re finding a rhythm. Let your body stay quiet and relaxed.',
    'Keep your shoulders down and relaxed.',
    'Two more!',
    'Last one!',
  ],
  outro: {
    name: 'Goodbye',
    note: 'Twice a day: morning and evening.',
    points: [
      'Well done! Put the trainer down and breathe calmly.',
      'Do it twice a day, morning and evening, for at least six weeks.',
      'Rinse the mouthpiece and put it away.',
      'Thanks for joining me!',
    ],
  },
}

const es: Copy = {
  program: 'Entrenamiento con respirador',
  section: { intro: 'Introducción', practice: 'Práctica', outro: 'Cierre' },
  intro: {
    name: 'Bienvenida',
    note: 'Consulta con tu médico antes de empezar. No cambies tu medicación. Para si te mareas o te duele la cabeza.',
    points: [
      '¡Hola! Hoy entrenamos los músculos de la respiración con un entrenador respiratorio sencillo. Lo haremos sentados todo el tiempo.',
      'Es como una pequeña pesa para el diafragma: inspiras con fuerza contra una pequeña resistencia.',
      'Los estudios muestran que, si lo haces con regularidad durante unas semanas, puede ayudarte a bajar la tensión.',
      'Consulta con tu médico antes de empezar, sobre todo si tienes problemas de pulmón o de oído, o te han operado hace poco.',
      'Practicaremos cinco minutos sin pausa: una inspiración lenta y fuerte por el entrenador cada medio minuto.',
      'Después suelta el aire con normalidad, sin alargarlo, y sigue respirando tranquilo por la nariz hasta el siguiente sonido.',
      'Si te mareas o te duele la cabeza, ve más despacio: una por minuto es suficiente.',
    ],
  },
  setup: {
    name: 'Tu nivel',
    note: 'El nivel correcto: la inspiración larga cuesta, pero la terminas.',
    points: [
      'Siéntate cómodo, con la espalda recta y los pies en el suelo.',
      'Este entrenador tiene seis niveles. La primera vez, empieza en el uno.',
      'Cierra los labios alrededor de la boquilla e inspira despacio y con fuerza, todo lo que puedas.',
      'Si te ha resultado fácil, sube un nivel y prueba otra vez.',
      'El nivel correcto es aquel en el que cuesta, pero aún la terminas. Más o menos tres cuartos de tu máximo.',
      'Quédate en ese nivel. Si en una o dos semanas te resulta fácil, sube uno.',
    ],
  },
  breath: 'Respiración',
  breathNote: 'Sonido agudo: inspira despacio y con fuerza. Sonido grave: suelta el aire con normalidad y respira por la nariz.',
  breathPoints: [
    'Sonido agudo: boquilla en la boca e inspira despacio, con fuerza y constante.',
    'Sonido grave: suelta el aire con normalidad, sin alargarlo.',
    'Luego, boca cerrada, respira tranquilo por la nariz hasta el siguiente sonido.',
    'La primera mitad del círculo es inspirar, la segunda respirar por la nariz.',
  ],
  tips: [
    'Entre respiraciones, boca cerrada y respira por la nariz.',
    'Puedes notarlo en el cuello y el pecho, pero el trabajo abajo, en el diafragma.',
    'Soltar el aire es fácil. Tomarlo es el trabajo.',
    'Si te mareas o te duele la cabeza, ve más despacio: una por minuto es suficiente.',
    '¡Mitad!',
    'Piensa en respirar con la tripa: lento y profundo.',
    'Vas cogiendo el ritmo. El cuerpo tranquilo y relajado.',
    'Hombros abajo y relajados.',
    '¡Dos más!',
    '¡La última!',
  ],
  outro: {
    name: 'Despedida',
    note: 'Dos veces al día: mañana y noche.',
    points: [
      '¡Buen trabajo! Deja el entrenador y respira con calma.',
      'Hazlo dos veces al día, mañana y noche, al menos seis semanas.',
      'Enjuaga la boquilla y guárdala.',
      '¡Gracias por acompañarme!',
    ],
  },
}

const COPY: Record<Lang, Copy> = { hu, en, es }

let seq = 0
const block = (kind: Block['kind'], name: string, seconds: number, note?: string, points?: string[]): Block => ({
  id: `lt-${seq++}`,
  name,
  seconds,
  kind,
  note,
  ...(points ? { points } : {}),
})

const BREATHS = 10
const EVERY = 30
const INHALE = 15

export function breathingTrainerProgram(lang: Lang): Program {
  const c = COPY[lang]
  // "1. kör" in Hungarian, "Breath 1" / "Respiración 1" otherwise.
  const breathName = (n: number) => (lang === 'hu' ? `${n}. ${c.breath}` : `${c.breath} ${n}`)
  const breaths: Block[] = []
  for (let n = 1; n <= BREATHS; n++) {
    breaths.push({
      ...block('work', breathName(n), EVERY, c.breathNote, [c.tips[n - 1], ...c.breathPoints]),
      breathIn: INHALE,
    })
  }
  return {
    id: 'legzotrener',
    name: c.program,
    prepSeconds: 0,
    repeatRounds: 1,
    sound: 'soft',
    rounds: [
      {
        name: c.section.intro,
        blocks: [
          block('prep', c.intro.name, 70, c.intro.note, c.intro.points),
          // Rolls straight on from the welcome: the label changes, nothing sounds.
          { ...block('prep', c.setup.name, 60, c.setup.note, c.setup.points), quiet: true },
        ],
      },
      // Five minutes without a break: one breath every half minute, no rests.
      { name: c.section.practice, blocks: breaths },
      {
        name: c.section.outro,
        // Fades out on the goodbye: no countdown, no finish tone.
        blocks: [{ ...block('prep', c.outro.name, 35, c.outro.note, c.outro.points), quietEnd: true }],
      },
    ],
  }
}

/**
 * The same session with András's English lines on the prompter, for recording the English
 * take: timings, chimes and the breathing ring are identical to `legzotrener`, except a
 * longer (silent-ending) goodbye.
 */
/** His goodbye on the second Hungarian take runs ~20 s past the timer: room for it in English. */
const GOODBYE_SECONDS = 60

export function breathingPrompterProgram(): Program {
  const base = breathingTrainerProgram('en')
  const last = base.rounds[base.rounds.length - 1]
  let at = 0
  return {
    ...base,
    id: 'legzotrener-en-prompter',
    name: 'Breathing trainer — English prompter',
    rounds: base.rounds.map((round) => ({
      ...round,
      blocks: round.blocks.map((block) => {
        const b = round === last ? { ...block, seconds: GOODBYE_SECONDS } : block
        const start = at
        at += b.seconds
        const prompt = BREATHING_PROMPTER_EN.filter(([t]) => t >= start && t < at).map(([t, text]) => ({
          at: t - start,
          text,
        }))
        return { ...b, id: `${b.id}-prompter`, ...(prompt.length ? { prompt } : {}) }
      }),
    })),
  }
}
