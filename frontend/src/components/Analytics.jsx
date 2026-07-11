import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Optional Google Analytics 4 — set VITE_GA_MEASUREMENT_ID=G-XXXXXXXX */
export default function Analytics() {
  const location = useLocation()
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID
  const enabled = Boolean(id && id !== 'G-XXXXXXXX')

  useEffect(() => {
    if (!enabled) return undefined

    if (!window.gtag) {
      const s = document.createElement('script')
      s.async = true
      s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
      document.head.appendChild(s)

      window.dataLayer = window.dataLayer || []
      window.gtag = function gtag() {
        window.dataLayer.push(arguments)
      }
      window.gtag('js', new Date())
    }

    return undefined
  }, [enabled, id])

  useEffect(() => {
    if (!enabled || typeof window.gtag !== 'function') return
    window.gtag('config', id, {
      page_path: `${location.pathname}${location.search}${location.hash}`,
    })
  }, [enabled, id, location.pathname, location.search, location.hash])

  return null
}
