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
