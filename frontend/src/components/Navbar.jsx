import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS } from '../data/content'
import { useContent } from '../context/ContentContext'
import { prepareRouteChange } from '../lib/prepareRouteChange'
import AppLink from './AppLink'
import SocialLinks from './SocialLinks'
import NavSearch from './NavSearch'
import { scrollToSection } from '../lib/lenisBridge'

function goTo(navigate, href) {
  prepareRouteChange()
  if (href.startsWith('/#')) {
    const id = href.slice(2)
    navigate({ pathname: '/', hash: `#${id}` })
    window.setTimeout(() => scrollToSection(id, { offset: -90 }), 80)
    return
  }
  if (href.startsWith('#')) {
    const id = href.slice(1)
    navigate({ pathname: '/', hash: href })
    window.setTimeout(() => scrollToSection(id, { offset: -90 }), 80)
    return
  }
  navigate(href)
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [isLg, setIsLg] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false,
  )
  const { store } = useContent()
  const location = useLocation()
  const navigate = useNavigate()
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
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40)
        ticking = false
      })
    }
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
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const closeMenu = () => setOpen(false)

  const onMobileNav = (href) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    closeMenu()
    window.setTimeout(() => goTo(navigate, href), 120)
  }

  const socialLinkClass =
    'flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/30 hover:text-white'

  const pillTone =
    scrolled || !isHome
      ? 'border border-transparent bg-[#07090b]/70 shadow-lg shadow-black/30 backdrop-blur-xl backdrop-saturate-150'
      : 'border border-transparent bg-transparent'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="section-pad relative z-[70]">
        <nav
          className={`nav-pill mx-auto flex max-w-7xl items-center transition-all duration-500 ${pillTone}`}
        >
          <AppLink
            to="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center lg:h-9 lg:w-auto lg:justify-start lg:gap-2"
            data-cursor="hover"
            onClick={closeMenu}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue to-green text-sm font-bold leading-none text-[#041018] lg:h-9 lg:w-9">
              GA
            </span>
            <span className="hidden truncate font-display text-lg font-semibold leading-none tracking-tight lg:inline">
              {store?.name || 'Greenland Aquarium'}
            </span>
          </AppLink>

          {!isLg && (
            <div className="flex h-10 min-w-0 items-center">
              <NavSearch className="nav-search--in-pill w-full" />
            </div>
          )}

          {isLg && (
            <div className="ml-auto flex min-w-0 items-center gap-4">
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
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="mobile-backdrop"
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[65] bg-black/60 lg:hidden"
              onClick={closeMenu}
            />
            <motion.div
              id="mobile-nav"
              key="mobile-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="section-pad fixed inset-x-0 top-[5.25rem] z-[70] lg:hidden"
            >
              <div className="glass rounded-3xl p-4 shadow-xl shadow-black/40">
                <div className="flex flex-col">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={onMobileNav(link.href)}
                      className="rounded-xl px-3 py-3 text-lg text-white/85 transition hover:bg-white/5"
                      data-cursor="hover"
                    >
                      {link.label}
                    </a>
                  ))}
                  <SocialLinks
                    socials={store?.socials}
                    className="mt-4 justify-center border-t border-white/10 pt-4"
                    iconSize={16}
                    linkClassName={socialLinkClass}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
