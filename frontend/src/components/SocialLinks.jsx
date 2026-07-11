function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

function FacebookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
    </svg>
  )
}

function YoutubeIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12.2c0-2.2-.3-3.6-.5-4.3-.3-.8-.9-1.4-1.7-1.6C18.2 5.8 12 5.8 12 5.8s-6.2 0-7.8.5c-.8.2-1.4.8-1.7 1.6-.2.7-.5 2.1-.5 4.3s.3 3.6.5 4.3c.3.8.9 1.4 1.7 1.6 1.6.5 7.8.5 7.8.5s6.2 0 7.8-.5c.8-.2 1.4-.8 1.7-1.6.2-.7.5-2.1.5-4.3zM10 15.2V9.2l5.2 3-5.2 3z" />
    </svg>
  )
}

function isRealSocialUrl(href) {
  if (!href || typeof href !== 'string') return false
  const trimmed = href.trim()
  if (!trimmed || trimmed === '#') return false
  try {
    const u = new URL(trimmed)
    if (!/^https?:$/.test(u.protocol)) return false
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'instagram.com' && (u.pathname === '/' || u.pathname === '')) return false
    if (host === 'facebook.com' && (u.pathname === '/' || u.pathname === '')) return false
    if ((host === 'youtube.com' || host === 'youtu.be') && (u.pathname === '/' || u.pathname === ''))
      return false
    return true
  } catch {
    return false
  }
}

export function getSocialLinks(socials = {}) {
  return [
    { Icon: InstagramIcon, href: socials.instagram, label: 'Instagram' },
    { Icon: FacebookIcon, href: socials.facebook, label: 'Facebook' },
    { Icon: YoutubeIcon, href: socials.youtube, label: 'YouTube' },
  ].filter((s) => isRealSocialUrl(s.href))
}

export default function SocialLinks({
  socials,
  className = '',
  iconSize = 16,
  linkClassName = 'glass flex h-10 w-10 items-center justify-center rounded-full transition hover:border-blue/40',
}) {
  const items = getSocialLinks(socials)
  if (!items.length) return null

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {items.map(({ Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className={linkClassName}
          data-cursor="hover"
        >
          <Icon size={iconSize} />
        </a>
      ))}
    </div>
  )
}
