export type Lang = 'en' | 'es' | 'hu'

export const LANGS: { code: Lang; label: string; speech: string }[] = [
  { code: 'en', label: 'English', speech: 'en-GB' },
  { code: 'es', label: 'Español', speech: 'es-ES' },
  { code: 'hu', label: 'Magyar', speech: 'hu-HU' },
]

export type Dict = {
  appName: string
  tagline: string
  navRun: string
  navPrograms: string
  navCues: string

  ready: string
  start: string
  pause: string
  resume: string
  reset: string
  sessionComplete: string
  roundOf: (round: number, total: number) => string
  leftInSession: (clock: string) => string
  upNext: (name: string) => string
  nothingNext: string
  labelNow: string
  labelNext: string
  noteLabel: string
  countdownPips: string
  countingDown: string
  getReady: string
  interrupted: string
  keepScreenOn: string
  speakNames: string
  totalLength: (clock: string) => string

  cuesTitle: string
  cuesIntro: string
  cuePips: string
  cuePipsMeaning: string
  cueWork: string
  cueWorkMeaning: string
  cueRest: string
  cueRestMeaning: string
  cueDone: string
  cueDoneMeaning: string
  play: string
  cuesNote: string

  programsTitle: string
  programsIntro: string
  use: string
  duplicate: string
  edit: string
  del: string
  share: string
  linkCopied: string
  copyFailed: string
  newProgram: string
  programName: string
  prepSeconds: string
  repeatRounds: string
  addRound: string
  addBlock: string
  blockName: string
  seconds: string
  kind: string
  kindWork: string
  kindRest: string
  save: string
  cancel: string
  removeRound: string
  removeBlock: string
  roundLabel: (n: number) => string
  importedProgram: string
  deleteConfirm: (name: string) => string

  exportTitle: string
  exportIntro: string
  exportButton: string
  exportRendering: string
  exportSaved: (clock: string) => string
  exportFailed: string
  leadInLabel: string

  exampleSimple: string
  exampleCircuit: string
  exampleChair: string
  blockMarching: string
  blockWallSit: string
  blockChestOpener: string
  blockBreak: string
  blockExercise: string
  blockSitToStand: string
  blockArmCircles: string
  blockAnkleRaises: string
  roundCircuit: string
  roundWarmUp: string
}

