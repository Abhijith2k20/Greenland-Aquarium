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
