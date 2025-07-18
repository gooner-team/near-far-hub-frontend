const API_URL = 'http://localhost:8000/api'

const createAPI = (baseURL = API_URL) => {
    const request = async (endpoint, options = {}) => {
        const token = localStorage.getItem('auth_token')
        const url = `${baseURL}${endpoint}`

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers
            },
            ...options
        }

        const response = await fetch(url, config)

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            throw new Error(error.message || `HTTP ${response.status}`)
        }

        return response.json()
    }

    return {
        get: (endpoint, params) => {
            const query = params ? `?${new URLSearchParams(params)}` : ''
            return request(`${endpoint}${query}`)
        },
        post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
        put: (endpoint, data) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (endpoint) => request(endpoint, { method: 'DELETE' })
    }
}

export const api = createAPI()

// API endpoints
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getUser: () => api.get('/auth/user')
}

export const listingsAPI = {
    getAll: (filters) => api.get('/listings', filters),
    getById: (id) => api.get(`/listings/${id}`),
    create: (data) => api.post('/listings', data),
    update: (id, data) => api.put(`/listings/${id}`, data),
    delete: (id) => api.delete(`/listings/${id}`),
    getMy: (filters) => api.get('/listings/my/listings', filters),
    getFeatured: (filters) => api.get('/listings/featured', filters),
    search: (query, filters) => api.get('/listings/search', { q: query, ...filters })
}