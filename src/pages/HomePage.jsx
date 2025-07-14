import Hero from '../components/home/Hero'
import CategoryGrid from '../components/home/CategoryGrid'
import FeaturedListings from '../components/home/FeaturedListings'
import HowItWorks from '../components/home/HowItWorks'
import StatsSection from '../components/home/StatsSection'
import TestimonialSection from '../components/home/TestimonialSection'

function HomePage() {
    return (
        <div className="space-y-0">
            <Hero />
            <CategoryGrid />
            <FeaturedListings />
            <HowItWorks />
            <StatsSection />
            <TestimonialSection />
        </div>
    )
}

export default HomePage