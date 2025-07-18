import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, MapPin, Eye, Calendar, MessageCircle, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { listingsAPI } from '../services/api'
import { Card, Button, Badge } from '../components/ui'
import { formatPrice, formatTimeAgo } from '../utils'

export const ListingDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isLiked, setIsLiked] = useState(false)
    const [selectedImage, setSelectedImage] = useState(0)

    useEffect(() => {
        listingsAPI.getById(id)
            .then(({ data }) => setListing(data))
            .catch(() => navigate('/404'))
            .finally(() => setLoading(false))
    }, [id, navigate])

    const handleAction = (action) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: `/product/${id}` } } })
            return
        }
        // Handle action
    }

    if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" /></div>

    if (!listing) return <div className="text-center py-20">Listing not found</div>

    const images = listing.images?.length ? listing.images : ['/placeholder.jpg']

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Button variant="ghost" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="overflow-hidden">
                            <img
                                src={images[selectedImage]}
                                alt={listing.title}
                                className="w-full h-80 object-cover"
                                onError={(e) => e.target.src = '/placeholder.jpg'}
                            />
                            {images.length > 1 && (
                                <div className="p-4 border-t">
                                    <div className="flex space-x-2 overflow-x-auto">
                                        {images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedImage(index)}
                                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                                                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                                                }`}
                                            >
                                                <img src={image} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="blue">{listing.categoryLabel}</Badge>
                                        {listing.condition && <Badge>{listing.condition}</Badge>}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => setIsLiked(!isLiked)}>
                                        <Heart className={`w-5 h-5 ${isLiked ? 'text-red-600 fill-current' : 'text-gray-400'}`} />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => navigator.share?.({ url: window.location.href })}>
                                        <Share2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="text-3xl font-bold text-gray-900 mb-4">
                                {formatPrice(listing.price)}
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
                                <span>{formatTimeAgo(listing.createdAt)}</span>
                            </div>

                            {listing.description && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                                    {listing.seller?.businessName?.charAt(0) || 'S'}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{listing.seller?.businessName || 'Seller'}</h4>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span>4.8 rating</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {listing.requiresAppointment ? (
                                    <Button onClick={() => handleAction('appointment')} className="w-full">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Book Appointment
                                    </Button>
                                ) : (
                                    <Button onClick={() => handleAction('contact')} className="w-full">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Contact Seller
                                    </Button>
                                )}

                                <Button variant="secondary" onClick={() => handleAction('message')} className="w-full">
                                    Send Message
                                </Button>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    <Shield className="w-4 h-4 inline mr-1" />
                                    Your transaction is protected
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
