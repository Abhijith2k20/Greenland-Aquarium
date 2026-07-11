import { useEffect, useRef, useState } from 'react'

function canUseCustomCursor() {
  return (
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.matchMedia('(min-width: 1024px)').matches
  )
}

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const moving = useRef(false)
  const idleTimer = useRef(0)
  const hovering = useRef(false)

  useEffect(() => {
    if (!canUseCustomCursor()) return undefined
    setEnabled(true)

    let raf = 0

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.18
      ring.current.y += (pos.current.y - ring.current.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`
      }

      const dx = Math.abs(pos.current.x - ring.current.x)
      const dy = Math.abs(pos.current.y - ring.current.y)
      if (dx > 0.1 || dy > 0.1 || moving.current) {
        raf = requestAnimationFrame(animate)
      } else {
        raf = 0
      }
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(animate)
    }

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      moving.current = true
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      }
      kick()
      window.clearTimeout(idleTimer.current)
      idleTimer.current = window.setTimeout(() => {
        moving.current = false
      }, 120)
    }

    const onOver = (e) => {
      const target = e.target.closest('a, button, [data-cursor="hover"]')
      const next = Boolean(target)
      if (next === hovering.current) return
      hovering.current = next
      ringRef.current?.classList.toggle('is-hover', next)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.clearTimeout(idleTimer.current)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
