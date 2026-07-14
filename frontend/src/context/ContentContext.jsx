import {createContext, useContext, useEffect, useState} from 'react'
import {fetchSiteContent} from '../lib/contentApi'
import {isSanityConfigured} from '../lib/sanity'
import {
  STORE,
  CATEGORIES,
  FEATURED_FISH,
  SERVICES,
  REVIEWS,
} from '../data/content'

const defaultCollection = FEATURED_FISH.map((f, i) => ({
  id: f.id || i,
  name: f.name,
  category: f.category || 'Fish',
  waterType: f.waterType || null,
  description: f.description || '',
  price: f.price ?? null,
  image: f.image,
}))

const defaultFeatured = FEATURED_FISH.filter((f) => f.featured !== false).map((f, i) => ({
  id: f.id || i,
  name: f.name,
  subtitle: f.species || '',
  description: f.description || '',
  category: f.category || 'Fish',
  price: f.price ?? null,
  waterType: f.waterType || null,
  image: f.image,
}))

// When Sanity is configured, avoid flashing Unsplash fallbacks before CMS data arrives
const waitForCms = isSanityConfigured

// store/services/reviews never vary by CMS response (contentApi always returns
// the same constants) — kept in a separate, never-updating context so the
// components that only need these (Navbar, Footer, Hero, Visit, Services,
// Reviews, CustomAquarium, Privacy) don't get swept into the one-time
// re-render cascade that fires when the CMS-backed data below resolves.
const STATIC_CONTENT = {
  store: STORE,
  services: SERVICES,
  reviews: REVIEWS,
}
const StaticContentContext = createContext(STATIC_CONTENT)

const ContentContext = createContext({
  categories: waitForCms ? [] : CATEGORIES,
  collection: waitForCms ? [] : defaultCollection,
  featuredFish: waitForCms ? [] : defaultFeatured,
  loading: waitForCms,
  source: 'local',
})

export function ContentProvider({children}) {
  const [content, setContent] = useState({
    categories: waitForCms ? [] : CATEGORIES,
    collection: waitForCms ? [] : defaultCollection,
    featuredFish: waitForCms ? [] : defaultFeatured,
    loading: waitForCms,
    source: 'local',
  })

  useEffect(() => {
    let alive = true
    fetchSiteContent().then((data) => {
      if (!alive) return
      setContent({
        categories: data.categories,
        collection: data.collection,
        featuredFish: data.featuredFish,
        loading: false,
        source: data.source,
      })
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <StaticContentContext.Provider value={STATIC_CONTENT}>
      <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
    </StaticContentContext.Provider>
  )
}

/** Dynamic, CMS-backed slice — only subscribe here if you actually read categories/collection/featuredFish/loading. */
export function useContent() {
  return useContext(ContentContext)
}

/** Stable slice (store/services/reviews) — never re-renders when CMS data loads. */
export function useStaticContent() {
  return useContext(StaticContentContext)
}
