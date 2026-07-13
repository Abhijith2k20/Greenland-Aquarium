import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useContent } from '../context/ContentContext'
import { FEATURED_FISH } from '../data/content'
import { prepareRouteChange } from '../lib/prepareRouteChange'
import ProductSheet from './ProductSheet'

const BESTSELLER_COUNT = 12
const SUPPLIES_COUNT = 12

const SUPPLY_CATEGORIES = ['Aquariums', 'Accessories', 'Pet Food', 'Live Plants']

const LOCAL_SUPPLIES = FEATURED_FISH.filter((item) =>
  SUPPLY_CATEGORIES.includes(item.category),
).map((item, i) => ({
  id: item.id || `local-supply-${i}`,
  name: item.name,
  category: item.category,
  waterType: item.waterType || null,
  description: item.description || '',
  price: item.price ?? null,
  image: item.image,
}))

function enquireUrl(phone, item) {
  const bits = [
    `Hi Greenland Aquarium, I'm interested in the ${item.name}`,
    item.category ? `(${item.category})` : null,
    item.price != null ? `— ₹${Number(item.price).toLocaleString('en-IN')}` : null,
  ].filter(Boolean)
  return `https://wa.me/${phone}?text=${encodeURIComponent(`${bits.join(' ')}.`)}`
}

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

/** Round-robin mix so tanks, accessories, food, plants alternate in the rail */
function mixByCategory(items, categories, limit) {
  const buckets = categories.map((cat) =>
    items.filter((item) => item.category === cat),
  )
  const mixed = []
  let i = 0
  while (mixed.length < limit) {
    let added = false
    for (const bucket of buckets) {
      if (bucket[i]) {
        mixed.push(bucket[i])
        added = true
        if (mixed.length >= limit) break
      }
    }
    if (!added) break
    i += 1
  }
  return mixed
}

