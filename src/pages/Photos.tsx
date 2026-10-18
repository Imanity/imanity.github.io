import {
  PhotoMapFilter,
  PhotoMasonry,
  PhotoTagFilter,
  usePhotoSearch,
} from '@imanity/tabi-gallery'
import { PageHeader } from '../components/ui/PageHeader'
import { useGallery } from '../gallery/GalleryProvider'

export function Photos() {
  const { error, loading, photos, reload } = useGallery()
  const {
    clearLocations,
    clearSearch,
    clearTags,
    facets,
    results,
    search,
    toggleLocation,
    toggleTag,
  } = usePhotoSearch(photos)
  const hasFilters =
    search.selectedTags.length > 0 || search.selectedLocations.length > 0

  return (
    <section className="page-stack photos-page">
      <PageHeader eyebrow="Photos" title="照片" />

      {loading ? <p className="gallery-load-state">正在加载照片……</p> : null}
      {error ? (
        <div className="gallery-load-state gallery-load-error" role="alert">
          <p>照片配置加载失败：{error}</p>
          <button onClick={reload} type="button">
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
                <span> / {photos.length} 张照片</span>
              </p>
              {hasFilters ? (
                <button onClick={clearSearch} type="button">
                  清除全部筛选
                </button>
              ) : null}
            </header>

            <PhotoMasonry
              getPhotoHref={(photo) => `/photos/${encodeURIComponent(photo.id)}`}
              photos={results}
            />
          </div>

          <aside className="photo-sidebar" aria-label="照片筛选">
            <PhotoTagFilter
              onClear={clearTags}
              onToggle={toggleTag}
              selectedTags={search.selectedTags}
              tags={facets.tags}
            />
            <PhotoMapFilter
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              onClear={clearLocations}
              onToggleLocation={toggleLocation}
              photos={photos}
              selectedLocations={search.selectedLocations}
            />
          </aside>
        </div>
      ) : null}
    </section>
  )
}
