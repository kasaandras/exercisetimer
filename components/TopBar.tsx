'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LANGS, type Lang } from '@/lib/i18n'
import { useSettings } from './Providers'

export function TopBar() {
  const { t, lang, setLang } = useSettings()
  const pathname = usePathname()
  const here = (href: string) =>
    (href === '/' ? pathname === '/' : pathname.startsWith(href)) ? 'page' : undefined

  return (
    <header className="topbar">
      <nav aria-label={t.appName}>
        <Link href="/" aria-current={here('/')}>{t.navRun}</Link>
        <Link href="/programs" aria-current={here('/programs')}>{t.navPrograms}</Link>
        <Link href="/cues" aria-current={here('/cues')}>{t.navCues}</Link>
      </nav>
      <label className="visually-hidden" htmlFor="lang">Language</label>
      <select id="lang" value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </header>
  )
}
