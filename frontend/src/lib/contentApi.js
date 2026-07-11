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
  if (typeof source === 'string') {
    const sep = source.includes('?') ? '&' : '?'
    return `${source}${sep}w=${width}&q=75&auto=format`
  }
  try {
    return urlFor(source)?.width(width).quality(75).auto('format').url() || null
  } catch {
    return null
  }
}

const mapCollectionItem = (f, i) => ({
  id: f._id || f.id || i,
  name: f.name,
  category: f.category || 'Fish',
  price: typeof f.price === 'number' ? f.price : null,
  image: optimizedUrl(f.image, 800) || FEATURED_FISH[0].image,
})

const mapFeaturedItem = (f, i) => ({
  id: f._id || f.id || i,
  name: f.name,
  subtitle: f.subtitle || '',
  description: f.description || '',
  image: optimizedUrl(f.image, 1200) || FEATURED_FISH[0].image,
})

const queries = {
  categories: `*[_type == "category"] | order(title asc){
    _id,
    title,
    description,
    icon,
    accent,
    "image": image.asset->url
  }`,
  collection: `*[_type == "fish"] | order(_createdAt desc){
    _id,
    name,
    category,
    price,
    "image": image.asset->url
  }`,
  featured: `*[_type == "featured"] | order(_createdAt desc){
    _id,
    name,
    subtitle,
    description,
    "image": image.asset->url
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
              id: c._id,
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
