import { useEffect, useRef, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import setupImg from '../assets/services/setup.jpg'
import aquascapeImg from '../assets/services/aquascape.jpg'
import maintenanceImg from '../assets/services/maintenance.jpg'

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

export default function Services() {
  const { services, store } = useContent()
  const items = Array.isArray(services) ? services.slice(0, 3) : []
  const phone = store?.phoneRaw || '919611269901'
  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduced || items.length < 2) return undefined

    const track = trackRef.current
    if (!track) return undefined

    let raf = 0
    const update = () => {
      raf = 0
      const rect = track.getBoundingClientRect()
      const total = Math.max(1, track.offsetHeight - window.innerHeight)
      const scrolled = clamp(-rect.top, 0, total)
      const progress = scrolled / total
      const steps = items.length - 1
      const exact = progress * steps
      const idx = clamp(Math.round(exact), 0, steps)

      if (idx !== activeRef.current) {
        activeRef.current = idx
        setActive(idx)
      }

      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const local = exact - i
        let y = 0
        let scale = 1
        let opacity = 1

        if (local < -1) {
          y = 110
          opacity = 0
          scale = 1
        } else if (local < 0) {
          const t = local + 1
          y = (1 - t) * 110
          opacity = 0.35 + t * 0.65
          scale = 0.92 + t * 0.08
        } else if (local < 1) {
          y = 0
          scale = 1 - local * 0.06
          opacity = 1 - local * 0.35
        } else {
          y = 0
          scale = 0.94
          opacity = 0
        }

        card.style.transform = `translate3d(0, ${y}%, 0) scale(${scale})`
        card.style.opacity = String(opacity)
        card.style.zIndex = String(i + 1)
      })
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [items, reduced])

  if (!items.length) return null

  if (reduced) {
    return (
      <section id="services" className="section-pad relative py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-green">Services</p>
          <h2 className="mb-10 font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Crafted care, end to end.
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {items.map((service) => {
              const src = SERVICE_IMAGES[service.id]
              return (
                <article key={service.id}>
                  {src ? (
                    <img
                      src={src}
                      alt={service.imageAlt || ''}
                      className="aspect-[4/3] w-full rounded-2xl object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <h3 className="mt-5 font-display text-2xl font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm text-white/55">{service.description}</p>
                  <a
                    href={serviceEnquireUrl(phone, service.title)}
                    target="_blank"
                    rel="noreferrer"
                    className="services-stack__cta mt-4"
                  >
                    <MessageCircle size={15} aria-hidden />
                    Enquire on WhatsApp
                  </a>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  const activeItem = items[active] || items[0]
  const activeMeta = SERVICE_META[activeItem.id] || SERVICE_META[1]

  return (
    <section
      id="services"
      className="services-scroll relative bg-[var(--bg)]"
      style={{ '--svc-tint': activeMeta.tint }}
    >
      <div
        ref={trackRef}
        className="services-scroll__track"
        style={{ height: `${items.length * 100}svh` }}
      >
        <div className="services-scroll__sticky">
          <div className="services-scroll__shell mx-auto flex h-full flex-col py-8 md:py-12">
            <header className="services-scroll__intro">
              <p className="services-scroll__eyebrow">Services</p>
              <h2 className="services-scroll__heading">Crafted care, end to end.</h2>
            </header>

            <div className="services-scroll__stage">
              {items.map((service, i) => {
                const meta = SERVICE_META[service.id] || SERVICE_META[1]
                const src = SERVICE_IMAGES[service.id]
                return (
                  <article
                    key={service.id}
                    ref={(el) => {
                      cardRefs.current[i] = el
                    }}
                    className="services-scroll__card"
                    style={{ '--svc-tint': meta.tint }}
                    aria-hidden={i !== active}
                  >
                    <div className="services-scroll__media">
                      {src ? (
                        <img
                          src={src}
                          alt={service.imageAlt || ''}
                          className="services-scroll__img"
                          loading={i === 0 ? 'eager' : 'lazy'}
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
                        tabIndex={i === active ? 0 : -1}
                      >
                        <MessageCircle size={18} strokeWidth={2} aria-hidden />
                        Enquire on WhatsApp
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="services-scroll__dots" aria-hidden>
              {items.map((service, i) => (
                <span
                  key={service.id}
                  className={`services-scroll__dot${i === active ? ' is-active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
