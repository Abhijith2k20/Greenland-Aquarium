import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import gsap from 'gsap'
import Bubbles from './Bubbles'
import { STORE } from '../data/content'
import { useContent } from '../context/ContentContext'
import { prepareRouteChange } from '../lib/prepareRouteChange'
import { scrollToSection } from '../lib/lenisBridge'
import { useMagnetic } from '../hooks/useMagnetic'
import heroDesktop from '../assets/hero-desktop.jpg'
import heroTablet from '../assets/hero-tablet.png'
import heroMobile from '../assets/hero-mobile.png'

function HeroDiveCta({ to, children }) {
  const navigate = useNavigate()
  const ref = useMagnetic(0.22)

  return (
    <a
      ref={ref}
      href={to}
      data-cursor="hover"
      className="hero-cta__dive"
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        prepareRouteChange()
        navigate(to)
      }}
    >
      <span className="hero-cta__ripple" aria-hidden />
      <span className="hero-cta__ripple hero-cta__ripple--delay" aria-hidden />
      <span className="hero-cta__label">{children}</span>
      <ArrowUpRight className="hero-cta__arrow" size={16} strokeWidth={2.25} aria-hidden />
    </a>
  )
}

function HeroVisitCta({ href, children }) {
  const navigate = useNavigate()
  const id = href.replace(/^#/, '')

  return (
    <a
      href={href}
      data-cursor="hover"
      className="hero-cta__visit"
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        prepareRouteChange()
        navigate({ pathname: '/', hash: href })
        window.setTimeout(() => scrollToSection(id, { offset: -90 }), 60)
      }}
    >
      <MapPin size={14} className="opacity-60" aria-hidden />
      <span>{children}</span>
      <ArrowUpRight className="hero-cta__visit-icon" size={14} strokeWidth={2} aria-hidden />
      <span className="hero-cta__wave" aria-hidden />
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/40 via-black/10 to-transparent md:h-36" />

      <div className="hidden lg:block">
        <Bubbles count={4} />
      </div>

      <h1 className="sr-only">
        {name} — {tagline}
      </h1>

      <div className="section-pad relative z-20 flex min-h-[100svh] w-full max-w-[1400px] flex-col items-center justify-end pb-10 pt-24 md:pb-20 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.75 }}
          className="mb-7 max-w-[300px] text-center md:mb-9 md:max-w-md"
        >
          <p className="font-display text-lg font-semibold tracking-tight text-white md:text-xl">
            {tagline}
          </p>
          <p className="mt-2 font-body text-[12px] leading-relaxed text-white/50 md:text-sm">
            Premium exotic fish, custom aquariums & living aquascapes in Bengaluru.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.75 }}
          className="hero-cta"
        >
          <HeroDiveCta to="/collection">Dive into collection</HeroDiveCta>
          <HeroVisitCta href="#visit">Visit the store</HeroVisitCta>
        </motion.div>
      </div>
    </section>
  )
}
