import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import Bubbles from './Bubbles'
import MagneticButton from './MagneticButton'
import { STORE } from '../data/content'
import { useContent } from '../context/ContentContext'
import heroDesktop from '../assets/hero-desktop.jpg'
import heroTablet from '../assets/hero-tablet.png'
import heroMobile from '../assets/hero-mobile.png'

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
      {/* Art-directed hero: 9:16 mobile → 4:3 tablet → wide desktop */}
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

      {/* Soft vignette — light so artwork stays bright */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.15)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent md:h-28" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/40 via-black/10 to-transparent md:h-36" />

      <div className="hidden lg:block">
        <Bubbles count={4} />
      </div>

      {/* Accessible heading (visually hidden — brand is in the artwork) */}
      <h1 className="sr-only">
        {name} — {tagline}
      </h1>

      {/* Overlay UI — compact on mobile so it doesn't cover the fish */}
      <div className="section-pad relative z-20 flex min-h-[100svh] w-full max-w-[1400px] flex-col items-center justify-end pb-10 pt-24 md:pb-20 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.75 }}
          className="mb-6 max-w-[300px] text-center md:mb-8 md:max-w-md"
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
          className="flex w-full max-w-[340px] flex-row items-center justify-center gap-2.5 sm:max-w-none sm:gap-3"
        >
          <MagneticButton
            to="/collection"
            variant="solid"
            className="min-w-0 flex-1 justify-center px-3 py-2.5 text-xs sm:flex-none sm:px-6 sm:py-3 sm:text-sm sm:min-w-[148px]"
          >
            Explore Collection
          </MagneticButton>
          <MagneticButton
            href="#visit"
            variant="ghost"
            className="min-w-0 flex-1 justify-center border-white/25 bg-white/[0.04] px-3 py-2.5 text-xs backdrop-blur-sm sm:flex-none sm:px-6 sm:py-3 sm:text-sm sm:min-w-[148px]"
          >
            Visit Store
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
