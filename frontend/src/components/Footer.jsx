import { Phone, MapPin } from 'lucide-react'
import { NAV_LINKS } from '../data/content'
import { useContent } from '../context/ContentContext'
import AppLink from './AppLink'
import SocialLinks from './SocialLinks'

export default function Footer() {
  const { store } = useContent()

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#070707]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 opacity-60">
        <svg viewBox="0 0 720 120" className="h-full w-full" preserveAspectRatio="none">
          <path
            className="wave-path"
            fill="url(#waveGrad)"
            d="M0,40 C120,80 240,0 360,40 C480,80 600,0 720,40 L720,120 L0,120 Z"
          />
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4FC3F7" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#2ECC71" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4FC3F7" stopOpacity="0.35" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="section-pad relative z-10 mx-auto grid max-w-7xl gap-10 py-16 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue to-green font-bold text-[#041018]">
              GA
            </span>
            <div>
              <p className="font-display text-xl font-semibold">{store.name}</p>
              <p className="text-sm text-white/50 italic">{store.tagline}</p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/55">
            Premium aquarium experiences, exotic fish, and pet care in Horamavu, Bengaluru.
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
            Navigate
          </p>
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <AppLink
                key={link.href}
                href={link.href}
                className="text-white/70 transition hover:text-white"
                data-cursor="hover"
              >
                {link.label}
              </AppLink>
            ))}
            <AppLink
              href="/privacy"
              className="text-white/70 transition hover:text-white"
              data-cursor="hover"
            >
              Privacy
            </AppLink>
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
            Contact
          </p>
          <div className="space-y-3 text-sm text-white/70">
            <p className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-blue" />
              <span>
                {store.address.line1} {store.address.line4} {store.address.city}
              </span>
            </p>
            <a
              href={`tel:${store.phoneRaw}`}
              className="flex items-center gap-2 transition hover:text-white"
              data-cursor="hover"
            >
              <Phone size={16} className="text-green" />
              {store.phone}
            </a>
          </div>
          <SocialLinks socials={store.socials} className="mt-6" />
        </div>
      </div>

      <div className="section-pad relative z-10 border-t border-white/5 py-5 text-center text-xs text-white/35">
        © {new Date().getFullYear()} Greenland Aquarium. All rights reserved.
      </div>
    </footer>
  )
}
