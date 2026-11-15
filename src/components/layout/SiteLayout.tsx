import type { MouseEvent, ReactNode } from 'react'
import { Mail } from 'lucide-react'
import { routes } from '../../app/routes'
import { profile } from '../../content/profile'
import { GithubIcon } from '../ui/GithubIcon'
import { ThemeToggle } from '../ui/ThemeToggle'

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
        <div className="site-header-inner">
          <a aria-label="RJ's Page 主页" className="brand" href="/" onClick={handleNavigate('/')}>
            <span aria-hidden="true" className="brand-mark">
              RJ
            </span>
            <span className="brand-text">RJ's Page</span>
          </a>

          <nav className="site-nav" aria-label="站点导航">
            {routes.map((route) => (
              <a
                key={route.path}
                aria-current={activePath === route.path ? 'page' : undefined}
                className="nav-link"
                href={route.path}
                onClick={handleNavigate(route.path)}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <a
              aria-label="GitHub"
              className="icon-button header-github"
              href={profile.links.github}
              rel="noreferrer"
              target="_blank"
              title="GitHub"
            >
              <GithubIcon size={16} />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <span>
            © {new Date().getFullYear()} {profile.name} · {profile.city}
          </span>
          <div className="footer-links">
            <a href={profile.links.github} rel="noreferrer" target="_blank">
              <GithubIcon size={15} />
              GitHub
            </a>
            <a href={`mailto:${profile.links.email}`}>
              <Mail aria-hidden="true" size={16} strokeWidth={1.8} />
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
