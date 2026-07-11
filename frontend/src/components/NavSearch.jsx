import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { prepareRouteChange } from '../lib/prepareRouteChange'

/**
 * Always-visible header search (NN/G / Baymard pattern).
 * Quiet field + icon submit — Enter also searches.
 */
export default function NavSearch({ className = '' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const onCollection = location.pathname === '/collection'
  const urlQ = onCollection ? searchParams.get('q') || '' : ''
  const [query, setQuery] = useState(urlQ)
  const inputRef = useRef(null)

  useEffect(() => {
    if (onCollection) setQuery(searchParams.get('q') || '')
  }, [onCollection, searchParams])

  const applyQuery = (raw) => {
    const q = raw.trim()
    if (onCollection) {
      const next = new URLSearchParams(searchParams)
      if (q) next.set('q', q)
      else next.delete('q')
      setSearchParams(next, { replace: true })
      return
    }
    prepareRouteChange()
    navigate(q ? `/collection?q=${encodeURIComponent(q)}` : '/collection', {
      state: { focusSearch: true },
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    applyQuery(query)
    if (!onCollection) inputRef.current?.blur()
  }

  return (
    <form role="search" onSubmit={onSubmit} className={`nav-search ${className}`}>
      <div className="nav-search__field">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            const value = e.target.value
            setQuery(value)
            if (onCollection) {
              const next = new URLSearchParams(searchParams)
              const q = value.trim()
              if (q) next.set('q', q)
              else next.delete('q')
              setSearchParams(next, { replace: true })
            }
          }}
          placeholder="Search fish, plants, aquariums…"
          aria-label="Search collection"
          autoComplete="off"
          enterKeyHint="search"
          className="nav-search__input"
        />
        <button
          type="submit"
          aria-label="Search"
          data-cursor="hover"
          className="nav-search__submit"
        >
          <Search size={16} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </form>
  )
}
