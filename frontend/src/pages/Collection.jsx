import { memo, useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { COLLECTION_CATEGORIES } from '../data/content'
import { useContent } from '../context/ContentContext'
import ProductSheet from '../components/ProductSheet'

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

const CollectionCard = memo(function CollectionCard({ item, index, phone, onOpen }) {
  return (
    <li className="min-w-0">
      <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c1014] transition hover:border-white/20">
        <button
          type="button"
          onClick={() => onOpen(item)}
          className="flex w-full flex-col text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-[#080b0d] sm:aspect-[5/4]">
            <img
              src={item.image}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              loading={index < 6 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>

          <div className="flex flex-1 flex-col p-2.5 sm:p-3.5">
            <h2 className="line-clamp-2 font-display text-[13px] font-semibold leading-snug text-white sm:text-base">
              {item.name}
            </h2>
            {item.price != null ? (
              <p className="mt-1.5 text-[13px] font-semibold text-white sm:text-[15px]">
                {formatPrice(item.price)}
              </p>
            ) : (
              <p className="mt-1.5 text-[12px] text-white/45 sm:text-sm">Price on request</p>
            )}
            <span className="mt-2 text-[11px] font-medium text-blue/90 sm:text-xs">
              View details
            </span>
          </div>
        </button>

        <div className="mt-auto border-t border-white/[0.06] p-2 sm:p-2.5">
          <a
            href={enquireUrl(phone, item)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#25d366] px-3 py-2 text-[11px] font-semibold text-[#041018] transition hover:brightness-105 sm:text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle size={13} aria-hidden />
            Enquire
          </a>
        </div>
      </article>
    </li>
  )
})

export default function Collection() {
  const content = useContent()
  const collection = Array.isArray(content.collection) ? content.collection : []
  const store = content.store || {}
  const [searchParams, setSearchParams] = useSearchParams()
  const [selected, setSelected] = useState(null)

  const category = searchParams.get('category') || 'All'
  const water = searchParams.get('water') || 'All'
  const search = searchParams.get('q') || ''

  const filterCategories = useMemo(() => {
    const fromCms = [
      ...new Set(collection.map((item) => item.category).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b))
    if (fromCms.length === 0) return COLLECTION_CATEGORIES
    return ['All', ...fromCms]
  }, [collection])

  const waterOptions = useMemo(() => {
    const types = [
      ...new Set(
        collection
          .map((item) => item.waterType)
          .filter((t) => t && t !== 'N/A' && t !== 'All'),
      ),
    ].sort((a, b) => a.localeCompare(b))
    return types.length ? ['All', ...types] : []
  }, [collection])

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'All') next.delete(key)
    else next.set(key, value)
    setSearchParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return collection.filter((item) => {
      if (category !== 'All' && item.category !== category) return false
      if (water !== 'All' && item.waterType !== water) return false
      if (!q) return true
      return [item.name, item.category, item.waterType]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    })
  }, [collection, search, category, water])

  const clearAll = () => {
    setSearchParams({}, { replace: true })
  }

  const openSheet = useCallback((item) => setSelected(item), [])
  const closeSheet = useCallback(() => setSelected(null), [])
  const phone = store.phoneRaw || '919611269901'
  const hasFilters = category !== 'All' || water !== 'All' || Boolean(search.trim())
  const generalWhatsapp =
    store.whatsapp ||
    `https://wa.me/${phone}?text=${encodeURIComponent(
      'Hi Greenland Aquarium, I couldn\'t find what I was looking for in the collection.',
    )}`

  const categoryChipClass = (active) =>
    `shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition ${
      active
        ? 'bg-white text-[#07090b]'
        : 'bg-white/[0.06] text-white/65 hover:bg-white/[0.1] hover:text-white'
    }`

  const categoryBtnClass = (active) =>
    `w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition ${
      active
        ? 'bg-white/10 text-white'
        : 'text-white/50 hover:bg-white/[0.05] hover:text-white/80'
    }`

  return (
    <div className="page-enter relative z-10 min-h-screen bg-[#07090b] pb-24 pt-28">
      <div className="section-pad mx-auto max-w-7xl">
        <div className="mb-5 sm:mb-8">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-orange">Shop the store</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Collection
          </h1>
        </div>

        <div className="collection-cats-sticky lg:hidden">
          <div
            className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Categories"
          >
            {filterCategories.map((c) => {
              const active = category === c
              return (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter('category', c)}
                  className={categoryChipClass(active)}
                >
                  {c}
                </button>
              )
            })}
          </div>
          {waterOptions.length > 0 ? (
            <div
              className="mt-2 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Water type"
            >
              {waterOptions.map((w) => {
                const active = water === w
                return (
                  <button
                    key={w}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter('water', w)}
                    className={categoryChipClass(active)}
                  >
                    {w === 'All' ? 'All water' : w}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>

        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
          <aside className="sticky top-28 hidden self-start lg:block">
            <p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-white/40">
              Categories
            </p>
            <nav className="space-y-1.5" aria-label="Categories">
              {filterCategories.map((c) => {
                const active = category === c
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFilter('category', c)}
                    className={categoryBtnClass(active)}
                  >
                    {c}
                  </button>
                )
              })}
            </nav>

            {waterOptions.length > 0 ? (
              <>
                <p className="mb-3 mt-8 text-[11px] uppercase tracking-[0.28em] text-white/40">
                  Water
                </p>
                <nav className="space-y-1.5" aria-label="Water type">
                  {waterOptions.map((w) => {
                    const active = water === w
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setFilter('water', w)}
                        className={categoryBtnClass(active)}
                      >
                        {w === 'All' ? 'All types' : w}
                      </button>
                    )
                  })}
                </nav>
              </>
            ) : null}
          </aside>

          <div>
            {!content.loading && filtered.length > 0 ? (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-white/40" aria-live="polite">
                  {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
                  {category !== 'All' ? (
                    <>
                      {' '}
                      in <span className="text-white/60">{category}</span>
                    </>
                  ) : null}
                  {water !== 'All' ? (
                    <>
                      {' '}
                      · <span className="text-white/60">{water}</span>
                    </>
                  ) : null}
                </p>
                {hasFilters ? (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-sm text-white/45 transition hover:text-white"
                  >
                    Clear filters
                  </button>
                ) : null}
              </div>
            ) : null}

            {content.loading ? (
              <div
                className="collection-grid grid list-none gap-3 sm:gap-4"
                aria-busy="true"
                aria-label="Loading collection"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0c1014]"
                  >
                    <div className="aspect-[4/3] animate-pulse bg-white/[0.04] sm:aspect-[5/4]" />
                    <div className="space-y-2 p-2.5 sm:p-3.5">
                      <div className="h-3 w-3/4 animate-pulse rounded bg-white/[0.06]" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-white/[0.04]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/10 px-6 py-16 text-center">
                <p className="font-display text-xl font-semibold">No matches</p>
                <p className="mt-2 text-sm text-white/45">
                  Try another filter, or ask us on WhatsApp — we can check what’s in store.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  {hasFilters ? (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:border-white/30"
                    >
                      Clear filters
                    </button>
                  ) : null}
                  <a
                    href={generalWhatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#25d366] px-4 py-2 text-sm font-semibold text-[#041018]"
                  >
                    <MessageCircle size={15} aria-hidden />
                    Ask on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <ul className="collection-grid grid list-none gap-3 sm:gap-4">
                {filtered.map((item, i) => (
                  <CollectionCard
                    key={item.id}
                    item={item}
                    index={i}
                    phone={phone}
                    onOpen={openSheet}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <ProductSheet item={selected} phone={phone} onClose={closeSheet} />
    </div>
  )
}
