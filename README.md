# Cue Timer

An interval timer for guided exercise sessions where **the audio carries the
instruction**. The person following along is usually not looking at a screen —
they are on a mat, on a bench, or watching a video from across the room — so
every transition is announced by sound before it happens, never only shown.

## The cue language

| Cue | Sound | Meaning |
|---|---|---|
| Three short pips at T-3, T-2, T-1 | 920 Hz triangle, 110 ms | Get into position, a change is coming |
| One long **high** tone | 1320 Hz sine, 700 ms | Start exercising now |
| One long **low** tone | 520 Hz sine, 700 ms | Stop, break starts now |
| Get ready | 784 Hz sine, 450 ms | The prep block has begun |
| One rising tone | 1568 Hz sine, 1300 ms | Session finished |

The pitch difference is the whole point. A single undifferentiated beep at
every boundary tells a listener that *something* changed but not *what*, which
is useless without looking.

## Timing

Cues are **not** driven by a `setInterval` tick that notices a threshold was
crossed — that drifts, double-fires and misses cues when the main thread is
busy. Instead:

1. On start, the full cue list is computed as absolute offsets from `t0`.
2. Every event is committed to one `AudioContext` with `osc.start(t0 + offset)`,
   which is sample-accurate and runs off the audio thread.
3. Events are scheduled in a rolling 30-second window, topped up every 10 s.
4. The visual clock is animated **from** `audioContext.currentTime`, never the
   other way round, so sound and display cannot disagree.
5. Pausing re-anchors and re-schedules from the current position.

iOS suspends Web Audio when the screen locks or the tab is backgrounded. Rather
than silently drifting, the app takes a `WakeLock` while running and, if the
context is suspended mid-session, shows the timer as **paused at the real
elapsed position**.

## Screens

- **Run** — the whole screen is the timer. Block name, remaining time as the
  largest element on the page, the three pips lighting as they fire, what is
  coming next, and position in the session.
- **Programs** — list, pick, duplicate, edit, share, delete, and export.
- **Cue key** — the table above with a play button per cue, so a video producer
  can teach the code in the first thirty seconds of a video.

## Programs

A program is a list of **named blocks** rather than a uniform
`work × rest × rounds`, because real sessions are not uniform:

```ts
type Block = { id: string; name: string; seconds: number; kind: 'work' | 'rest' | 'prep' }
type Program = {
  id: string
  name: string
  prepSeconds: number
  rounds: { name: string; blocks: Block[] }[]
  repeatRounds: number
}
```

The block name is both shown and spoken, so "Bench step-ups" reads out as the
exercise rather than as "Work". A session always ends on the last piece of
work — a trailing break before the finish tone is dead air, so it is trimmed.

Three programs ship with the app, including a simple uniform one, so it is
usable in ten seconds without building anything.

Programs live in `localStorage`. There is **no backend, no auth, no database**.
A program is shared by encoding it into the URL hash, so a link is enough to
pass a session to someone else.

## Export for video production

The Programs screen renders the cue track on its own through an
`OfflineAudioContext` and downloads it as a 44.1 kHz mono WAV — a silent track
with only the cues on it, to sit under footage on an editing timeline. The
first tone is at exactly `t=0` so it can be snapped to a marker, with an
optional 2-second lead-in when an editor wants handles.

## Accessibility

The audience includes older adults, and the premise is that people are *not*
looking at the screen.

- Remaining time renders at 25%+ of viewport height.
- WCAG AA contrast; work and rest are never distinguished by colour alone —
  the kind is spelled out on screen and the pitch says it again.
- Touch targets 48 px or larger, no gesture-only controls.
- Spoken block names via `speechSynthesis`, opt-in, in the current language.
- `prefers-reduced-motion` respected.
- Full keyboard control with visible focus: **Space** toggles, **R** resets.

## Languages

English, Spanish and Hungarian, including the spoken block names and the cue
key page.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run verify     # checks the cue plan: ordering, pips, no collisions
npm run typecheck
npm run build      # static export into out/
```

## Deploying

Static export (`output: 'export'`) to Firebase Hosting:

```bash
npm run build
firebase use <project-id>
firebase deploy --only hosting
```

`firebase.json` serves `out/`, marks `sw.js` as never-cached so updates
propagate, and marks hashed build assets immutable.

## Stack

Next.js 16 (App Router), TypeScript, static export, no runtime dependencies
beyond React. Installable PWA with an offline service worker — the timer works
in airplane mode after first load.
