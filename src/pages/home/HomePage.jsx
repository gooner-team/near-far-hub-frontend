import Hero from '../../components/home/Hero.jsx'
import CategoryGrid from '../../components/home/CategoryGrid.jsx'
import FeaturedListings from '../../components/home/FeaturedListings.jsx'
import HowItWorks from '../../components/home/HowItWorks.jsx'
import StatsSection from '../../components/home/StatsSection.jsx'
import TestimonialSection from '../../components/home/TestimonialSection.jsx'

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