class APIClient {
    constructor(baseURL = 'http://localhost:8000/api') {
        this.baseURL = baseURL
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    getAuthHeaders() {
        const token = localStorage.getItem('auth_token')
        return token ? { 'Authorization': `Bearer ${token}` } : {}
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`
        const headers = {
            ...this.defaultHeaders,
            ...this.getAuthHeaders(),
            ...options.headers
        }

        const config = { ...options, headers }

        try {
            const response = await fetch(url, config)

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

    // HTTP Methods
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

    // File upload with progress
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

            // Add auth header
            const token = localStorage.getItem('auth_token')
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`)
            }

            xhr.send(formData)
        })
    }
}

const api = new APIClient()