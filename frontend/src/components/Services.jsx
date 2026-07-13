import { useEffect, useRef, useState } from 'react'
import { useContent } from '../context/ContentContext'
import { scrollToY } from '../lib/lenisBridge'
import setupImg from '../assets/services/setup.jpg'
import aquascapeImg from '../assets/services/aquascape.jpg'
import maintenanceImg from '../assets/services/maintenance.jpg'

const SERVICE_IMAGES = {
  1: setupImg,
  2: aquascapeImg,
  3: maintenanceImg,
}

const SERVICE_ACCENTS = {
  1: { glow: 'rgba(79, 195, 247, 0.22)', tint: '#4fc3f7' },
  2: { glow: 'rgba(46, 204, 113, 0.2)', tint: '#2ecc71' },
  3: { glow: 'rgba(126, 200, 240, 0.18)', tint: '#7ec8f0' },
}

export default function Services() {
  const { services } = useContent()
  const items = Array.isArray(services) ? services.slice(0, 3) : []
  const trackRef = useRef(null)
  const stageRef = useRef(null)
  const [active, setActive] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false,
  )
  const activeRef = useRef(0)
  const userLockUntil = useRef(0)

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

  useEffect(() => {
    if (reduced || items.length < 2) return undefined

    const track = trackRef.current
    const stage = stageRef.current
    if (!track || !stage) return undefined

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const total = Math.max(1, track.offsetHeight - window.innerHeight)
        const top = track.getBoundingClientRect().top
        const scrolled = Math.min(total, Math.max(0, -top))
        const progress = scrolled / total
        const pos = progress * (items.length - 1)
        const idx = Math.min(items.length - 1, Math.round(pos))

        stage.style.setProperty('--services-progress', String(progress))
        stage.style.setProperty('--services-pos', String(pos))
        stage.dataset.active = String(idx)

        const accent = SERVICE_ACCENTS[items[idx]?.id] || SERVICE_ACCENTS[1]
        stage.style.setProperty('--services-glow', accent.glow)
        stage.style.setProperty('--services-tint', accent.tint)

        if (idx !== activeRef.current && Date.now() >= userLockUntil.current) {
          activeRef.current = idx
          setActive(idx)
        }
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [items, reduced])

  if (!items.length) return null

  if (reduced) {
    return (
      <section id="services" className="section-pad relative overflow-hidden py-28 md:py-36">
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-green">Services</p>
          <h2 className="mb-14 font-display text-4xl font-semibold tracking-tight md:text-6xl">
            Crafted care, end to end.
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {items.map((service) => {
              const src = SERVICE_IMAGES[service.id]
              return (
                <div key={service.id}>
                  {src ? (
                    <img
                      src={src}
                      alt={service.imageAlt || ''}
                      className="aspect-square w-full rounded-2xl object-cover"
                      loading="lazy"
                    />
                  ) : null}
                  <h3 className="mt-5 font-display text-2xl font-semibold">{service.title}</h3>
                  <p className="mt-3 text-white/55">{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  const goTo = (i) => {
    const track = trackRef.current
    if (!track) return
    userLockUntil.current = Date.now() + 700
    activeRef.current = i
    setActive(i)
    if (items.length < 2) return
    const total = Math.max(1, track.offsetHeight - window.innerHeight)
    const top =
      track.getBoundingClientRect().top + window.scrollY + (i / (items.length - 1)) * total
    scrollToY(top)
  }

  return (
    <section id="services" className="relative bg-[#050505]">
      <div
        ref={trackRef}
        className="services-track"
        style={{
          height: `calc(100svh + ${(items.length - 1) * (narrow ? 48 : 90)}svh)`,
        }}
      >
        <div className={`services-sticky ${narrow ? 'services-sticky--mobile' : ''}`}>
          <div
            ref={stageRef}
            className="services-canvas"
            data-active="0"
            style={{
              '--services-progress': 0,
              '--services-pos': 0,
              '--services-glow': SERVICE_ACCENTS[1].glow,
              '--services-tint': SERVICE_ACCENTS[1].tint,
            }}
          >
            <div className="services-canvas__glow" aria-hidden />

            <div className="section-pad relative z-10 mx-auto flex h-full max-w-7xl flex-col py-12 md:py-24">
              <header className={`services-header ${narrow ? 'services-header--mobile' : ''}`}>
                <p className="services-header__eyebrow">Services</p>
                <h2 className="services-header__title">Crafted care, end to end.</h2>
              </header>

              <div className={`services-layout ${narrow ? 'services-layout--mobile' : ''}`}>
                {narrow ? (
                  <>
                    <div className="services-frame">
                      {items.map((service, i) => {
                        const src = SERVICE_IMAGES[service.id]
                        return (
                          <div
                            key={service.id}
                            className={`services-shot ${i === active ? 'is-active' : ''}`}
                            aria-hidden={i !== active}
                          >
                            {src ? (
                              <img
                                src={src}
                                alt={service.imageAlt || ''}
                                className="services-shot__img"
                                loading={i === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                                draggable={false}
                              />
                            ) : (
                              <div className="services-shot__fallback" />
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="services-copy">
                      {items.map((service, i) => (
                        <article
                          key={service.id}
                          className={`services-card ${i === active ? 'is-active' : ''}`}
                          aria-hidden={i !== active}
                        >
                          <h3 className="services-card__title">{service.title}</h3>
                          <p className="services-card__desc">{service.description}</p>
                        </article>
                      ))}

                      <nav className="services-rail services-rail--row" aria-label="Services">
                        {items.map((service, i) => (
                          <button
                            key={service.id}
                            type="button"
                            className={`services-rail__pill ${i === active ? 'is-active' : ''}`}
                            aria-current={i === active ? 'true' : undefined}
                            onClick={() => goTo(i)}
                          >
                            {service.title}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="services-copy">
                      {items.map((service, i) => (
                        <article
                          key={service.id}
                          className={`services-card ${i === active ? 'is-active' : ''}`}
                          aria-hidden={i !== active}
                        >
                          <h3 className="services-card__title">{service.title}</h3>
                          <p className="services-card__desc">{service.description}</p>
                        </article>
                      ))}

                      <nav className="services-rail" aria-label="Services">
                        {items.map((service, i) => (
                          <button
                            key={service.id}
                            type="button"
                            className={`services-rail__item ${i === active ? 'is-active' : ''}`}
                            aria-current={i === active ? 'true' : undefined}
                            onClick={() => goTo(i)}
                          >
                            <span className="services-rail__line" aria-hidden />
                            <span className="services-rail__name">{service.title}</span>
                          </button>
                        ))}
                      </nav>
                    </div>

                    <div className="services-frame">
                      <div className="services-frame__sheen" aria-hidden />
                      {items.map((service, i) => {
                        const src = SERVICE_IMAGES[service.id]
                        return (
                          <div
                            key={service.id}
                            className={`services-shot ${i === active ? 'is-active' : ''}`}
                            aria-hidden={i !== active}
                          >
                            {src ? (
                              <img
                                src={src}
                                alt={service.imageAlt || ''}
                                className="services-shot__img"
                                loading={i === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                                draggable={false}
                              />
                            ) : (
                              <div className="services-shot__fallback" />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
