import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, Calendar, Star, Eye } from 'lucide-react'

function FeaturedListings() {
    const [likedItems, setLikedItems] = useState(new Set())

    const featuredItems = [
        {
            id: 1,
            title: "MacBook Pro 16\" M3 Max",
            price: "€2,899",
            originalPrice: "€3,199",
            location: "Riga, Latvia",
            distance: "2.5 km",
            seller: { name: "TechStore LV", rating: 4.9, verified: true },
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop",
            isNew: false,
            canScheduleViewing: true,
            canDeliverGlobally: true,
            views: 1247,
            likes: 89
        },
        {
            id: 2,
            title: "BMW X5 2021 - Excellent Condition",
            price: "€45,900",
            location: "Tallinn, Estonia",
            distance: "320 km",
            seller: { name: "AutoDeal Baltic", rating: 4.7, verified: true },
            image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop",
            isNew: false,
            canScheduleViewing: true,
            canDeliverGlobally: false,
            views: 892,
            likes: 156
        },
        {
            id: 3,
            title: "Designer Apartment in Old Town",
            price: "€850/month",
            location: "Riga, Latvia",
            distance: "1.2 km",
            seller: { name: "Premium Properties", rating: 4.8, verified: true },
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=300&fit=crop",
            isNew: true,
            canScheduleViewing: true,
            canDeliverGlobally: false,
            views: 2103,
            likes: 234
        },
        {
            id: 4,
            title: "Vintage Gibson Les Paul Guitar",
            price: "€3,200",
            originalPrice: "€3,800",
            location: "Stockholm, Sweden",
            distance: "450 km",
            seller: { name: "Music Vintage", rating: 4.9, verified: true },
            image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=500&h=300&fit=crop",
            isNew: false,
            canScheduleViewing: true,
            canDeliverGlobally: true,
            views: 456,
            likes: 67
        },
        {
            id: 5,
            title: "Modern Scandinavian Sofa Set",
            price: "€1,299",
            originalPrice: "€1,599",
            location: "Helsinki, Finland",
            distance: "380 km",
            seller: { name: "Nordic Furniture", rating: 4.6, verified: true },
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop",
            isNew: true,
            canScheduleViewing: false,
            canDeliverGlobally: true,
            views: 678,
            likes: 123
        },
        {
            id: 6,
            title: "Professional Photography Services",
            price: "€150/session",
            location: "Riga, Latvia",
            distance: "5.8 km",
            seller: { name: "PhotoArt Studio", rating: 5.0, verified: true },
            image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=300&fit=crop",
            isNew: false,
            canScheduleViewing: true,
            canDeliverGlobally: false,
            views: 234,
            likes: 45
        }
    ]

    const toggleLike = (itemId) => {
        const newLikedItems = new Set(likedItems)
        if (newLikedItems.has(itemId)) {
            newLikedItems.delete(itemId)
        } else {
            newLikedItems.add(itemId)
        }
        setLikedItems(newLikedItems)
    }

    return (
        <section className="section bg-white">
            <div className="container-modern">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Featured Listings
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Hand-picked items from trusted sellers with verified quality
                    </p>
                </div>

                <div className="grid-responsive">
                    {featuredItems.map((item) => (
                        <div key={item.id} className="card overflow-hidden group">
                            {/* Image */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex flex-col gap-2">
                                    {item.isNew && <span className="badge badge-green">New</span>}
                                    {item.originalPrice && <span className="badge badge-red">Sale</span>}
                                </div>

                                {/* Like Button */}
                                <button
                                    onClick={() => toggleLike(item.id)}
                                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                                >
                                    <Heart className={`w-4 h-4 ${likedItems.has(item.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                                </button>

                                {/* Features */}
                                <div className="absolute bottom-3 left-3 flex gap-1">
                                    {item.canScheduleViewing && (
                                        <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            View
                                        </div>
                                    )}
                                    {item.canDeliverGlobally && (
                                        <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                                            Ship
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <Link to={`/product/${item.id}`}>
                                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                </Link>

                                {/* Price */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xl font-bold text-gray-900">{item.price}</span>
                                    {item.originalPrice && (
                                        <span className="text-sm text-gray-400 line-through">{item.originalPrice}</span>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="flex items-center text-gray-600 mb-3">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span className="text-sm">{item.location} • {item.distance}</span>
                                </div>

                                {/* Seller */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                                            {item.seller.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium text-gray-900">{item.seller.name}</span>
                                                {item.seller.verified && (
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center ml-1">
                                                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center">
                                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                                <span className="text-xs text-gray-600 ml-1">{item.seller.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <div className="flex items-center">
                                        <Eye className="w-4 h-4 mr-1" />
                                        <span>{item.views}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Heart className="w-4 h-4 mr-1" />
                                        <span>{item.likes}</span>
                                    </div>
                                </div>

                                {/* Action */}
                                <Link to={`/product/${item.id}`} className="btn-primary w-full text-center">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Link to="/browse" className="btn-primary">
                        Browse All Listings
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default FeaturedListings