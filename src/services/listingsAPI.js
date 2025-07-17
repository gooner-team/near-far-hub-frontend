// src/services/listingsAPI.js
const API_BASE_URL = 'http://localhost:8000/api'

const getAuthToken = () => {
    return localStorage.getItem('auth_token')
}

const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`
    const token = getAuthToken()

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    const config = {
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
        ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
}

export const listingsAPI = {
    // Get all listings with filtering
    getListings: async (filters = {}) => {
        const params = new URLSearchParams()

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.append(key, value)
            }
        })

        const query = params.toString()
        return apiRequest(`/listings${query ? `?${query}` : ''}`)
    },

    // Get listing by ID
    getListingById: async (id) => {
        return apiRequest(`/listings/${id}`)
    },

    // Create new listing
    createListing: async (listingData) => {
        return apiRequest('/listings', {
            method: 'POST',
            body: JSON.stringify(listingData)
        })
    },

    // Update existing listing
    updateListing: async (id, listingData) => {
        return apiRequest(`/listings/${id}`, {
            method: 'PUT',
            body: JSON.stringify(listingData)
        })
    },

    // Delete listing
    deleteListing: async (id) => {
        return apiRequest(`/listings/${id}`, {
            method: 'DELETE'
        })
    },

    // Get current user's listings
    getCurrentUserListings: async (filters = {}) => {
        const params = new URLSearchParams()

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.append(key, value)
            }
        })

        const query = params.toString()
        return apiRequest(`/listings/my/listings${query ? `?${query}` : ''}`)
    },

    // Publish listing
    publishListing: async (id) => {
        return apiRequest(`/listings/${id}/publish`, {
            method: 'POST'
        })
    },

    // Unpublish listing
    unpublishListing: async (id) => {
        return apiRequest(`/listings/${id}/unpublish`, {
            method: 'POST'
        })
    },

    // Mark listing as sold
    markAsSold: async (id) => {
        return apiRequest(`/listings/${id}/mark-sold`, {
            method: 'POST'
        })
    },

    // Get featured listings
    getFeaturedListings: async (filters = {}) => {
        const params = new URLSearchParams()

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.append(key, value)
            }
        })

        const query = params.toString()
        return apiRequest(`/listings/featured${query ? `?${query}` : ''}`)
    },

    // Search listings
    searchListings: async (query, filters = {}) => {
        const params = new URLSearchParams()
        params.append('q', query)

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.append(key, value)
            }
        })

        const queryString = params.toString()
        return apiRequest(`/listings/search?${queryString}`)
    },

    // Get listings by category
    getListingsByCategory: async (category, filters = {}) => {
        const params = new URLSearchParams()

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.append(key, value)
            }
        })

        const query = params.toString()
        return apiRequest(`/listings/category/${category}${query ? `?${query}` : ''}`)
    },

    // Get categories with listing counts
    getCategoriesWithCounts: async () => {
        return apiRequest('/listings/categories')
    },

    // Get listing statistics
    getListingStats: async () => {
        return apiRequest('/listings/stats')
    }
}

// Categories and conditions for frontend use
export const LISTING_CATEGORIES = {
    'electronics': 'Electronics',
    'vehicles': 'Vehicles',
    'real-estate': 'Real Estate',
    'fashion': 'Fashion',
    'home-garden': 'Home & Garden',
    'services': 'Services',
    'gaming': 'Gaming',
    'books': 'Books & Media',
    'sports': 'Sports & Outdoors',
    'photography': 'Photography',
    'music': 'Musical Instruments',
    'fitness': 'Health & Fitness'
}

export const LISTING_CONDITIONS = {
    'new': 'New',
    'like_new': 'Like New',
    'excellent': 'Excellent',
    'good': 'Good',
    'fair': 'Fair',
    'poor': 'Poor'
}

export const LISTING_STATUSES = {
    'draft': 'Draft',
    'active': 'Active',
    'sold': 'Sold',
    'expired': 'Expired',
    'suspended': 'Suspended'
}

export const SORT_OPTIONS = {
    'newest': 'Newest First',
    'oldest': 'Oldest First',
    'price_low': 'Price: Low to High',
    'price_high': 'Price: High to Low',
    'most_viewed': 'Most Viewed',
    'most_favorited': 'Most Favorited',
    'relevance': 'Most Relevant'
}