const en: Dict = {
  appName: 'Cue Timer',
  tagline:
    'Three short pips count you into every change, then one long tone marks it. You never need to look at the screen.',
  navRun: 'Run',
  navPrograms: 'Programs',
  navCues: 'Cue key',

  ready: 'Ready when you are',
  start: 'Start',
  pause: 'Pause',
  resume: 'Resume',
  reset: 'Reset',
  sessionComplete: 'Session complete',
  roundOf: (round, total) => `Round ${round} of ${total}`,
  leftInSession: (clock) => `${clock} left in the session`,
  upNext: (name) => `Next: ${name}`,
  nothingNext: 'Last block',
  labelNow: 'Now',
  labelNext: 'Next',
  noteLabel: 'Instruction / easier variant',
  countdownPips: 'countdown pips',
  countingDown: 'counting down',
  getReady: 'Get ready',
  interrupted:
    'The audio was interrupted, so the timer is paused here. Press resume to carry on.',
  keepScreenOn: 'Keep this screen on — the sound stops if the phone locks.',
  speakNames: 'Say the block name out loud',
  totalLength: (clock) => `${clock} total`,

  cuesTitle: 'The cues',
  cuesIntro:
    'Every change is announced by sound before it happens. The pitch tells you what changed, so you can keep your eyes off the screen.',
  cuePips: 'Three short pips',
  cuePipsMeaning: 'Three, two, one — get into position, a change is coming',
  cueWork: 'One long high tone',
  cueWorkMeaning: 'Start exercising now',
  cueRest: 'One long low tone',
  cueRestMeaning: 'Stop — your break starts now',
  cueDone: 'One rising tone',
  cueDoneMeaning: 'The session is finished',
  play: 'Play',
  cuesNote:
    'Worth playing these once at the top of a video so everyone knows the code before they start.',

  programsTitle: 'Programs',
  programsIntro: 'Pick a session, or build one from named blocks.',
  use: 'Use',
  duplicate: 'Duplicate',
  edit: 'Edit',
  del: 'Delete',
  share: 'Copy share link',
  linkCopied: 'Link copied — anyone opening it gets this program.',
  copyFailed: 'Could not copy automatically. The link is in the address bar.',
  newProgram: 'New program',
  programName: 'Program name',
  prepSeconds: 'Get ready (sec)',
  repeatRounds: 'Repeat the circuit',
  addRound: 'Add a round',
  addBlock: 'Add a block',
  blockName: 'Block name',
  seconds: 'Seconds',
  kind: 'Type',
  kindWork: 'Exercise',
  kindRest: 'Break',
  save: 'Save',
  cancel: 'Cancel',
  removeRound: 'Remove round',
  removeBlock: 'Remove block',
  roundLabel: (n) => `Round ${n}`,
  importedProgram: 'Program loaded from a shared link.',
  deleteConfirm: (name) => `Delete “${name}”?`,

  exportTitle: 'For video production',
  exportIntro:
    'A silent audio file with only the cues on it, to sit under your footage on an editing timeline.',
  exportButton: 'Download the cue track as WAV',
  exportRendering: 'Rendering…',
  exportSaved: (clock) => `Saved — ${clock} of audio.`,
  exportFailed: 'The render failed here. Try again in a normal browser tab.',
  leadInLabel: 'Add 2 seconds of silence before the first tone',

  exampleSimple: 'Simple intervals',
  exampleCircuit: 'Blood pressure circuit',
  exampleChair: 'Chair-based warm-up',
  blockMarching: 'Marching on the spot',
  blockWallSit: 'Wall sit',
  blockChestOpener: 'Chest opener',
  blockBreak: 'Break',
  blockExercise: 'Exercise',
  blockSitToStand: 'Sit to stand',
  blockArmCircles: 'Arm circles',
  blockAnkleRaises: 'Ankle raises',
  roundCircuit: 'Circuit',
  roundWarmUp: 'Warm-up',
}

