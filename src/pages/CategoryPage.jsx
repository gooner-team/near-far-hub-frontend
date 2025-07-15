import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Search,
    Filter,
    Grid,
    List,
    MapPin,
    Calendar,
    Heart,
    Star,
    Eye,
    ArrowLeft,
    SlidersHorizontal
} from 'lucide-react'

function CategoryPage() {
    const { category } = useParams()
    const [viewMode, setViewMode] = useState('grid')
    const [sortBy, setSortBy] = useState('popular')
    const [searchQuery, setSearchQuery] = useState('')
    const [likedItems, setLikedItems] = useState(new Set())

    // Mock data - in real app, this would come from API
    const categoryInfo = {
        electronics: {
            name: 'Electronics',
            description: 'Latest tech gadgets, smartphones, laptops, and electronic accessories',
            totalItems: '12,450'
        },
        vehicles: {
            name: 'Vehicles',
            description: 'Cars, motorcycles, boats, and automotive parts',
            totalItems: '8,320'
        },
        'real-estate': {
            name: 'Real Estate',
            description: 'Houses, apartments, land, and commercial properties',
            totalItems: '5,680'
        },
        fashion: {
            name: 'Fashion',
            description: 'Clothing, shoes, accessories, and jewelry',
            totalItems: '15,920'
        },
        'home-garden': {
            name: 'Home & Garden',
            description: 'Furniture, decor, tools, and garden supplies',
            totalItems: '9,750'
        },
        services: {
            name: 'Services',
            description: 'Professional services, repairs, and consultations',
            totalItems: '6,420'
        }
    }

    const currentCategory = categoryInfo[category] || {
        name: 'Category',
        description: 'Browse products in this category',
        totalItems: '0'
    }

    // Mock listings data
    const listings = [
        {
            id: 1,
            title: "MacBook Pro 16\" M3 Max - Like New",
            price: "€2,899",
            originalPrice: "€3,199",
            location: "Riga, Latvia",
            distance: "2.5 km",
            seller: {
                name: "TechStore LV",
                rating: 4.9,
                verified: true
            },
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
            isNew: false,
            canScheduleViewing: true,
            canDeliverGlobally: true,
            views: 1247,
            likes: 89,
            postedDate: "2 days ago"
        },
        {
            id: 2,
            title: "iPhone 15 Pro Max 256GB - Sealed",
            price: "€1,299",
            location: "Tallinn, Estonia",
            distance: "320 km",
            seller: {
                name: "Mobile Expert",
                rating: 4.8,
                verified: true
            },
            image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
            isNew: true,
            canScheduleViewing: true,
            canDeliverGlobally: true,
            views: 892,
            likes: 156,
            postedDate: "1 day ago"
        },
        {
            id: 3,
            title: "Gaming Laptop ASUS ROG Strix",
            price: "€1,899",
            originalPrice: "€2,299",
            location: "Stockholm, Sweden",
            distance: "450 km",
            seller: {
                name: "Gaming Pro",
                rating: 4.7,
                verified: true
            },
            image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop",
            isNew: false,
            canScheduleViewing: false,
            canDeliverGlobally: true,
            views: 654,
            likes: 98,
            postedDate: "3 days ago"
        },
        {
            id: 4,
            title: "Sony WH-1000XM5 Headphones",
            price: "€349",
            originalPrice: "€399",
            location: "Helsinki, Finland",
            distance: "380 km",
            seller: {
                name: "Audio World",
                rating: 4.9,
                verified: true
            },
            image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop",
            isNew: false,
            canScheduleViewing: true,
            canDeliverGlobally: true,
            views: 432,
            likes: 67,
            postedDate: "1 week ago"
        },
        {
            id: 5,
            title: "iPad Pro 12.9\" M2 Chip",
            price: "€1,099",
            location: "Copenhagen, Denmark",
            distance: "620 km",
            seller: {
                name: "Digital Hub",
                rating: 4.6,
                verified: true
            },
            image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
            isNew: true,
            canScheduleViewing: false,
            canDeliverGlobally: true,
            views: 789,
            likes: 123,
            postedDate: "5 days ago"
        },
        {
            id: 6,
            title: "Samsung 65\" QLED 4K TV",
            price: "€1,299",
            originalPrice: "€1,599",
            location: "Oslo, Norway",
            distance: "850 km",
            seller: {
                name: "Electronics Plus",
                rating: 4.8,
                verified: true
            },
            image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&h=300&fit=crop",
            isNew: false,
            canScheduleViewing: true,
            canDeliverGlobally: false,
            views: 567,
            likes: 89,
            postedDate: "1 week ago"
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

    const sortOptions = [
        { value: 'popular', label: 'Most Popular' },
        { value: 'newest', label: 'Newest First' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' },
        { value: 'distance', label: 'Nearest First' }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link
                            to="/categories"
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Categories
                        </Link>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="mb-4 lg:mb-0">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {currentCategory.name}
                            </h1>
                            <p className="text-gray-600 mb-2">{currentCategory.description}</p>
                            <p className="text-sm text-gray-500">
                                {currentCategory.totalItems} items available
                            </p>
                        </div>

                        {/* Search */}
                        <div className="w-full lg:w-96">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={`Search in ${currentCategory.name.toLowerCase()}...`}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                <SlidersHorizontal className="w-4 h-4" />
                                <span>Filters</span>
                            </button>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 mr-2">View:</span>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Listings */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {listings.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                                {/* Image Container */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />

                                    {/* Overlay Badges */}
                                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                                        {item.isNew && (
                                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                New
                                            </span>
                                        )}
                                        {item.originalPrice && (
                                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                Sale
                                            </span>
                                        )}
                                    </div>

                                    {/* Like Button */}
                                    <button
                                        onClick={() => toggleLike(item.id)}
                                        className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                                    >
                                        <Heart
                                            className={`w-4 h-4 ${likedItems.has(item.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                                        />
                                    </button>

                                    {/* Features */}
                                    <div className="absolute bottom-3 left-3 flex gap-1">
                                        {item.canScheduleViewing && (
                                            <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>View</span>
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
                                    <Link to={`/product/${item.id}`} className="block">
                                        <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>
                                    </Link>

                                    {/* Price */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg font-bold text-gray-900">{item.price}</span>
                                        {item.originalPrice && (
                                            <span className="text-sm text-gray-400 line-through">{item.originalPrice}</span>
                                        )}
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center text-gray-600 mb-3">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        <span className="text-xs">{item.location} • {item.distance}</span>
                                    </div>

                                    {/* Seller */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                                                {item.seller.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <span className="text-xs font-medium text-gray-900">{item.seller.name}</span>
                                                    {item.seller.verified && (
                                                        <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center ml-1">
                                                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center">
                                                    <Star className="w-2 h-2 text-yellow-400 fill-current" />
                                                    <span className="text-xs text-gray-600 ml-1">{item.seller.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                        <div className="flex items-center">
                                            <Eye className="w-3 h-3 mr-1" />
                                            <span>{item.views}</span>
                                        </div>
                                        <span>{item.postedDate}</span>
                                    </div>

                                    {/* Action Button */}
                                    <Link
                                        to={`/product/${item.id}`}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-medium transition-colors text-sm"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {listings.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                                <div className="flex flex-col md:flex-row">
                                    {/* Image */}
                                    <div className="relative md:w-64 h-48 md:h-40">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
                                        />
                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            {item.isNew && (
                                                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                    New
                                                </span>
                                            )}
                                            {item.originalPrice && (
                                                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                                    Sale
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <Link to={`/product/${item.id}`} className="block">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                </Link>

                                                {/* Price */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="text-xl font-bold text-gray-900">{item.price}</span>
                                                    {item.originalPrice && (
                                                        <span className="text-lg text-gray-400 line-through">{item.originalPrice}</span>
                                                    )}
                                                </div>

                                                {/* Location and Seller */}
                                                <div className="flex items-center text-gray-600 mb-2">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    <span className="text-sm">{item.location} • {item.distance}</span>
                                                </div>

                                                <div className="flex items-center mb-3">
                                                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                                                        {item.seller.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{item.seller.name}</span>
                                                    {item.seller.verified && (
                                                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center ml-1">
                                                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <Star className="w-3 h-3 text-yellow-400 fill-current ml-2" />
                                                    <span className="text-sm text-gray-600 ml-1">{item.seller.rating}</span>
                                                </div>

                                                {/* Features */}
                                                <div className="flex gap-2 mb-3">
                                                    {item.canScheduleViewing && (
                                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                                            Can View
                                                        </span>
                                                    )}
                                                    {item.canDeliverGlobally && (
                                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                            Global Shipping
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Stats */}
                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex items-center">
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            <span>{item.views} views</span>
                                                        </div>
                                                        <span>{item.postedDate}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col space-y-2 ml-4">
                                                <button
                                                    onClick={() => toggleLike(item.id)}
                                                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                                >
                                                    <Heart
                                                        className={`w-4 h-4 ${likedItems.has(item.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                                                    />
                                                </button>
                                                <Link
                                                    to={`/product/${item.id}`}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm text-center"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Load More */}
                <div className="text-center mt-8">
                    <button className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 px-8 rounded-xl transition-colors">
                        Load More Items
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CategoryPage