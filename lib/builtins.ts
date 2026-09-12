import type { Block, Program, Round } from './program'

/**
 * "Kíméletes Keringésfokozó" — the two session plans, transcribed from the
 * source document. Names are kept in Hungarian: they are exercise names in a
 * specific programme, not interface text, and they are read aloud as written.
 *
 * The third argument is the coaching note — the form cue, the breathing
 * instruction, or the easier variant — shown beside the clock while the block
 * runs.
 */

let seq = 0
const make = (kind: Block['kind']) => (name: string, seconds: number, note?: string): Block => ({
  id: `kk-${seq++}`,
  name,
  seconds,
  kind,
  note,
})
const w = make('work')
const r = make('rest')
const p = make('prep')

const SAFETY = 'Folyamatos légzés; szédülés esetén abbahagyni.'
const BREAK_NOTE = 'Pulzus rendezése, ivás.'
const PUSHUP_NOTE = 'Kilégzés a tolásra. Könnyítés: falnyomás.'

/**
 * Lay out exercises with a 15 s Átvezetés between each one, which is where the
 * time to change position is actually needed. There is none before the break:
 * the Pihenő starts the moment the last exercise of the round ends.
 */
const circuit = (exercises: Block[], breakSeconds = 0): Block[] => {
  const blocks: Block[] = []
  exercises.forEach((exercise, i) => {
    blocks.push(exercise)
    if (i < exercises.length - 1) {
      blocks.push(r('Átvezetés', 15, 'Biztonságos testhelyzetváltás.'))
    }
  })
  if (breakSeconds > 0) blocks.push(r('Pihenő', breakSeconds, BREAK_NOTE))
  return blocks
}

/** What the presenter works through on camera before the warm-up. */
const INTRO_POINTS = [
  'Köszöntés, a videó hossza és felépítése',
  'Orvosi konzultáció mozgás előtt',
  'Leállás és orvoshoz fordulás tünet esetén',
  'Szükséges eszközök',
  'Folyamatos légzés, levegő-visszatartás tilos',
  'Könnyített változat minden gyakorlathoz',
  'Saját tempó',
]

const intro = (): Round => ({
  name: 'Bevezető',
  blocks: [
    {
      // A full minute: seven talking points, including the medical warnings.
      ...p('Bemutatkozás, biztonsági jelzések', 60, SAFETY),
      points: INTRO_POINTS,
    },
  ],
})

/** Six exercises, rising tempo — 3:40. Identical in both sessions. */
const warmUp = (): Round => ({
  name: 'Bemelegítés',
  blocks: [
    w('Könnyű lépdelés', 60, 'Nyugodt tempó, karok lazán.'),
    w('Karkörzés', 30, 'Kis körökkel indul, majd nagyobb.'),
    w('Törzsfordítás', 30, 'Csípő előre néz, csak a váll fordul.'),
    w('Csípőkörzés', 30, 'Fej viszonylag mozdulatlan.'),
    w('Oldallépés', 40, 'Talp végig a földön.'),
    w('Tempós térdemelés', 30, 'Törzs egyenes; könnyítés: kisebb emelés.'),
  ],
})

/** The shared cool-down — 5:30. Always finishes seated on a long exhale. */
const coolDownStart = (): Block[] => [
  w('Lassú séta', 60, 'Mozgás folytatása, nem megállni.'),
  w('Oldallépés lassan', 45, 'Csökkenő tempó.'),
  w('Mellkasnyitás karokkal', 30, 'Lapockák hátra.'),
]
const coolDownEnd = (): Block[] => [
  w('Combfeszítő nyújtása', 60, '30 mp / láb; padnak támaszkodva.'),
  w('Combhajlító nyújtása padon', 45, 'Sarok a padon, egyenes háttal előredőlés.'),
  w('Vádlinyújtás', 30, 'Padnak dőlve.'),
  w('Ülve, hosszú kilégzés', 60, 'Kb. 6 légvétel/perc.'),
]

/** One pass of the first session's main circuit. */
const mainRound = (index: number, withRest: boolean): Round => ({
  name: `Fő rész — ${index}. kör`,
  // The document places the 60 s break after rounds 1 and 2 only.
  blocks: circuit(
    [
      w('Helyben járás', 45, 'Könnyítés: lassabb tempó.'),
      w('Magas fekvőtámasz padon', 45, PUSHUP_NOTE),
      w('Oldallépés sarokemeléssel', 45, 'Bicepszhajlítással; talp a földön marad.'),
      w('Lábszár izometrikus tartás', 45, 'Fal közelében; egyenletes légzés.'),
    ],
    withRest ? 60 : 0,
  ),
})

const sorozat1: Program = {
  id: 'kk-sorozat-1',
  name: 'Kíméletes Keringésfokozó — 1. sorozat',
  prepSeconds: 0,
  repeatRounds: 1,
  rounds: [
    intro(),
    warmUp(),
    mainRound(1, true),
    mainRound(2, true),
    mainRound(3, false),
    { name: 'Levezetés', blocks: [...coolDownStart(), ...coolDownEnd()] },
  ],
}

/**
 * Second session: cardio — strength/hold — cardio — break, three times.
 * The role prefix is part of the name because that structure is the point of
 * this session, not incidental labelling.
 */
const block = (index: number, cardioA: Block, middle: Block, cardioB: Block): Round => ({
  name: `${index}. blokk`,
  blocks: circuit([cardioA, middle, cardioB], 60),
})

// Rep-based in the document ("10 ism."); timed at 45 s to match what the first
// session gives the same movements.
const REPS = 45

const sorozat2: Program = {
  id: 'kk-sorozat-2',
  name: 'Kíméletes Keringésfokozó — 2. sorozat',
  prepSeconds: 0,
  repeatRounds: 1,
  rounds: [
    intro(),
    warmUp(),
    block(
      1,
      w('Kardió: sarokfelrúgás helyben', 45, 'Könnyítés: lassú helyben járás.'),
      w('Erő: magas fekvőtámasz padon', REPS, PUSHUP_NOTE),
      w('Kardió: gyors oldallépés karhúzással', 45, 'Könnyítés: lassabb, karhúzás nélkül.'),
    ),
    block(
      2,
      w('Kardió: tempós térdemelés', 45, 'Könnyítés: kisebb emelés.'),
      w('Tartás: magas guggolótartás', 45, 'Fal közelében; térd nem lép a lábujjak elé.'),
      w('Kardió: box step tempósan', 45, 'Négy sarokpont, előre–hátra.'),
    ),
    block(
      3,
      w('Kardió: kitörés hátra váltott lábbal', 45, 'Könnyítés: kisebb lépés, padra támaszkodás.'),
      w('Erő: felhúzás gumiszalaggal vagy súlyzóval', REPS, 'Könyök vállmagasságig, kéz nem a szegycsont fölé.'),
      w('Kardió: oldallépés bicepszhajlítással', 45, 'Talp a földön marad.'),
    ),
    {
      name: 'Levezetés',
      blocks: [
        ...coolDownStart(),
        // The second session adds a shoulder stretch, placed before the seated
        // finish so the rule "always ends seated" still holds.
        w('Vállnyújtás', 30, 'Kar a test előtt át, váll lent.'),
        ...coolDownEnd(),
      ],
    },
  ],
}

export function builtinPrograms(): Program[] {
  return [sorozat1, sorozat2]
}