const es: Dict = {
  appName: 'Cue Timer',
  tagline:
    'Tres pitidos cortos te cuentan cada cambio y un tono largo lo marca. No hace falta mirar la pantalla.',
  navRun: 'Sesión',
  navPrograms: 'Programas',
  navCues: 'Guía de señales',

  ready: 'Cuando quieras',
  start: 'Empezar',
  pause: 'Pausa',
  resume: 'Continuar',
  reset: 'Reiniciar',
  sessionComplete: 'Sesión terminada',
  roundOf: (round, total) => `Ronda ${round} de ${total}`,
  leftInSession: (clock) => `Quedan ${clock} de sesión`,
  upNext: (name) => `Siguiente: ${name}`,
  nothingNext: 'Último bloque',
  labelNow: 'Ahora',
  labelNext: 'Siguiente',
  noteLabel: 'Indicación / variante fácil',
  countdownPips: 'pitidos de cuenta atrás',
  countingDown: 'contando atrás',
  getReady: 'Prepárate',
  interrupted:
    'El audio se interrumpió, así que el temporizador está en pausa aquí. Pulsa continuar para seguir.',
  keepScreenOn: 'Mantén la pantalla encendida — el sonido se para si el móvil se bloquea.',
  speakNames: 'Decir el nombre del bloque en voz alta',
  totalLength: (clock) => `${clock} en total`,

  cuesTitle: 'Las señales',
  cuesIntro:
    'Cada cambio se anuncia con sonido antes de ocurrir. El tono te dice qué ha cambiado, así no necesitas mirar la pantalla.',
  cuePips: 'Tres pitidos cortos',
  cuePipsMeaning: 'Tres, dos, uno — colócate, viene un cambio',
  cueWork: 'Un tono largo agudo',
  cueWorkMeaning: 'Empieza a hacer ejercicio ahora',
  cueRest: 'Un tono largo grave',
  cueRestMeaning: 'Para — empieza tu descanso',
  cueDone: 'Un tono ascendente',
  cueDoneMeaning: 'La sesión ha terminado',
  play: 'Escuchar',
  cuesNote:
    'Conviene reproducirlas al principio de un vídeo para que todos conozcan el código antes de empezar.',

  programsTitle: 'Programas',
  programsIntro: 'Elige una sesión o crea una con bloques con nombre.',
  use: 'Usar',
  duplicate: 'Duplicar',
  edit: 'Editar',
  del: 'Eliminar',
  share: 'Copiar enlace',
  linkCopied: 'Enlace copiado — quien lo abra tendrá este programa.',
  copyFailed: 'No se pudo copiar automáticamente. El enlace está en la barra de direcciones.',
  newProgram: 'Programa nuevo',
  programName: 'Nombre del programa',
  prepSeconds: 'Preparación (seg)',
  repeatRounds: 'Repetir el circuito',
  addRound: 'Añadir ronda',
  addBlock: 'Añadir bloque',
  blockName: 'Nombre del bloque',
  seconds: 'Segundos',
  kind: 'Tipo',
  kindWork: 'Ejercicio',
  kindRest: 'Descanso',
  save: 'Guardar',
  cancel: 'Cancelar',
  removeRound: 'Quitar ronda',
  removeBlock: 'Quitar bloque',
  roundLabel: (n) => `Ronda ${n}`,
  importedProgram: 'Programa cargado desde un enlace compartido.',
  deleteConfirm: (name) => `¿Eliminar «${name}»?`,

  exportTitle: 'Para producción de vídeo',
  exportIntro:
    'Un archivo de audio silencioso con solo las señales, para colocar bajo tus imágenes en la línea de tiempo de edición.',
  exportButton: 'Descargar la pista de señales en WAV',
  exportRendering: 'Renderizando…',
  exportSaved: (clock) => `Guardado — ${clock} de audio.`,
  exportFailed: 'El renderizado falló aquí. Inténtalo en una pestaña normal del navegador.',
  leadInLabel: 'Añadir 2 segundos de silencio antes del primer tono',

  exampleSimple: 'Intervalos simples',
  exampleCircuit: 'Circuito para la tensión',
  exampleChair: 'Calentamiento en silla',
  blockMarching: 'Marcha en el sitio',
  blockWallSit: 'Sentadilla isométrica en pared',
  blockChestOpener: 'Apertura de pecho',
  blockBreak: 'Descanso',
  blockExercise: 'Ejercicio',
  blockSitToStand: 'Levantarse y sentarse',
  blockArmCircles: 'Círculos de brazos',
  blockAnkleRaises: 'Elevación de talones',
  roundCircuit: 'Circuito',
  roundWarmUp: 'Calentamiento',
}

