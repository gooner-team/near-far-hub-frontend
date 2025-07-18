const API_BASE = 'http://localhost:8000/api'

class UploadService {
    constructor() {
        this.maxRetries = 3
        this.retryDelay = 1000
    }

    getHeaders() {
        const token = localStorage.getItem('auth_token')
        return {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    }

    async request(url, options = {}) {
        const response = await fetch(`${API_BASE}${url}`, {
            headers: this.getHeaders(),
            ...options
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            throw new Error(error.message || `HTTP ${response.status}`)
        }

        return response.json()
    }

    async uploadImage(file, folder = 'listings', onProgress) {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('folder', folder)

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable && onProgress) {
                    const percentComplete = (e.loaded / e.total) * 100
                    onProgress(percentComplete)
                }
            }

            xhr.onload = () => {
                if (xhr.status === 200) {
                    try {
                        const result = JSON.parse(xhr.responseText)
                        resolve(result)
                    } catch (e) {
                        reject(new Error('Invalid response format'))
                    }
                } else {
                    reject(new Error(`Upload failed: ${xhr.status}`))
                }
            }

            xhr.onerror = () => reject(new Error('Network error'))

            xhr.open('POST', `${API_BASE}/upload/image`)

            const token = localStorage.getItem('auth_token')
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`)
            }

            xhr.send(formData)
        })
    }

    async uploadMultiple(files, folder = 'listings', onProgress) {
        const uploads = files.map((file, index) =>
            this.uploadImage(file, folder, (progress) =>
                onProgress?.(index, progress)
            )
        )

        return Promise.allSettled(uploads)
    }

    async deleteImage(url) {
        return this.request('/upload/delete', {
            method: 'DELETE',
            headers: {
                ...this.getHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        })
    }

    async uploadFromUrl(url, folder = 'listings') {
        return this.request('/upload/from-url', {
            method: 'POST',
            headers: {
                ...this.getHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url, folder })
        })
    }
}

export const uploadService = new UploadService()