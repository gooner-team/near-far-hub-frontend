// src/services/uploadAPI.js
const API_BASE_URL = 'http://localhost:8000/api'

const getAuthToken = () => {
    return localStorage.getItem('auth_token')
}

const createFormDataRequest = async (endpoint, formData) => {
    const token = getAuthToken()

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
}

const jsonRequest = async (endpoint, options = {}) => {
    const token = getAuthToken()

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        ...options
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
}

export const uploadAPI = {
    // Upload single image
    uploadImage: async (file, folder = 'listings') => {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('folder', folder)

        return createFormDataRequest('/upload/image', formData)
    },

    // Upload multiple images
    uploadImages: async (files, folder = 'listings') => {
        const formData = new FormData()
        files.forEach((file, index) => {
            formData.append(`images[${index}]`, file)
        })
        formData.append('folder', folder)

        return createFormDataRequest('/upload/images', formData)
    },

    // Upload image from URL
    uploadFromUrl: async (url, folder = 'listings') => {
        return jsonRequest('/upload/from-url', {
            body: JSON.stringify({ url, folder })
        })
    },

    // Delete uploaded image
    deleteImage: async (url) => {
        return jsonRequest('/upload/delete', {
            method: 'DELETE',
            body: JSON.stringify({ url })
        })
    },

    // Get upload progress (for large files)
    getUploadProgress: async (uploadId) => {
        const token = getAuthToken()
        const response = await fetch(`${API_BASE_URL}/upload/progress/${uploadId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) {
            throw new Error('Failed to get upload progress')
        }

        return response.json()
    }
}

export default uploadAPI