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
    if (!isDesktop) return
    lockUser()
    activeRef.current = i
    setActive(i)
    syncPanelAttrs(i)

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

  const header = (
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
  )

  // Mobile: static cards + native horizontal scroll only
  if (!isDesktop) {
    return (
      <section id="featured" className="relative bg-[var(--bg)] py-16">
        {header}
        <div className="featured-mobile-strip">
          {items.map((fish) => (
            <article key={fish.id} className="featured-mobile-card">
              <img
                src={fish.image}
                alt={fish.name}
                className="featured-mobile-card__img"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              <div className="featured-mobile-card__shade" aria-hidden />
              <div className="featured-mobile-card__body">
                <h3 className="featured-mobile-card__title">{fish.name}</h3>
                <a
                  href={`https://wa.me/${phone}?text=${encodeURIComponent(
                    `Hi Greenland Aquarium, I'm interested in the ${fish.name}.`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="featured-mobile-card__cta"
                >
                  <MessageCircle size={13} color="#000000" />
                  WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    )
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
          {header}

          <div className="featured-strip flex h-[400px] gap-3 overflow-visible px-[clamp(1.25rem,4vw,5rem)] pb-2 lg:h-[460px]">
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
                  className="featured-panel relative h-full min-w-0 cursor-pointer overflow-hidden rounded-[1.5rem] text-left contain-paint"
                  style={{
                    flexGrow: flexForDist(Math.abs(i - active)),
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
                    className="featured-panel__detail absolute inset-x-0 bottom-0 p-5 lg:p-6"
                    aria-hidden={!isActive}
                  >
                    <h3 className="pointer-events-none font-display text-2xl font-semibold tracking-tight text-white lg:text-3xl">
                      {fish.name}
                    </h3>
                    {fish.subtitle ? (
                      <p className="pointer-events-none mt-2 text-sm italic text-white/50">
                        {fish.subtitle}
                      </p>
                    ) : null}
                    {fish.description ? (
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
                      className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#25d366] px-3.5 py-2 text-sm font-semibold transition hover:bg-[#20bd5a]"
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
