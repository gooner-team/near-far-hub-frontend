import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, MapPin, Eye, Calendar, MessageCircle, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Card, Button, Badge } from '../components/ui'
import { formatPrice, formatTimeAgo } from '../utils'
import { MOCK_LISTINGS } from '../data'

function ListingDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isLiked, setIsLiked] = useState(false)
    const [selectedImage, setSelectedImage] = useState(0)

    useEffect(() => {
        // Simulate API call with mock data
        setTimeout(() => {
            const foundListing = MOCK_LISTINGS.find(l => l.id.toString() === id)
            if (foundListing) {
                setListing(foundListing)
            }
            setLoading(false)
        }, 500)
    }, [id])

    const handleAction = (action) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: `/product/${id}` } } })
            return
        }
        console.log('Action:', action)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        )
    }

    if (!listing) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h2>
                <Button onClick={() => navigate('/')}>Go Home</Button>
            </div>
        )
    }

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
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="overflow-hidden">
                            <img
                                src={listing.mainImage}
                                alt={listing.title}
                                className="w-full h-80 object-cover"
                            />
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="blue">{listing.categoryLabel}</Badge>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => setIsLiked(!isLiked)}>
                                        <Heart className={`w-5 h-5 ${isLiked ? 'text-red-600 fill-current' : 'text-gray-400'}`} />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        <Share2 className="w-5 h-5" />
                                    </Button>
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
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                <p className="text-gray-700">This is a great product with excellent quality and features.</p>
                            </div>
                        </Card>
                    </div>

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
                                <Button onClick={() => handleAction('contact')} className="w-full">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Contact Seller
                                </Button>

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

export default ListingDetailPage