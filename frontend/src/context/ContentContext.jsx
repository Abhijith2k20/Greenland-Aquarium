import {createContext, useContext, useEffect, useState} from 'react'
import {fetchSiteContent} from '../lib/contentApi'
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
  price: f.price ?? null,
  image: f.image,
}))

const defaultFeatured = FEATURED_FISH.filter((f) => f.featured !== false).map((f, i) => ({
  id: f.id || i,
  name: f.name,
  subtitle: f.species || '',
  description: f.description || '',
  image: f.image,
}))

const ContentContext = createContext({
  store: STORE,
  categories: CATEGORIES,
  collection: defaultCollection,
  featuredFish: defaultFeatured,
  services: SERVICES,
  reviews: REVIEWS,
  loading: true,
  source: 'local',
})

export function ContentProvider({children}) {
  const [content, setContent] = useState({
    store: STORE,
    categories: CATEGORIES,
    collection: defaultCollection,
    featuredFish: defaultFeatured,
    services: SERVICES,
    reviews: REVIEWS,
    loading: true,
    source: 'local',
  })

  useEffect(() => {
    let alive = true
    fetchSiteContent().then((data) => {
      if (!alive) return
      setContent({...data, loading: false})
    })
    return () => {
      alive = false
    }
  }, [])

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export function useContent() {
  return useContext(ContentContext)
}
