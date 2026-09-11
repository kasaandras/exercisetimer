import type { Block, Program, Round } from './program'

/**
 * "Kíméletes Keringésfokozó" — the two session plans, transcribed from the
 * source document. Names are kept in Hungarian: they are exercise names in a
 * specific programme, not interface text, and they are read aloud as written.
 */

let seq = 0
const w = (name: string, seconds: number): Block => ({
  id: `kk-${seq++}`,
  name,
  seconds,
  kind: 'work',
})
const r = (name: string, seconds: number): Block => ({
  id: `kk-${seq++}`,
  name,
  seconds,
  kind: 'rest',
})
const p = (name: string, seconds: number): Block => ({
  id: `kk-${seq++}`,
  name,
  seconds,
  kind: 'prep',
})

const intro = (): Round => ({
  name: 'Bevezető',
  blocks: [p('Bemutatkozás, biztonsági jelzések', 30)],
})

/** Six exercises, rising tempo — 3:40. Identical in both sessions. */
const warmUp = (): Round => ({
  name: 'Bemelegítés',
  blocks: [
    w('Könnyű lépdelés', 60),
    w('Karkörzés', 30),
    w('Törzsfordítás', 30),
    w('Csípőkörzés', 30),
    w('Oldallépés', 40),
    w('Tempós térdemelés', 30),
  ],
})

/** The shared cool-down — 5:30. Always finishes seated on a long exhale. */
const coolDownBlocks = (): Block[] => [
  w('Lassú séta', 60),
  w('Oldallépés lassan', 45),
  w('Mellkasnyitás karokkal', 30),
  w('Combfeszítő nyújtása', 60),
  w('Combhajlító nyújtása padon', 45),
  w('Vádlinyújtás', 30),
  w('Ülve, hosszú kilégzés', 60),
]

/** One pass of the first session's main circuit. */
const mainRound = (index: number, withRest: boolean): Round => ({
  name: `Fő rész — ${index}. kör`,
  blocks: [
    w('Helyben járás', 45),
    w('Magas fekvőtámasz padon', 45),
    w('Oldallépés sarokemeléssel', 45),
    w('Lábszár izometrikus tartás', 45),
    r('Átvezetés', 15),
    // The document places the 60 s break after rounds 1 and 2 only.
    ...(withRest ? [r('Pihenő', 60)] : []),
  ],
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
    { name: 'Levezetés', blocks: coolDownBlocks() },
  ],
}

/** Second session: cardio — strength/hold — cardio — break, three times. */
const block = (index: number, cardioA: string, middle: string, cardioB: string): Round => ({
  name: `${index}. blokk`,
  blocks: [
    w(cardioA, 45),
    // Rep-based in the document ("10 ism."); timed to match the 45 s the
    // first session gives the same movement.
    w(middle, 45),
    w(cardioB, 45),
    r('Pihenő', 60),
  ],
})

const sorozat2: Program = {
  id: 'kk-sorozat-2',
  name: 'Kíméletes Keringésfokozó — 2. sorozat',
  prepSeconds: 0,
  repeatRounds: 1,
  rounds: [
    intro(),
    warmUp(),
    block(1, 'Sarokfelrúgás helyben', 'Magas fekvőtámasz padon', 'Gyors oldallépés karhúzással'),
    block(2, 'Tempós térdemelés', 'Magas guggolótartás', 'Box step tempósan'),
    block(3, 'Kitörés hátra váltott lábbal', 'Felhúzás gumiszalaggal vagy súlyzóval', 'Oldallépés bicepszhajlítással'),
    {
      name: 'Levezetés',
      blocks: [
        ...coolDownBlocks().slice(0, 3),
        // The second session adds shoulder and side stretches, placed before
        // the seated finish so the rule "always ends seated" still holds.
        w('Vállnyújtás', 30),
        w('Oldalra hajlás', 30),
        ...coolDownBlocks().slice(3),
      ],
    },
  ],
}

export function builtinPrograms(): Program[] {
  return [sorozat1, sorozat2]
}
