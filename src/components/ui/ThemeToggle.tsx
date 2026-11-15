import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

function getEffectiveTheme(): Theme {
  const explicit = document.documentElement.dataset.theme

  if (explicit === 'light' || explicit === 'dark') {
    return explicit
  }

  return darkQuery().matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getEffectiveTheme)

  useEffect(() => {
    const query = darkQuery()
    const handleChange = () => setTheme(getEffectiveTheme())

    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'

    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage can be unavailable (private mode); the choice still applies to this visit.
    }
    setTheme(next)
  }

  const label = theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'

  return (
    <button aria-label={label} className="icon-button" onClick={toggle} title={label} type="button">
      {theme === 'dark' ? (
        <Sun aria-hidden="true" size={17} strokeWidth={1.8} />
      ) : (
        <Moon aria-hidden="true" size={17} strokeWidth={1.8} />
      )}
    </button>
  )
}
