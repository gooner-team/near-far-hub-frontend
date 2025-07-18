// Export all API services from single entry point
export { authAPI, listingsAPI, uploadAPI } from './api'

// Simplified service wrappers for easier usage
export const authService = {
    login: (credentials) => authAPI.login(credentials),
    logout: () => authAPI.logout(),
    getUser: () => authAPI.getUser(),
    register: (data) => authAPI.register(data)
}

export const listingService = {
    getAll: (filters) => listingsAPI.getAll(filters),
    getById: (id) => listingsAPI.getById(id),
    create: (data) => listingsAPI.create(data),
    update: (id, data) => listingsAPI.update(id, data),
    delete: (id) => listingsAPI.delete(id),
    getMy: (filters) => listingsAPI.getCurrentUserListings(filters),
    getFeatured: (filters) => listingsAPI.getFeaturedListings(filters),
    publish: (id) => listingsAPI.publishListing(id),
    unpublish: (id) => listingsAPI.unpublishListing(id),
    markSold: (id) => listingsAPI.markAsSold(id)
}

export const uploadService = {
    uploadImage: (file, folder) => uploadAPI.uploadImage(file, folder),
    deleteImage: (url) => uploadAPI.deleteImage(url)
}