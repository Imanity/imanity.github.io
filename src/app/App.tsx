import { useEffect, useMemo, useState } from 'react'
import { SiteLayout } from '../components/layout/SiteLayout'
import { notFoundRoute, routes } from './routes'

const getPath = () => window.location.pathname || '/'

export function App() {
  const [path, setPath] = useState(getPath)

  useEffect(() => {
    const handlePopState = () => setPath(getPath())

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const activeRoute = useMemo(
    () => routes.find((route) => route.path === path) ?? notFoundRoute,
    [path],
  )

  const navigate = (nextPath: string) => {
    if (nextPath === path) {
      return
    }

    window.history.pushState(null, '', nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setPath(nextPath)
  }

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const target = event.target

      if (!(target instanceof Element)) {
        return
      }

      const link = target.closest('a')
      const href = link?.getAttribute('href')

      if (!link || !href || link.target || link.hasAttribute('download')) {
        return
      }

      const url = new URL(href, window.location.href)

      if (
        url.origin !== window.location.origin ||
        !routes.some((route) => route.path === url.pathname)
      ) {
        return
      }

      event.preventDefault()
      navigate(url.pathname)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [path])

  useEffect(() => {
    document.title =
      activeRoute.path === '/' ? "RJ's Page" : `${activeRoute.title} | RJ's Page`
  }, [activeRoute])

  const Page = activeRoute.component

  return (
    <SiteLayout activePath={activeRoute.path} onNavigate={navigate}>
      <Page />
    </SiteLayout>
  )
}
