import { PhotoDetail } from '@imanity/tabi-gallery'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getPhotoIdFromPath } from '../app/routes'
import { PageHeader } from '../components/ui/PageHeader'
import { useGallery } from '../gallery/GalleryProvider'

function getPhotoHref(id: string) {
  return `/photos/${encodeURIComponent(id)}`
}

export function PhotoDetailPage() {
  const { error, loading, photos, reload } = useGallery()
  const photoId = getPhotoIdFromPath(window.location.pathname)
  const photoIndex = photos.findIndex((photo) => photo.id === photoId)
  const photo = photos[photoIndex]

  if (loading) {
    return <p className="gallery-load-state">正在加载照片……</p>
  }

  if (error) {
    return (
      <section className="page-stack">
        <PageHeader eyebrow="Unable to load" title="照片配置加载失败" description={error} />
        <button className="photo-back-link" onClick={reload} type="button">
          重新加载
        </button>
      </section>
    )
  }

  if (!photo) {
    return (
      <section className="page-stack">
        <PageHeader
          eyebrow="Photo not found"
          title="没有找到这张照片"
          description="照片可能已被移动或删除。"
        />
        <a className="photo-back-link" href="/photos">
          <ArrowLeft aria-hidden="true" size={18} />
          返回照片集
        </a>
      </section>
    )
  }

  const previousPhoto = photos[photoIndex - 1]
  const nextPhoto = photos[photoIndex + 1]

  return (
    <section className="photo-detail-page">
      <nav className="photo-detail-toolbar" aria-label="照片导航">
        <a className="photo-back-link" href="/photos">
          <ArrowLeft aria-hidden="true" size={18} />
          返回照片集
        </a>
        <span>
          {photoIndex + 1} / {photos.length}
        </span>
      </nav>

      <PhotoDetail
        getTagHref={(tag) => `/photos?tag=${encodeURIComponent(tag)}`}
        mapApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        photo={photo}
      />

      <nav className="photo-sequence" aria-label="上一张和下一张照片">
        {previousPhoto ? (
          <a className="photo-sequence-card" href={getPhotoHref(previousPhoto.id)}>
            <ArrowLeft aria-hidden="true" size={18} />
            <img
              alt=""
              height={previousPhoto.image.height}
              loading="lazy"
              src={previousPhoto.image.src}
              srcSet={previousPhoto.image.srcSet}
              width={previousPhoto.image.width}
            />
            <span>
              <small>上一张</small>
              {previousPhoto.title}
            </span>
          </a>
        ) : (
          <span />
        )}
        {nextPhoto ? (
          <a className="photo-sequence-card" href={getPhotoHref(nextPhoto.id)}>
            <span>
              <small>下一张</small>
              {nextPhoto.title}
            </span>
            <img
              alt=""
              height={nextPhoto.image.height}
              loading="lazy"
              src={nextPhoto.image.src}
              srcSet={nextPhoto.image.srcSet}
              width={nextPhoto.image.width}
            />
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        ) : null}
      </nav>
    </section>
  )
}