const hu: Dict = {
  appName: 'Cue Timer',
  tagline:
    'Három rövid csipogás számol be minden váltást, majd egy hosszú hang jelzi. Nem kell a képernyőt nézned.',
  navRun: 'Edzés',
  navPrograms: 'Programok',
  navCues: 'Hangjelzések',

  ready: 'Kezdheted, amikor készen állsz',
  start: 'Indítás',
  pause: 'Szünet',
  resume: 'Folytatás',
  reset: 'Alaphelyzet',
  sessionComplete: 'Az edzés véget ért',
  roundOf: (round, total) => `${round}. kör a ${total}-ből`,
  leftInSession: (clock) => `Még ${clock} van hátra`,
  upNext: (name) => `Következik: ${name}`,
  nothingNext: 'Utolsó blokk',
  labelNow: 'Most',
  labelNext: 'Következik',
  noteLabel: 'Jelzés / könnyített változat',
  countdownPips: 'visszaszámláló csipogások',
  countingDown: 'visszaszámlálás',
  getReady: 'Készülj',
  interrupted:
    'A hang megszakadt, ezért az időzítő itt megállt. Nyomd meg a folytatást.',
  keepScreenOn: 'Hagyd bekapcsolva a képernyőt — a hang leáll, ha a telefon lezár.',
  speakNames: 'Mondja ki a blokk nevét',
  totalLength: (clock) => `Összesen ${clock}`,

  cuesTitle: 'A hangjelzések',
  cuesIntro:
    'Minden váltást hang jelez, mielőtt bekövetkezne. A hangmagasság mondja meg, mi változott, így nem kell a képernyőt figyelned.',
  cuePips: 'Három rövid csipogás',
  cuePipsMeaning: 'Három, kettő, egy — vedd fel a pozíciót, jön a váltás',
  cueWork: 'Egy hosszú magas hang',
  cueWorkMeaning: 'Kezdd el a gyakorlatot',
  cueRest: 'Egy hosszú mély hang',
  cueRestMeaning: 'Állj meg — most jön a pihenő',
  cueDone: 'Egy emelkedő hang',
  cueDoneMeaning: 'Az edzés befejeződött',
  play: 'Lejátszás',
  cuesNote:
    'Érdemes ezeket egyszer lejátszani a videó elején, hogy mindenki ismerje a jelzéseket.',

  programsTitle: 'Programok',
  programsIntro: 'Válassz egy edzést, vagy állíts össze egyet elnevezett blokkokból.',
  use: 'Használom',
  duplicate: 'Másolat',
  edit: 'Szerkesztés',
  del: 'Törlés',
  share: 'Megosztó link másolása',
  linkCopied: 'Link másolva — aki megnyitja, megkapja ezt a programot.',
  copyFailed: 'Nem sikerült automatikusan másolni. A link a címsorban van.',
  newProgram: 'Új program',
  programName: 'Program neve',
  prepSeconds: 'Felkészülés (mp)',
  repeatRounds: 'A kör ismétlése',
  addRound: 'Kör hozzáadása',
  addBlock: 'Blokk hozzáadása',
  blockName: 'Blokk neve',
  seconds: 'Másodperc',
  kind: 'Típus',
  kindWork: 'Gyakorlat',
  kindRest: 'Pihenő',
  save: 'Mentés',
  cancel: 'Mégse',
  removeRound: 'Kör eltávolítása',
  removeBlock: 'Blokk eltávolítása',
  roundLabel: (n) => `${n}. kör`,
  importedProgram: 'A program megosztott linkről töltődött be.',
  deleteConfirm: (name) => `Törlöd ezt: „${name}”?`,

  exportTitle: 'Videókészítéshez',
  exportIntro:
    'Néma hangfájl, amelyen csak a jelzések hallhatók — a vágóidővonalon a felvétel alá helyezhető.',
  exportButton: 'Hangsáv letöltése WAV-ban',
  exportRendering: 'Renderelés…',
  exportSaved: (clock) => `Mentve — ${clock} hanganyag.`,
  exportFailed: 'A renderelés nem sikerült. Próbáld meg egy normál böngészőfülön.',
  leadInLabel: '2 másodperc csend az első hang előtt',

  exampleSimple: 'Egyszerű intervallumok',
  exampleCircuit: 'Vérnyomáscsökkentő kör',
  exampleChair: 'Széken végezhető bemelegítés',
  blockMarching: 'Helyben járás',
  blockWallSit: 'Fali ülés',
  blockChestOpener: 'Mellkasnyitás',
  blockBreak: 'Pihenő',
  blockExercise: 'Gyakorlat',
  blockSitToStand: 'Felállás és leülés',
  blockArmCircles: 'Karkörzés',
  blockAnkleRaises: 'Lábujjhegyre emelkedés',
  roundCircuit: 'Kör',
  roundWarmUp: 'Bemelegítés',
}

export const dictionaries: Record<Lang, Dict> = { en, es, hu }

export function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'en'
  for (const tag of navigator.languages ?? [navigator.language]) {
    const code = tag.slice(0, 2).toLowerCase()
    if (code === 'hu' || code === 'es' || code === 'en') return code
  }
  return 'en'
}

export function speechTag(lang: Lang): string {
  return LANGS.find((l) => l.code === lang)?.speech ?? 'en-GB'
}
