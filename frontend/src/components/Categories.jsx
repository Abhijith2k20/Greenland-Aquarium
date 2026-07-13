import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useContent } from '../context/ContentContext'
import { prepareRouteChange } from '../lib/prepareRouteChange'

export default function Categories() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const { categories, loading } = useContent()
  const navigate = useNavigate()

  const toCollection = (path) => (e) => {
    e.preventDefault()
    prepareRouteChange()
    navigate(path)
  }

  if (!loading && (!categories || categories.length === 0)) {
    return (
      <section id="categories" className="section-pad relative py-28 md:py-36">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-green">Collection</p>
          <h2 className="max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
            Everything for a living world at home.
          </h2>
          <Link
            to="/collection"
            onClick={toCollection('/collection')}
            className="mt-6 inline-block text-sm text-blue transition hover:underline"
            data-cursor="hover"
          >
            Browse all
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section id="categories" className="section-pad relative overflow-hidden py-28 md:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 0% 50%, rgba(46,204,113,0.07), transparent 55%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-14"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-green">Collection</p>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
              Everything for a living world at home.
            </h2>
            <Link
              to="/collection"
              onClick={toCollection('/collection')}
              className="shrink-0 text-sm text-blue transition hover:underline"
              data-cursor="hover"
            >
              Browse all
            </Link>
          </div>
        </motion.div>

        <div
          ref={ref}
          className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5"
        >
          {loading && categories.length === 0 ? (
            <div className="col-span-full min-h-[40vh]" aria-hidden />
          ) : (
            categories.map((cat, i) => {
            const path = `/collection?category=${encodeURIComponent(cat.title)}`
            const isFish = cat.id === 'fish' || cat.title === 'Fish'
            const isAquariums = cat.id === 'aquariums' || cat.title === 'Aquariums'
            const wide = isFish || isAquariums

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className={
                  isAquariums
                    ? 'col-span-2 md:col-span-3'
                    : isFish
                      ? 'col-span-2 md:col-span-2'
                      : ''
                }
              >
                <Link
                  to={path}
                  onClick={toCollection(path)}
                  data-cursor="hover"
                  className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl sm:rounded-[1.35rem] ${
                    wide
                      ? 'min-h-[180px] p-5 sm:min-h-[240px] sm:p-8 md:min-h-[280px] md:p-10'
                      : 'min-h-[160px] p-4 sm:min-h-[200px] sm:p-6 md:min-h-[220px] md:p-8'
                  }`}
                >
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 h-full w-full object-cover transition duration-[700ms] ease-out group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  )}

                  {/* Base wash */}
                  <div
                    className="absolute inset-0 transition duration-700 group-hover:opacity-55"
                    style={{
                      background: `linear-gradient(to top, rgba(4,8,10,0.82) 0%, rgba(4,8,10,0.35) 45%, rgba(4,8,10,0.12) 100%)`,
                    }}
                  />

                  {/* Accent bloom on hover */}
                  <div
                    className="pointer-events-none absolute -bottom-1/4 -left-1/4 h-[80%] w-[80%] rounded-full opacity-0 blur-3xl transition duration-700 group-hover:opacity-40"
                    style={{ background: cat.accent }}
                    aria-hidden
                  />

                  {/* Light sweep */}
                  <span
                    className="pointer-events-none absolute inset-0 z-[1] -translate-x-[120%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[120%]"
                    aria-hidden
                  />

                  <div className="relative z-10 translate-y-0.5 transition duration-700 group-hover:translate-y-0">
                    <h3
                      className={`font-display font-semibold tracking-tight text-white transition duration-700 ${
                        wide
                          ? 'text-2xl sm:text-3xl md:text-4xl'
                          : 'text-lg sm:text-xl md:text-2xl'
                      }`}
                    >
                      {cat.title}
                    </h3>
                    <p
                      className={`mt-2 hidden leading-relaxed text-white/65 transition duration-700 group-hover:text-white/80 sm:block ${
                        wide
                          ? 'max-w-md text-sm sm:text-base'
                          : 'line-clamp-2 text-xs sm:line-clamp-3 sm:text-sm'
                      }`}
                    >
                      {cat.description}
                    </p>
                    <span
                      className="mt-4 hidden translate-y-2 items-center rounded-full border border-white/25 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white opacity-0 backdrop-blur-sm transition duration-700 md:inline-flex md:group-hover:translate-y-0 md:group-hover:opacity-100"
                    >
                      Browse {cat.title}
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })
          )}
        </div>
      </div>
    </section>
  )
}
