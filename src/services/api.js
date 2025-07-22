// src/services/api.js
const API_BASE_URL = 'http://localhost:8000/api'

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`)
        error.status = response.status
        error.data = errorData
        throw error
    }
    return response.json()
}

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

    try {
        const response = await fetch(url, config)
        return await handleResponse(response)
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error)
        throw error
    }
}

export const authAPI = {
    login: async (credentials) => {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        })
    },

    register: async (userData) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        })
    },

    logout: async () => {
        return apiRequest('/auth/logout', {
            method: 'POST',
        })
    },

    getUser: async () => {
        return apiRequest('/auth/user')
    },

    forgotPassword: async (email) => {
        return apiRequest('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        })
    },

    resetPassword: async (resetData) => {
        return apiRequest('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(resetData),
        })
    },
}

export const userAPI = {
    getProfile: async () => {
        return apiRequest('/profile')
    },

    updateProfile: async (profileData) => {
        return apiRequest('/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        })
    },

    getUserListings: async () => {
        return apiRequest('/user/listings')
    },

    getUserFavorites: async () => {
        return apiRequest('/user/favorites')
    },
}

export const locationAPI = {
    getSuggestions: async (query, limit = 10) => {
        const params = new URLSearchParams({ q: query, limit })
        return apiRequest(`/locations/suggestions?${params}`)
    },

    validateLocation: async (locationData) => {
        return apiRequest('/locations/validate', {
            method: 'POST',
            body: JSON.stringify({ location: locationData }),
        })
    },

    geocodeAddress: async (address) => {
        const params = new URLSearchParams({ address })
        return apiRequest(`/locations/geocode?${params}`)
    },

    getPopularLocations: async (limit = 20) => {
        const params = new URLSearchParams({ limit })
        return apiRequest(`/locations/popular?${params}`)
    },
}

export const productAPI = {
    getProducts: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString()
        return apiRequest(`/products${queryString ? `?${queryString}` : ''}`)
    },

    getProduct: async (id) => {
        return apiRequest(`/products/${id}`)
    },

    createProduct: async (productData) => {
        return apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        })
    },

    updateProduct: async (id, productData) => {
        return apiRequest(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        })
    },

    deleteProduct: async (id) => {
        return apiRequest(`/products/${id}`, {
            method: 'DELETE',
        })
    },
}

export const categoryAPI = {
    getCategories: async () => {
        return apiRequest('/categories')
    },

    getCategoryProducts: async (categoryId, params = {}) => {
        const queryString = new URLSearchParams(params).toString()
        return apiRequest(`/categories/${categoryId}/products${queryString ? `?${queryString}` : ''}`)
    },
}

export const uploadAPI = {
    uploadFile: async (file, type = 'image') => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)

        return apiRequest('/upload', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: formData,
        })
    },

    uploadFiles: async (files, type = 'image') => {
        const formData = new FormData()
        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file)
        })
        formData.append('type', type)

        return apiRequest('/upload/multiple', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: formData,
        })
    },
}

export const healthAPI = {
    check: async () => {
        return apiRequest('/health')
    },
}

export { apiRequest }

const api = {
    auth: authAPI,
    user: userAPI,
    location: locationAPI,
    products: productAPI,
    categories: categoryAPI,
    upload: uploadAPI,
    health: healthAPI,
    request: apiRequest,
}

export default api