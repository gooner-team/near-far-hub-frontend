// src/pages/ListingDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
    ArrowLeft,
    Heart,
    Share2,
    MapPin,
    Calendar,
    Eye,
    Globe,
    Clock,
    User,
    Star,
    MessageCircle,
    Shield,
    Truck,
    CheckCircle,
    Image as ImageIcon
} from 'lucide-react'
import { listingsAPI, LISTING_CATEGORIES, LISTING_CONDITIONS } from '../services/listingsAPI'
import { useAuth } from '../contexts/AuthContext'

function ListingDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [listing, setListing] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isLiked, setIsLiked] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    useEffect(() => {
        loadListing()
    }, [id])

    const loadListing = async () => {
        try {
            setIsLoading(true)
            const response = await listingsAPI.getListingById(id)
            setListing(response.data)
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleLike = () => {
        setIsLiked(!isLiked)
        // TODO: Implement actual like functionality
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: listing.title,
                    text: listing.description,
                    url: window.location.href
                })
            } catch (error) {
                // User cancelled sharing or error occurred
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(window.location.href)
            // Show toast notification
        }
    }

    const handleBookAppointment = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: `/product/${id}` } } })
            return
        }
        // Navigate to appointment booking
        navigate(`/book-appointment/${listing.seller.id}`, { state: { listing } })
    }

    const handleContactSeller = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: `/product/${id}` } } })
            return
        }
        // Navigate to messaging or open contact modal
        // TODO: Implement messaging system
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h2>
                    <p className="text-gray-600 mb-4">The listing you're looking for doesn't exist or has been removed.</p>
                    <Link
                        to="/"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        )
    }

    const images = listing.images && listing.images.length > 0 ? listing.images : []

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Images */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {images.length > 0 ? (
                                <div>
                                    <div className="aspect-w-16 aspect-h-12">
                                        <img
                                            src={images[selectedImageIndex]}
                                            alt={listing.title}
                                            className="w-full h-80 object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/800x600/F3F4F6/9CA3AF?text=No+Image'
                                            }}
                                        />
                                    </div>
                                    {images.length > 1 && (
                                        <div className="p-4 border-t">
                                            <div className="flex space-x-2 overflow-x-auto">
                                                {images.map((image, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSelectedImageIndex(index)}
                                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                                                            selectedImageIndex === index
                                                                ? 'border-blue-500'
                                                                : 'border-gray-200'
                                                        }`}
                                                    >
                                                        <img
                                                            src={image}
                                                            alt={`${listing.title} ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-80 bg-gray-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500">No images available</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                            {LISTING_CATEGORIES[listing.category]}
                                        </span>
                                        {listing.condition && (
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                                {LISTING_CONDITIONS[listing.condition]}
                                            </span>
                                        )}
                                        {listing.isNew && (
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                New
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleLike}
                                        className={`p-2 rounded-full ${
                                            isLiked ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600'
                                        } transition-colors`}
                                    >
                                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="text-3xl font-bold text-gray-900 mb-4">
                                {listing.formattedPrice}
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span>{listing.locationString}</span>
                                </div>
                                <div className="flex items-center">
                                    <Eye className="w-4 h-4 mr-1" />
                                    <span>{listing.viewsCount} views</span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>{listing.timeAgo}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {listing.canDeliverGlobally && (
                                    <div className="flex items-center text-sm text-green-600">
                                        <Globe className="w-4 h-4 mr-2" />
                                        <span>Global Shipping</span>
                                    </div>
                                )}
                                {listing.requiresAppointment && (
                                    <div className="flex items-center text-sm text-blue-600">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span>Appointment Required</span>
                                    </div>
                                )}
                                <div className="flex items-center text-sm text-gray-600">
                                    <Shield className="w-4 h-4 mr-2" />
                                    <span>Secure Transaction</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Truck className="w-4 h-4 mr-2" />
                                    <span>Safe Delivery</span>
                                </div>
                            </div>

                            {listing.description && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                    <div className="prose prose-sm max-w-none text-gray-700">
                                        {listing.description.split('\n').map((paragraph, index) => (
                                            <p key={index} className="mb-2">{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Seller Info */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                                    {listing.seller.businessName?.charAt(0) || 'S'}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 flex items-center">
                                        {listing.seller.businessName || 'Seller'}
                                        {listing.seller.isVerified && (
                                            <CheckCircle className="w-4 h-4 text-blue-500 ml-1" />
                                        )}
                                    </h4>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                        <span>4.8 rating</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {listing.requiresAppointment ? (
                                    <button
                                        onClick={handleBookAppointment}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        <span>Book Appointment</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleContactSeller}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Contact Seller</span>
                                    </button>
                                )}

                                <button
                                    onClick={handleContactSeller}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
                                >
                                    Send Message
                                </button>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    <Shield className="w-4 h-4 inline mr-1" />
                                    Your transaction is protected by our buyer guarantee
                                </p>
                            </div>
                        </div>

                        {/* Safety Tips */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-medium text-yellow-800 mb-2">Safety Tips</h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• Meet in a safe, public location</li>
                                <li>• Inspect the item before payment</li>
                                <li>• Use secure payment methods</li>
                                <li>• Never share personal financial info</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListingDetailPage