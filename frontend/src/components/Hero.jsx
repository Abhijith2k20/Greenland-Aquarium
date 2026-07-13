import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Bubbles from './Bubbles'
import { STORE } from '../data/content'
import { useContent } from '../context/ContentContext'
import { prepareRouteChange } from '../lib/prepareRouteChange'
import { scrollToSection } from '../lib/lenisBridge'
import heroDesktop from '../assets/hero-desktop.jpg'
import heroTablet from '../assets/hero-tablet.png'
import heroMobile from '../assets/hero-mobile.png'

function HeroDiveCta({ to }) {
  const navigate = useNavigate()

  return (
    <a
      href={to}
      className="hero-rail__btn"
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        prepareRouteChange()
        navigate(to)
      }}
    >
      <span className="hero-rail__btn-fill" aria-hidden />
      <span className="hero-rail__btn-label">Discover the collection</span>
      <span className="hero-rail__btn-arrow" aria-hidden>
        <ArrowUpRight size={15} strokeWidth={1.6} />
      </span>
    </a>
  )
}

function HeroVisitCta({ href, children }) {
  const navigate = useNavigate()
  const id = href.replace(/^#/, '')

  return (
    <a
      href={href}
      className="hero-rail__link"
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        prepareRouteChange()
        navigate({ pathname: '/', hash: href })
        window.setTimeout(() => scrollToSection(id, { offset: -90 }), 60)
      }}
    >
      {children}
    </a>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const { store } = useContent()
  const tagline = store?.tagline || STORE.tagline
  const name = store?.name || STORE.name

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return undefined
    // Kick CSS enter once after paint
    const id = requestAnimationFrame(() => el.classList.add('is-ready'))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero-section relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <picture className="flex h-full w-full items-center justify-center">
          <source media="(min-width: 1024px)" srcSet={heroDesktop} />
          <source media="(min-width: 768px)" srcSet={heroTablet} />
          <img
            src={heroMobile}
            alt="Greenland Aquarium"
            className="hero-section__img h-full w-full max-w-none object-contain object-center"
            fetchPriority="high"
            decoding="async"
            draggable={false}
          />
        </picture>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.15)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent md:h-28" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/55 via-black/20 to-transparent md:h-44" />

      <div className="hidden lg:block">
        <Bubbles count={2} />
      </div>

      <h1 className="sr-only">
        {name} — {tagline}
      </h1>

      <div className="section-pad relative z-20 flex min-h-[100svh] w-full max-w-[1400px] flex-col justify-end pb-10 pt-24 md:pb-16 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="hero-rail"
        >
          <div className="hero-rail__actions">
            <HeroDiveCta to="/collection" />
            <HeroVisitCta href="#visit">Visit the store</HeroVisitCta>
          </div>

          <div className="hero-rail__copy">
            <p className="hero-rail__tagline">{tagline}</p>
            <p className="hero-rail__lede">
              Premium exotic fish, custom aquariums & living aquascapes in Bengaluru.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
