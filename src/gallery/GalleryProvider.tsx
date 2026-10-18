import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Photo } from '@imanity/tabi-gallery'

type GalleryManifestEntry = {
  id: string
  title: string
  config: string
}

type GalleryManifest = {
  taxonomy: string
  galleries: GalleryManifestEntry[]
}

type TaxonomyItem = {
  id: string
  labels: Record<string, string>
  aliases: string[]
}

type GalleryTaxonomy = {
  defaultLocale: string
  locales: string[]
  tags: TaxonomyItem[]
  countries: TaxonomyItem[]
}

export type LoadedGallery = {
  id: string
  title: string
  photos: Photo[]
}

type GalleryContextValue = {
  error: string | null
  galleries: LoadedGallery[]
  loading: boolean
  photos: Photo[]
  reload: () => void
}

const GalleryContext = createContext<GalleryContextValue | null>(null)

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function requireString(value: unknown, label: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} must be a non-empty string.`)
  }

  return value
}

function parseManifest(value: unknown): GalleryManifest {
  if (!isRecord(value) || !Array.isArray(value.galleries)) {
    throw new Error('Gallery manifest must contain a galleries array.')
  }

  return {
    taxonomy:
      typeof value.taxonomy === 'string' && value.taxonomy
        ? value.taxonomy
        : '/data/gallery-taxonomy.json',
    galleries: value.galleries.map((entry, index) => {
      if (!isRecord(entry)) {
        throw new Error(`Gallery manifest entry ${index + 1} is invalid.`)
      }

      return {
        id: requireString(entry.id, `Gallery ${index + 1} id`),
        title: requireString(entry.title, `Gallery ${index + 1} title`),
        config: requireString(entry.config, `Gallery ${index + 1} config`),
      }
    }),
  }
}

function parseLabels(value: unknown, label: string) {
  if (!isRecord(value)) {
    throw new Error(`${label} labels must be an object.`)
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
      .map(([locale, translation]) => [locale, translation.trim()])
      .filter(([, translation]) => translation),
  )
}

function parseTaxonomyItems(value: unknown, kind: string): TaxonomyItem[] {
  if (!Array.isArray(value)) {
    throw new Error(`Gallery taxonomy ${kind} must be an array.`)
  }

  const ids = new Set<string>()

  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`${kind} taxonomy item ${index + 1} is invalid.`)
    }

    const id = requireString(item.id, `${kind} taxonomy item ${index + 1} id`)

    if (ids.has(id)) {
      throw new Error(`Duplicate ${kind} taxonomy ID: ${id}.`)
    }

    ids.add(id)
    return {
      id,
      labels: parseLabels(item.labels, `${kind} ${id}`),
      aliases: Array.isArray(item.aliases)
        ? item.aliases.filter((alias): alias is string => typeof alias === 'string')
        : [],
    }
  })
}

function parseTaxonomy(value: unknown): GalleryTaxonomy {
  if (!isRecord(value)) {
    throw new Error('Gallery taxonomy must be an object.')
  }

  const defaultLocale = requireString(value.defaultLocale, 'Taxonomy defaultLocale')
  const locales = Array.isArray(value.locales)
    ? value.locales.filter((locale): locale is string => typeof locale === 'string')
    : []

  if (!locales.includes(defaultLocale)) {
    locales.unshift(defaultLocale)
  }

  return {
    defaultLocale,
    locales: [...new Set(locales)],
    tags: parseTaxonomyItems(value.tags, 'tag'),
    countries: parseTaxonomyItems(value.countries, 'country'),
  }
}

function getPreferredLocale(taxonomy: GalleryTaxonomy) {
  const requested = document.documentElement.lang || navigator.language
  const exact = taxonomy.locales.find(
    (locale) => locale.toLocaleLowerCase() === requested.toLocaleLowerCase(),
  )

  if (exact) {
    return exact
  }

  const language = requested.split('-')[0].toLocaleLowerCase()
  return (
    taxonomy.locales.find(
      (locale) => locale.split('-')[0].toLocaleLowerCase() === language,
    ) || taxonomy.defaultLocale
  )
}

function findTaxonomyItem(items: TaxonomyItem[], value: string) {
  const normalizedValue = value.trim().toLocaleLowerCase()

  return items.find(
    (item) =>
      item.id.toLocaleLowerCase() === normalizedValue ||
      Object.values(item.labels).some(
        (label) => label.toLocaleLowerCase() === normalizedValue,
      ) ||
      item.aliases.some((alias) => alias.toLocaleLowerCase() === normalizedValue),
  )
}

function localizeTaxonomyValue(
  items: TaxonomyItem[],
  value: string,
  locale: string,
  fallbackLocale: string,
) {
  const item = findTaxonomyItem(items, value)

  if (!item) {
    return value
  }

  return (
    item.labels[locale] ||
    item.labels[fallbackLocale] ||
    Object.values(item.labels).find(Boolean) ||
    item.id
  )
}

function parsePhoto(
  value: unknown,
  galleryId: string,
  index: number,
  taxonomy: GalleryTaxonomy,
  locale: string,
): Photo {
  if (!isRecord(value) || !isRecord(value.image)) {
    throw new Error(`Photo ${index + 1} in ${galleryId} is invalid.`)
  }

  const tags = Array.isArray(value.tags)
    ? [
        ...new Set(
          value.tags
            .filter((tag): tag is string => typeof tag === 'string')
            .map((tag) =>
              localizeTaxonomyValue(
                [...taxonomy.tags, ...taxonomy.countries],
                tag,
                locale,
                taxonomy.defaultLocale,
              ),
            ),
        ),
      ]
    : []
  const location = isRecord(value.location)
    ? {
        label: requireString(value.location.label, `Photo ${index + 1} location label`),
        latitude: Number(value.location.latitude),
        longitude: Number(value.location.longitude),
        country:
          typeof value.location.country === 'string'
            ? localizeTaxonomyValue(
                taxonomy.countries,
                value.location.country,
                locale,
                taxonomy.defaultLocale,
              )
            : undefined,
        region: typeof value.location.region === 'string' ? value.location.region : undefined,
      }
    : undefined
  const photo: Photo = {
    id: requireString(value.id, `Photo ${index + 1} id`),
    title: requireString(value.title, `Photo ${index + 1} title`),
    description: typeof value.description === 'string' ? value.description : '',
    takenAt: typeof value.takenAt === 'string' ? value.takenAt : undefined,
    tags,
    location,
    sourceHash: typeof value.sourceHash === 'string' ? value.sourceHash : undefined,
    image: {
      src: requireString(value.image.src, `Photo ${index + 1} image src`),
      srcSet: typeof value.image.srcSet === 'string' ? value.image.srcSet : undefined,
      width: Number(value.image.width),
      height: Number(value.image.height),
      alt:
        typeof value.image.alt === 'string' && value.image.alt
          ? value.image.alt
          : requireString(value.title, `Photo ${index + 1} title`),
    },
  }

  if (
    !Number.isFinite(photo.image.width) ||
    !Number.isFinite(photo.image.height) ||
    photo.image.width < 0 ||
    photo.image.height < 0
  ) {
    throw new Error(`Photo ${index + 1} in ${galleryId} has invalid image dimensions.`)
  }

  if (
    photo.location &&
    (!Number.isFinite(photo.location.latitude) || !Number.isFinite(photo.location.longitude))
  ) {
    throw new Error(`Photo ${index + 1} in ${galleryId} has invalid coordinates.`)
  }

  return photo
}

function parseGallery(
  value: unknown,
  manifestEntry: GalleryManifestEntry,
  taxonomy: GalleryTaxonomy,
  locale: string,
): LoadedGallery {
  if (!isRecord(value) || !Array.isArray(value.photos)) {
    throw new Error(`Gallery config ${manifestEntry.id} must contain a photos array.`)
  }

  const id = requireString(value.id, `${manifestEntry.id} gallery id`)

  if (id !== manifestEntry.id) {
    throw new Error(`Gallery ID mismatch: manifest has ${manifestEntry.id}, config has ${id}.`)
  }

  return {
    id,
    title:
      typeof value.title === 'string' && value.title.trim()
        ? value.title
        : manifestEntry.title,
    photos: value.photos.map((photo, index) =>
      parsePhoto(photo, id, index, taxonomy, locale),
    ),
  }
}

function getPublicUrl(source: string, manifestUrl: string) {
  if (/^https?:\/\//i.test(source)) {
    return source
  }

  if (source.startsWith('/')) {
    return `${import.meta.env.BASE_URL}${source.replace(/^\/+/, '')}`
  }

  return new URL(source, new URL(manifestUrl, window.location.origin)).toString()
}

async function fetchJson(url: string, signal: AbortSignal) {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`Failed to load ${url} (${response.status}).`)
  }

  return response.json() as Promise<unknown>
}

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [galleries, setGalleries] = useState<LoadedGallery[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadVersion, setReloadVersion] = useState(0)

  const reload = useCallback(() => setReloadVersion((version) => version + 1), [])

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const manifestUrl = `${import.meta.env.BASE_URL}data/galleries/index.json`
        const manifest = parseManifest(await fetchJson(manifestUrl, controller.signal))
        const taxonomyUrl = getPublicUrl(manifest.taxonomy, manifestUrl)
        const taxonomy = parseTaxonomy(await fetchJson(taxonomyUrl, controller.signal))
        const locale = getPreferredLocale(taxonomy)
        const loaded = await Promise.all(
          manifest.galleries.map(async (entry) => {
            const configUrl = getPublicUrl(entry.config, manifestUrl)
            return parseGallery(
              await fetchJson(configUrl, controller.signal),
              entry,
              taxonomy,
              locale,
            )
          }),
        )
        const photoIds = new Set<string>()

        for (const gallery of loaded) {
          for (const photo of gallery.photos) {
            if (photoIds.has(photo.id)) {
              throw new Error(`Duplicate photo ID across galleries: ${photo.id}.`)
            }
            photoIds.add(photo.id)
          }
        }

        setGalleries(loaded)
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setGalleries([])
          setError(loadError instanceof Error ? loadError.message : String(loadError))
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void load()
    return () => controller.abort()
  }, [reloadVersion])

  const photos = useMemo(() => galleries.flatMap((gallery) => gallery.photos), [galleries])
  const value = useMemo(
    () => ({ error, galleries, loading, photos, reload }),
    [error, galleries, loading, photos, reload],
  )

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}

export function useGallery() {
  const context = useContext(GalleryContext)

  if (!context) {
    throw new Error('useGallery must be used inside GalleryProvider.')
  }

  return context
}
