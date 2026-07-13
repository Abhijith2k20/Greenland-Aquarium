import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useLenis } from '../hooks/useLenis'
import { scrollToSection } from '../lib/lenisBridge'

function resetScrollTop(lenis) {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  if (lenis) {
    lenis.scrollTo(0, { immediate: true })
  }
}

export default function Layout() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis(pathname === '/')
  const cancelScroll = useRef(null)

  // Before paint: jump to top so new pages don't flash at the old scroll position
  useLayoutEffect(() => {
    if (hash) return
    resetScrollTop(null)
  }, [pathname, hash])

  useEffect(() => {
    cancelScroll.current?.()
    cancelScroll.current = null

    if (hash) {
      const id = hash.replace(/^#/, '')
      const t = window.setTimeout(() => {
        cancelScroll.current = scrollToSection(id, { offset: -90 })
      }, 50)
      return () => {
        window.clearTimeout(t)
        cancelScroll.current?.()
      }
    }

    // Sync Lenis after it mounts/destroys on home ↔ other routes
    resetScrollTop(lenis)
    return undefined
  }, [pathname, hash, lenis])

  return (
    <div className="relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>

      {/* Solid sheet sits above the sticky footer and reveals it on scroll (Curate-style) */}
      <div className="site-sheet">
        <Navbar />
        <main id="main-content">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  )
}
