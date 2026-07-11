import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useContent } from '../context/ContentContext'
import aboutBetta from '../assets/about-betta-sm.png'

export default function Services() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const { services } = useContent()

  return (
    <section id="services" className="section-pad relative overflow-hidden py-28 md:py-36">
      {/* Betta as atmospheric background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 45% 55% at 85% 50%, rgba(255,107,120,0.1), transparent 60%)',
          }}
        />
        <img
          src={aboutBetta}
          alt=""
          className="about-betta absolute -right-[8%] top-1/2 w-[min(55vw,420px)] -translate-y-1/2 opacity-[0.38] brightness-110 drop-shadow-[0_20px_50px_rgba(255,90,100,0.2)] md:right-[2%] md:w-[min(42vw,480px)] md:opacity-[0.45] lg:w-[520px]"
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 max-w-2xl"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-green">Services</p>
          <h2 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
            Crafted care, end to end.
          </h2>
        </motion.div>

        <div ref={ref} className="relative max-w-2xl space-y-10 md:space-y-14">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <h3 className="font-display text-2xl font-semibold md:text-3xl">
                {service.title}
              </h3>
              <p className="mt-3 max-w-xl text-white/55">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
