import { Heart, MapPin, Eye, Calendar, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, Badge, Button } from '../ui/index.jsx'
import { formatPrice, formatTimeAgo } from '../../utils'

function ListingCard({ listing, onLike, isLiked = false }) {
    return (
        <Card className="group overflow-hidden">
            <div className="relative">
                <img
                    src={listing.mainImage || 'https://via.placeholder.com/500x300/F3F4F6/9CA3AF?text=No+Image'}
                    alt={listing.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/500x300/F3F4F6/9CA3AF?text=No+Image'
                    }}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 space-y-2">
                    {listing.isNew && <Badge variant="green">New</Badge>}
                    <Badge variant="blue">{listing.categoryLabel}</Badge>
                </div>

                {/* Like Button */}
                <button
                    onClick={() => onLike?.(listing.id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                    <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                </button>

                {/* Features */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                    {listing.requiresAppointment && (
                        <Badge variant="default" className="bg-black/70 text-white">
                            <Calendar className="w-3 h-3 mr-1" />
                            View
                        </Badge>
                    )}
                    {listing.canDeliverGlobally && (
                        <Badge variant="default" className="bg-black/70 text-white">
                            <Globe className="w-3 h-3 mr-1" />
                            Ship
                        </Badge>
                    )}
                </div>
            </div>

            <div className="p-4">
                <Link to={`/product/${listing.id}`}>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                        {listing.title}
                    </h3>
                </Link>

                <div className="text-2xl font-bold text-gray-900 mb-3">
                    {listing.formattedPrice || formatPrice(listing.price)}
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{listing.locationString}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{listing.viewsCount || 0} views</span>
                    </div>
                    <span>{formatTimeAgo(listing.createdAt)}</span>
                </div>

                <Button asChild className="w-full">
                    <Link to={`/product/${listing.id}`}>View Details</Link>
                </Button>
            </div>
        </Card>
    )
}

export default ListingCard