import { useState } from 'react'
import { MapPin, Phone, Clock, Navigation, MessageCircle } from 'lucide-react'
import MagneticButton from './MagneticButton'
import { useContent } from '../context/ContentContext'

export default function Visit() {
  const { store } = useContent()
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const openWhatsApp = () => {
    const name = form.name.trim()
    const message = form.message.trim()
    if (!name || !message) return false
    window.open(
      `https://wa.me/${store.phoneRaw}?text=${encodeURIComponent(
        `Hi, I'm ${name}. ${message}`,
      )}`,
      '_blank',
    )
    return true
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) {
      setStatus({ type: 'error', message: 'Please enter your name and message.' })
      return
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email.' })
      return
    }

    setLoading(true)
    setStatus({ type: '', message: '' })

    const endpoint =
      store.formspreeEndpoint || import.meta.env.VITE_FORMSPREE_ENDPOINT || ''

    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Form submit failed')
        setStatus({ type: 'success', message: 'Message sent! We’ll get back to you soon.' })
        setForm({ name: '', email: '', phone: '', message: '' })
      } else {
        openWhatsApp()
        setStatus({
          type: 'success',
          message: 'Opening WhatsApp so you can reach us directly.',
        })
      }
    } catch {
      if (openWhatsApp()) {
        setStatus({
          type: 'success',
          message: 'Opening WhatsApp so you can reach us directly.',
        })
      } else {
        setStatus({
          type: 'error',
          message: 'Something went wrong. Please try again or call us.',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const addressLines = [
    store.address.line1,
    store.address.line2,
    store.address.line3,
    store.address.line4,
    store.address.city,
  ].filter(Boolean)

  const mapSrc =
    store.mapsEmbed ||
    'https://maps.google.com/maps?q=SLN%20Complex%20Horamavu%20Bengaluru%20560113&t=&z=15&ie=UTF8&iwloc=&output=embed'

  const fieldClass =
    'w-full rounded-xl border border-white/12 bg-[#0a0e11] px-4 py-3.5 text-white outline-none transition placeholder:text-white/30 focus:border-blue/60'

  return (
    <section id="visit" className="section-pad relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 45% 40% at 100% 0%, rgba(46,204,113,0.06), transparent 55%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 md:mb-12">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-green">Visit</p>
          <h2 className="max-w-xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
            Visit our store.
          </h2>
          <p className="mt-4 max-w-lg text-sm text-white/50 md:text-base">
            Find us in Horamavu — or send a message and we’ll help you plan your visit.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          {/* Contact + map */}
          <div className="space-y-5 lg:col-span-2">
            <div className="space-y-5 rounded-2xl border border-white/10 bg-[#0a0e11] p-6 sm:p-7">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 shrink-0 text-blue" size={20} />
                <div className="text-sm leading-relaxed text-white/70">
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>

              <a
                href={`tel:+${String(store.phoneRaw).replace(/^\+/, '')}`}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                data-cursor="hover"
              >
                <Phone className="shrink-0 text-green" size={18} />
                <span>
                  <span className="block text-xs uppercase tracking-[0.18em] text-white/35">
                    Call
                  </span>
                  <span className="text-base font-medium">{store.phone}</span>
                </span>
              </a>

              <div className="flex items-center gap-3 px-1 text-white/70">
                <Clock className="shrink-0 text-orange" size={18} />
                <span>
                  <span className="block text-xs uppercase tracking-[0.18em] text-white/35">
                    Hours
                  </span>
                  <span className="text-sm">{store.hours} · Every day</span>
                </span>
              </div>

              <div className="flex flex-row gap-2.5 pt-1">
                <MagneticButton
                  href={store.mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="min-w-0 flex-1 justify-center px-3 py-2.5 text-xs sm:px-4 sm:py-3 sm:text-sm"
                >
                  <Navigation size={14} />
                  Directions
                </MagneticButton>
                <MagneticButton
                  href={store.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  variant="whatsapp"
                  className="min-w-0 flex-1 justify-center px-3 py-2.5 text-xs sm:px-4 sm:py-3 sm:text-sm"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </MagneticButton>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="Greenland Aquarium location"
                src={mapSrc}
                className="h-52 w-full sm:h-56"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Clear contact form */}
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-white/10 bg-[#0a0e11] p-6 sm:p-8 lg:col-span-3"
          >
            <h3 className="font-display text-2xl font-semibold tracking-tight">Message on WhatsApp</h3>
            <p className="mt-2 text-sm text-white/45">
              Tell us what you need — tanks, fish, or a store visit. We’ll open WhatsApp so you can
              send it directly to the store.
            </p>

            <div className="mt-7 space-y-4">
              {[
                { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Your name' },
                {
                  name: 'email',
                  label: 'Email',
                  type: 'email',
                  placeholder: 'you@email.com',
                },
                {
                  name: 'phone',
                  label: 'Phone',
                  type: 'tel',
                  placeholder: 'Your phone number',
                },
              ].map((field) => (
                <label key={field.name} className="block">
                  <span className="mb-2 block text-sm text-white/55">
                    {field.label}
                    {field.required ? <span className="text-orange"> *</span> : null}
                  </span>
                  <input
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    value={form[field.name]}
                    onChange={onChange}
                    placeholder={field.placeholder}
                    className={fieldClass}
                  />
                </label>
              ))}

              <label className="block">
                <span className="mb-2 block text-sm text-white/55">
                  Message<span className="text-orange"> *</span>
                </span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={onChange}
                  placeholder="How can we help?"
                  className={`${fieldClass} resize-none`}
                />
              </label>

              {status.message && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`text-sm ${
                    status.type === 'error' ? 'text-orange' : 'text-green'
                  }`}
                >
                  {status.message}
                </p>
              )}

              <MagneticButton
                as="button"
                type="submit"
                disabled={loading}
                variant="whatsapp"
                className="mt-2 w-full justify-center"
              >
                {loading ? 'Opening…' : 'Continue on WhatsApp'}
              </MagneticButton>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
