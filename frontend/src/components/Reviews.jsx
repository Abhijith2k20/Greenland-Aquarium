import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useContent } from '../context/ContentContext'

export default function Reviews() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const visible = useInView(ref, { amount: 0.2 })
  const { reviews, store } = useContent()
  const [active, setActive] = useState(0)
  const review = reviews[active] || reviews[0]
  const n = reviews.length || 1

  useEffect(() => {
    if (n < 2 || !visible) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % n)
    }, 5000)
    return () => window.clearInterval(id)
  }, [n, visible])

  if (!reviews?.length) return null

  return (
    <section id="reviews" className="section-pad relative py-16 md:py-20">
      <div ref={ref} className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-orange">Reviews</p>
          <p className="mb-8 text-sm text-white/40">What visitors say about the store</p>

          <div className="relative min-h-[6.5rem] md:min-h-[5.5rem]">
            <AnimatePresence mode="wait">
              {review && (
                <motion.blockquote
                  key={review.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-display text-xl font-medium leading-snug tracking-tight text-white md:text-2xl">
                    “{review.text}”
                  </p>
                  <cite className="mt-4 block text-sm not-italic text-white/45">
                    — {review.name}
                  </cite>
                </motion.blockquote>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            {reviews.map((r, i) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setActive(i)}
                data-cursor="hover"
                aria-label={`Review by ${r.name}`}
                aria-pressed={i === active}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-6 bg-orange' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {store.mapsLink && (
            <a
              href={store.mapsLink}
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
              className="mt-8 inline-block text-sm text-blue transition hover:underline"
            >
              Find us on Google Maps →
            </a>
          )}
        </motion.div>
      </div>
    </section>
  )
}
