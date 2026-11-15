import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ArrowUpRight, Clock, Mail, MapPin } from 'lucide-react'
import { formatPhotoDateTime, type Photo } from '@imanity/tabi-gallery'
import { GithubIcon } from '../components/ui/GithubIcon'
import { formatPeriod, profile } from '../content/profile'
import { projects, projectStatusLabel } from '../content/projects'
import { type LoadedGallery, useGallery } from '../gallery/GalleryProvider'
import { getGalleryStats } from '../gallery/galleryStats'
import { createRandomPhotoRanks, sortPhotos } from '../gallery/sortPhotos'

const RECENT_PHOTO_COUNT = 6

function getPhotoHref(photo: Photo) {
  return `/photos/${encodeURIComponent(photo.id)}`
}

function shuffle<T>(items: T[]) {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[target]] = [result[target], result[index]]
  }

  return result
}

const isPortrait = (photo: Photo) => photo.image.height > photo.image.width
const placeOf = (photo: Photo) => photo.location?.label ?? photo.id

/** Tall tile on the left, two landscape tiles on the right, each from a different place. */
const COLLAGE_SLOTS: Array<(photo: Photo) => boolean> = [
  isPortrait,
  (photo) => !isPortrait(photo),
  (photo) => !isPortrait(photo),
]

function pickCollagePhotos(photos: Photo[]) {
  const pool = shuffle(photos)
  const picks: Photo[] = []
  const places = new Set<string>()

  for (const fits of COLLAGE_SLOTS) {
    const photo =
      pool.find((item) => !picks.includes(item) && !places.has(placeOf(item)) && fits(item)) ??
      pool.find((item) => !picks.includes(item))

    if (!photo) {
      break
    }

    picks.push(photo)
    places.add(placeOf(photo))
  }

  return picks
}

/** Latest photo from each of the most recent albums, so one trip doesn't fill the grid. */
function pickRecentPhotos(
  photos: Photo[],
  galleries: LoadedGallery[],
  randomRanks: ReadonlyMap<string, number>,
) {
  const albumOf = new Map<string, string>()

  for (const gallery of galleries) {
    for (const photo of gallery.photos) {
      albumOf.set(photo.id, gallery.id)
    }
  }

  const seenAlbums = new Set<string>()
  const picks: Photo[] = []

  for (const photo of sortPhotos(photos, 'taken-at-desc', randomRanks)) {
    const album = albumOf.get(photo.id) ?? photo.id

    if (seenAlbums.has(album)) {
      continue
    }

    seenAlbums.add(album)
    picks.push(photo)

    if (picks.length === RECENT_PHOTO_COUNT) {
      break
    }
  }

  return picks
}

function useLocalTime(timeZone: string) {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat('zh-CN', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }),
    [timeZone],
  )
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 10_000)
    return () => window.clearInterval(timer)
  }, [])

  return { display: formatter.format(now), dateTime: now.toISOString() }
}

