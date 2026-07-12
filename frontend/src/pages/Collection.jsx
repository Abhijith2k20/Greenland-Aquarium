import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { COLLECTION_CATEGORIES } from '../data/content'
import { useContent } from '../context/ContentContext'
import ProductSheet from '../components/ProductSheet'

export default function Collection() {
  const content = useContent()
  const collection = Array.isArray(content.collection) ? content.collection : []
  const store = content.store || {}
  const [searchParams, setSearchParams] = useSearchParams()
  const [selected, setSelected] = useState(null)

  const category = searchParams.get('category') || 'All'
  const search = searchParams.get('q') || ''

  const filterCategories = useMemo(() => {
    const fromCms = [
      ...new Set(collection.map((item) => item.category).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b))
    if (fromCms.length === 0) return COLLECTION_CATEGORIES
    return ['All', ...fromCms]
  }, [collection])

  const setCategory = (value) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'All') next.delete('category')
    else next.set('category', value)
    setSearchParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return collection.filter((item) => {
      if (category !== 'All' && item.category !== category) return false
      if (!q) return true
      return [item.name, item.category]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    })
  }, [collection, search, category])

  const clearAll = () => {
    setSearchParams({}, { replace: true })
  }

  const closeSheet = useCallback(() => setSelected(null), [])
  const phone = store.phoneRaw || '919611269901'

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
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Collection
          </h1>
          <p className="mt-2 max-w-md text-sm text-white/45 sm:text-base">
            Browse fish, plants, aquariums & supplies available at our Horamavu store.
            {search.trim() ? (
              <>
                {' '}
                Showing results for <span className="text-white/70">“{search.trim()}”</span>.
              </>
            ) : null}
          </p>
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
                  onClick={() => setCategory(c)}
                  className={categoryChipClass(active)}
                >
                  {c}
                </button>
              )
            })}
          </div>
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
                    onClick={() => setCategory(c)}
                    className={categoryBtnClass(active)}
                  >
                    {c}
                  </button>
                )
              })}
            </nav>
          </aside>

          <div>
            {!content.loading && filtered.length > 0 ? (
              <p className="mb-4 text-sm text-white/40" aria-live="polite">
                {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
                {category !== 'All' ? (
                  <>
                    {' '}
                    in <span className="text-white/60">{category}</span>
                  </>
                ) : null}
              </p>
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
                <p className="mt-2 text-sm text-white/45">Try another search or category.</p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="mt-5 text-sm text-blue hover:underline"
                >
                  Reset
                </button>
              </div>
            ) : (
              <ul className="collection-grid grid list-none gap-3 sm:gap-4">
                {filtered.map((item, i) => (
                  <li key={item.id} className="min-w-0">
                    <button
                      type="button"
                      onClick={() => setSelected(item)}
                      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c1014] text-left transition hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#080b0d] sm:aspect-[5/4]">
                        <img
                          src={item.image}
                          alt=""
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          loading={i < 6 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      </div>

                      <div className="flex flex-1 flex-col p-2.5 sm:p-3.5">
                        <h2 className="line-clamp-2 font-display text-[13px] font-semibold leading-snug text-white sm:text-base">
                          {item.name}
                        </h2>
                        {item.price != null ? (
                          <p className="mt-1 text-[12px] font-medium text-white/70 sm:text-sm">
                            ₹{Number(item.price).toLocaleString('en-IN')}
                          </p>
                        ) : (
                          <p className="mt-1 text-[11px] text-white/40 sm:text-xs">Ask for price</p>
                        )}
                        <span className="mt-2 text-[11px] font-medium text-blue/90 sm:mt-3 sm:text-xs">
                          View details
                        </span>
                      </div>
                    </button>
                  </li>
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