function StoreRail({ title, items, phone, onOpen, showCategory, moreTo, moreLabel }) {
  const stripRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateArrows = useCallback(() => {
    const el = stripRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 4)
    setCanNext(max > 4 && el.scrollLeft < max - 4)
  }, [])

  useEffect(() => {
    const el = stripRef.current
    if (!el) return undefined

    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateArrows) : null
    ro?.observe(el)

    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
      ro?.disconnect()
    }
  }, [items, updateArrows])

  const scrollByDir = (dir) => {
    const el = stripRef.current
    if (!el) return
    const card = el.querySelector('.store-now__card')
    const step = card ? card.getBoundingClientRect().width + 24 : Math.min(320, el.clientWidth * 0.8)
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  if (!items.length) return null

  return (
    <div className="store-now__rail">
      <div className="store-now__rail-head">
        <h3 className="store-now__rail-title">{title}</h3>
      </div>

      <div className="store-now__viewport">
        <button
          type="button"
          className="store-now__arrow store-now__arrow--prev"
          aria-label={`Previous ${title}`}
          disabled={!canPrev}
          onClick={() => scrollByDir(-1)}
        >
          <ChevronLeft size={20} strokeWidth={2} aria-hidden />
        </button>

        <div className="store-now__strip" ref={stripRef}>
          {items.map((item, i) => (
            <article key={item.id} className="store-now__card">
              <button
                type="button"
                className="store-now__media"
                onClick={() => onOpen(item)}
                aria-label={item.name}
              >
                <img
                  src={item.image}
                  alt=""
                  className="store-now__img"
                  loading={i < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                />
              </button>

              <div className="store-now__meta">
                {showCategory && item.category ? (
                  <p className="store-now__cat">{item.category}</p>
                ) : null}
                <button
                  type="button"
                  className="store-now__name"
                  onClick={() => onOpen(item)}
                >
                  {item.name}
                </button>
                {item.price != null ? (
                  <p className="store-now__price">{formatPrice(item.price)}</p>
                ) : (
                  <p className="store-now__price store-now__price--ask">Price on request</p>
                )}
                <a
                  href={enquireUrl(phone, item)}
                  target="_blank"
                  rel="noreferrer"
                  className="store-now__enquire"
                >
                  <MessageCircle size={14} aria-hidden />
                  Enquire
                </a>
              </div>
            </article>
          ))}

          {moreTo ? (
            <Link
              to={moreTo}
              onClick={() => prepareRouteChange()}
              className="store-now__more"
            >
              <ArrowRight size={18} strokeWidth={2} aria-hidden />
              <span>{moreLabel || 'More'}</span>
            </Link>
          ) : null}
        </div>

        <button
          type="button"
          className="store-now__arrow store-now__arrow--next"
          aria-label={`Next ${title}`}
          disabled={!canNext}
          onClick={() => scrollByDir(1)}
        >
          <ChevronRight size={20} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  )
}

export default function FeaturedFish() {
  const { featuredFish, collection, store } = useContent()
  const phone = store?.phoneRaw || '919611269901'
  const [selected, setSelected] = useState(null)
  const closeSheet = useCallback(() => setSelected(null), [])

  const bestsellers = useMemo(() => {
    const byName = new Map((collection || []).map((c) => [c.name, c]))
    const enrich = (f) => {
      const match = byName.get(f.name)
      return {
        ...f,
        category: f.category || match?.category || 'Fish',
        price: f.price ?? match?.price ?? null,
        description: f.description || match?.description || '',
        waterType: f.waterType || match?.waterType || null,
      }
    }

    const featured = (featuredFish || []).map(enrich)
    const seen = new Set(featured.map((f) => f.id || f.name))
    const moreFish = (collection || [])
      .filter((c) => c.category === 'Fish' && !seen.has(c.id) && !seen.has(c.name))
      .map(enrich)

    return [...featured, ...moreFish].slice(0, BESTSELLER_COUNT)
  }, [featuredFish, collection])

  const supplies = useMemo(() => {
    const fromCms = (collection || []).filter((c) =>
      SUPPLY_CATEGORIES.includes(c.category),
    )
    // CMS is mostly fish today — fill the mixed rail from local sample stock
    const pool = fromCms.length >= 4 ? fromCms : [...fromCms, ...LOCAL_SUPPLIES]
    const seen = new Set()
    const unique = pool.filter((item) => {
      const key = item.id || item.name
      if (seen.has(key) || seen.has(item.name)) return false
      seen.add(key)
      seen.add(item.name)
      return true
    })
    return mixByCategory(unique, SUPPLY_CATEGORIES, SUPPLIES_COUNT)
  }, [collection])

  if (!bestsellers.length && !supplies.length) {
    return (
      <section id="bestsellers" className="section-pad relative py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-orange">In the store</p>
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
            Bestsellers
          </h2>
          <p className="mt-4 max-w-md text-sm text-white/50">
            Popular items will appear here once they’re added in the CMS.
          </p>
          <Link
            to="/collection"
            onClick={() => prepareRouteChange()}
            className="mt-6 inline-block text-sm text-blue transition hover:underline"
          >
            Browse collection →
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section id="bestsellers" className="store-now relative bg-[var(--bg)] py-16 md:py-24">
      <div className="section-pad mx-auto max-w-7xl">
        <div className="store-now__intro">
          <p className="store-now__eyebrow">In the store now</p>
          <h2 className="store-now__heading">Our Bestsellers</h2>
          <p className="store-now__sub">
            Popular picks from the Horamavu store — enquire on WhatsApp to check stock.
          </p>
        </div>
      </div>

      <div className="store-now__rails">
        <StoreRail
          title="Bestsellers"
          items={bestsellers}
          phone={phone}
          onOpen={setSelected}
          moreTo="/collection?category=Fish"
          moreLabel="More fish"
        />
        <StoreRail
          title="Tanks & supplies"
          items={supplies}
          phone={phone}
          onOpen={setSelected}
          showCategory
          moreTo="/collection"
          moreLabel="See more"
        />
      </div>

      <div className="section-pad mx-auto max-w-7xl">
        <div className="store-now__footer">
          <Link
            to="/collection"
            onClick={() => prepareRouteChange()}
            className="store-now__footer-link"
          >
            Browse full collection →
          </Link>
        </div>
      </div>

      <ProductSheet item={selected} phone={phone} onClose={closeSheet} />
    </section>
  )
}
