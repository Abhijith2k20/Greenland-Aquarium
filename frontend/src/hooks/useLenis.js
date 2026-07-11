import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { setLenisInstance } from '../lib/lenisBridge'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isCoarsePointer() {
  return window.matchMedia('(pointer: coarse), (max-width: 767px)').matches
}

/**
 * Smooth scroll for desktop homepage only.
 * Native RAF (no GSAP ticker). Disabled on mobile / reduced-motion / other routes.
 */
export function useLenis(enabled = true) {
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    if (!enabled || prefersReducedMotion() || isCoarsePointer()) {
      setLenis(null)
      setLenisInstance(null)
      return undefined
    }

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.85,
      touchMultiplier: 1,
    })

    setLenisInstance(instance)

    let rafId = 0
    const raf = (time) => {
      instance.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    setLenis(instance)
    document.documentElement.classList.add('lenis', 'lenis-smooth')

    const onChange = () => {
      if (isCoarsePointer()) {
        cancelAnimationFrame(rafId)
        instance.destroy()
        setLenis(null)
        setLenisInstance(null)
        document.documentElement.classList.remove('lenis', 'lenis-smooth')
      }
    }
    const mq = window.matchMedia('(pointer: coarse), (max-width: 767px)')
    mq.addEventListener?.('change', onChange)

    return () => {
      mq.removeEventListener?.('change', onChange)
      cancelAnimationFrame(rafId)
      instance.destroy()
      setLenis(null)
      setLenisInstance(null)
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
    }
  }, [enabled])

  return lenis
}
