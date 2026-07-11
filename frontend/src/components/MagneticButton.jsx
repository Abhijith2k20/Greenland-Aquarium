import { useNavigate } from 'react-router-dom'
import { useMagnetic } from '../hooks/useMagnetic'
import { prepareRouteChange } from '../lib/prepareRouteChange'

function isInternalPath(href) {
  return typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')
}

function isHashOnly(href) {
  return typeof href === 'string' && href.startsWith('#')
}

function navigateInternal(navigate, path) {
  prepareRouteChange()
  if (path.startsWith('/#')) {
    navigate({ pathname: '/', hash: `#${path.slice(2)}` })
    return
  }
  if (path.includes('#')) {
    const [pathname, hashPart] = path.split('#')
    navigate({ pathname: pathname || '/', hash: `#${hashPart}` })
    return
  }
  navigate(path)
}

export default function MagneticButton({
  children,
  variant = 'primary',
  className = '',
  as,
  href,
  to,
  onClick,
  type = 'button',
  ...props
}) {
  const navigate = useNavigate()
  const ref = useMagnetic(0.28)
  const variantClass =
    variant === 'ghost'
      ? 'magnetic-btn--ghost'
      : variant === 'solid'
        ? 'magnetic-btn--solid'
        : variant === 'whatsapp'
          ? 'magnetic-btn--whatsapp'
          : 'magnetic-btn--primary'
  const classes = `magnetic-btn ${variantClass} ${className}`
  const path = to || href

  if (as) {
    const Tag = as
    return (
      <Tag
        ref={ref}
        className={classes}
        data-cursor="hover"
        href={href}
        to={to}
        onClick={onClick}
        type={type}
        {...props}
      >
        {children}
      </Tag>
    )
  }

  // In-app route: /collection, /#about
  if (isInternalPath(path)) {
    return (
      <a
        ref={ref}
        href={path}
        className={classes}
        data-cursor="hover"
        onClick={(e) => {
          onClick?.(e)
          if (e.defaultPrevented) return
          if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
          e.preventDefault()
          navigateInternal(navigate, path)
        }}
        {...props}
      >
        {children}
      </a>
    )
  }

  // Same-page hash: #visit
  if (isHashOnly(path)) {
    return (
      <a
        ref={ref}
        href={path}
        className={classes}
        data-cursor="hover"
        onClick={(e) => {
          onClick?.(e)
          if (e.defaultPrevented) return
          if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
          e.preventDefault()
          prepareRouteChange()
          navigate({ pathname: '/', hash: path })
        }}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <a
      ref={ref}
      href={href}
      className={classes}
      data-cursor="hover"
      onClick={onClick}
      {...props}
    >
      {children}
    </a>
  )
}
