'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { detectLang, dictionaries, type Dict, type Lang } from '@/lib/i18n'

const LANG_KEY = 'cue-timer.lang'
const SPEAK_KEY = 'cue-timer.speak'

type Settings = {
  lang: Lang
  setLang: (lang: Lang) => void
  speak: boolean
  setSpeak: (speak: boolean) => void
  t: Dict
}

const SettingsContext = createContext<Settings | null>(null)

export function Providers({ children }: { children: ReactNode }) {
  // Start from a fixed language so the server-rendered markup and the first
  // client render agree; the stored preference is applied straight after.
  const [lang, setLangState] = useState<Lang>('en')
  const [speak, setSpeakState] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANG_KEY)
      setLangState(stored === 'en' || stored === 'es' || stored === 'hu' ? stored : detectLang())
      setSpeakState(window.localStorage.getItem(SPEAK_KEY) === '1')
    } catch {
      setLangState(detectLang())
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) document.documentElement.lang = lang
  }, [lang, ready])

  const value = useMemo<Settings>(
    () => ({
      lang,
      setLang: (next) => {
        setLangState(next)
        try {
          window.localStorage.setItem(LANG_KEY, next)
        } catch {
          // Preference simply will not persist.
        }
      },
      speak,
      setSpeak: (next) => {
        setSpeakState(next)
        try {
          window.localStorage.setItem(SPEAK_KEY, next ? '1' : '0')
        } catch {
          // As above.
        }
      },
      t: dictionaries[lang],
    }),
    [lang, speak],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): Settings {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside Providers')
  return ctx
}
