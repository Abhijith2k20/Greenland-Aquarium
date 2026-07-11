import { useEffect } from 'react'

/** Optional Google Analytics 4 — set VITE_GA_MEASUREMENT_ID=G-XXXXXXXX */
export default function Analytics() {
  useEffect(() => {
    const id = import.meta.env.VITE_GA_MEASUREMENT_ID
    if (!id || id === 'G-XXXXXXXX') return undefined

    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
    document.head.appendChild(s)

    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', id)

    return () => {
      s.remove()
    }
  }, [])

  return null
}
