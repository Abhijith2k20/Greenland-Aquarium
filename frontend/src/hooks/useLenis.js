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
 * RAF runs only while Lenis is scrolling — sleeps when idle.
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
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.85,
      touchMultiplier: 1,
      autoRaf: false,
    })

    setLenisInstance(instance)

    let rafId = 0
    let running = false

    const stopRaf = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = 0
      running = false
    }

    const loop = (time) => {
      instance.raf(time)
      if (instance.isScrolling) {
        rafId = requestAnimationFrame(loop)
      } else {
        running = false
        rafId = 0
      }
    }

    const kick = () => {
      if (running) return
      running = true
      rafId = requestAnimationFrame(loop)
    }

    instance.on('scroll', kick)
    window.addEventListener('wheel', kick, { passive: true })
    window.addEventListener('keydown', kick, { passive: true })

    setLenis(instance)
    document.documentElement.classList.add('lenis', 'lenis-smooth')

    const onChange = () => {
      if (isCoarsePointer()) {
        stopRaf()
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
      window.removeEventListener('wheel', kick)
      window.removeEventListener('keydown', kick)
      instance.off('scroll', kick)
      stopRaf()
      instance.destroy()
      setLenis(null)
      setLenisInstance(null)
      document.documentElement.classList.remove('lenis', 'lenis-smooth')
    }
  }, [enabled])

  return lenis
}
