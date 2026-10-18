import { formatPhotoDateTime } from '@imanity/tabi-gallery'
import type { Photo } from '@imanity/tabi-gallery'

export type PhotoSortOrder = 'random' | 'taken-at-asc' | 'taken-at-desc'

export function createRandomPhotoRanks(photos: Photo[]) {
  const ids = photos.map((photo) => photo.id)

  for (let index = ids.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    const currentId = ids[index]
    ids[index] = ids[target]
    ids[target] = currentId
  }

  return new Map(ids.map((id, index) => [id, index]))
}

function getTakenAtTimestamp(photo: Photo) {
  const formatted = formatPhotoDateTime(photo.takenAt, 'en-CA')

  if (!formatted) {
    return null
  }

  const timestamp = new Date(formatted.dateTime).getTime()
  return Number.isNaN(timestamp) ? null : timestamp
}

function compareRandomRank(
  left: Photo,
  right: Photo,
  randomRanks: ReadonlyMap<string, number>,
) {
  const difference =
    (randomRanks.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
    (randomRanks.get(right.id) ?? Number.MAX_SAFE_INTEGER)

  return difference || left.id.localeCompare(right.id)
}

export function sortPhotos(
  photos: Photo[],
  order: PhotoSortOrder,
  randomRanks: ReadonlyMap<string, number>,
) {
  return [...photos].sort((left, right) => {
    if (order === 'random') {
      return compareRandomRank(left, right, randomRanks)
    }

    const leftTimestamp = getTakenAtTimestamp(left)
    const rightTimestamp = getTakenAtTimestamp(right)

    if (leftTimestamp === null && rightTimestamp === null) {
      return compareRandomRank(left, right, randomRanks)
    }

    if (leftTimestamp === null) {
      return 1
    }

    if (rightTimestamp === null) {
      return -1
    }

    const difference =
      order === 'taken-at-asc'
        ? leftTimestamp - rightTimestamp
        : rightTimestamp - leftTimestamp

    return difference || compareRandomRank(left, right, randomRanks)
  })
}
