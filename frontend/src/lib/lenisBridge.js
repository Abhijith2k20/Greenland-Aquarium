/** Shared Lenis instance for scroll helpers (Featured pin, hash links, etc.). */
let lenisInstance = null

export function setLenisInstance(instance) {
  lenisInstance = instance
}

export function getLenisInstance() {
  return lenisInstance
}

export function scrollToY(y, { immediate = false } = {}) {
  const lenis = lenisInstance
  if (lenis) {
    lenis.scrollTo(y, { immediate, duration: immediate ? 0 : 1.1 })
    return
  }
  window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' })
}

/**
 * Scroll to a section by id. Retries until the node exists (needed for lazy Home sections).
 * Works with or without Lenis; safe to call on every Visit Store click.
 */
export function scrollToSection(id, { offset = -90, timeoutMs = 5000 } = {}) {
  if (!id) return () => {}

  const started = Date.now()
  let raf = 0
  let cancelled = false

  const run = () => {
    if (cancelled) return
    const el = document.getElementById(id)
    if (el) {
      const lenis = lenisInstance
      if (lenis) {
        lenis.scrollTo(el, { offset, immediate: false })
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY + offset
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      }
      return
    }
    if (Date.now() - started < timeoutMs) {
      raf = requestAnimationFrame(run)
    }
  }

  raf = requestAnimationFrame(run)

  return () => {
    cancelled = true
    if (raf) cancelAnimationFrame(raf)
  }
}
