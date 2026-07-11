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
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false,
  )

  const trackRef = useRef(null)
  const stripRef = useRef(null)
  const panelRefs = useRef([])
  const activeRef = useRef(0)
  const userLockUntil = useRef(0)
  const scrollingStrip = useRef(false)
  const rafRef = useRef(0)

  const lockUser = (ms = 1200) => {
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
    const mq = window.matchMedia('(min-width: 768px)')
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Desktop: sticky track — morph flex via DOM only; avoid React re-renders on scroll
  useEffect(() => {
    if (!isDesktop || items.length < 2) return undefined

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

    // Native scroll + Lenis (RAF-deduped). Attach both so morph stays in sync
    // even if Lenis mounts after this section.
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
  }, [isDesktop, items.length])

  // Mobile: sync active from horizontal snap
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
        setActive(best)
      }
    }

    const onScroll = () => {
      scrollingStrip.current = true
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(() => {
        scrollingStrip.current = false
        pickCentered()
      }, 80)
    }

    strip.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      strip.removeEventListener('scroll', onScroll)
      window.clearTimeout(settleTimer)
    }
  }, [isDesktop, items.length])

  if (!items.length) return null

  const steps = Math.max(1, items.length - 1)

  const goToCard = (i) => {
    lockUser()
    activeRef.current = i
    setActive(i)
    syncPanelAttrs(i)

    if (isDesktop) {
      panelRefs.current.forEach((el, j) => {
        if (!el) return
        el.style.flexGrow = String(flexForDist(Math.abs(j - i)))
      })
    }

    if (!isDesktop) {
      const strip = stripRef.current
      const panel = strip?.querySelector(`[data-index="${i}"]`)
      if (strip && panel) {
        const left = panel.offsetLeft - (strip.clientWidth - panel.offsetWidth) / 2
        strip.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
      }
      return
    }

    const track = trackRef.current
    if (!track || items.length < 2) return
    const total = Math.max(1, track.offsetHeight - window.innerHeight)
    const top =
      track.getBoundingClientRect().top +
      window.scrollY +
      (i / (items.length - 1)) * total
    scrollToY(top)
  }

  return (
    <div
      ref={trackRef}
      className="relative"
      style={isDesktop ? { height: `${100 + steps * 90}vh` } : undefined}
    >
      <div
        className={
          isDesktop
            ? 'sticky top-0 flex min-h-[100svh] flex-col justify-center bg-[var(--bg)] py-16 lg:py-20'
            : 'relative py-28'
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
                data-cursor="hover"
              >
                View full collection →
              </Link>
            </div>
          </div>

          <div
            ref={stripRef}
            className="flex h-[320px] gap-3 overflow-x-auto overscroll-x-contain px-[clamp(1.25rem,4vw,5rem)] pb-2 [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x snap-x snap-mandatory sm:h-[360px] md:h-[420px] md:gap-3 md:overflow-visible md:overscroll-auto md:touch-auto md:snap-none lg:h-[460px] [&::-webkit-scrollbar]:hidden"
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
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      goToCard(i)
                    }
                  }}
                  data-cursor="hover"
                  aria-pressed={isActive}
                  aria-label={`${fish.name} — featured item`}
                  className={`featured-panel relative h-full shrink-0 cursor-pointer snap-center overflow-hidden rounded-[1.5rem] text-left contain-paint md:snap-align-none ${
                    isDesktop
                      ? 'flex-[1_1_0%]'
                      : 'w-[min(68vw,260px)] transition-[flex] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
                  }`}
                  style={
                    isDesktop
                      ? { flexGrow: flexForDist(Math.abs(i - active)), flexBasis: 0 }
                      : undefined
                  }
                >
                  <img
                    src={fish.image}
                    alt=""
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

                  <div className="featured-panel__detail absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6">
                    <h3 className="pointer-events-none font-display text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
                      {fish.name}
                    </h3>
                    {fish.subtitle && (
                      <p className="pointer-events-none mt-2 text-sm italic text-white/50">
                        {fish.subtitle}
                      </p>
                    )}
                    {fish.description && (
                      <p className="pointer-events-none mt-2 line-clamp-2 text-sm text-white/60">
                        {fish.description}
                      </p>
                    )}
                    <a
                      href={`https://wa.me/${phone}?text=${encodeURIComponent(
                        `Hi Greenland Aquarium, I'm interested in the ${fish.name}.`,
                      )}`}
                      target="_blank"
                      rel="noreferrer"
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
