/**
 * The breathing trainer in English, as short lines for the prompter: [seconds into the
 * session, line].
 *
 * Translated from András's second Hungarian take (IMG_1470, 2026-10-14), one idea per line,
 * each placed where he said it in Hungarian (recording time - 0.54 s), so the English take
 * keeps the same rhythm. His goodbye runs past the end of the timer, so the prompter session
 * gives the goodbye GOODBYE_SECONDS instead of the usual 35 (see breathing.ts).
 *
 * Smoothed on purpose: "more on that later" about the breathe-out setting is dropped (he does
 * not come back to it), and the level advice is tightened into three lines.
 */
export const BREATHING_PROMPTER_EN: [number, string][] = [
  [1.5, "Hi everyone! Today we're training our breathing muscles with a breathing trainer like this one."],
  [6.7, 'You can get one like this online, or maybe at a pharmacy.'],
  [12, 'You can set how hard it is to breathe in and out. Today we only use it for breathing in.'],
  [19.2, "There's hardly any other way to train the diaphragm than breathing in against resistance."],
  [24.5, 'That makes the muscle work harder and get stronger, and that can help your blood pressure.'],
  [33.9, 'For that, do this exercise at least five times a week, for six weeks.'],
  [41.3, 'Before you start, talk to your doctor, especially with lung or ear problems, or after recent surgery.'],
  [48.2, "We'll practise for five minutes without a break: every half minute, one slow, strong breath in through the trainer."],
  [54.5, 'Deep belly breathing: let your belly rise.'],
  [58.5, 'The rest of the time, breathe calmly through your nose.'],
  [62.7, 'Dizzy, or a headache? Slow down, or stop. One breath a minute is plenty while you build up.'],
  [71.2, 'How we do it: sit comfortably on a chair, back straight, feet flat on the floor.'],
  [77.2, 'Then set the trainer. I suggest everyone starts on level one.'],
  [82.5, 'Or find your maximum: the highest level where you can breathe in twice in a row.'],
  [92.1, 'Mine is six. Then go back one or two levels, so you build up step by step.'],
  [103.7, "Don't overload the muscle all at once."],
  [109.5, 'Or start on one, try two the next day, three a week later, and so on.'],
  [117.4, 'How to use it: just close your lips around the mouthpiece.'],
  [121.6, "That's all. Let's start. Get ready!"],
  [126.7, "We'll start with one breath in."],
  [151.4, 'Now breathe calmly through your nose until the next chime.'],
  [436.2, "That's how we strengthen our diaphragm."],
  [438.7, 'Now just breathe calmly. I suggest doing this twice a day: morning and evening.'],
  [447.3, 'You can set the times in the app, and add a reminder too.'],
  [455, 'After use, rinse the mouthpiece. Please always keep it clean.'],
  [460, 'Thank you so much for joining me. You can find more videos in the video library.'],
  [467.2, "There's also a version of this exercise that's just the animation."],
  [473.3, "So if you'd rather follow the animation on its own, you'll find it in the library too."],
  [482.2, 'Thanks again, and have a lovely day!'],
]
