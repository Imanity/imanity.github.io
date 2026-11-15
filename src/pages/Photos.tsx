import { useMemo, useState } from 'react'
import {
  PhotoMapFilter,
  PhotoMasonry,
  PhotoTagFilter,
  usePhotoSearch,
} from '@imanity/tabi-gallery'
import { PageHeader } from '../components/ui/PageHeader'
import { useGallery } from '../gallery/GalleryProvider'
import { getGalleryStats } from '../gallery/galleryStats'
import {
  createRandomPhotoRanks,
  sortPhotos,
  type PhotoSortOrder,
} from '../gallery/sortPhotos'

const sortOptions: Array<{ value: PhotoSortOrder; label: string }> = [
  { value: 'random', label: '随机' },
  { value: 'taken-at-desc', label: '最新' },
  { value: 'taken-at-asc', label: '最早' },
]

export function Photos() {
  const { error, loading, photos, reload } = useGallery()
  const [sortOrder, setSortOrder] = useState<PhotoSortOrder>('random')
  const requestedTags = [
    ...new Set(
      new URLSearchParams(window.location.search)
        .getAll('tag')
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ]
  const {
    clearMapSelection,
    clearSearch,
    clearTags,
    facets,
    results,
    search,
    selectMapPhotos,
    toggleTag,
  } = usePhotoSearch(photos, { selectedTags: requestedTags })
  const randomRanks = useMemo(() => createRandomPhotoRanks(photos), [photos])
  const sortedResults = useMemo(
    () => sortPhotos(results, sortOrder, randomRanks),
    [randomRanks, results, sortOrder],
  )
  const stats = useMemo(() => getGalleryStats(photos), [photos])
  const hasFilters =
    search.selectedTags.length > 0 || search.selectedPhotoIds.length > 0
  const description =
    !loading && !error && stats.photoCount > 0
      ? `${stats.photoCount} 张照片，拍摄于 ${stats.placeCount} 个地点${
          stats.countries.length > 0 ? `，足迹遍及${stats.countries.join('、')}` : ''
        }。可以在地图上点选地点，或按标签筛选。`
      : undefined

  return (
    <section className="page-stack photos-page">
      <PageHeader description={description} eyebrow="Photographs" title="照片" />

      {loading ? <p className="gallery-load-state">正在加载照片……</p> : null}
      {error ? (
        <div className="gallery-load-state gallery-load-error" role="alert">
          <p>照片配置加载失败：{error}</p>
          <button className="button button-ghost" onClick={reload} type="button">
            重新加载
          </button>
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="photo-browser">
          <div className="photo-results">
            <header className="photo-results-heading">
              <p>
                <strong>{results.length}</strong>
                <span>/ {photos.length} 张照片</span>
              </p>
              <div className="photo-results-controls">
                {hasFilters ? (
                  <button className="text-button" onClick={clearSearch} type="button">
                    清除全部筛选
                  </button>
                ) : null}
                <div aria-label="照片排序" className="segmented" role="group">
                  {sortOptions.map((option) => (
                    <button
                      aria-pressed={sortOrder === option.value}
                      key={option.value}
                      onClick={() => setSortOrder(option.value)}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            <PhotoMasonry
              getPhotoHref={(photo) => `/photos/${encodeURIComponent(photo.id)}`}
              photos={sortedResults}
            />
          </div>

          <aside className="photo-sidebar" aria-label="照片筛选">
            <PhotoMapFilter
              onClear={clearMapSelection}
              onSelectPhotos={selectMapPhotos}
              photos={photos}
              selectedPhotoIds={search.selectedPhotoIds}
              title="地点"
            />
            <PhotoTagFilter
              onClear={clearTags}
              onToggle={toggleTag}
              selectedTags={search.selectedTags}
              tags={facets.tags}
              title="标签"
            />
          </aside>
        </div>
      ) : null}
    </section>
  )
}
