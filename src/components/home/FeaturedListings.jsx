import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, Calendar, Star, Eye, AlertCircle } from 'lucide-react'
import { MOCK_LISTINGS } from '../../data'
import ListingCard from '../listings/ListingCard'

function FeaturedListings() {
    const [likedItems, setLikedItems] = useState(new Set())
    const [featuredItems, setFeaturedItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Simulate API call with mock data
        setTimeout(() => {
            setFeaturedItems(MOCK_LISTINGS)
            setIsLoading(false)
        }, 1000)
    }, [])

    const toggleLike = (itemId) => {
        const newLikedItems = new Set(likedItems)
        if (newLikedItems.has(itemId)) {
            newLikedItems.delete(itemId)
        } else {
            newLikedItems.add(itemId)
        }
        setLikedItems(newLikedItems)
    }

    if (error) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load featured listings</h3>
                        <p className="text-gray-600">Please try again later</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Featured Listings
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Hand-picked items from trusted sellers. Premium products, verified quality,
                        and amazing deals from both local and international vendors.
                    </p>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Listings Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredItems.map((item) => (
                                <ListingCard
                                    key={item.id}
                                    listing={item}
                                    onLike={toggleLike}
                                    isLiked={likedItems.has(item.id)}
                                />
                            ))}
                        </div>

                        {/* View More Button */}
                        <div className="text-center mt-12">
                            <Link
                                to="/browse"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Browse All Listings
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export default FeaturedListings