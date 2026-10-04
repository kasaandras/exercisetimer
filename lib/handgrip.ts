import type { Lang } from './i18n'
import { HANDGRIP_SCRIPT_EN } from './handgripScriptEn.ts'
import type { Block, Program } from './program'

/**
 * Isometric handgrip for blood pressure, with a spring hand gripper.
 *
 * The protocol is the one the trials keep using (Taylor et al. 2003, and
 * Millar et al. 2008 with an inexpensive spring gripper): four 2-minute holds
 * at about 30% of maximum grip, alternating hands. The trials rest 1 minute
 * between holds; this session rests 30 seconds, by choice.
 * A spring gripper shows no percentage, so the copy teaches it as a feeling:
 * handles about halfway closed, held still, 6-7 out of 10 by the end.
 *
 * 12:15 in all. Every visible string is in COPY; the timings are below, once.
 */

type Script = { name: string; note: string; points?: string[] }

type Copy = {
  program: string
  section: { intro: string; holds: string; outro: string }
  intro: Script
  setup: Script
  holdRight: string
  holdLeft: string
  holdNote: string
  holdPoints: string[]
  /** The third hold gets one extra line up front: it will feel harder. */
  harderPoint: string
  rest: Script
  outro: Script
}

const hu: Copy = {
  program: 'Kézszorító — vérnyomáscsökkentő gyakorlat',
  section: { intro: 'Bevezető', holds: 'Szorítások', outro: 'Levezetés' },
  intro: {
    name: 'Köszöntő',
    note: 'Kezdés előtt beszélj az orvosoddal. Ne csináld, ha a vérnyomásod nagyon magas vagy nincs beállítva. Szédülés, mellkas- vagy fejfájás esetén azonnal hagyd abba.',
    points: [
      'Szia! Ma egy egyszerű kézszorító gyakorlatot csinálunk, ami segíthet lejjebb vinni a vérnyomást. Kb. 12 perc, és csak egy kézi erősítő kell hozzá.',
      'Kutatások szerint ha hetente háromszor megcsinálod, néhány hét után mérhetően csökkenhet a vérnyomásod.',
      'Ha nagyon magas vagy még nincs beállítva a vérnyomásod, előbb beszélj az orvosoddal.',
      'Ha szédülsz, fáj a mellkasod vagy a fejed, azonnal hagyd abba.',
      'A legfontosabb: végig lélegezz nyugodtan. Soha ne tartsd vissza a levegőt.',
      'Négyszer két percig szorítunk, felváltva jobb és bal kézzel, és közte mindig van egy fél perc pihenő.',
    ],
  },
  setup: {
    name: 'Előkészület',
    note: 'Félig összenyomva, nem teljes erőből.',
    points: [
      'Ülj le kényelmesen, egyenes háttal, a talpad legyen a földön.',
      'A kezed pihenjen a combodon, a másik kezed legyen laza.',
      'Nem kell teljes erőből szorítani! Elég nagyjából a harmada, kb. 30 százalék.',
      'Nyomd össze a szorítót kb. félig, és ott tartsd meg. Ne pumpáld, csak tartsd.',
      'Az eleje könnyű lesz, a végére elég nehéz: egy tízes skálán kb. 6-7. Pont így jó.',
      'Ha nem bírod ki a két percet, szoríts egy kicsit kevésbé. Ha a végén is könnyű, egy kicsit jobban.',
    ],
  },
  holdRight: 'Jobb kéz',
  holdLeft: 'Bal kéz',
  holdNote: 'Félig összenyomva tartsd. Lélegezz nyugodtan.',
  holdPoints: [
    'Lélegezz nyugodtan. Ha segít, számolj hangosan.',
    'A vállad és az állkapcsod maradjon laza.',
    'Félidő! Tartsd meg ugyanott.',
    'Ha remegni kezd a kezed, az teljesen rendben van.',
    'Már csak 10 másodperc!',
  ],
  harderPoint: 'Ez most nehezebb lesz, mint az első. Ez teljesen normális.',
  rest: {
    name: 'Pihenő',
    note: 'Engedd el, rázd meg a kezed, és vedd át a másik kezedbe.',
  },
  outro: {
    name: 'Elköszönés',
    note: 'Heti 3 alkalom elég.',
    points: [
      'Szép munka! Rázd meg mindkét kezed.',
      'Hetente háromszor elég, nem kell minden nap.',
      'Pár hét után jön a hatás, de ha abbahagyod, elmúlik. Legyen belőle szokás!',
      'Köszönöm, hogy velem tartottál!',
    ],
  },
}

