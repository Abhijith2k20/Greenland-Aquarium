import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { MessageCircle, X } from 'lucide-react'

function enquireUrl(phone, item) {
  const bits = [
    `Hi Greenland Aquarium, I'm interested in the ${item.name}`,
    item.category ? `(${item.category})` : null,
    item.price != null ? `— ₹${Number(item.price).toLocaleString('en-IN')}` : null,
  ].filter(Boolean)
  return `https://wa.me/${phone}?text=${encodeURIComponent(`${bits.join(' ')}. Can you confirm availability?`)}`
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const sync = () => setDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return desktop
}

export default function ProductSheet({ item, phone, onClose }) {
  const desktop = useIsDesktop()

  const waHref = useMemo(
    () => (item ? enquireUrl(phone, item) : '#'),
    [item, phone],
  )

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (!item) return undefined
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose])

  if (!item) return null

  return createPortal(
    <div
      className={`product-sheet-root${
        desktop ? ' product-sheet-root--desktop' : ' product-sheet-root--mobile'
      }`}
    >
      <button
        type="button"
        aria-label="Close product details"
        className="product-sheet-scrim"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-sheet-title"
        className="product-sheet"
      >
        <div className="product-sheet__handle" aria-hidden />

        <button
          type="button"
          className="product-sheet__close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} strokeWidth={2} />
        </button>

        <div className="product-sheet__media">
          <img
            src={item.image}
            alt={item.name}
            decoding="async"
            loading="eager"
            draggable={false}
          />
        </div>

        <div className="product-sheet__body">
          <div className="product-sheet__meta">
            {item.category ? (
              <p className="product-sheet__category">{item.category}</p>
            ) : null}
            {item.waterType ? (
              <span className="product-sheet__pill">{item.waterType}</span>
            ) : null}
          </div>

          <h2 id="product-sheet-title" className="product-sheet__title">
            {item.name}
          </h2>

          {item.price != null ? (
            <p className="product-sheet__price">
              ₹{Number(item.price).toLocaleString('en-IN')}
            </p>
          ) : (
            <p className="product-sheet__price product-sheet__price--ask">Price on request</p>
          )}

          {item.description ? (
            <p className="product-sheet__desc">{item.description}</p>
          ) : null}

          <p className="product-sheet__note">
            Available at our Horamavu store. Message us on WhatsApp to confirm stock and reserve.
          </p>

          <a href={waHref} target="_blank" rel="noreferrer" className="product-sheet__cta">
            <MessageCircle size={18} strokeWidth={2} aria-hidden />
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </div>,
    document.body,
  )
}
