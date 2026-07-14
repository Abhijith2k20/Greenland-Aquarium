import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { NAV_LINKS } from '../data/content'
import { useStaticContent } from '../context/ContentContext'
import AppLink from './AppLink'
import SocialLinks from './SocialLinks'
import NavSearch from './NavSearch'
import logo from '../assets/logo.webp'

const MOBILE_LINKS = [
  ...NAV_LINKS,
  { label: 'Visit Store', href: '/#visit' },
  { label: 'Custom Aquarium', href: '/#custom' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [isLg, setIsLg] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false,
  )
  const { store } = useStaticContent()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsLg(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    let ticking = false
    let last = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const next = window.scrollY > 40
        if (next !== last) {
          last = next
          setScrolled(next)
        }
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search, location.hash])

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const closeMenu = () => setOpen(false)

  const socialLinkClass =
    'flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/30 hover:text-white'

  const pillTone =
    scrolled || !isHome || open
      ? 'border border-white/[0.06] bg-[#07090b]/92 shadow-lg shadow-black/25'
      : 'border border-transparent bg-transparent'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-[padding] duration-300 ${
        scrolled || open ? 'py-3' : 'py-5'
      }`}
    >
      <div className="section-pad relative z-[70]">
        <nav
          className={`nav-pill mx-auto flex max-w-7xl items-center transition-[background-color,border-color,box-shadow,padding] duration-300 ${pillTone}`}
        >
          <AppLink
            to="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center lg:h-9 lg:w-auto lg:justify-start lg:gap-2"
            data-cursor="hover"
            onClick={closeMenu}
          >
            <img
              src={logo}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full object-cover lg:h-9 lg:w-9"
              width={40}
              height={40}
              decoding="async"
            />
            <span className="hidden truncate font-display text-lg font-semibold leading-none tracking-tight lg:inline">
              {store?.name || 'Greenland Aquarium'}
            </span>
          </AppLink>

          {!isLg && (
            <div className="nav-pill__search flex h-10 items-center">
              <NavSearch className="nav-search--in-pill w-full" />
            </div>
          )}

          {isLg && (
            <div className="ml-auto flex shrink-0 items-center gap-4">
              {NAV_LINKS.map((link) => (
                <AppLink
                  key={link.href}
                  href={link.href}
                  className="shrink-0 text-sm text-white/70 transition hover:text-white"
                  data-cursor="hover"
                >
                  {link.label}
                </AppLink>
              ))}
              <SocialLinks
                socials={store?.socials}
                iconSize={15}
                linkClassName={socialLinkClass}
              />
              <NavSearch className="nav-search--desktop" />
            </div>
          )}

          {!isLg && (
            <button
              type="button"
              className="relative z-[70] flex h-10 w-10 shrink-0 items-center justify-center"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-nav"
              data-cursor="hover"
            >
              {open ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
            </button>
          )}
        </nav>

        {open && (
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="mobile-nav-shell relative z-[70] mx-auto mt-2 max-w-7xl lg:hidden"
          >
            <div className="mobile-nav-panel">
              <nav className="flex flex-col">
                {MOBILE_LINKS.map((link) => (
                  <AppLink
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    data-cursor="hover"
                    className="mobile-nav-panel__link"
                  >
                    {link.label}
                  </AppLink>
                ))}
              </nav>

              <div className="mobile-nav-panel__footer">
                <SocialLinks
                  socials={store?.socials}
                  iconSize={15}
                  linkClassName={socialLinkClass}
                />
                <a
                  href={store?.whatsapp || `https://wa.me/${store?.phoneRaw || '919611269901'}`}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="hero-cta__dive hero-cta__dive--nav hero-cta__dive--whatsapp"
                  onClick={closeMenu}
                >
                  <span className="hero-cta__ripple" aria-hidden />
                  <span className="hero-cta__ripple hero-cta__ripple--delay" aria-hidden />
                  <span className="hero-cta__label">WhatsApp</span>
                  <ArrowUpRight
                    className="hero-cta__arrow"
                    size={13}
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="mobile-nav-scrim fixed inset-0 z-[60] lg:hidden"
          onClick={closeMenu}
        />
      )}
    </header>
  )
}