const en: Copy = {
  program: 'Handgrip for blood pressure',
  section: { intro: 'Intro', holds: 'Holds', outro: 'Wrap-up' },
  intro: {
    name: 'Welcome',
    note: 'Talk to your doctor before you start. Don\'t do this if your blood pressure is very high or not under control. Stop straight away if you feel dizzy, or get chest pain or a headache.',
    points: [
      'Hi! Today we\'re doing a simple handgrip exercise that can help bring your blood pressure down. It takes about 12 minutes, and all you need is a hand gripper.',
      'Studies show that if you do it three times a week, your blood pressure can drop noticeably within a few weeks.',
      'If your blood pressure is very high or not under control yet, talk to your doctor first.',
      'If you feel dizzy, or get chest pain or a headache, stop straight away.',
      'Most important of all: keep breathing calmly. Never hold your breath.',
      'We\'ll squeeze four times for two minutes, switching between right and left hands, with half a minute\'s rest in between.',
    ],
  },
  setup: {
    name: 'Getting set',
    note: 'About halfway closed — not full strength.',
    points: [
      'Sit comfortably with your back straight and your feet flat on the floor.',
      'Rest your hand on your thigh and let the other hand relax.',
      'You don\'t need to squeeze as hard as you can! About a third is enough — around 30 percent.',
      'Squeeze the gripper about halfway closed and hold it there. No pumping, just hold.',
      'It\'ll feel easy at first and fairly hard by the end — about 6 or 7 out of 10. That\'s just right.',
      'If you can\'t last the two minutes, squeeze a little less. If it\'s still easy at the end, a little more.',
    ],
  },
  holdRight: 'Right hand',
  holdLeft: 'Left hand',
  holdNote: 'Hold it halfway closed. Breathe calmly.',
  holdPoints: [
    'Breathe calmly. Count out loud if it helps.',
    'Keep your shoulders and jaw relaxed.',
    'Halfway! Hold it in the same place.',
    'If your hand starts to shake, that\'s completely fine.',
    'Just 10 seconds to go!',
  ],
  harderPoint: 'This one will feel harder than the first. That\'s completely normal.',
  rest: {
    name: 'Rest',
    note: 'Let go, shake your hand out, and switch to the other hand.',
  },
  outro: {
    name: 'Goodbye',
    note: 'Three times a week is enough.',
    points: [
      'Well done! Shake out both hands.',
      'Three times a week is enough — no need to do it every day.',
      'You\'ll notice the effect after a few weeks, but it fades if you stop. Make it a habit!',
      'Thanks for joining me!',
    ],
  },
}

