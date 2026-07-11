import { lazy, Suspense } from 'react'
import Hero from '../components/Hero'
import Categories from '../components/Categories'

const FeaturedFish = lazy(() => import('../components/FeaturedFish'))
const CustomAquarium = lazy(() => import('../components/CustomAquarium'))
const Services = lazy(() => import('../components/Services'))
const Reviews = lazy(() => import('../components/Reviews'))
const Visit = lazy(() => import('../components/Visit'))

function SectionFallback() {
  return <div className="min-h-[40vh]" aria-hidden />
}

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Suspense fallback={<SectionFallback />}>
        <FeaturedFish />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <CustomAquarium />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Services />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Reviews />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Visit />
      </Suspense>
    </>
  )
}
