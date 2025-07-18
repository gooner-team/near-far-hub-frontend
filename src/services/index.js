export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    getUser: () => api.get('/auth/user'),
    register: (data) => api.post('/auth/register', data)
}

export const listingService = {
    getAll: (filters = {}) => api.get('/listings', filters),
    getById: (id) => api.get(`/listings/${id}`),
    create: (data) => api.post('/listings', data),
    update: (id, data) => api.put(`/listings/${id}`, data),
    delete: (id) => api.delete(`/listings/${id}`),
    getMy: (filters = {}) => api.get('/listings/my/listings', filters),
    getFeatured: (filters = {}) => api.get('/listings/featured', filters),
    publish: (id) => api.post(`/listings/${id}/publish`),
    unpublish: (id) => api.post(`/listings/${id}/unpublish`),
    markSold: (id) => api.post(`/listings/${id}/mark-sold`)
}

export const uploadService = {
    image: (file, folder, onProgress) => {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('folder', folder)
        return api.upload('/upload/image', formData, onProgress)
    },

    fromUrl: (url, folder) => api.post('/upload/from-url', { url, folder }),
    delete: (url) => api.delete('/upload/delete', { url })
}