const es: Copy = {
  program: 'Agarre isométrico para la tensión',
  section: { intro: 'Introducción', holds: 'Agarres', outro: 'Cierre' },
  intro: {
    name: 'Bienvenida',
    note: 'Consulta con tu médico antes de empezar. No lo hagas si tu tensión es muy alta o no está controlada. Para enseguida si te mareas o notas dolor en el pecho o de cabeza.',
    points: [
      '¡Hola! Hoy hacemos un ejercicio sencillo de agarre que puede ayudarte a bajar la tensión. Son unos 12 minutos y solo necesitas un hand grip.',
      'Los estudios muestran que, si lo haces tres veces por semana, la tensión puede bajar de forma notable en pocas semanas.',
      'Si tu tensión es muy alta o aún no está controlada, consulta antes con tu médico.',
      'Si te mareas o notas dolor en el pecho o de cabeza, para enseguida.',
      'Lo más importante: respira con calma todo el tiempo. Nunca contengas el aire.',
      'Apretaremos cuatro veces durante dos minutos, alternando mano derecha e izquierda, con medio minuto de descanso entre medias.',
    ],
  },
  setup: {
    name: 'Preparación',
    note: 'Cerrado hasta la mitad, no con toda la fuerza.',
    points: [
      'Siéntate cómodo, con la espalda recta y los pies en el suelo.',
      'Apoya la mano en el muslo y deja la otra relajada.',
      '¡No hace falta apretar al máximo! Basta con un tercio, más o menos un 30 por ciento.',
      'Cierra el hand grip hasta la mitad y mantenlo ahí. Sin bombear, solo mantener.',
      'Al principio será fácil y al final bastante duro: un 6 o 7 sobre 10. Así está bien.',
      'Si no aguantas los dos minutos, aprieta un poco menos. Si al final sigue siendo fácil, un poco más.',
    ],
  },
  holdRight: 'Mano derecha',
  holdLeft: 'Mano izquierda',
  holdNote: 'Mantenlo cerrado hasta la mitad. Respira con calma.',
  holdPoints: [
    'Respira con calma. Si te ayuda, cuenta en voz alta.',
    'Hombros y mandíbula relajados.',
    '¡Mitad! Mantenlo en el mismo sitio.',
    'Si la mano empieza a temblar, es totalmente normal.',
    '¡Solo 10 segundos más!',
  ],
  harderPoint: 'Este costará más que el primero. Es totalmente normal.',
  rest: {
    name: 'Descanso',
    note: 'Suelta, sacude la mano y pasa el hand grip a la otra.',
  },
  outro: {
    name: 'Despedida',
    note: 'Tres veces por semana es suficiente.',
    points: [
      '¡Buen trabajo! Sacude las dos manos.',
      'Tres veces por semana es suficiente, no hace falta cada día.',
      'Notarás el efecto en unas semanas, pero desaparece si lo dejas. ¡Hazlo un hábito!',
      '¡Gracias por acompañarme!',
    ],
  },
}

const COPY: Record<Lang, Copy> = { hu, en, es }

let seq = 0
const block = (kind: Block['kind'], name: string, seconds: number, note?: string, points?: string[]): Block => ({
  id: `hg-${seq++}`,
  name,
  seconds,
  kind,
  note,
  ...(points ? { points } : {}),
})

const HOLD = 120
const REST = 30

export function handgripProgram(lang: Lang): Program {
  const c = COPY[lang]
  const hold = (name: string, n: number, harder = false) =>
    block('work', `${n}. ${name}`, HOLD, c.holdNote, harder ? [c.harderPoint, ...c.holdPoints] : c.holdPoints)
  const rest = () => block('rest', c.rest.name, REST, c.rest.note)
  return {
    id: 'kezszorito',
    name: c.program,
    prepSeconds: 0,
    repeatRounds: 1,
    rounds: [
      {
        name: c.section.intro,
        blocks: [
          block('prep', c.intro.name, 75, c.intro.note, c.intro.points),
          // Rolls straight on from the welcome: the label changes, nothing sounds.
          { ...block('prep', c.setup.name, 45, c.setup.note, c.setup.points), quiet: true },
        ],
      },
      {
        name: c.section.holds,
        blocks: [
          hold(c.holdRight, 1),
          rest(),
          hold(c.holdLeft, 2),
          rest(),
          hold(c.holdRight, 3, true),
          rest(),
          hold(c.holdLeft, 4),
        ],
      },
      {
        name: c.section.outro,
        // Fades out on the goodbye: no countdown, no finish tone.
        blocks: [{ ...block('prep', c.outro.name, 45, c.outro.note, c.outro.points), quietEnd: true }],
      },
    ],
  }
}

const clock = (seconds: number) => `+${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`

/**
 * The same session with the approved English script on screen: every block shows the
 * lines spoken during it, each stamped with when it starts inside the block, to read
 * from while recording in English. Timings and sounds are identical to `kezszorito`.
 */
export function handgripScriptProgram(): Program {
  const base = handgripProgram('en')
  let at = 0
  return {
    ...base,
    id: 'kezszorito-en-script',
    name: 'Handgrip — English script',
    rounds: base.rounds.map((round) => ({
      ...round,
      blocks: round.blocks.map((b) => {
        const start = at
        at += b.seconds
        const points = HANDGRIP_SCRIPT_EN.filter(([t]) => t >= start && t < at).map(
          ([t, line]) => `${clock(t - start)}  ${line}`,
        )
        return { ...b, id: `${b.id}-script`, points: points.length ? points : undefined }
      }),
    })),
  }
}
