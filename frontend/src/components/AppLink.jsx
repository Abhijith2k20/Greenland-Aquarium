import { Link, useNavigate } from 'react-router-dom'
import { prepareRouteChange } from '../lib/prepareRouteChange'

function isExternal(path) {
  return (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('https://wa.me')
  )
}

/**
 * Unified in-app link:
 * - /collection  → React Router page
 * - /#about      → home + scroll to section
 * - #visit       → go home then scroll
 * - https://...  → normal external anchor
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

    if (path.startsWith('/#')) {
      navigate({ pathname: '/', hash: `#${path.slice(2)}` })
      return
    }

    if (path.startsWith('#')) {
      navigate({ pathname: '/', hash: path })
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
