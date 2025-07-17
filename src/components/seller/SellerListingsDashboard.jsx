// src/components/seller/SellerListingsDashboard.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    ShoppingCart,
    Calendar,
    MapPin,
    Euro,
    Filter,
    Search,
    MoreVertical,
    CheckCircle,
    AlertCircle,
    Package
} from 'lucide-react'
import { listingsAPI, LISTING_STATUSES, LISTING_CATEGORIES } from '../../services/listingsAPI'

export default function SellerListingsDashboard() {
    const navigate = useNavigate()
    const [listings, setListings] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [filters, setFilters] = useState({
        status: '',
        search: '',
        sort_by: 'newest'
    })
    const [selectedListing, setSelectedListing] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        draft: 0,
        sold: 0
    })

    useEffect(() => {
        loadListings()
    }, [filters])

    const loadListings = async () => {
        try {
            setIsLoading(true)
            const response = await listingsAPI.getCurrentUserListings(filters)
            setListings(response.data || [])

            // Calculate stats
            const total = response.data?.length || 0
            const active = response.data?.filter(l => l.status === 'active').length || 0
            const draft = response.data?.filter(l => l.status === 'draft').length || 0
            const sold = response.data?.filter(l => l.status === 'sold').length || 0

            setStats({ total, active, draft, sold })
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load listings' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handlePublishListing = async (listingId) => {
        try {
            await listingsAPI.publishListing(listingId)
            setMessage({ type: 'success', text: 'Listing published successfully!' })
            loadListings()
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to publish listing' })
        }
    }

    const handleUnpublishListing = async (listingId) => {
        try {
            await listingsAPI.unpublishListing(listingId)
            setMessage({ type: 'success', text: 'Listing unpublished successfully!' })
            loadListings()
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to unpublish listing' })
        }
    }

    const handleMarkAsSold = async (listingId) => {
        try {
            await listingsAPI.markAsSold(listingId)
            setMessage({ type: 'success', text: 'Listing marked as sold!' })
            loadListings()
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to mark as sold' })
        }
    }

    const handleDeleteListing = async () => {
        if (!selectedListing) return

        try {
            await listingsAPI.deleteListing(selectedListing.id)
            setMessage({ type: 'success', text: 'Listing deleted successfully!' })
            setShowDeleteModal(false)
            setSelectedListing(null)
            loadListings()
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete listing' })
        }
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
            active: { color: 'bg-green-100 text-green-800', label: 'Active' },
            sold: { color: 'bg-blue-100 text-blue-800', label: 'Sold' },
            expired: { color: 'bg-red-100 text-red-800', label: 'Expired' },
            suspended: { color: 'bg-yellow-100 text-yellow-800', label: 'Suspended' }
        }

        const config = statusConfig[status] || statusConfig.draft
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
                {config.label}
            </span>
        )
    }

    const formatPrice = (price) => {
        return `€${parseFloat(price).toFixed(2)}`
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString()
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
                    <p className="text-gray-600 mt-1">Manage your product listings</p>
                </div>
                <Link
                    to="/create-listing"
                    className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Listing</span>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="flex items-center">
                        <Package className="w-8 h-8 text-blue-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="flex items-center">
                        <Eye className="w-8 h-8 text-green-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Active</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="flex items-center">
                        <Edit className="w-8 h-8 text-gray-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Draft</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                    <div className="flex items-center">
                        <ShoppingCart className="w-8 h-8 text-blue-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-500">Sold</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.sold}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search listings..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All statuses</option>
                            {Object.entries(LISTING_STATUSES).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            value={filters.sort_by}
                            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="price_low">Price: Low to High</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Messages */}
            {message.text && (
                <div className={`p-4 rounded-lg flex items-center space-x-3 ${
                    message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                    {message.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            {/* Listings */}
            <div className="bg-white rounded-lg shadow border">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Loading listings...</p>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="p-8 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
                        <p className="text-gray-600 mb-4">
                            {filters.search || filters.status
                                ? 'No listings match your current filters.'
                                : 'You haven\'t created any listings yet.'}
                        </p>
                        <Link
                            to="/create-listing"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Your First Listing</span>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Listing
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Views
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {listings.map((listing) => (
                                <tr key={listing.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                {listing.mainImage ? (
                                                    <img
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                        src={listing.mainImage}
                                                        alt={listing.title}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none'
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                    {listing.title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {listing.locationString}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">
                                                {LISTING_CATEGORIES[listing.category] || listing.category}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">
                                                {listing.formattedPrice}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(listing.status)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {listing.viewsCount || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {listing.timeAgo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            {listing.status === 'draft' && (
                                                <button
                                                    onClick={() => handlePublishListing(listing.id)}
                                                    className="text-green-600 hover:text-green-800 p-1"
                                                    title="Publish"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            )}
                                            {listing.status === 'active' && (
                                                <>
                                                    <button
                                                        onClick={() => handleUnpublishListing(listing.id)}
                                                        className="text-yellow-600 hover:text-yellow-800 p-1"
                                                        title="Unpublish"
                                                    >
                                                        <EyeOff className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleMarkAsSold(listing.id)}
                                                        className="text-blue-600 hover:text-blue-800 p-1"
                                                        title="Mark as Sold"
                                                    >
                                                        <ShoppingCart className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            <Link
                                                to={`/edit-listing/${listing.id}`}
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setSelectedListing(listing)
                                                    setShowDeleteModal(true)
                                                }}
                                                className="text-red-600 hover:text-red-800 p-1"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedListing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Delete Listing
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{selectedListing.title}"? This action cannot be undone.
                        </p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false)
                                    setSelectedListing(null)
                                }}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteListing}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}