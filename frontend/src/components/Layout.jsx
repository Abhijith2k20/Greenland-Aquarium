import { useEffect } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CustomCursor from './CustomCursor'
import { useLenis } from '../hooks/useLenis'

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

  useEffect(() => {
    const scrollToHash = () => {
      if (hash) {
        const id = hash.replace(/^#/, '')
        const el = document.getElementById(id)
        if (!el) return false
        if (lenis) {
          lenis.scrollTo(el, { offset: -90, immediate: false })
        } else {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        return true
      }

      resetScrollTop(lenis)
      return true
    }

    let tries = 0
    const tick = () => {
      const ok = scrollToHash()
      if (!ok && hash && tries < 20) {
        tries += 1
        requestAnimationFrame(tick)
      }
    }
    requestAnimationFrame(tick)

    if (!hash) {
      const t = window.setTimeout(() => resetScrollTop(lenis), 50)
      return () => window.clearTimeout(t)
    }

    return undefined
  }, [pathname, hash, lenis])

  return (
    <div className="relative min-h-screen bg-bg text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <CustomCursor />
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
