import { Link, useNavigate } from 'react-router-dom'
import { prepareRouteChange } from '../lib/prepareRouteChange'
import { scrollToSection } from '../lib/lenisBridge'

function isExternal(path) {
  return (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('https://wa.me')
  )
}

function hashFromPath(path) {
  if (path.startsWith('/#')) return path.slice(2)
  if (path.startsWith('#')) return path.slice(1)
  if (path.includes('#')) return path.split('#')[1] || ''
  return ''
}

/**
 * Unified in-app link:
 * - /collection  → React Router page
 * - /#visit      → home + scroll to section
 * - #visit       → home + scroll
 */
export default function AppLink({ href, to, children, onClick, className, ...props }) {
  const navigate = useNavigate()
  const path = to || href || '/'

  const handleClick = (e) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

    if (!path.startsWith('/') && !path.startsWith('#') && isExternal(path)) {
      return
    }

    e.preventDefault()
    prepareRouteChange()

    const id = hashFromPath(path)
    if (id) {
      navigate({ pathname: '/', hash: `#${id}` })
      // Scroll immediately too — Layout effect can miss lazy sections / same-hash clicks
      window.setTimeout(() => scrollToSection(id, { offset: -90 }), 60)
      return
    }

    if (path.startsWith('/')) {
      navigate(path)
    }
  }

  if (path.startsWith('/') && !path.includes('#')) {
    return (
      <Link to={path} className={className} onClick={handleClick} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a href={path} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
