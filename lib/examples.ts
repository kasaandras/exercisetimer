import type { Dict } from './i18n'
import type { Program } from './program'

/**
 * Shipped programs, so the app is usable immediately without building
 * anything. Names come from the dictionary because block names are both shown
 * and spoken aloud.
 */
export function examplePrograms(t: Dict): Program[] {
  const block = (id: string, name: string, seconds: number, kind: 'work' | 'rest' = 'work', note?: string) => ({
    id,
    name,
    seconds,
    kind,
    ...(note ? { note } : {}),
  })

  return [
    {
      id: 'example-simple',
      name: t.exampleSimple,
      prepSeconds: 10,
      repeatRounds: 8,
      rounds: [
        {
          name: t.roundCircuit,
          blocks: [
            block('s-work', t.blockExercise, 45),
            block('s-rest', t.blockBreak, 15, 'rest'),
          ],
        },
      ],
    },
    {
      id: 'example-circuit',
      name: t.exampleCircuit,
      prepSeconds: 10,
      repeatRounds: 3,
      rounds: [
        {
          name: t.roundCircuit,
          blocks: [
            block('c-march', t.blockMarching, 45),
            block('c-rest1', t.blockBreak, 15, 'rest'),
            block('c-wall', t.blockWallSit, 60),
            block('c-rest2', t.blockBreak, 15, 'rest'),
            block('c-chest', t.blockChestOpener, 30),
            block('c-rest3', t.blockBreak, 15, 'rest'),
          ],
        },
      ],
    },
    {
      id: 'example-kettlebell',
      name: t.exampleKettlebell,
      prepSeconds: 10,
      repeatRounds: 4,
      rounds: [
        {
          name: t.roundCircuit,
          // 40 s on, 20 s off, six movements. The rest after the last one is
          // trimmed by expandProgram, so the session ends on the curl.
          blocks: [
            block('kb-swing', t.blockSwing, 40),
            block('kb-rest1', t.blockBreak, 20, 'rest'),
            block('kb-thruster', t.blockThrusters, 40),
            block('kb-rest2', t.blockBreak, 20, 'rest'),
            block('kb-pushpull', t.blockPushUpPullThrough, 40),
            block('kb-rest3', t.blockBreak, 20, 'rest'),
            block('kb-row-l', t.blockRowLeft, 40),
            block('kb-rest4', t.blockBreak, 20, 'rest'),
            block('kb-row-r', t.blockRowRight, 40),
            block('kb-rest5', t.blockBreak, 20, 'rest'),
            block('kb-curl', t.blockBicepCurl, 40),
            block('kb-rest6', t.blockBreak, 20, 'rest'),
          ],
        },
      ],
    },
    {
      id: 'example-kettlebell-cardio',
      name: t.exampleArmsChest,
      prepSeconds: 10,
      repeatRounds: 4,
      rounds: [
        {
          name: t.roundCircuit,
          // The simple kettlebell circuit, with the thruster split into a
          // shoulder press and a bridge, and cardio threaded between the
          // heavy lifts so the arms recover without the heart rate dropping.
          // Four rounds, matching the simple kettlebell session. The trailing
          // rest is trimmed by expandProgram.
          blocks: [
            block('kc-swing', t.blockSwing, 40),
            block('kc-rest1', t.blockBreak, 20, 'rest'),
            block('kc-press', t.blockShoulderPress, 40),
            block('kc-rest2', t.blockBreak, 20, 'rest'),
            block('kc-bridge', t.blockBridge, 40),
            block('kc-rest3', t.blockBreak, 20, 'rest'),
            block('kc-run', t.blockRunningOnSpot, 40),
            block('kc-rest4', t.blockBreak, 20, 'rest'),
            block('kc-pushpull', t.blockPushUpPullThrough, 40),
            block('kc-rest5', t.blockBreak, 20, 'rest'),
            block('kc-punches', t.blockPunches, 40),
            block('kc-rest6', t.blockBreak, 20, 'rest'),
            block('kc-row-l', t.blockRowLeft, 40),
            block('kc-rest7', t.blockBreak, 20, 'rest'),
            block('kc-row-r', t.blockRowRight, 40),
            block('kc-rest8', t.blockBreak, 20, 'rest'),
            block('kc-curl', t.blockBicepCurl, 40),
            block('kc-rest9', t.blockBreak, 20, 'rest'),
          ],
        },
      ],
    },
    {
      id: 'example-arms-200',
      name: t.exampleArms200,
      prepSeconds: 10,
      repeatRounds: 5,
      rounds: [
        {
          name: t.roundCircuit,
          // Pavel Krotov's "200 reps, arms on fire": four kettlebell moves,
          // 10 reps each, a short changeover between them and a long rest
          // after the round, five rounds. The reps are untimed in the
          // original; 40 s fits 10 reps with a press-weight bell. The last
          // long rest is trimmed by expandProgram. 23:15 in all.
          blocks: [
            block('a2-curlpress', t.blockCurlToPress, 40, 'work', t.note10Reps),
            block('a2-rest1', t.blockBreak, 15, 'rest'),
            block('a2-extension', t.blockOverheadExtension, 40, 'work', t.note10Reps),
            block('a2-rest2', t.blockBreak, 15, 'rest'),
            block('a2-halo', t.blockHalo, 40, 'work', t.note10Reps),
            block('a2-rest3', t.blockBreak, 15, 'rest'),
            block('a2-crush', t.blockCrushPushUp, 40, 'work', t.note10Reps),
            block('a2-longrest', t.blockLongRest, 90, 'rest'),
          ],
        },
      ],
    },
    {
      id: 'example-kettlebell-full',
      name: t.exampleKettlebellFull,
      prepSeconds: 10,
      repeatRounds: 5,
      rounds: [
        {
          name: t.roundCircuit,
          // Seven moves, five rounds, 35:40. Ordered so the grip-heavy ones
          // (deadlift, row, swing, curl) always have an easier move between
          // them. A glute bridge instead of a goblet squat, for the knee.
          // The rows switch sides without a break. The last long rest is
          // trimmed by expandProgram.
          blocks: [
            block('kf-deadlift', t.blockDeadlift, 40),
            block('kf-rest1', t.blockBreak, 15, 'rest'),
            block('kf-halo', t.blockHalo, 40),
            block('kf-rest2', t.blockBreak, 15, 'rest'),
            block('kf-row-l', t.blockRowLeft, 30),
            block('kf-row-r', t.blockRowRight, 30),
            block('kf-rest3', t.blockBreak, 15, 'rest'),
            block('kf-bridge', t.blockBridge, 40, 'work', t.noteBellOnHips),
            block('kf-rest4', t.blockBreak, 15, 'rest'),
            block('kf-swing', t.blockSwing, 40),
            block('kf-rest5', t.blockBreak, 15, 'rest'),
            block('kf-pushup', t.blockPushUp, 40),
            block('kf-rest6', t.blockBreak, 15, 'rest'),
            block('kf-curl', t.blockBicepCurl, 40),
            block('kf-longrest', t.blockLongRest, 45, 'rest'),
          ],
        },
      ],
    },
    {
      id: 'example-cardio',
      name: t.exampleCardio,
      prepSeconds: 10,
      repeatRounds: 5,
      rounds: [
        {
          name: t.roundCircuit,
          // 35 s on, 25 s off, six moves, five rounds, 29:45. Arms and legs
          // take turns so neither is working twice in a row. The last rest is
          // trimmed by expandProgram, so the session ends on the plank.
          blocks: [
            block('cd-run', t.blockRunningOnSpot, 35),
            block('cd-rest1', t.blockBreak, 25, 'rest'),
            block('cd-pushup', t.blockPushUp, 35),
            block('cd-rest2', t.blockBreak, 25, 'rest'),
            block('cd-squat', t.blockSquat, 35),
            block('cd-rest3', t.blockBreak, 25, 'rest'),
            block('cd-climbers', t.blockMountainClimbers, 35),
            block('cd-rest4', t.blockBreak, 25, 'rest'),
            block('cd-swing', t.blockSwing, 35),
            block('cd-rest5', t.blockBreak, 25, 'rest'),
            block('cd-plank', t.blockPlank, 35),
            block('cd-rest6', t.blockBreak, 25, 'rest'),
          ],
        },
      ],
    },
    {
      id: 'example-weights-cardio',
      name: t.exampleWeightsCardio,
      prepSeconds: 10,
      repeatRounds: 5,
      rounds: [
        {
          name: t.roundCircuit,
          // 40 s on, 20 s off, seven moves, then a 45 s break after the round,
          // five rounds, 36:30 with the countdown. The last long rest is
          // trimmed by expandProgram, so the session ends on the curls.
          blocks: [
            block('wc-run', t.blockRunningOnSpot, 40),
            block('wc-rest1', t.blockBreak, 20, 'rest'),
            block('wc-pushpress', t.blockPushPress, 40),
            block('wc-rest2', t.blockBreak, 20, 'rest'),
            block('wc-pullthrough', t.blockPushUpPullThrough, 40),
            block('wc-rest3', t.blockBreak, 20, 'rest'),
            block('wc-renegade', t.blockRenegadeRow, 40),
            block('wc-rest4', t.blockBreak, 20, 'rest'),
            block('wc-climbers', t.blockMountainClimbers, 40),
            block('wc-rest5', t.blockBreak, 20, 'rest'),
            block('wc-twist', t.blockRussianTwist, 40),
            block('wc-rest6', t.blockBreak, 20, 'rest'),
            block('wc-curl', t.blockBicepCurl, 40),
            block('wc-longrest', t.blockLongRest, 45, 'rest'),
          ],
        },
      ],
    },
    {
      id: 'example-chair',
      name: t.exampleChair,
      prepSeconds: 10,
      repeatRounds: 2,
      rounds: [
        {
          name: t.roundWarmUp,
          blocks: [
            block('h-stand', t.blockSitToStand, 30),
            block('h-rest1', t.blockBreak, 15, 'rest'),
            block('h-arms', t.blockArmCircles, 30),
            block('h-rest2', t.blockBreak, 15, 'rest'),
            block('h-ankle', t.blockAnkleRaises, 30),
            block('h-rest3', t.blockBreak, 15, 'rest'),
          ],
        },
      ],
    },
  ]
}
