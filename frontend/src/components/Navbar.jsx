import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS } from '../data/content'
import { useContent } from '../context/ContentContext'
import { prepareRouteChange } from '../lib/prepareRouteChange'
import AppLink from './AppLink'
import SocialLinks from './SocialLinks'

function goTo(navigate, href) {
  prepareRouteChange()
  if (href.startsWith('/#')) {
    navigate({ pathname: '/', hash: `#${href.slice(2)}` })
    return
  }
  if (href.startsWith('#')) {
    navigate({ pathname: '/', hash: href })
    return
  }
  navigate(href)
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { store } = useContent()
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

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
    requestAnimationFrame(() => goTo(navigate, href))
  }

  const socialLinkClass =
    'flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white/30 hover:text-white'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="section-pad relative z-[70]">
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
            scrolled || !isHome
              ? 'border border-white/10 bg-[#07090b]/85 shadow-lg shadow-black/30 backdrop-blur-[6px]'
              : 'bg-transparent'
          }`}
        >
          <AppLink to="/" className="group flex items-center gap-2" data-cursor="hover" onClick={closeMenu}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue to-green text-sm font-bold text-[#041018]">
              GA
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              {store?.name || 'Greenland Aquarium'}
            </span>
          </AppLink>

          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <AppLink
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 transition hover:text-white"
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
            <AppLink
              href="/#visit"
              className="nav-cta rounded-full px-4 py-2 text-sm font-semibold transition hover:brightness-95"
              data-cursor="hover"
            >
              Visit Store
            </AppLink>
          </div>

          <button
            type="button"
            className="relative z-[70] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            data-cursor="hover"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
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
              className="fixed inset-0 z-[65] bg-black/60 md:hidden"
              onClick={closeMenu}
            />
            <motion.div
              key="mobile-panel"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="section-pad fixed inset-x-0 top-[4.5rem] z-[70] md:hidden"
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
                  <a
                    href="/#visit"
                    onClick={onMobileNav('/#visit')}
                    className="nav-cta mt-1 rounded-full px-3 py-3 text-center text-base font-semibold"
                    data-cursor="hover"
                  >
                    Visit Store
                  </a>
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
