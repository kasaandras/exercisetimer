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

const intro = (): Round => ({
  name: 'Bevezető',
  blocks: [p('Bemutatkozás, biztonsági jelzések', 30, SAFETY)],
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

/**
 * One pass of the first session's main circuit.
 *
 * The 15 s Átvezetés sits *between* exercises, which is where the time to
 * change position is actually needed. There is none before the Pihenő: the
 * 60 s break begins the moment the last exercise of the round ends.
 */
const mainRound = (index: number, withRest: boolean): Round => {
  const exercises = [
    w('Helyben járás', 45, 'Könnyítés: lassabb tempó.'),
    w('Magas fekvőtámasz padon', 45, PUSHUP_NOTE),
    w('Oldallépés sarokemeléssel', 45, 'Bicepszhajlítással; talp a földön marad.'),
    w('Lábszár izometrikus tartás', 45, 'Fal közelében; egyenletes légzés.'),
  ]

  const blocks: Block[] = []
  exercises.forEach((exercise, i) => {
    blocks.push(exercise)
    if (i < exercises.length - 1) {
      blocks.push(r('Átvezetés', 15, 'Biztonságos testhelyzetváltás.'))
    }
  })
  // The document places the 60 s break after rounds 1 and 2 only.
  if (withRest) blocks.push(r('Pihenő', 60, BREAK_NOTE))

  return { name: `Fő rész — ${index}. kör`, blocks }
}

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

/** Second session: cardio — strength/hold — cardio — break, three times. */
const block = (index: number, cardioA: Block, middle: Block, cardioB: Block): Round => ({
  name: `${index}. blokk`,
  blocks: [cardioA, middle, cardioB, r('Pihenő', 60, BREAK_NOTE)],
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
      w('Sarokfelrúgás helyben', 45, 'Könnyítés: lassú helyben járás.'),
      w('Magas fekvőtámasz padon', REPS, PUSHUP_NOTE),
      w('Gyors oldallépés karhúzással', 45, 'Könnyítés: lassabb, karhúzás nélkül.'),
    ),
    block(
      2,
      w('Tempós térdemelés', 45, 'Könnyítés: kisebb emelés.'),
      w('Magas guggolótartás', 45, 'Fal közelében; térd nem lép a lábujjak elé.'),
      w('Box step tempósan', 45, 'Négy sarokpont, előre–hátra.'),
    ),
    block(
      3,
      w('Kitörés hátra váltott lábbal', 45, 'Könnyítés: kisebb lépés, padra támaszkodás.'),
      w('Felhúzás gumiszalaggal vagy súlyzóval', REPS, 'Könyök vállmagasságig, kéz nem a szegycsont fölé.'),
      w('Oldallépés bicepszhajlítással', 45, 'Talp a földön marad.'),
    ),
    {
      name: 'Levezetés',
      blocks: [
        ...coolDownStart(),
        // The second session adds shoulder and side stretches, placed before
        // the seated finish so the rule "always ends seated" still holds.
        w('Vállnyújtás', 30, 'Kar a test előtt át, váll lent.'),
        w('Oldalra hajlás', 30, '15 mp / oldal.'),
        ...coolDownEnd(),
      ],
    },
  ],
}

export function builtinPrograms(): Program[] {
  return [sorozat1, sorozat2]
}
