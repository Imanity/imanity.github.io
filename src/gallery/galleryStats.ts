import type { Photo } from '@imanity/tabi-gallery'
import type { LoadedGallery } from './GalleryProvider'

export type GalleryStats = {
  photoCount: number
  placeCount: number
  countries: string[]
  albumCount: number
}

export function getGalleryStats(photos: Photo[], galleries: LoadedGallery[] = []): GalleryStats {
  const places = new Set<string>()
  const countries = new Set<string>()

  for (const photo of photos) {
    if (photo.location?.label) {
      places.add(photo.location.label)
    }
    if (photo.location?.country) {
      countries.add(photo.location.country)
    }
  }

  return {
    photoCount: photos.length,
    placeCount: places.size,
    countries: [...countries],
    albumCount: galleries.filter((gallery) => gallery.photos.length > 0).length,
  }
}
