import { ArrowUpRight } from 'lucide-react'
import experienceBgDesktop from '../assets/experience-bg-desktop.webp'
import experienceBgMobile from '../assets/experience-bg-mobile.webp'
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
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <picture className="flex h-full w-full items-center justify-center">
          <source
            type="image/webp"
            media="(min-width: 1024px)"
            srcSet={experienceBgDesktop}
          />
          <img
            src={experienceBgMobile}
            alt=""
            aria-hidden
            className="h-auto w-auto max-h-[100svh] max-w-full object-contain object-center lg:h-full lg:w-full lg:max-h-none lg:object-cover"
            width={944}
            height={1232}
            loading="lazy"
            decoding="async"
          />
        </picture>
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
