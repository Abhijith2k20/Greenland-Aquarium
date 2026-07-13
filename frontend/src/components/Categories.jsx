import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useContent } from '../context/ContentContext'
import { prepareRouteChange } from '../lib/prepareRouteChange'

export default function Categories() {
  const { categories, loading } = useContent()
  const navigate = useNavigate()
  const swiperRef = useRef(null)

  const items = categories || []
  const count = items.length
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 767px), (pointer: coarse)').matches
      : true,
  )
  // Fewer duplicates on mobile — 30 slides was a major lag source
  const repeatCount = isMobile ? 3 : 5
  const skeletonSlideCount = 9
  const initialSlide = count > 0 ? count * Math.floor(repeatCount / 2) : 0
  const activeStartSlide = count > 0 ? initialSlide : Math.floor(skeletonSlideCount / 2)
  const slides = useMemo(() => {
    if (loading && count === 0) {
      return Array.from({ length: skeletonSlideCount }).map((_, i) => ({
        id: `sk-${i}`,
        skeleton: true,
        sourceIndex: i,
      }))
    }

    if (count === 0) return []

    return Array.from({ length: repeatCount }).flatMap((_, group) =>
      items.map((cat, sourceIndex) => ({
        ...cat,
        sourceIndex,
        loopKey: `${cat.id}-${group}`,
      })),
    )
  }, [count, items, loading, repeatCount, skeletonSlideCount])

  const toCollection = (path) => (e) => {
    e.preventDefault()
    prepareRouteChange()
    navigate(path)
  }

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px), (pointer: coarse)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (count === 0 || !swiperRef.current) return undefined

    const raf = requestAnimationFrame(() => {
      const swiper = swiperRef.current
      if (!swiper) return
      swiper.update()
      swiper.slideTo(initialSlide, 0)
    })

    return () => cancelAnimationFrame(raf)
  }, [count, initialSlide])

  if (!loading && count === 0) {
    return (
      <section id="categories" className="inspire section-pad relative py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="inspire__eyebrow">Collection</p>
          <h2 className="inspire__heading">Featured Categories</h2>
          <Link
            to="/collection"
            onClick={toCollection('/collection')}
            className="mt-6 inline-block text-sm text-blue transition hover:underline"
          >
            Browse all
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section id="categories" className="inspire relative py-20 md:py-28">
      <div className="section-pad mx-auto max-w-7xl">
        <div className="inspire__intro">
          <p className="inspire__eyebrow">Collection</p>
          <h2 className="inspire__heading">Featured Categories</h2>
        </div>
      </div>

      <div className="inspire__viewport">
        <button
          type="button"
          className="inspire__arrow inspire__arrow--prev"
          aria-label="Previous"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ChevronLeft size={20} strokeWidth={2} aria-hidden />
        </button>

        <Swiper
          key={count > 0 ? `categories-ready-${count}` : 'categories-loading'}
          className="inspire__swiper"
          centeredSlides
          initialSlide={activeStartSlide}
          slidesPerView={1.45}
          spaceBetween={15}
          speed={280}
          grabCursor
          slideToClickedSlide
          touchAngle={25}
          threshold={12}
          touchStartPreventDefault={false}
          breakpoints={{
            600: { slidesPerView: 1.9, spaceBetween: 16 },
            900: { slidesPerView: 2.75, spaceBetween: 18 },
            1200: { slidesPerView: 3.85, spaceBetween: 20 },
            1600: { slidesPerView: 4.9, spaceBetween: 22 },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
            requestAnimationFrame(() => {
              swiper.update()
              swiper.slideTo(activeStartSlide, 0)
            })
          }}
          onTransitionEnd={(swiper) => {
            if (count === 0) return
            const sourceIndex = ((swiper.activeIndex % count) + count) % count
            const min = count
            const max = count * (repeatCount - 1)
            if (swiper.activeIndex < min || swiper.activeIndex >= max) {
              swiper.slideTo(count * Math.floor(repeatCount / 2) + sourceIndex, 0)
            }
          }}
        >
          {slides.map((cat, i) => {
            if (cat.skeleton) {
              return (
                <SwiperSlide key={cat.id} className="inspire-slide">
                  <div className="inspire-card inspire-card--skeleton" aria-hidden />
                </SwiperSlide>
              )
            }

            const path = `/collection?category=${encodeURIComponent(cat.title)}`

            return (
              <SwiperSlide key={cat.loopKey} className="inspire-slide">
                <article className="inspire-card">
                  <button
                    type="button"
                    className="inspire-card__media"
                    aria-label={cat.title}
                    onClick={(e) => {
                      const slide = e.currentTarget.closest('.swiper-slide')
                      const isActive = slide?.classList.contains('swiper-slide-active')
                      if (!isActive) return
                      prepareRouteChange()
                      navigate(path)
                    }}
                  >
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt=""
                        className="inspire-card__img"
                        loading={Math.abs(i - initialSlide) <= 2 ? 'eager' : 'lazy'}
                        decoding="async"
                        draggable={false}
                        sizes="(max-width: 767px) 70vw, 280px"
                      />
                    ) : (
                      <div
                        className="inspire-card__fallback"
                        style={{ background: cat.accent || '#1a2228' }}
                      />
                    )}

                    <div className="inspire-card__meta">
                      <p className="inspire-card__brand">Greenland</p>
                      <span className="inspire-card__title">{cat.title}</span>
                      <p className="inspire-card__hint">Browse collection</p>
                    </div>
                  </button>
                </article>
              </SwiperSlide>
            )
          })}
        </Swiper>

        <button
          type="button"
          className="inspire__arrow inspire__arrow--next"
          aria-label="Next"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ChevronRight size={20} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </section>
  )
}
