import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
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
  const imageRef = useRef(null)
  const { store } = useContent()
  const tagline = store?.tagline || STORE.tagline
  const name = store?.name || STORE.name

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      if (sectionRef.current) sectionRef.current.style.opacity = '1'
      if (imageRef.current) {
        imageRef.current.style.opacity = '1'
        imageRef.current.style.transform = 'none'
      }
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: 'power2.out' },
      )

      gsap.fromTo(
        imageRef.current,
        { scale: 1.06, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.1 },
      )
    }, sectionRef)

    const pending = { current: null }
    const moveRaf = { current: 0 }

    const onMove = (e) => {
      if (!sectionRef.current || !imageRef.current) return
      if (window.matchMedia('(max-width: 767px), (pointer: coarse)').matches) return

      const rect = sectionRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      pending.current = { x: x * 14, y: y * 10 }
      if (moveRaf.current) return
      moveRaf.current = requestAnimationFrame(() => {
        moveRaf.current = 0
        const p = pending.current
        if (imageRef.current && p) {
          imageRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
        }
      })
    }

    const el = sectionRef.current
    el?.addEventListener('mousemove', onMove)

    return () => {
      ctx.revert()
      el?.removeEventListener('mousemove', onMove)
      if (moveRaf.current) cancelAnimationFrame(moveRaf.current)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <picture className="flex h-full w-full items-center justify-center">
          <source media="(min-width: 1024px)" srcSet={heroDesktop} />
          <source media="(min-width: 768px)" srcSet={heroTablet} />
          <img
            ref={imageRef}
            src={heroMobile}
            alt="Greenland Aquarium"
            className="h-full w-full max-w-none object-contain object-center brightness-110"
            draggable={false}
          />
        </picture>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.15)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent md:h-28" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/55 via-black/20 to-transparent md:h-44" />

      <div className="hidden lg:block">
        <Bubbles count={4} />
      </div>

      <h1 className="sr-only">
        {name} — {tagline}
      </h1>

      <div className="section-pad relative z-20 flex min-h-[100svh] w-full max-w-[1400px] flex-col justify-end pb-10 pt-24 md:pb-16 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
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
