

import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import AlumniSpotlight from '@/components/AlumniSpotlight'
import StatsSection from '@/components/StatsSection'
import BatchesSection from '@/components/BatchesSection'
import FeaturedBatchCards from '@/components/FeaturedBatchCards'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <FeaturedBatchCards />
      <BatchesSection />
      <AlumniSpotlight />
      <CTASection />
      <Footer />
    </main>
  )
}
