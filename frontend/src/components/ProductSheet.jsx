import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'

function enquireUrl(phone, item) {
  const text = `Hi Greenland Aquarium, I'm interested in the ${item.name}${
    item.price != null ? ` (₹${Number(item.price).toLocaleString('en-IN')})` : ''
  }.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
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
  const reduced = useReducedMotion()
  const desktop = useIsDesktop()

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
      window.removeEventListener('keydown', onKey)
      // Keep scroll locked until exit animation finishes (onExitComplete).
    }
  }, [item, onClose])

  const sheetMotion = reduced
    ? {
        initial: false,
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.1 },
      }
    : desktop
      ? {
          initial: { opacity: 0, scale: 0.96, y: 10 },
          animate: { opacity: 1, scale: 1, y: 0 },
          // Parent fades the whole layer — keep sheet settled so close stays crisp
          exit: { opacity: 1, scale: 1, y: 0 },
          transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
        }
      : {
          initial: { y: '100%' },
          animate: { y: 0 },
          exit: { y: '100%' },
          transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] },
        }

  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = ''
      }}
    >
      {item ? (
        <motion.div
          key={item.id}
          className={`product-sheet-root${desktop ? ' product-sheet-root--desktop' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: desktop || reduced ? 0 : 1 }}
          transition={
            reduced
              ? { duration: 0.08 }
              : desktop
                ? { duration: 0.15, ease: 'easeOut' }
                : { duration: 0.22, ease: [0.32, 0.72, 0, 1] }
          }
        >
          <button
            type="button"
            aria-label="Close product details"
            className="product-sheet-scrim"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-sheet-title"
            className="product-sheet"
            {...sheetMotion}
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
                fetchPriority="high"
              />
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
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
