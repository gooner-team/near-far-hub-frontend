// src/pages/BrowseListingsPage.jsx
import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
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
    SlidersHorizontal,
    X,
    Globe,
    Clock,
    ChevronDown,
    AlertCircle
} from 'lucide-react'
import { listingsAPI, LISTING_CATEGORIES, LISTING_CONDITIONS, SORT_OPTIONS } from '../services/listingsAPI'

export default function BrowseListingsPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [listings, setListings] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [viewMode, setViewMode] = useState('grid')
    const [showFilters, setShowFilters] = useState(false)
    const [likedItems, setLikedItems] = useState(new Set())

    // Filter state
    const [filters, setFilters] = useState({
        search: searchParams.get('q') || '',
        category: searchParams.get('category') || '',
        condition: searchParams.get('condition') || '',
        min_price: searchParams.get('min_price') || '',
        max_price: searchParams.get('max_price') || '',
        location: searchParams.get('location') || '',
        can_deliver_globally: searchParams.get('can_deliver_globally') === 'true',
        requires_appointment: searchParams.get('requires_appointment') === 'true',
        sort_by: searchParams.get('sort_by') || 'newest',
        per_page: 20,
        page: parseInt(searchParams.get('page')) || 1
    })

    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
        per_page: 20,
        last_page: 1
    })

    const [stats, setStats] = useState({
        total_listings: 0,
        categories: {}
    })

    useEffect(() => {
        loadListings()
        loadStats()
    }, [filters])

    useEffect(() => {
        // Update URL params when filters change
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== '' && value !== false && key !== 'per_page') {
                params.set(key, value.toString())
            }
        })
        setSearchParams(params)
    }, [filters, setSearchParams])

    const loadListings = async () => {
        try {
            setIsLoading(true)
            setError(null)

            let response
            if (filters.search) {
                response = await listingsAPI.searchListings(filters.search, filters)
            } else {
                response = await listingsAPI.getListings(filters)
            }

            setListings(response.data || [])
            if (response.pagination) {
                setPagination(response.pagination)
            }
        } catch (error) {
            console.error('Failed to load listings:', error)
            setError(error.message)
            setListings([])
        } finally {
            setIsLoading(false)
        }
    }

    const loadStats = async () => {
        try {
            const [statsResponse, categoriesResponse] = await Promise.all([
                listingsAPI.getListingStats(),
                listingsAPI.getCategoriesWithCounts()
            ])

            setStats({
                total_listings: statsResponse.data.total_listings || 0,
                categories: categoriesResponse.data || {}
            })
        } catch (error) {
            console.error('Failed to load stats:', error)
        }
    }

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filters change
        }))
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        loadListings()
    }

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            condition: '',
            min_price: '',
            max_price: '',
            location: '',
            can_deliver_globally: false,
            requires_appointment: false,
            sort_by: 'newest',
            per_page: 20,
            page: 1
        })
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

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const renderPagination = () => {
        if (pagination.last_page <= 1) return null

        const pages = []
        const maxVisiblePages = 5
        const startPage = Math.max(1, pagination.current_page - Math.floor(maxVisiblePages / 2))
        const endPage = Math.min(pagination.last_page, startPage + maxVisiblePages - 1)

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 rounded-lg ${
                        i === pagination.current_page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    {i}
                </button>
            )
        }

        return (
            <div className="flex items-center justify-center space-x-2 mt-8">
                {pagination.current_page > 1 && (
                    <button
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        className="px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        Previous
                    </button>
                )}
                {pages}
                {pagination.current_page < pagination.last_page && (
                    <button
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        className="px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        Next
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="mb-4 lg:mb-0">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Browse Listings
                            </h1>
                            <p className="text-gray-600">
                                {stats.total_listings.toLocaleString()} listings available
                            </p>
                        </div>

                        {/* Search */}
                        <div className="w-full lg:w-96">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    placeholder="Search listings..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Clear all
                                    </button>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="lg:hidden text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All categories</option>
                                        {Object.entries(LISTING_CATEGORIES).map(([key, label]) => (
                                            <option key={key} value={key}>
                                                {label} {stats.categories[key] ? `(${stats.categories[key]})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Condition */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Condition
                                    </label>
                                    <select
                                        value={filters.condition}
                                        onChange={(e) => handleFilterChange('condition', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Any condition</option>
                                        {Object.entries(LISTING_CONDITIONS).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Range (€)
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.min_price}
                                            onChange={(e) => handleFilterChange('min_price', e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.max_price}
                                            onChange={(e) => handleFilterChange('max_price', e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="City or region"
                                        value={filters.location}
                                        onChange={(e) => handleFilterChange('location', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Options */}
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="can_deliver_globally"
                                            checked={filters.can_deliver_globally}
                                            onChange={(e) => handleFilterChange('can_deliver_globally', e.target.checked)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="can_deliver_globally" className="ml-2 text-sm text-gray-700 flex items-center">
                                            <Globe className="w-4 h-4 mr-1" />
                                            Global shipping available
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="requires_appointment"
                                            checked={filters.requires_appointment}
                                            onChange={(e) => handleFilterChange('requires_appointment', e.target.checked)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor="requires_appointment" className="ml-2 text-sm text-gray-700 flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            Appointment viewing
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    <span>Filters</span>
                                </button>
                                <select
                                    value={filters.sort_by}
                                    onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Object.entries(SORT_OPTIONS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600 mr-2">View:</span>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg ${
                                        viewMode === 'grid'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg ${
                                        viewMode === 'list'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Results */}
                        {error ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading listings</h3>
                                <p className="text-gray-600 mb-4">{error}</p>
                                <button
                                    onClick={loadListings}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : isLoading ? (
                            <div className={viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'space-y-4'
                            }>
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="bg-white rounded-lg h-64 animate-pulse"></div>
                                ))}
                            </div>
                        ) : listings.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
                                <p className="text-gray-600 mb-4">
                                    Try adjusting your search criteria or browse all categories
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Grid View */}
                                {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {listings.map((listing) => (
                                            <div key={listing.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                                                <div className="relative">
                                                    <img
                                                        src={listing.mainImage || 'https://via.placeholder.com/400x200/F3F4F6/9CA3AF?text=No+Image'}
                                                        alt={listing.title}
                                                        className="w-full h-48 object-cover"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/400x200/F3F4F6/9CA3AF?text=No+Image'
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => toggleLike(listing.id)}
                                                        className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white"
                                                    >
                                                        <Heart className={`w-4 h-4 ${likedItems.has(listing.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                                                    </button>
                                                </div>
                                                <div className="p-4">
                                                    <Link to={`/product/${listing.id}`}>
                                                        <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                                                            {listing.title}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-2xl font-bold text-gray-900 mb-2">
                                                        {listing.formattedPrice}
                                                    </p>
                                                    <div className="flex items-center text-gray-600 text-sm mb-3">
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        <span>{listing.locationString || 'Location not specified'}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <Eye className="w-3 h-3 mr-1" />
                                                            <span>{listing.viewsCount || 0} views</span>
                                                        </div>
                                                        <span>{listing.timeAgo}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    /* List View */
                                    <div className="space-y-4">
                                        {listings.map((listing) => (
                                            <div key={listing.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                                                <div className="flex">
                                                    <div className="w-48 h-32 flex-shrink-0">
                                                        <img
                                                            src={listing.mainImage || 'https://via.placeholder.com/200x130/F3F4F6/9CA3AF?text=No+Image'}
                                                            alt={listing.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/200x130/F3F4F6/9CA3AF?text=No+Image'
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 p-4">
                                                        <div className="flex justify-between">
                                                            <div className="flex-1">
                                                                <Link to={`/product/${listing.id}`}>
                                                                    <h3 className="font-semibold text-lg text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                                                                        {listing.title}
                                                                    </h3>
                                                                </Link>
                                                                <p className="text-2xl font-bold text-gray-900 mb-2">
                                                                    {listing.formattedPrice}
                                                                </p>
                                                                <div className="flex items-center text-gray-600 text-sm mb-2">
                                                                    <MapPin className="w-3 h-3 mr-1" />
                                                                    <span>{listing.locationString || 'Location not specified'}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                                    <div className="flex items-center">
                                                                        <Eye className="w-3 h-3 mr-1" />
                                                                        <span>{listing.viewsCount || 0} views</span>
                                                                    </div>
                                                                    <span>{listing.timeAgo}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end space-y-2">
                                                                <button
                                                                    onClick={() => toggleLike(listing.id)}
                                                                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                                                                >
                                                                    <Heart className={`w-4 h-4 ${likedItems.has(listing.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                                                                </button>
                                                                <Link
                                                                    to={`/product/${listing.id}`}
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                                                >
                                                                    View Details
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {renderPagination()}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}