class APIClient {
    constructor(baseURL = 'http://localhost:8000/api') {
        this.baseURL = baseURL
    }

    getAuthHeaders() {
        const token = localStorage.getItem('auth_token')
        return token ? { 'Authorization': `Bearer ${token}` } : {}
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...this.getAuthHeaders(),
            ...options.headers
        }

        try {
            const response = await fetch(url, { ...options, headers })

            if (!response.ok) {
                const error = await response.json().catch(() => ({}))
                throw new Error(error.message || `HTTP ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            if (error.name === 'TypeError') {
                throw new Error('Network error - please check your connection')
            }
            throw error
        }
    }

    get(endpoint, params) {
        const query = params ? `?${new URLSearchParams(params)}` : ''
        return this.request(`${endpoint}${query}`)
    }

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        })
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' })
    }

    async upload(endpoint, formData, onProgress) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        onProgress((e.loaded / e.total) * 100)
                    }
                })
            }

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        resolve(JSON.parse(xhr.responseText))
                    } catch {
                        resolve(xhr.responseText)
                    }
                } else {
                    reject(new Error(`Upload failed: ${xhr.status}`))
                }
            })

            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'))
            })

            xhr.open('POST', `${this.baseURL}${endpoint}`)

            const token = localStorage.getItem('auth_token')
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`)
            }

            xhr.send(formData)
        })
    }
}

const api = new APIClient()

// Auth API
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getUser: () => api.get('/auth/user'),
    register: (data) => api.post('/auth/register', data)
}

// Listings API
export const listingsAPI = {
    getAll: (filters) => api.get('/listings', filters),
    getById: (id) => api.get(`/listings/${id}`),
    create: (data) => api.post('/listings', data),
    update: (id, data) => api.put(`/listings/${id}`, data),
    delete: (id) => api.delete(`/listings/${id}`),
    getCurrentUserListings: (filters) => api.get('/listings/my/listings', filters),
    getFeaturedListings: (filters) => api.get('/listings/featured', filters),
    publishListing: (id) => api.post(`/listings/${id}/publish`),
    unpublishListing: (id) => api.post(`/listings/${id}/unpublish`),
    markAsSold: (id) => api.post(`/listings/${id}/mark-sold`)
}

// Upload API
export const uploadAPI = {
    uploadImage: async (file, folder = 'listings') => {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('folder', folder)

        return api.upload('/upload/image', formData)
    },
    deleteImage: (url) => api.delete('/upload/delete', { url })
}

export default api