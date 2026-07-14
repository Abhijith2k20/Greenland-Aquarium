import { useEffect, useRef, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import setupImg from '../assets/services/setup.webp'
import aquascapeImg from '../assets/services/aquascape.webp'
import maintenanceImg from '../assets/services/maintenance.webp'

const SERVICE_IMAGES = {
  1: setupImg,
  2: aquascapeImg,
  3: maintenanceImg,
}

const SERVICE_META = {
  1: {
    tint: '#4fc3f7',
    kicker: 'Build',
    includes: ['Site visit & layout plan', 'Equipment sizing', 'Cycling guidance'],
  },
  2: {
    tint: '#2ecc71',
    kicker: 'Design',
    includes: ['Hardscape composition', 'Plant selection', 'Finish styling'],
  },
  3: {
    tint: '#7ec8f0',
    kicker: 'Care',
    includes: ['Water changes', 'Filter care', 'Health check-ins'],
  },
}

function serviceEnquireUrl(phone, title) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(
    `Hi Greenland Aquarium, I'd like to know more about your ${title} service.`,
  )}`
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function ServiceCard({ service, phone, eager = false }) {
  const meta = SERVICE_META[service.id] || SERVICE_META[1]
  const src = SERVICE_IMAGES[service.id]

  return (
    <article className="services-scroll__card" style={{ '--svc-tint': meta.tint }}>
      <div className="services-scroll__media">
        {src ? (
          <img
            src={src}
            alt={service.imageAlt || ''}
            className="services-scroll__img"
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
          />
        ) : (
          <div className="services-scroll__fallback" />
        )}
        <div className="services-scroll__veil" aria-hidden />
      </div>

      <div className="services-scroll__body">
        <p className="services-scroll__kicker">{meta.kicker}</p>
        <h3 className="services-scroll__title">{service.title}</h3>
        <p className="services-scroll__desc">{service.description}</p>

        <div className="services-scroll__panel">
          <p className="services-scroll__panel-label">What’s included</p>
          <ul className="services-scroll__includes">
            {meta.includes.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <a
          href={serviceEnquireUrl(phone, service.title)}
          target="_blank"
          rel="noreferrer"
          className="services-scroll__cta"
          data-svc-cta
        >
          <MessageCircle size={18} strokeWidth={2} aria-hidden />
          Enquire on WhatsApp
        </a>
      </div>
    </article>
  )
}

/**
 * Curate-style performance model:
 * - transform/opacity only (compositor)
 * - no React setState while scrolling
 * - progress from cached scroll metrics (no getBoundingClientRect every frame)
 * - will-change only while actively scrubbing
 */
export default function Services() {
  const { services, store } = useContent()
  const items = Array.isArray(services) ? services.slice(0, 3) : []
  const phone = store?.phoneRaw || '919611269901'
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const stickyRef = useRef(null)
  const cardRefs = useRef([])
  const activeRef = useRef(0)
  const [useScrollStack, setUseScrollStack] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setUseScrollStack(!mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!useScrollStack || items.length < 2) return undefined

    const section = sectionRef.current
    const track = trackRef.current
    const sticky = stickyRef.current
    if (!section || !track || !sticky) return undefined

    const cards = cardRefs.current.filter(Boolean)
    const tints = items.map((s) => (SERVICE_META[s.id] || SERVICE_META[1]).tint)
    const steps = items.length - 1

    let raf = 0
    let visible = false
    let scrubbing = false
    let idleTimer = 0
    let trackTop = 0
    let trackHeight = 0
    let viewportH = window.innerHeight

    const measure = () => {
      viewportH = window.innerHeight
      // One layout read on resize / enter — not on every scroll tick
      const rect = track.getBoundingClientRect()
      trackTop = window.scrollY + rect.top
      trackHeight = track.offsetHeight
    }

    const setActiveDom = (idx) => {
      activeRef.current = idx
      section.style.setProperty('--svc-tint', tints[idx] || tints[0])

      cards.forEach((card, i) => {
        const on = i === idx
        card.classList.toggle('is-active', on)
        card.setAttribute('aria-hidden', on ? 'false' : 'true')
        card.style.pointerEvents = on ? 'auto' : 'none'
        const cta = card.querySelector('[data-svc-cta]')
        if (cta) cta.tabIndex = on ? 0 : -1
      })
    }

    const applyCard = (card, y, scale, opacity, z) => {
      // transform + opacity only — same cheap path Curate-style themes use
      card.style.transform = `translate3d(0, ${y}%, 0) scale(${scale})`
      card.style.opacity = opacity < 0.02 ? '0' : String(opacity)
      card.style.zIndex = String(z)
    }

    const update = () => {
      raf = 0
      if (!visible) return

      const total = Math.max(1, trackHeight - viewportH)
      const scrolled = clamp(window.scrollY - trackTop, 0, total)
      const exact = (scrolled / total) * steps
      const idx = clamp(Math.round(exact), 0, steps)

      if (idx !== activeRef.current) setActiveDom(idx)

      for (let i = 0; i < cards.length; i += 1) {
        const card = cards[i]
        if (!card) continue
        const local = exact - i

        // Skip far-away cards (keeps compositor quieter)
        if (local <= -1.15 || local >= 1.15) {
          applyCard(card, local < 0 ? 110 : 0, local < 0 ? 1 : 0.94, 0, i + 1)
          continue
        }

        let y = 0
        let scale = 1
        let opacity = 1

        if (local < 0) {
          const t = local + 1
          y = (1 - t) * 110
          opacity = 0.35 + t * 0.65
          scale = 0.92 + t * 0.08
        } else {
          y = 0
          scale = 1 - local * 0.06
          opacity = 1 - local * 0.35
        }

        applyCard(card, y, scale, opacity, i + 1)
      }
    }

    const markScrubbing = () => {
      if (!scrubbing) {
        scrubbing = true
        sticky.classList.add('is-scrubbing')
      }
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => {
        scrubbing = false
        sticky.classList.remove('is-scrubbing')
      }, 140)
    }

    const onScroll = () => {
      if (!visible) return
      markScrubbing()
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    const onResize = () => {
      measure()
      update()
    }

    measure()
    setActiveDom(0)
    applyCard(cards[0], 0, 1, 1, 1)
    for (let i = 1; i < cards.length; i += 1) {
      applyCard(cards[i], 110, 1, 0, i + 1)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) {
          measure()
          onScroll()
        } else {
          sticky.classList.remove('is-scrubbing')
        }
      },
      { rootMargin: '15% 0px' },
    )
    io.observe(track)

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(idleTimer)
      if (raf) cancelAnimationFrame(raf)
      sticky.classList.remove('is-scrubbing')
    }
  }, [items, useScrollStack])

  if (!items.length) return null

  if (!useScrollStack) {
    return (
      <section id="services" className="services-simple relative bg-[var(--bg)] py-16 md:py-24">
        <div className="services-scroll__shell mx-auto">
          <header className="services-scroll__intro">
            <p className="services-scroll__eyebrow">Services</p>
            <h2 className="services-scroll__heading">Crafted care, end to end.</h2>
          </header>
          <div className="services-simple__list">
            {items.map((service, i) => (
              <ServiceCard key={service.id} service={service} phone={phone} eager={i === 0} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const firstTint = (SERVICE_META[items[0]?.id] || SERVICE_META[1]).tint

  return (
    <section
      ref={sectionRef}
      id="services"
      className="services-scroll relative bg-[var(--bg)]"
      style={{ '--svc-tint': firstTint }}
    >
      <div
        ref={trackRef}
        className="services-scroll__track"
        style={{ height: `${items.length * 100}svh` }}
      >
        <div ref={stickyRef} className="services-scroll__sticky">
          <div className="services-scroll__shell mx-auto flex h-full flex-col py-8 md:py-12">
            <header className="services-scroll__intro">
              <p className="services-scroll__eyebrow">Services</p>
              <h2 className="services-scroll__heading">Crafted care, end to end.</h2>
            </header>

            <div className="services-scroll__stage">
              {items.map((service, i) => (
                <div
                  key={service.id}
                  ref={(el) => {
                    cardRefs.current[i] = el
                  }}
                  className={`services-scroll__card-wrap${i === 0 ? ' is-active' : ''}`}
                  aria-hidden={i === 0 ? 'false' : 'true'}
                >
                  <ServiceCard service={service} phone={phone} eager={i === 0} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
