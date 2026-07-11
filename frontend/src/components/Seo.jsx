import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { STORE } from '../data/content'

const SITE_URL = import.meta.env.VITE_SITE_URL || ''

const titles = {
  '/': 'Greenland Aquarium | Bring Nature Home',
  '/collection': 'Collection | Greenland Aquarium',
  '/privacy': 'Privacy Policy | Greenland Aquarium',
}

const descriptions = {
  '/':
    'Greenland Aquarium — Bring Nature Home. Premium exotic fish, custom aquariums, live plants & pet care in Horamavu, Bengaluru.',
  '/collection':
    'Browse fish, plants, aquariums and supplies at Greenland Aquarium, Horamavu, Bengaluru.',
  '/privacy': 'Privacy policy for Greenland Aquarium website and contact enquiries.',
}

export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const title = titles[pathname] || titles['/']
    const description = descriptions[pathname] || descriptions['/']
    document.title = title

    const setMeta = (attr, key, content) => {
      if (!content) return
      let el = document.head.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)

    if (SITE_URL) {
      const url = `${SITE_URL.replace(/\/$/, '')}${pathname === '/' ? '' : pathname}`
      setMeta('property', 'og:url', url)
      let link = document.head.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', url)
    }
  }, [pathname])

  useEffect(() => {
    const existing = document.getElementById('local-business-jsonld')
    if (existing) existing.remove()

    const addr = STORE.address
    const data = {
      '@context': 'https://schema.org',
      '@type': 'PetStore',
      name: STORE.name,
      description: STORE.tagline,
      telephone: STORE.phone,
      url: SITE_URL || undefined,
      image: SITE_URL ? `${SITE_URL.replace(/\/$/, '')}/og.jpg` : undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress: [addr.line1, addr.line2, addr.line3, addr.line4].filter(Boolean).join(' '),
        addressLocality: 'Bengaluru',
        addressRegion: 'Karnataka',
        postalCode: '560113',
        addressCountry: 'IN',
      },
      openingHours: 'Mo-Su 10:00-22:00',
      sameAs: [STORE.socials.instagram, STORE.socials.facebook, STORE.socials.youtube].filter(
        Boolean,
      ),
    }

    const script = document.createElement('script')
    script.id = 'local-business-jsonld'
    script.type = 'application/ld+json'
    script.text = JSON.stringify(data)
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return null
}
