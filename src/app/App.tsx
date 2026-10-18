import { useEffect, useMemo, useState } from 'react'
import { SiteLayout } from '../components/layout/SiteLayout'
import { useGallery } from '../gallery/GalleryProvider'
import {
  getPhotoIdFromPath,
  photoDetailRoute,
  resolveRoute,
} from './routes'

const getLocationKey = () =>
  `${window.location.pathname || '/'}${window.location.search}${window.location.hash}`

export function App() {
  const { photos } = useGallery()
  const [locationKey, setLocationKey] = useState(getLocationKey)
  const path = useMemo(
    () => new URL(locationKey, window.location.origin).pathname,
    [locationKey],
  )

  useEffect(() => {
    const handlePopState = () => setLocationKey(getLocationKey())

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const activeRoute = useMemo(() => resolveRoute(path), [path])

  const navigate = (nextLocation: string) => {
    if (nextLocation === locationKey) {
      return
    }

    window.history.pushState(null, '', nextLocation)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setLocationKey(nextLocation)
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
        resolveRoute(url.pathname).path === '*'
      ) {
        return
      }

      event.preventDefault()
      navigate(`${url.pathname}${url.search}${url.hash}`)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [locationKey])

  useEffect(() => {
    const photoId = getPhotoIdFromPath(path)
    const photo = photoId ? photos.find((item) => item.id === photoId) : null
    const title = photo?.title ?? activeRoute.title

    document.title = activeRoute.path === '/' ? "RJ's Page" : `${title} | RJ's Page`
  }, [activeRoute, path, photos])

  const Page = activeRoute.component

  return (
    <SiteLayout
      activePath={activeRoute.path === photoDetailRoute.path ? '/photos' : activeRoute.path}
      onNavigate={navigate}
    >
      <Page key={locationKey} />
    </SiteLayout>
  )
}
