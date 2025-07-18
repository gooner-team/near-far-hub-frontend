import { useState, useRef, useCallback, useEffect } from 'react'
import {
    Upload, X, Eye, Trash2, Move, Camera, Plus,
    AlertCircle, CheckCircle, Loader2
} from 'lucide-react'

// Image type configurations from backend
const IMAGE_CONFIGS = {
    LISTING_PRIMARY: {
        maxSize: 5 * 1024 * 1024, // 5MB
        dimensions: { width: 800, height: 600 },
        maxCount: 1,
        folder: 'listings/primary'
    },
    LISTING_GALLERY: {
        maxSize: 5 * 1024 * 1024,
        dimensions: { width: 800, height: 600 },
        maxCount: 10,
        folder: 'listings/gallery'
    },
    USER_AVATAR: {
        maxSize: 2 * 1024 * 1024, // 2MB
        dimensions: { width: 200, height: 200 },
        maxCount: 1,
        folder: 'users/avatars'
    },
    SELLER_PROFILE: {
        maxSize: 5 * 1024 * 1024,
        dimensions: { width: 1200, height: 400 },
        maxCount: 1,
        folder: 'sellers/covers'
    }
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

export default function ImageUpload({
                                        type = 'LISTING_GALLERY',
                                        onImagesChange,
                                        existingImages = [],
                                        className = '',
                                        required = false
                                    }) {
    const config = IMAGE_CONFIGS[type]
    const fileInputRef = useRef(null)

    const [images, setImages] = useState([])
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({})
    const [errors, setErrors] = useState([])
    const [dragActive, setDragActive] = useState(false)
    const [previewImage, setPreviewImage] = useState(null)

    // Initialize with existing images
    useEffect(() => {
        if (existingImages.length > 0) {
            const processedImages = existingImages.map((img, index) => ({
                id: img.id || `existing-${index}`,
                url: img.url || img.original_url || img.medium_url,
                filename: img.filename || `image-${index + 1}`,
                isExisting: true,
                ...img
            }))
            setImages(processedImages)
        }
    }, [existingImages])

    // Notify parent when images change
    useEffect(() => {
        onImagesChange?.(images)
    }, [images, onImagesChange])

    const validateFile = useCallback((file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return 'Only JPEG, PNG, GIF, and WebP images are allowed'
        }
        if (file.size > config.maxSize) {
            return `File size must be less than ${Math.round(config.maxSize / 1024 / 1024)}MB`
        }
        return null
    }, [config.maxSize])

    const uploadToAPI = async (file) => {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('folder', config.folder)

        const token = localStorage.getItem('auth_token')
        const response = await fetch('http://localhost:8000/api/upload/image', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Upload failed')
        }

        return response.json()
    }

    const uploadFiles = async (files) => {
        if (images.length + files.length > config.maxCount) {
            setErrors([`Maximum ${config.maxCount} images allowed`])
            return
        }

        setUploading(true)
        setErrors([])

        const validFiles = []
        const fileErrors = []

        // Validate all files
        files.forEach((file, index) => {
            const error = validateFile(file)
            if (error) {
                fileErrors.push(`File ${index + 1}: ${error}`)
            } else {
                validFiles.push(file)
            }
        })

        if (fileErrors.length > 0) {
            setErrors(fileErrors)
            setUploading(false)
            return
        }

        // Upload files
        const uploadPromises = validFiles.map(async (file, index) => {
            const fileId = `upload-${Date.now()}-${index}`

            try {
                setUploadProgress(prev => ({ ...prev, [fileId]: 50 }))

                const result = await uploadToAPI(file)

                setUploadProgress(prev => ({ ...prev, [fileId]: 100 }))

                return {
                    id: fileId,
                    url: result.data.url || result.data.original_url,
                    original_url: result.data.original_url,
                    medium_url: result.data.medium_url,
                    thumbnail_url: result.data.thumbnail_url,
                    filename: result.data.filename || file.name,
                    isExisting: false
                }
            } catch (error) {
                setErrors(prev => [...prev, `Failed to upload ${file.name}: ${error.message}`])
                return null
            } finally {
                setUploadProgress(prev => {
                    const newProgress = { ...prev }
                    delete newProgress[fileId]
                    return newProgress
                })
            }
        })

        try {
            const results = await Promise.all(uploadPromises)
            const successfulUploads = results.filter(result => result !== null)

            if (successfulUploads.length > 0) {
                setImages(prev => [...prev, ...successfulUploads])
            }
        } catch (error) {
            setErrors(prev => [...prev, 'Some uploads failed'])
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const removeImage = async (index) => {
        const image = images[index]

        // Delete from server if not existing
        if (!image.isExisting && image.original_url) {
            try {
                const token = localStorage.getItem('auth_token')
                await fetch('http://localhost:8000/api/upload/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ url: image.original_url })
                })
            } catch (error) {
                console.warn('Failed to delete image from server:', error)
            }
        }

        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const reorderImages = (fromIndex, toIndex) => {
        setImages(prev => {
            const newImages = [...prev]
            const [movedImage] = newImages.splice(fromIndex, 1)
            newImages.splice(toIndex, 0, movedImage)
            return newImages
        })
    }

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        setDragActive(false)

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        )

        if (files.length > 0) uploadFiles(files)
    }, [])

    const handleDragOver = useCallback((e) => {
        e.preventDefault()
        setDragActive(true)
    }, [])

    const handleDragLeave = useCallback((e) => {
        e.preventDefault()
        setDragActive(false)
    }, [])

    const getImageUrl = (image) => image.url || image.medium_url || image.original_url
    const getThumbUrl = (image) => image.thumbnail_url || image.medium_url || image.url

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Error Messages */}
            {errors.length > 0 && (
                <div className="space-y-2">
                    {errors.map((error, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                            <AlertCircle className="w-4 h-4 flex-shrink-0"/>
                            <span className="text-sm">{error}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={image.id || index}
                            className="relative group border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData('text/plain', index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault()
                                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
                                reorderImages(fromIndex, index)
                            }}
                        >
                            <div className="aspect-square bg-gray-100 relative">
                                <img
                                    src={getThumbUrl(image)}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSA3NUgxMTVWMTA1SDg1Vjc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNzUgMTI1SDE0NVYxNTVINzVWMTI1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                                    }}
                                />
                            </div>

                            {/* Image Controls */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                                    <button
                                        onClick={() => setPreviewImage(image)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <Eye className="w-4 h-4 text-gray-700" />
                                    </button>
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Main Image Indicator */}
                            {index === 0 && type.includes('LISTING') && (
                                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                                    Main
                                </div>
                            )}

                            {/* Upload Progress */}
                            {uploadProgress[image.id] && (
                                <div className="absolute bottom-0 left-0 right-0 bg-blue-600 h-1">
                                    <div
                                        className="h-full bg-blue-400 transition-all duration-300"
                                        style={{ width: `${uploadProgress[image.id]}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            {images.length < config.maxCount && (
                <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                        dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple={config.maxCount > 1}
                        accept={ALLOWED_TYPES.join(',')}
                        onChange={(e) => uploadFiles(Array.from(e.target.files))}
                        className="hidden"
                        disabled={uploading}
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center space-y-2">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin"/>
                            <p className="text-sm text-gray-600">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Upload className="w-6 h-6 text-blue-600"/>
                            </div>
                            <div>
                                <p className="text-lg font-medium text-gray-900 mb-1">
                                    Drop files here or click to upload
                                </p>
                                <p className="text-sm text-gray-500">
                                    {ALLOWED_TYPES.map(t => t.split('/')[1]).join(', ')} up to {Math.round(config.maxSize / 1024 / 1024)}MB
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {images.length} of {config.maxCount} images
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Required Field Notice */}
            {required && images.length === 0 && (
                <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                    <Camera className="w-4 h-4"/>
                    <span className="text-sm">At least one image is required</span>
                </div>
            )}

            {/* Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img
                            src={getImageUrl(previewImage)}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}