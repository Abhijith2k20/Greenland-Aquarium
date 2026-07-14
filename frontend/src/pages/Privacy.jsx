import { Link } from 'react-router-dom'
import { useStaticContent } from '../context/ContentContext'

export default function Privacy() {
  const { store } = useStaticContent()
  const phone = store?.phone || '+91 96112 69901'
  const whatsapp = store?.whatsapp

  return (
    <div className="page-enter relative z-10 min-h-screen bg-[#07090b] pb-20 pt-28">
      <article className="section-pad mx-auto max-w-3xl">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-white/40">Legal</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-white/45">Last updated: July 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-white/70">
          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-white">Who we are</h2>
            <p>
              {store?.name || 'Greenland Aquarium'} (“we”, “us”) operates this website for our store
              in Horamavu, Bengaluru. You can reach us by phone at {phone}
              {whatsapp ? (
                <>
                  {' '}
                  or via{' '}
                  <a href={whatsapp} className="text-blue hover:underline" target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>
                </>
              ) : null}
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-white">
              Information we collect
            </h2>
            <p>
              If you use the contact form, you may send us your name, phone number, email address
              (optional), and message. Messages are typically delivered to us through WhatsApp (or
              an email form service if configured). We also receive standard technical data from
              your browser (such as IP address and device type) via our hosting provider and any
              analytics tools we enable.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-white">How we use it</h2>
            <p>
              We use contact details only to reply to your enquiry about our products or services.
              We do not sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-white">Sharing</h2>
            <p>
              Your message may pass through third-party tools we rely on (for example WhatsApp /
              Meta, and optionally Formspree or similar). Those services process data under their
              own policies.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-white">Retention</h2>
            <p>
              We keep enquiry messages only as long as needed to respond and follow up, then delete
              or archive them in the normal course of business.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-white">Your choices</h2>
            <p>
              You can ask us to delete a message you sent, or update how we contact you, by
              messaging us on WhatsApp or calling {phone}.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-lg font-semibold text-white">Contact</h2>
            <p>
              For privacy questions, contact {store?.name || 'Greenland Aquarium'} at {phone}.
            </p>
          </section>
        </div>

        <Link to="/" className="mt-12 inline-block text-sm text-blue hover:underline" data-cursor="hover">
          ← Back to home
        </Link>
      </article>
    </div>
  )
}
