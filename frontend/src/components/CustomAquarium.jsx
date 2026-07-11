import { ArrowUpRight } from 'lucide-react'
import experienceBg from '../assets/experience-bg.jpg'
import { useContent } from '../context/ContentContext'

export default function CustomAquarium() {
  const { store } = useContent()
  const href =
    store?.whatsapp ||
    `https://wa.me/${store?.phoneRaw || '919611269901'}?text=${encodeURIComponent(
      'Hi Greenland Aquarium, I want to design a custom aquarium.',
    )}`

  return (
    <section id="custom" className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={experienceBg}
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-center brightness-110"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050505]/30 via-transparent to-[#050505]/45" />
      </div>

      <div className="section-pad relative z-10 flex min-h-[100svh] flex-col items-center justify-center text-center">
        <h2 className="max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl">
          Design your dream aquarium.
        </h2>
        <p className="mt-5 max-w-xl text-white/70">
          Immersive custom tanks with living plants, cinematic lighting, and species chosen for
          balance and beauty.
        </p>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          data-cursor="hover"
          className="hero-cta__dive mt-10"
        >
          <span className="hero-cta__ripple" aria-hidden />
          <span className="hero-cta__ripple hero-cta__ripple--delay" aria-hidden />
          <span className="hero-cta__label">Design Your Dream Aquarium</span>
          <ArrowUpRight className="hero-cta__arrow" size={16} strokeWidth={2.25} aria-hidden />
        </a>
      </div>
    </section>
  )
}
