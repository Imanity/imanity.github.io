import { createPhotoRandomValues, formatPhotoDateTime, rankPhotosByScore, sortPhotosByScore } from '@imanity/tabi-gallery'
import type { Photo } from '@imanity/tabi-gallery'

export type PhotoSortOrder = 'default' | 'score-desc' | 'random' | 'taken-at-asc' | 'taken-at-desc'

export function createRandomPhotoRanks(photos: Photo[], seed = getPhotoSortSeed()) {
  const values = createPhotoRandomValues(photos, seed)
  const ids = photos.map(photo => photo.id).sort((left, right) => values.get(left)! - values.get(right)!)
  return new Map(ids.map((id, index) => [id, index]))
}

export function createDefaultPhotoRanks(photos: Photo[], seed: string) {
  return new Map(rankPhotosByScore(photos, createPhotoRandomValues(photos, seed))
    .map((photo, index) => [photo.id, index]))
}

export function getPhotoSortSeed() {
  try {
    const saved = sessionStorage.getItem('gallery:sort-seed')
    if (saved) return saved
  } catch { /* Storage can be unavailable in private browsing. */ }
  return renewPhotoSortSeed()
}

export function renewPhotoSortSeed() {
  const seed = Math.random().toString(36).slice(2) + Date.now().toString(36)
  try { sessionStorage.setItem('gallery:sort-seed', seed) } catch { /* Keep an in-memory seed. */ }
  return seed
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
  defaultRanks: ReadonlyMap<string, number> = randomRanks,
) {
  if (order === 'score-desc') return sortPhotosByScore(photos)
  return [...photos].sort((left, right) => {
    if (order === 'default') return compareRandomRank(left, right, defaultRanks)
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