export function HomePage() {
  const { galleries, loading, photos } = useGallery()
  const localTime = useLocalTime(profile.timeZone)
  const randomRanks = useMemo(() => createRandomPhotoRanks(photos), [photos])
  const collage = useMemo(() => pickCollagePhotos(photos), [photos])
  const recent = useMemo(
    () => pickRecentPhotos(photos, galleries, randomRanks),
    [galleries, photos, randomRanks],
  )
  const stats = useMemo(() => getGalleryStats(photos, galleries), [galleries, photos])
  const [firstName, ...restOfName] = profile.name.split(' ')
  const current = profile.experiences[0]
  const statValue = (value: number) => (loading ? '—' : value)

  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="status-pill">
            <span aria-hidden="true" className="status-pill-dot" />
            <span>
              {profile.city} · 当地时间{' '}
              <time dateTime={localTime.dateTime}>{localTime.display}</time>
            </span>
          </p>

          <h1 className="hero-heading" id="hero-title">
            <span className="hero-greeting">你好，我是</span>
            <span className="hero-name">
              {firstName} <em>{restOfName.join(' ')}</em>
            </span>
          </h1>

          <p className="hero-lead">{profile.intro}</p>

          <div className="hero-actions">
            <a className="button button-primary" href="/photos">
              浏览照片
              <ArrowRight aria-hidden="true" size={17} strokeWidth={2} />
            </a>
            <a className="button button-ghost" href="/about">
              关于我
            </a>
            <div className="hero-socials">
              <a
                aria-label="GitHub"
                className="icon-button"
                href={profile.links.github}
                rel="noreferrer"
                target="_blank"
                title="GitHub"
              >
                <GithubIcon size={18} />
              </a>
              <a
                aria-label="发送邮件"
                className="icon-button"
                href={`mailto:${profile.links.email}`}
                title="Email"
              >
                <Mail aria-hidden="true" size={18} strokeWidth={1.8} />
              </a>
            </div>
          </div>
        </div>

        {loading ? (
          <div aria-hidden="true" className="hero-collage">
            {[0, 1, 2].map((slot) => (
              <div className="collage-tile skeleton" key={slot} />
            ))}
          </div>
        ) : collage.length > 0 ? (
          <div aria-label="随机挑选的照片" className="hero-collage" role="group">
            {collage.map((photo) => (
              <a className="collage-tile" href={getPhotoHref(photo)} key={photo.id}>
                <img
                  alt={photo.image.alt}
                  decoding="async"
                  height={photo.image.height}
                  src={photo.image.src}
                  srcSet={photo.image.srcSet}
                  width={photo.image.width}
                />
                <span className="collage-caption">
                  <strong>{photo.title}</strong>
                  {photo.location ? <span>{photo.location.label}</span> : null}
                </span>
              </a>
            ))}
          </div>
        ) : null}
      </section>

      <dl className="stats">
        <div className="stat">
          <dt>张照片</dt>
          <dd>{statValue(stats.photoCount)}</dd>
        </div>
        <div className="stat">
          <dt>个拍摄地点</dt>
          <dd>{statValue(stats.placeCount)}</dd>
        </div>
        <div className="stat">
          <dt>{stats.countries.length > 0 ? stats.countries.join(' · ') : '个国家'}</dt>
          <dd>{statValue(stats.countries.length)}</dd>
        </div>
        <div className="stat">
          <dt>本相册</dt>
          <dd>{statValue(stats.albumCount)}</dd>
        </div>
      </dl>

      <section className="section" aria-labelledby="recent-title">
        <header className="section-head">
          <div>
            <p className="eyebrow">Recently</p>
            <h2 id="recent-title">最近拍摄</h2>
          </div>
          <a className="link-arrow" href="/photos">
            查看全部照片
            <ArrowRight aria-hidden="true" size={16} strokeWidth={2} />
          </a>
        </header>

        <div className="photo-grid">
          {loading
            ? Array.from({ length: RECENT_PHOTO_COUNT }, (_, slot) => (
                <div aria-hidden="true" className="photo-tile" key={slot}>
                  <span className="photo-tile-media skeleton" />
                </div>
              ))
            : recent.map((photo) => {
                const takenAt = formatPhotoDateTime(photo.takenAt)

                return (
                  <a className="photo-tile" href={getPhotoHref(photo)} key={photo.id}>
                    <span className="photo-tile-media">
                      <img
                        alt={photo.image.alt}
                        decoding="async"
                        height={photo.image.height}
                        loading="lazy"
                        src={photo.image.src}
                        srcSet={photo.image.srcSet}
                        width={photo.image.width}
                      />
                    </span>
                    <span className="photo-tile-meta">
                      <div>
                        <strong>{photo.title}</strong>
                        {takenAt ? <time dateTime={takenAt.dateTime}>{takenAt.display}</time> : null}
                      </div>
                      {photo.location ? (
                        <span className="photo-tile-place">
                          <MapPin aria-hidden="true" size={13} strokeWidth={2} />
                          <span>{photo.location.label}</span>
                        </span>
                      ) : null}
                    </span>
                  </a>
                )
              })}
        </div>
      </section>

      <section className="section" aria-labelledby="now-title">
        <header className="section-head">
          <div>
            <p className="eyebrow">Now</p>
            <h2 id="now-title">近况</h2>
          </div>
        </header>

        <div className="home-now">
          {current ? (
            <a className="card now-card" href="/about">
              <span aria-hidden="true" className="card-corner">
                <ArrowUpRight size={16} strokeWidth={2} />
              </span>
              <p className="label">目前</p>
              <h3>{current.title}</h3>
              <p className="now-card-role">{current.organization}</p>
              <p className="now-card-meta">
                <span>
                  <Clock aria-hidden="true" size={14} strokeWidth={2} />
                  {formatPeriod(current.period)}
                </span>
                {current.location ? (
                  <span>
                    <MapPin aria-hidden="true" size={14} strokeWidth={2} />
                    {current.location}
                  </span>
                ) : null}
              </p>
              {current.highlights.length > 0 ? (
                <ul className="chip-list">
                  {current.highlights.map((highlight) => (
                    <li className="chip" key={highlight}>
                      {highlight}
                    </li>
                  ))}
                </ul>
              ) : null}
            </a>
          ) : null}

          <a className="card now-card" href="/projects">
            <span aria-hidden="true" className="card-corner">
              <ArrowUpRight size={16} strokeWidth={2} />
            </span>
            <p className="label">项目</p>
            <ul className="project-rows">
              {projects.map((project) => (
                <li key={project.name}>
                  <div>
                    <strong>{project.name}</strong>
                    <small>{project.summary}</small>
                  </div>
                  <span className="status" data-status={project.status}>
                    {projectStatusLabel[project.status]}
                  </span>
                </li>
              ))}
            </ul>
          </a>
        </div>
      </section>
    </div>
  )
}
