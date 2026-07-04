import type { MouseEvent, ReactNode } from 'react'
import { ExternalLink, Mail } from 'lucide-react'
import { routes } from '../../app/routes'

type SiteLayoutProps = {
  activePath: string
  children: ReactNode
  onNavigate: (path: string) => void
}

export function SiteLayout({ activePath, children, onNavigate }: SiteLayoutProps) {
  const handleNavigate =
    (path: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      onNavigate(path)
    }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="/" onClick={handleNavigate('/')}>
          <span>
            <strong>RJ's Page</strong>
            <small>imanity.github.io</small>
          </span>
        </a>

        <nav className="site-nav" aria-label="Site navigation">
          {routes.map((route) => {
            const Icon = route.icon

            return (
              <a
                key={route.path}
                aria-current={activePath === route.path ? 'page' : undefined}
                className="nav-link"
                href={route.path}
                onClick={handleNavigate(route.path)}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{route.label}</span>
              </a>
            )
          })}
        </nav>
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Imanity</span>
        <div className="footer-links">
          <a href="https://github.com/Imanity" rel="noreferrer" target="_blank">
            <ExternalLink size={17} strokeWidth={1.8} />
            GitHub
          </a>
          <a href="mailto:imanity14@gmail.com">
            <Mail size={17} strokeWidth={1.8} />
            Contact
          </a>
        </div>
      </footer>
    </div>
  )
}
