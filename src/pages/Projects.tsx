import { PageHeader } from '../components/ui/PageHeader'
import { projects } from '../content/projects'

const statusLabel = {
  active: '进行中',
  planning: '规划中',
  archived: '已归档',
}

export function Projects() {
  return (
    <section className="page-stack">
      <PageHeader
        eyebrow="Projects"
        title="项目"
        description=""
      />

      <div className="project-list">
        {projects.map((project) => (
          <article className="project-item" key={project.name}>
            <div>
              <p className="item-meta">{statusLabel[project.status]}</p>
              <h2>{project.name}</h2>
              <p>{project.summary}</p>
            </div>
            <div className="tag-row" aria-label={`${project.name} tags`}>
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
