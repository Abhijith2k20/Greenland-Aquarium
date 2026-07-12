import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'

function enquireUrl(phone, item) {
  const text = `Hi Greenland Aquarium, I'm interested in the ${item.name}${
    item.price != null ? ` (₹${Number(item.price).toLocaleString('en-IN')})` : ''
  }.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

export default function ProductSheet({ item, phone, onClose }) {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!item) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose])

  const panelMotion = isDesktop
    ? {
        initial: { opacity: 0, scale: 0.96, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 8 },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
      }
    : {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
        transition: { type: 'spring', damping: 28, stiffness: 320 },
      }

  return createPortal(
    <AnimatePresence>
      {item ? (
        <div className="product-sheet-root" key={item.id}>
          <motion.button
            type="button"
            aria-label="Close product details"
            className="product-sheet-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-sheet-title"
            className="product-sheet"
            {...panelMotion}
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
              <img src={item.image} alt={item.name} decoding="async" />
            </div>

            <div className="product-sheet__body">
              {item.category ? (
                <p className="product-sheet__category">{item.category}</p>
              ) : null}

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

              <p className="product-sheet__note">
                Available at our Horamavu store. Message us on WhatsApp to check stock and reserve.
              </p>

              <a
                href={enquireUrl(phone, item)}
                target="_blank"
                rel="noreferrer"
                className="product-sheet__cta"
              >
                <MessageCircle size={18} strokeWidth={2} aria-hidden />
                Enquire on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
