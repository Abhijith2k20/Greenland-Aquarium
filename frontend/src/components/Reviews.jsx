import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentContext'

export default function Reviews() {
  const { reviews, store } = useContent()
  const [active, setActive] = useState(0)
  const review = reviews[active] || reviews[0]
  const n = reviews.length || 1

  useEffect(() => {
    if (n < 2) return undefined
    if (
      window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 767px), (pointer: coarse)')
        .matches
    ) {
      return undefined
    }
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % n)
    }, 1800)
    return () => window.clearInterval(id)
  }, [n])

  if (!reviews?.length) return null

  return (
    <section id="reviews" className="section-pad relative py-16 md:py-20">
      <div className="relative mx-auto max-w-3xl text-center">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-orange">Reviews</p>
          <p className="mb-8 text-sm text-white/40">What visitors say about the store</p>

          <div className="relative min-h-[6.5rem] md:min-h-[5.5rem]">
            {review && (
              <blockquote>
                <p className="font-display text-xl font-medium leading-snug tracking-tight text-white md:text-2xl">
                  “{review.text}”
                </p>
                <cite className="mt-4 block text-sm not-italic text-white/45">
                  — {review.name}
                </cite>
              </blockquote>
            )}
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
        </div>
      </div>
    </section>
  )
}
