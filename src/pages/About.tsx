import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { GithubIcon } from '../components/ui/GithubIcon'
import { PageHeader } from '../components/ui/PageHeader'
import { formatPeriod, isCurrentPeriod, profile } from '../content/profile'

export function About() {
  const githubLabel = profile.links.github.replace(/^https?:\/\//, '')

  return (
    <section className="page-stack">
      <PageHeader eyebrow="About" title="简介" />

      <div className="about-layout">
        <aside aria-label="个人信息" className="card profile-card">
          <span aria-hidden="true" className="avatar">
            RJ
          </span>

          <div>
            <h2>{profile.name}</h2>
            <p className="profile-location">
              <MapPin aria-hidden="true" size={15} strokeWidth={2} />
              {profile.location} · {profile.city}
            </p>
          </div>

          <p className="profile-intro">{profile.intro}</p>

          {profile.focus.length > 0 ? (
            <ul className="chip-list">
              {profile.focus.map((item) => (
                <li className="chip" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          <ul className="profile-links">
            <li>
              <a href={profile.links.github} rel="noreferrer" target="_blank">
                <GithubIcon size={16} />
                <span>{githubLabel}</span>
                <ArrowUpRight aria-hidden="true" size={15} strokeWidth={2} />
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.links.email}`}>
                <Mail aria-hidden="true" size={16} strokeWidth={1.8} />
                <span>{profile.links.email}</span>
                <ArrowUpRight aria-hidden="true" size={15} strokeWidth={2} />
              </a>
            </li>
          </ul>
        </aside>

        <section className="timeline" aria-labelledby="experience-heading">
          <header className="section-head">
            <div>
              <p className="eyebrow">Experience</p>
              <h2 id="experience-heading">经历</h2>
            </div>
          </header>

          <ol className="timeline-list">
            {profile.experiences.map((experience) => (
              <li
                className="timeline-item"
                data-current={isCurrentPeriod(experience.period)}
                key={`${experience.title}-${experience.period}`}
              >
                <div className="timeline-head">
                  <h3>{experience.title}</h3>
                  <span className="timeline-period">{formatPeriod(experience.period)}</span>
                </div>

                <p className="timeline-org">
                  <span>{experience.organization}</span>
                  {experience.location ? (
                    <span className="timeline-location">
                      <MapPin aria-hidden="true" size={13} strokeWidth={2} />
                      {experience.location}
                    </span>
                  ) : null}
                </p>

                {experience.summary.length > 0 ? (
                  <ul className="timeline-summary">
                    {experience.summary.map((summary) => (
                      <li key={summary}>{summary}</li>
                    ))}
                  </ul>
                ) : null}

                {experience.highlights.length > 0 ? (
                  <ul className="chip-list">
                    {experience.highlights.map((highlight) => (
                      <li className="chip" key={highlight}>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  )
}
