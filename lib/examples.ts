import type { Dict } from './i18n'
import type { Program } from './program'

/**
 * Shipped programs, so the app is usable immediately without building
 * anything. Names come from the dictionary because block names are both shown
 * and spoken aloud.
 */
export function examplePrograms(t: Dict): Program[] {
  const block = (id: string, name: string, seconds: number, kind: 'work' | 'rest' = 'work') => ({
    id,
    name,
    seconds,
    kind,
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
