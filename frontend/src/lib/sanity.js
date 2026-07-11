import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

export const isSanityConfigured = Boolean(
  projectId && projectId !== 'yourProjectId' && projectId !== 'undefined',
)

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-01-01',
      // Skip CDN in dev so new Studio publishes show up immediately
      useCdn: !import.meta.env.DEV,
    })
  : null

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null

export function urlFor(source) {
  if (!builder || !source) return null
  return builder.image(source)
}
