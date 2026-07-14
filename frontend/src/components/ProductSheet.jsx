import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
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

/**
 * Lean sheet: only 2 animated layers (scrim opacity + panel transform).
 * No staggered children, no drag listeners, no scale.
 */
export default function ProductSheet({ item, phone, onClose }) {
  const reduced = useReducedMotion()
  const desktop = useIsDesktop()
  const open = Boolean(item)
  const Root = desktop ? motion.div : 'div'
  const Scrim = desktop ? motion.button : 'button'
  const Panel = desktop ? motion.div : 'div'

  const waHref = useMemo(
    () => (item ? enquireUrl(phone, item) : '#'),
    [item, phone],
  )

  const variants = useMemo(() => {
    if (reduced) {
      return {
        root: {
          open: { transition: { staggerChildren: 0 } },
          closed: { transition: { staggerChildren: 0, when: 'afterChildren' } },
        },
        scrim: {
          open: { opacity: 1, transition: { duration: 0.12 } },
          closed: { opacity: 0, transition: { duration: 0.1 } },
        },
        panel: {
          open: { opacity: 1, transition: { duration: 0.12 } },
          closed: { opacity: 0, transition: { duration: 0.1 } },
        },
      }
    }

    if (desktop) {
      return {
        root: {
          open: { transition: { staggerChildren: 0.02 } },
          closed: {
            transition: { staggerChildren: 0.02, staggerDirection: -1, when: 'afterChildren' },
          },
        },
        scrim: {
          open: { opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } },
          closed: { opacity: 0, transition: { duration: 0.22, ease: 'easeOut' } },
        },
        panel: {
          open: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
          },
          closed: {
            opacity: 0,
            y: 16,
            transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
          },
        },
      }
    }

    return {
      root: {
        open: { transition: { staggerChildren: 0.02 } },
        closed: {
          transition: { staggerChildren: 0.02, staggerDirection: -1, when: 'afterChildren' },
        },
      },
      scrim: {
        open: { opacity: 1, transition: { duration: 0.28, ease: 'easeOut' } },
        closed: { opacity: 0, transition: { duration: 0.22, ease: 'easeOut' } },
      },
      panel: {
        open: {
          y: 0,
          transition: { duration: 0.34, ease: [0.32, 0.72, 0, 1] },
        },
        closed: {
          y: '100%',
          transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
        },
      },
    }
  }, [desktop, reduced])

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (!open) return undefined
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const rootProps = desktop
    ? {
        variants: variants.root,
        initial: 'closed',
        animate: 'open',
        exit: 'closed',
      }
    : {}
  const scrimProps = desktop ? { variants: variants.scrim } : {}
  const panelProps = desktop ? { variants: variants.panel } : {}

  const sheet = item ? (
    <Root
      key="product-sheet"
      className={`product-sheet-root${
        desktop ? ' product-sheet-root--desktop' : ' product-sheet-root--mobile'
      }`}
      {...rootProps}
    >
      <Scrim
        type="button"
        aria-label="Close product details"
        className="product-sheet-scrim"
        onClick={onClose}
        {...scrimProps}
      />

      <Panel
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-sheet-title"
        className="product-sheet"
        {...panelProps}
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
            {item.category ? <p className="product-sheet__category">{item.category}</p> : null}
            {item.waterType ? <span className="product-sheet__pill">{item.waterType}</span> : null}
          </div>

          <h2 id="product-sheet-title" className="product-sheet__title">
            {item.name}
          </h2>

          {item.price != null ? (
            <p className="product-sheet__price">₹{Number(item.price).toLocaleString('en-IN')}</p>
          ) : (
            <p className="product-sheet__price product-sheet__price--ask">Price on request</p>
          )}

          {item.description ? <p className="product-sheet__desc">{item.description}</p> : null}

          <p className="product-sheet__note">
            Available at our Horamavu store. Message us on WhatsApp to confirm stock and reserve.
          </p>

          <a href={waHref} target="_blank" rel="noreferrer" className="product-sheet__cta">
            <MessageCircle size={18} strokeWidth={2} aria-hidden />
            Enquire on WhatsApp
          </a>
        </div>
      </Panel>
    </Root>
  ) : null

  if (!desktop) {
    return open ? createPortal(sheet, document.body) : null
  }

  return createPortal(
    <AnimatePresence>{open ? sheet : null}</AnimatePresence>,
    document.body,
  )
}
