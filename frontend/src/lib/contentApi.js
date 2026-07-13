import {isSanityConfigured, sanityClient, urlFor} from './sanity'
import {
  STORE,
  CATEGORIES,
  FEATURED_FISH,
  SERVICES,
  REVIEWS,
} from '../data/content'

function optimizedUrl(source, width) {
  if (!source) return null
  // Sanity image objects / refs → image builder (respects crop/hotspot + CDN resize)
  if (typeof source === 'object') {
    try {
      return urlFor(source)?.width(width).quality(75).auto('format').url() || null
    } catch {
      return null
    }
  }
  // External / Unsplash strings — leave as-is (query params only help some CDNs)
  if (typeof source === 'string') {
    if (source.includes('cdn.sanity.io') && source.includes('/images/')) {
      // Legacy raw Sanity CDN URL — append width if supported by image API path
      try {
        const u = new URL(source)
        u.searchParams.set('w', String(width))
        u.searchParams.set('q', '75')
        u.searchParams.set('auto', 'format')
        return u.toString()
      } catch {
        return source
      }
    }
    return source
  }
  return null
}

function slugFromTitle(title, fallback) {
  const slug = String(title || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return slug || fallback
}

const mapCollectionItem = (f, i) => ({
  id: f._id || f.id || i,
  name: f.name,
  category: f.category || 'Fish',
  waterType: f.waterType || null,
  description: f.description || '',
  price: typeof f.price === 'number' ? f.price : null,
  image: optimizedUrl(f.image, 800) || FEATURED_FISH[0].image,
})

const mapFeaturedItem = (f, i) => ({
  id: f._id || f.id || i,
  name: f.name,
  subtitle: f.subtitle || '',
  description: f.description || '',
  category: f.category || 'Fish',
  price: typeof f.price === 'number' ? f.price : null,
  waterType: f.waterType || null,
  image: optimizedUrl(f.image, 1200) || FEATURED_FISH[0].image,
})

const queries = {
  categories: `*[_type == "category"] | order(title asc){
    _id,
    title,
    description,
    icon,
    accent,
    image
  }`,
  collection: `*[_type == "fish"] | order(_createdAt desc){
    _id,
    name,
    category,
    waterType,
    description,
    price,
    image
  }`,
  featured: `*[_type == "featured"] | order(_createdAt desc){
    _id,
    name,
    subtitle,
    description,
    category,
    image
  }`,
}

export async function fetchSiteContent() {
  const fallbackCollection = FEATURED_FISH.map(mapCollectionItem)
  const fallbackFeatured = FEATURED_FISH.filter((f) => f.featured !== false)
    .slice(0, 12)
    .map((f, i) =>
      mapFeaturedItem(
        {
          ...f,
          subtitle: f.species || '',
        },
        i,
      ),
    )

  const fallback = {
    store: STORE,
    categories: CATEGORIES,
    collection: fallbackCollection,
    featuredFish: fallbackFeatured,
    services: SERVICES,
    reviews: REVIEWS,
    source: 'local',
  }

  if (!isSanityConfigured || !sanityClient) {
    return fallback
  }

  try {
    const [categories, collection, featured] = await Promise.all([
      sanityClient.fetch(queries.categories),
      sanityClient.fetch(queries.collection),
      sanityClient.fetch(queries.featured),
    ])

    return {
      store: STORE,
      categories:
        categories?.length > 0
          ? categories.map((c, i) => ({
              id: slugFromTitle(c.title, c._id),
              title: c.title,
              description: c.description,
              icon: c.icon || 'Fish',
              accent: c.accent || '#4FC3F7',
              image:
                optimizedUrl(c.image, 1000) ||
                CATEGORIES[i]?.image ||
                CATEGORIES[0].image,
            }))
          : CATEGORIES,
      collection:
        collection?.length > 0 ? collection.map(mapCollectionItem) : fallbackCollection,
      featuredFish:
        featured?.length > 0 ? featured.map(mapFeaturedItem).slice(0, 12) : fallbackFeatured,
      services: SERVICES,
      reviews: REVIEWS,
      source: 'sanity',
    }
  } catch (err) {
    console.warn('Sanity fetch failed, using local content:', err.message)
    return fallback
  }
}

export {urlFor}
