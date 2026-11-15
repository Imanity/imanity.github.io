import { PageHeader } from '../components/ui/PageHeader'
import { projects, projectStatusLabel } from '../content/projects'

export function Projects() {
  return (
    <section className="page-stack">
      <PageHeader eyebrow="Projects" title="项目" />

      <div className="project-grid">
        {projects.map((project, index) => (
          <article className="card project-card" key={project.name}>
            <div className="project-card-top">
              <span aria-hidden="true" className="project-index">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="status" data-status={project.status}>
                {projectStatusLabel[project.status]}
              </span>
            </div>

            <div className="project-card-body">
              <h2>{project.name}</h2>
              <p>{project.summary}</p>
            </div>

            <ul className="chip-list" aria-label={`${project.name} 技术栈`}>
              {project.tags.map((tag) => (
                <li className="chip" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
