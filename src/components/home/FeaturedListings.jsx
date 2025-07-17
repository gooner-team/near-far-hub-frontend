// src/components/home/FeaturedListings.jsx - Enhanced version
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, Calendar, Star, Eye, AlertCircle } from 'lucide-react'
import { listingsAPI } from '../../services/listingsAPI'

function FeaturedListings() {
    const [likedItems, setLikedItems] = useState(new Set())
    const [featuredItems, setFeaturedItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadFeaturedListings()
    }, [])

    const loadFeaturedListings = async () => {
        try {
            setIsLoading(true)
            const response = await listingsAPI.getFeaturedListings({ per_page: 6 })
            setFeaturedItems(response.data || [])
        } catch (error) {
            console.error('Failed to load featured listings:', error)
            setError(error.message)
            // Fallback to empty array so component still renders
            setFeaturedItems([])
        } finally {
            setIsLoading(false)
        }
    }

    const toggleLike = (itemId) => {
        const newLikedItems = new Set(likedItems)
        if (newLikedItems.has(itemId)) {
            newLikedItems.delete(itemId)
        } else {
            newLikedItems.add(itemId)
        }
        setLikedItems(newLikedItems)
        // TODO: Implement actual like API call
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
                                <div key={item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                                    {/* Image Container */}
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={item.mainImage || 'https://via.placeholder.com/500x300/F3F4F6/9CA3AF?text=No+Image'}
                                            alt={item.title}
                                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/500x300/F3F4F6/9CA3AF?text=No+Image'
                                            }}
                                        />

                                        {/* Overlay Badges */}
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            {item.isNew && (
                                                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                    New
                                                </span>
                                            )}
                                            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                {item.categoryLabel || 'Product'}
                                            </span>
                                        </div>

                                        {/* Like Button */}
                                        <button
                                            onClick={() => toggleLike(item.id)}
                                            className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                                        >
                                            <Heart
                                                className={`w-5 h-5 ${likedItems.has(item.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                                            />
                                        </button>

                                        {/* Delivery/Viewing Options */}
                                        <div className="absolute bottom-4 left-4 flex gap-2">
                                            {item.requiresAppointment && (
                                                <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    View
                                                </div>
                                            )}
                                            {item.canDeliverGlobally && (
                                                <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                                                    Global Ship
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <Link to={`/product/${item.id}`} className="block">
                                            <h3 className="font-semibold text-lg text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                        </Link>

                                        {/* Price */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-2xl font-bold text-gray-900">
                                                {item.formattedPrice || `€${item.price}`}
                                            </span>
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center text-gray-600 mb-3">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            <span className="text-sm">
                                                {item.locationString || item.distance || 'Location not specified'}
                                            </span>
                                        </div>

                                        {/* Seller Info */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                                                    {item.seller?.businessName?.charAt(0) || item.seller?.name?.charAt(0) || 'S'}
                                                </div>
                                                <div>
                                                    <div className="flex items-center">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {item.seller?.businessName || item.seller?.name || 'Seller'}
                                                        </span>
                                                        {item.seller?.verified && (
                                                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center ml-1">
                                                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                        <span className="text-xs text-gray-600 ml-1">
                                                            {item.seller?.rating || '4.8'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <div className="flex items-center">
                                                <Eye className="w-4 h-4 mr-1" />
                                                <span>{item.viewsCount || item.views || 0} views</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Heart className="w-4 h-4 mr-1" />
                                                <span>{item.favoritesCount || item.likes || 0} likes</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/product/${item.id}`}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-medium transition-colors"
                                            >
                                                View Details
                                            </Link>
                                            {item.requiresAppointment && (
                                                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                                                    <Calendar className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
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