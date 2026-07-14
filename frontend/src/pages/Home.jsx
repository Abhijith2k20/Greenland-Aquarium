import { lazy, Suspense } from 'react'
import Hero from '../components/Hero'

const Categories = lazy(() => import('../components/Categories'))
const FeaturedFish = lazy(() => import('../components/FeaturedFish'))
const CustomAquarium = lazy(() => import('../components/CustomAquarium'))
const Services = lazy(() => import('../components/Services'))
const Reviews = lazy(() => import('../components/Reviews'))
const Visit = lazy(() => import('../components/Visit'))

function SectionFallback() {
  return <div className="min-h-[40vh]" aria-hidden />
}

function Deferred({ children }) {
  return <div className="home-deferred">{children}</div>
}

export default function Home() {
  return (
    <>
      <Hero />

      {/* Opaque sheet scrolls over the sticky hero */}
      <div className="home-sheet">
        <Suspense fallback={<SectionFallback />}>
          <Categories />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Deferred>
            <FeaturedFish />
          </Deferred>
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Deferred>
            <CustomAquarium />
          </Deferred>
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Deferred>
            <Services />
          </Deferred>
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Deferred>
            <Reviews />
          </Deferred>
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Deferred>
            <Visit />
          </Deferred>
        </Suspense>
      </div>
    </>
  )
}
