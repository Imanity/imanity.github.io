import { PageHeader } from '../components/ui/PageHeader'
import { profile } from '../content/profile'

export function About() {
  return (
    <section className="page-stack">
      <PageHeader
        eyebrow="About"
        title="简介"
        description=""
      />

      <div className="about-panel">
        <div>
          <p className="item-meta">{profile.location}</p>
          <h2>{profile.role}</h2>
          <p>{profile.intro}</p>
        </div>
        <ul className="focus-list">
          {profile.focus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <section className="experience-section" aria-labelledby="experience-heading">
        <div className="section-heading">
          <p className="eyebrow">Experience</p>
          <h2 id="experience-heading">经历</h2>
        </div>

        <div className="experience-list">
          {profile.experiences.map((experience) => (
            <article
              className="experience-item"
              key={`${experience.title}-${experience.period}`}
            >
              <div className="experience-meta">
                <p className="item-meta">{experience.period}</p>
                {experience.location ? <span>{experience.location}</span> : null}
              </div>

              <div className="experience-body">
                <header>
                  <h3>{experience.title}</h3>
                  <p>{experience.organization}</p>
                </header>
                <ul className="experience-summary">
                  {experience.summary.map((summary) => (
                    <li key={summary}>{summary}</li>
                  ))}
                </ul>
                <ul className="experience-points">
                  {experience.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
