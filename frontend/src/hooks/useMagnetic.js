import { useEffect, useRef } from 'react'

export function useMagnetic(strength = 0.28) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    let frame = 0
    let targetX = 0
    let targetY = 0

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      targetX = (e.clientX - rect.left - rect.width / 2) * strength
      targetY = (e.clientY - rect.top - rect.height / 2) * strength
      if (!frame) {
        frame = requestAnimationFrame(() => {
          el.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
          frame = 0
        })
      }
    }

    const onLeave = () => {
      cancelAnimationFrame(frame)
      frame = 0
      el.style.transform = 'translate3d(0, 0, 0)'
    }

    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  return ref
}
