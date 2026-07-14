import { ArrowUpRight } from 'lucide-react'
import experienceBgDesktop from '../assets/experience-bg-desktop.webp'
import experienceBgMobile from '../assets/experience-bg-mobile.webp'
import { useStaticContent } from '../context/ContentContext'

export default function CustomAquarium() {
  const { store } = useStaticContent()
  const href =
    store?.whatsapp ||
    `https://wa.me/${store?.phoneRaw || '919611269901'}?text=${encodeURIComponent(
      'Hi Greenland Aquarium, I want to design a custom aquarium.',
    )}`

  return (
    <section id="custom" className="relative overflow-hidden bg-black lg:min-h-[100svh]">
      <div className="relative lg:absolute lg:inset-0">
        <picture className="block">
          <source
            type="image/webp"
            media="(min-width: 1024px)"
            srcSet={experienceBgDesktop}
          />
          <img
            src={experienceBgMobile}
            alt=""
            aria-hidden
            className="block h-auto w-full lg:h-full lg:object-cover lg:object-center"
            width={944}
            height={1232}
            loading="lazy"
            decoding="async"
          />
        </picture>

        <div className="absolute inset-0 bg-black/10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050505]/30 via-transparent to-[#050505]/45" />

        <div className="section-pad absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
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
      </div>
    </section>
  )
}
