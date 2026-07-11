import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { prepareRouteChange } from '../lib/prepareRouteChange'

/**
 * Single site search (header only — no duplicate on Collection).
 * Off Collection: click opens Collection and focuses this field.
 * On Collection: type here to filter results live.
 */
export default function NavSearch({ className = '' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const onCollection = location.pathname === '/collection'
  const [query, setQuery] = useState(() =>
    onCollection ? searchParams.get('q') || '' : '',
  )
  const inputRef = useRef(null)
  const navigating = useRef(false)

  useEffect(() => {
    if (onCollection) setQuery(searchParams.get('q') || '')
    else setQuery('')
  }, [onCollection, searchParams])

  useEffect(() => {
    if (!onCollection || !location.state?.focusSearch) return undefined
    const t = window.setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select?.()
    }, 60)
    return () => window.clearTimeout(t)
  }, [onCollection, location.state, location.key])

  const openCollectionSearch = () => {
    if (onCollection) {
      inputRef.current?.focus()
      return
    }
    if (navigating.current) return
    navigating.current = true
    prepareRouteChange()
    navigate('/collection', { state: { focusSearch: true } })
    window.setTimeout(() => {
      navigating.current = false
    }, 400)
  }

  const updateQuery = (value) => {
    setQuery(value)
    if (!onCollection) return
    const next = new URLSearchParams(searchParams)
    const q = value.trim()
    if (q) next.set('q', q)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!onCollection) {
      openCollectionSearch()
      return
    }
    inputRef.current?.blur()
  }

  return (
    <form role="search" onSubmit={onSubmit} className={`nav-search ${className}`}>
      <div className="nav-search__field">
        <input
          ref={inputRef}
          id="nav-search-input"
          type="search"
          value={query}
          readOnly={!onCollection}
          onChange={(e) => {
            if (!onCollection) return
            updateQuery(e.target.value)
          }}
          onFocus={(e) => {
            if (onCollection) return
            e.target.blur()
            openCollectionSearch()
          }}
          onPointerDown={(e) => {
            if (onCollection) return
            e.preventDefault()
            openCollectionSearch()
          }}
          placeholder={onCollection ? 'Search…' : 'Search collection…'}
          aria-label="Search collection"
          autoComplete="off"
          enterKeyHint="search"
          className="nav-search__input"
        />
        {onCollection && query ? (
          <button
            type="button"
            aria-label="Clear search"
            data-cursor="hover"
            className="nav-search__submit"
            onClick={() => updateQuery('')}
          >
            <X size={15} strokeWidth={2} aria-hidden />
          </button>
        ) : (
          <button
            type="submit"
            aria-label="Search"
            data-cursor="hover"
            className="nav-search__submit"
          >
            <Search size={16} strokeWidth={2} aria-hidden />
          </button>
        )}
      </div>
    </form>
  )
}
