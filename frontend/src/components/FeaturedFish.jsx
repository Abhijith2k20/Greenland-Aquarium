import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import { prepareRouteChange } from '../lib/prepareRouteChange'
import { getLenisInstance, scrollToY } from '../lib/lenisBridge'

const CARD_COUNT = 3

function flexForDist(dist) {
  if (dist >= 2) return 0.55
  if (dist <= 0) return 2.6
  if (dist <= 1) return 2.6 + (1.35 - 2.6) * dist
  return 1.35 + (0.55 - 1.35) * (dist - 1)
}

export default function FeaturedFish() {
  const { featuredFish, store } = useContent()
  const items = (featuredFish || []).slice(0, CARD_COUNT)
  const phone = store?.phoneRaw || '919611269901'
  const [active, setActive] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false,
  )

  const trackRef = useRef(null)
  const stripRef = useRef(null)
  const panelRefs = useRef([])
  const activeRef = useRef(0)
  const userLockUntil = useRef(0)
  const rafRef = useRef(0)

  const lockUser = (ms = 900) => {
    userLockUntil.current = Date.now() + ms
  }

  const syncPanelAttrs = (idx) => {
    panelRefs.current.forEach((el, i) => {
      if (!el) return
      const dist = Math.abs(i - idx)
      el.dataset.active = dist === 0 ? 'true' : 'false'
      el.dataset.near = dist === 1 ? 'true' : 'false'
      el.setAttribute('aria-pressed', dist === 0 ? 'true' : 'false')
    })
  }

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const deskMq = window.matchMedia('(min-width: 768px)')
    const sync = () => {
      setReduced(motionMq.matches)
      setIsDesktop(deskMq.matches)
    }
    sync()
    motionMq.addEventListener('change', sync)
    deskMq.addEventListener('change', sync)
    return () => {
      motionMq.removeEventListener('change', sync)
      deskMq.removeEventListener('change', sync)
    }
  }, [])

  // Desktop only: sticky scroll morph
  useEffect(() => {
    if (!isDesktop || reduced || items.length < 2) return undefined

    const track = trackRef.current
    if (!track) return undefined

    const apply = () => {
      const total = Math.max(1, track.offsetHeight - window.innerHeight)
      const top = track.getBoundingClientRect().top
      const scrolled = Math.min(total, Math.max(0, -top))
      const progress = scrolled / total
      const pos = progress * (items.length - 1)

      panelRefs.current.forEach((el, i) => {
        if (!el) return
        el.style.flexGrow = String(flexForDist(Math.abs(i - pos)))
      })

      const idx = Math.min(items.length - 1, Math.round(pos))
      if (idx !== activeRef.current && Date.now() >= userLockUntil.current) {
        activeRef.current = idx
        syncPanelAttrs(idx)
        setActive(idx)
      }
    }

    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        apply()
      })
    }

    apply()
    syncPanelAttrs(activeRef.current)
    window.addEventListener('scroll', onScroll, { passive: true })

    let lenis = getLenisInstance()
    lenis?.on?.('scroll', onScroll)
    const attachLate = window.setInterval(() => {
      const next = getLenisInstance()
      if (!next || next === lenis) return
      lenis?.off?.('scroll', onScroll)
      lenis = next
      lenis.on('scroll', onScroll)
      window.clearInterval(attachLate)
    }, 120)
    const stopAttach = window.setTimeout(() => window.clearInterval(attachLate), 2500)

    return () => {
      window.removeEventListener('scroll', onScroll)
      lenis?.off?.('scroll', onScroll)
      window.clearInterval(attachLate)
      window.clearTimeout(stopAttach)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isDesktop, reduced, items.length])

  // Mobile: horizontal swipe for cards, vertical swipe for the page
  useEffect(() => {
    if (isDesktop) return undefined
    const strip = stripRef.current
    if (!strip) return undefined

    let startX = 0
    let startY = 0
    let lastX = 0
    let axis = /** @type {null | 'x' | 'y'} */ (null)

    const onStart = (e) => {
      if (!e.touches[0]) return
      startX = lastX = e.touches[0].clientX
      startY = e.touches[0].clientY
      axis = null
    }

    const onMove = (e) => {
      if (!e.touches[0]) return
      const x = e.touches[0].clientX
      const y = e.touches[0].clientY
      const dx = x - startX
      const dy = y - startY

      if (!axis) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      }

      if (axis === 'x') {
        e.preventDefault()
        strip.scrollLeft -= x - lastX
        lastX = x
      }
      // axis === 'y' → let the page scroll normally
    }

    const onEnd = () => {
      if (axis === 'x') {
        const mid = strip.scrollLeft + strip.clientWidth / 2
        const panels = [...strip.querySelectorAll('[data-index]')]
        let bestLeft = strip.scrollLeft
        let bestDist = Infinity
        panels.forEach((panel) => {
          const target = panel.offsetLeft - (strip.clientWidth - panel.offsetWidth) / 2
          const center = panel.offsetLeft + panel.offsetWidth / 2
          const d = Math.abs(center - mid)
          if (d < bestDist) {
            bestDist = d
            bestLeft = Math.max(0, target)
          }
        })
        strip.scrollTo({ left: bestLeft, behavior: 'smooth' })
      }
      axis = null
    }

    strip.addEventListener('touchstart', onStart, { passive: true })
    strip.addEventListener('touchmove', onMove, { passive: false })
    strip.addEventListener('touchend', onEnd, { passive: true })
    strip.addEventListener('touchcancel', onEnd, { passive: true })

    return () => {
      strip.removeEventListener('touchstart', onStart)
      strip.removeEventListener('touchmove', onMove)
      strip.removeEventListener('touchend', onEnd)
      strip.removeEventListener('touchcancel', onEnd)
    }
  }, [isDesktop, items.length])

  // Mobile: active card from horizontal snap scroll
  useEffect(() => {
    if (isDesktop) return undefined
    const strip = stripRef.current
    if (!strip) return undefined

    let settleTimer = 0

    const pickCentered = () => {
      const mid = strip.scrollLeft + strip.clientWidth / 2
      const panels = [...strip.querySelectorAll('[data-index]')]
      let best = 0
      let bestDist = Infinity
      panels.forEach((panel) => {
        const center = panel.offsetLeft + panel.offsetWidth / 2
        const d = Math.abs(center - mid)
        if (d < bestDist) {
          bestDist = d
          best = Number(panel.dataset.index)
        }
      })
      if (best !== activeRef.current) {
        activeRef.current = best
        syncPanelAttrs(best)
        setActive(best)
      }
    }

    const onScroll = () => {
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(pickCentered, 80)
    }

    strip.addEventListener('scroll', onScroll, { passive: true })
    pickCentered()
    return () => {
      strip.removeEventListener('scroll', onScroll)
      window.clearTimeout(settleTimer)
    }
  }, [isDesktop, items.length])

  if (!items.length) {
    return (
      <section id="featured" className="section-pad relative py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-orange">Featured</p>
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
            Species in the spotlight.
          </h2>
          <p className="mt-4 max-w-md text-sm text-white/50">
            Featured species will appear here once they’re added in the CMS.
          </p>
          <Link
            to="/collection"
            onClick={() => prepareRouteChange()}
            className="mt-6 inline-block text-sm text-blue transition hover:underline"
          >
            View full collection →
          </Link>
        </div>
      </section>
    )
  }

  const steps = Math.max(1, items.length - 1)
  const useSticky = isDesktop && !reduced

  const goToCard = (i) => {
    lockUser()
    activeRef.current = i
    setActive(i)
    syncPanelAttrs(i)

    if (!isDesktop) {
      const strip = stripRef.current
      const panel = strip?.querySelector(`[data-index="${i}"]`)
      if (strip && panel) {
        const left = panel.offsetLeft - (strip.clientWidth - panel.offsetWidth) / 2
        strip.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
      }
      return
    }

    panelRefs.current.forEach((el, j) => {
      if (!el) return
      el.style.flexGrow = String(flexForDist(Math.abs(j - i)))
    })

    if (!useSticky || items.length < 2) return
    const track = trackRef.current
    if (!track) return
    const total = Math.max(1, track.offsetHeight - window.innerHeight)
    const top =
      track.getBoundingClientRect().top + window.scrollY + (i / (items.length - 1)) * total
    scrollToY(top)
  }

  return (
    <div
      ref={trackRef}
      className="relative"
      style={useSticky ? { height: `${100 + steps * 90}vh` } : undefined}
    >
      <div
        className={
          useSticky
            ? 'sticky top-0 flex min-h-[100svh] flex-col justify-center bg-[var(--bg)] py-16 lg:py-20'
            : 'relative bg-[var(--bg)] py-16 sm:py-20'
        }
      >
        <section id="featured" className="relative">
          <div className="section-pad mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="mb-4 text-xs uppercase tracking-[0.3em] text-orange">Featured</p>
                <h2 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
                  Species in the spotlight.
                </h2>
              </div>
              <Link
                to="/collection"
                onClick={() => prepareRouteChange()}
                className="text-sm text-blue transition hover:underline"
              >
                View full collection →
              </Link>
            </div>
          </div>

          <div
            ref={stripRef}
            className={
              isDesktop
                ? 'featured-strip flex h-[400px] gap-3 overflow-visible px-[clamp(1.25rem,4vw,5rem)] pb-2 lg:h-[460px]'
                : 'featured-mobile-strip flex h-[320px] gap-3 overflow-x-auto px-[clamp(1.25rem,4vw,5rem)] pb-2 snap-x snap-mandatory sm:h-[360px]'
            }
          >
            {items.map((fish, i) => {
              const isActive = i === active
              return (
                <div
                  key={fish.id}
                  role="button"
                  tabIndex={0}
                  data-index={i}
                  data-active={isActive ? 'true' : 'false'}
                  data-near={Math.abs(i - active) === 1 ? 'true' : 'false'}
                  ref={(el) => {
                    panelRefs.current[i] = el
                  }}
                  onClick={() => goToCard(i)}
                  onKeyDown={(e) => {
                    if (e.target !== e.currentTarget) return
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      goToCard(i)
                    }
                  }}
                  aria-pressed={isActive}
                  aria-label={`${fish.name} — featured item${isActive ? '' : ', select to expand'}`}
                  className={
                    isDesktop
                      ? 'featured-panel relative h-full min-w-0 cursor-pointer overflow-hidden rounded-[1.5rem] text-left contain-paint'
                      : 'featured-panel relative h-full w-[min(68vw,260px)] shrink-0 cursor-pointer snap-center overflow-hidden rounded-[1.5rem] text-left contain-paint'
                  }
                  style={
                    isDesktop
                      ? {
                          flexGrow: flexForDist(Math.abs(i - active)),
                          flexBasis: 0,
                          flexShrink: 1,
                        }
                      : undefined
                  }
                >
                  <img
                    src={fish.image}
                    alt={fish.name}
                    className="featured-panel__img pointer-events-none absolute inset-0 h-full w-full object-cover brightness-110"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                  />
                  <div className="featured-panel__shade pointer-events-none absolute inset-0" />

                  <div className="featured-panel__near pointer-events-none absolute inset-x-0 bottom-0 p-4">
                    <p className="mt-1 font-display text-base font-semibold text-white">{fish.name}</p>
                  </div>

                  <div className="featured-panel__far pointer-events-none absolute inset-0 flex items-end p-4">
                    <span
                      className="font-display text-sm font-semibold text-white"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {fish.name}
                    </span>
                  </div>

                  <div
                    className="featured-panel__detail absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6"
                    aria-hidden={!isActive}
                  >
                    <h3 className="pointer-events-none font-display text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
                      {fish.name}
                    </h3>
                    {isDesktop && fish.subtitle ? (
                      <p className="pointer-events-none mt-2 text-sm italic text-white/50">
                        {fish.subtitle}
                      </p>
                    ) : null}
                    {isDesktop && fish.description ? (
                      <p className="pointer-events-none mt-2 line-clamp-2 text-sm text-white/60">
                        {fish.description}
                      </p>
                    ) : null}
                    <a
                      href={`https://wa.me/${phone}?text=${encodeURIComponent(
                        `Hi Greenland Aquarium, I'm interested in the ${fish.name}.`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      tabIndex={isActive ? 0 : -1}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#25d366] px-2.5 py-1.5 text-[11px] font-semibold transition hover:bg-[#20bd5a] sm:mt-4 sm:gap-1.5 sm:px-3.5 sm:py-2 sm:text-sm"
                      style={{ color: '#000000' }}
                    >
                      <MessageCircle size={13} color="#000000" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
