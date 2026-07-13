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

/** Slightly tighter morph on narrow screens so 3 cards still fit. */
function flexForDistMobile(dist) {
  if (dist >= 2) return 0.42
  if (dist <= 0) return 2.35
  if (dist <= 1) return 2.35 + (1.05 - 2.35) * dist
  return 1.05 + (0.42 - 1.05) * (dist - 1)
}

export default function FeaturedFish() {
  const { featuredFish, store } = useContent()
  const items = (featuredFish || []).slice(0, CARD_COUNT)
  const phone = store?.phoneRaw || '919611269901'
  const [active, setActive] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false,
  )

  const trackRef = useRef(null)
  const panelRefs = useRef([])
  const activeRef = useRef(0)
  const userLockUntil = useRef(0)
  const rafRef = useRef(0)

  const lockUser = (ms = 1200) => {
    userLockUntil.current = Date.now() + ms
  }

  const flexFn = narrow ? flexForDistMobile : flexForDist

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
    const narrowMq = window.matchMedia('(max-width: 767px)')
    const sync = () => {
      setReduced(motionMq.matches)
      setNarrow(narrowMq.matches)
    }
    sync()
    motionMq.addEventListener('change', sync)
    narrowMq.addEventListener('change', sync)
    return () => {
      motionMq.removeEventListener('change', sync)
      narrowMq.removeEventListener('change', sync)
    }
  }, [])

  // Sticky track scroll morph — desktop + mobile (disabled only for reduced motion)
  useEffect(() => {
    if (reduced || items.length < 2) return undefined

    const track = trackRef.current
    if (!track) return undefined

    const apply = () => {
      const total = Math.max(1, track.offsetHeight - window.innerHeight)
      const top = track.getBoundingClientRect().top
      const scrolled = Math.min(total, Math.max(0, -top))
      const progress = scrolled / total
      const pos = progress * (items.length - 1)
      const grow = narrow ? flexForDistMobile : flexForDist

      panelRefs.current.forEach((el, i) => {
        if (!el) return
        el.style.flexGrow = String(grow(Math.abs(i - pos)))
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
  }, [reduced, items.length, narrow])

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
  const useSticky = !reduced

  const goToCard = (i) => {
    lockUser()
    activeRef.current = i
    setActive(i)
    syncPanelAttrs(i)

    panelRefs.current.forEach((el, j) => {
      if (!el) return
      el.style.flexGrow = String(flexFn(Math.abs(j - i)))
    })

    if (!useSticky) return

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
      style={useSticky ? { height: `${100 + steps * (narrow ? 75 : 90)}vh` } : undefined}
    >
      <div
        className={
          useSticky
            ? 'sticky top-0 flex min-h-[100svh] flex-col justify-center bg-[var(--bg)] py-14 sm:py-16 lg:py-20'
            : 'relative py-20 sm:py-24'
        }
      >
        <section id="featured" className="relative">
          <div className="section-pad mx-auto max-w-7xl">
            <div className="mb-7 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
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
            className={`featured-strip flex gap-2 overflow-visible px-[clamp(1rem,4vw,5rem)] pb-2 sm:gap-3 ${
              narrow ? 'h-[300px]' : 'h-[400px] lg:h-[460px]'
            }`}
          >
            {items.map((fish, i) => {
              const isActive = i === active

              return (
                <div
                  key={fish.id}
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
                  tabIndex={0}
                  aria-label={`${fish.name} — featured item${isActive ? '' : ', select to expand'}`}
                  className="featured-panel relative h-full min-w-0 cursor-pointer overflow-hidden rounded-[1.25rem] text-left contain-paint sm:rounded-[1.5rem]"
                  style={{
                    flexGrow: flexFn(Math.abs(i - active)),
                    flexBasis: 0,
                    flexShrink: 1,
                  }}
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

                  <div className="featured-panel__near pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <p className="mt-1 font-display text-sm font-semibold text-white sm:text-base">
                      {fish.name}
                    </p>
                  </div>

                  <div className="featured-panel__far pointer-events-none absolute inset-0 flex items-end p-3 sm:p-4">
                    <span
                      className="font-display text-xs font-semibold text-white sm:text-sm"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      {fish.name}
                    </span>
                  </div>

                  <div
                    className="featured-panel__detail absolute inset-x-0 bottom-0 p-3.5 sm:p-5 lg:p-6"
                    aria-hidden={!isActive}
                  >
                    <h3 className="pointer-events-none font-display text-lg font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
                      {fish.name}
                    </h3>
                    {fish.subtitle && (
                      <p className="pointer-events-none mt-1.5 text-xs italic text-white/50 sm:mt-2 sm:text-sm">
                        {fish.subtitle}
                      </p>
                    )}
                    {fish.description && (
                      <p className="pointer-events-none mt-2 hidden text-sm text-white/60 sm:line-clamp-2 sm:block">
                        {fish.description}
                      </p>
                    )}
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
