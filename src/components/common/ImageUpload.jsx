import {useState, useRef, useEffect} from 'react'
import {
    Upload,
    X,
    Image as ImageIcon,
    AlertCircle,
    CheckCircle,
    Loader2,
    Plus,
    Link as LinkIcon,
    Camera,
    Move,
    Eye
} from 'lucide-react'
import {useAuth} from '../../contexts/AuthContext'

export default function ImageUpload({
                                        onImagesChange,
                                        maxImages = 10,
                                        folder = 'listings',
                                        existingImages = [],
                                        className = '',
                                        required = false
                                    }) {
    const {apiCall} = useAuth()
    const fileInputRef = useRef(null)
    const [images, setImages] = useState([])
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({})
    const [errors, setErrors] = useState([])
    const [showUrlInput, setShowUrlInput] = useState(false)
    const [urlInput, setUrlInput] = useState('')
    const [draggedIndex, setDraggedIndex] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)

    // Initialize with existing images
    useEffect(() => {
        if (existingImages && existingImages.length > 0) {
            const processedImages = existingImages.map((img, index) => {
                if (typeof img === 'string') {
                    return {
                        id: `existing-${index}`,
                        original_url: img,
                        medium_url: img,
                        thumbnail_url: img,
                        filename: `image-${index + 1}`,
                        isExisting: true
                    }
                }
                return {
                    id: img.id || `existing-${index}`,
                    ...img,
                    isExisting: true
                }
            })
            setImages(processedImages)
        }
    }, [existingImages])

    // Notify parent component when images change
    useEffect(() => {
        onImagesChange(images)
    }, [images, onImagesChange])

    const validateFile = (file) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        const maxSize = 10 * 1024 * 1024 // 10MB

        if (!validTypes.includes(file.type)) {
            return 'Please upload only JPEG, PNG, GIF, or WebP images'
        }

        if (file.size > maxSize) {
            return 'File size must be less than 10MB'
        }

        return null
    }

    const handleFileSelect = async (event) => {
        const files = Array.from(event.target.files)
        if (files.length === 0) return

        // Check if adding these files would exceed the limit
        if (images.length + files.length > maxImages) {
            setErrors([`You can only upload a maximum of ${maxImages} images`])
            return
        }

        setUploading(true)
        setErrors([])

        const validFiles = []
        const fileErrors = []

        // Validate all files first
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

        try {
            const formData = new FormData()
            validFiles.forEach(file => {
                formData.append('images[]', file)
            })
            formData.append('folder', folder)

            const response = await apiCall('http://localhost:8000/api/upload/images', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Upload failed')
            }

            const data = await response.json()

            if (data.success) {
                const newImages = data.data.map(img => ({
                    id: `uploaded-${Date.now()}-${Math.random()}`,
                    ...img,
                    isExisting: false
                }))
                setImages(prev => [...prev, ...newImages])
            } else {
                throw new Error(data.message || 'Upload failed')
            }

        } catch (error) {
            setErrors([error.message])
        } finally {
            setUploading(false)
            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleUrlUpload = async () => {
        if (!urlInput.trim()) return

        setUploading(true)
        setErrors([])

        try {
            const response = await apiCall('http://localhost:8000/api/upload/from-url', {
                method: 'POST',
                body: JSON.stringify({
                    url: urlInput.trim(),
                    folder: folder
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Upload failed')
            }

            const data = await response.json()

            if (data.success) {
                const newImage = {
                    id: `url-uploaded-${Date.now()}`,
                    ...data.data,
                    isExisting: false
                }
                setImages(prev => [...prev, newImage])
                setUrlInput('')
                setShowUrlInput(false)
            } else {
                throw new Error(data.message || 'Upload failed')
            }

        } catch (error) {
            setErrors([error.message])
        } finally {
            setUploading(false)
        }
    }

    const removeImage = async (index) => {
        const imageToRemove = images[index]

        try {
            // Try to delete from server if it's not an existing image
            if (!imageToRemove.isExisting && imageToRemove.original_url) {
                await apiCall('http://localhost:8000/api/upload/image', {
                    method: 'DELETE',
                    body: JSON.stringify({
                        path: imageToRemove.original_url
                    })
                })
            }
        } catch (error) {
            console.warn('Failed to delete image from server:', error.message)
        }

        const newImages = images.filter((_, i) => i !== index)
        setImages(newImages)
    }

    const reorderImages = (fromIndex, toIndex) => {
        const newImages = [...images]
        const [movedImage] = newImages.splice(fromIndex, 1)
        newImages.splice(toIndex, 0, movedImage)
        setImages(newImages)
    }

    const handleDragStart = (e, index) => {
        setDraggedIndex(index)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    const handleDrop = (e, dropIndex) => {
        e.preventDefault()
        if (draggedIndex !== null && draggedIndex !== dropIndex) {
            reorderImages(draggedIndex, dropIndex)
        }
        setDraggedIndex(null)
    }

    const handleDragEnd = () => {
        setDraggedIndex(null)
    }

    const handleFileDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleFileDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleFileDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleFileDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        )

        if (files.length > 0) {
            // Simulate file input change
            const event = {
                target: {
                    files: files
                }
            }
            handleFileSelect(event)
        }
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Error Messages */}
            {errors.length > 0 && (
                <div className="space-y-2">
                    {errors.map((error, index) => (
                        <div key={index}
                             className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                            <AlertCircle className="w-4 h-4"/>
                            <span className="text-sm">{error}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                            <div
                                key={image.id || index}
                                className={`relative group cursor-move ${draggedIndex === index ? 'opacity-50' : ''}`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-colors">
                                    <img
                                        src={image.medium_url || image.thumbnail_url || image.original_url || image}
                                        alt={`Upload ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSA3NUgxMTVWMTA1SDg1Vjc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNzUgMTI1SDE0NVYxNTVINzVWMTI1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                                        }}
                                    />
                                </div>

                                {/* Image Controls */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                                        <button
                                            onClick={() => setPreviewImage(image)}
                                            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                            title="Preview"
                                        >
                                            <Eye className="w-4 h-4 text-gray-700" />
                                        </button>
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                            title="Remove"
                                        >
                                            <X className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>

                                {/* Main Image Indicator */}
                                {index === 0 && (
                                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                                        Main
                                    </div>
                                )}

                                {/* Drag Indicator */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white rounded p-1">
                                    <Move className="w-3 h-3 text-gray-600" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-sm text-gray-600">
                        <strong>Tip:</strong> Drag images to reorder them. The first image will be used as the main photo.
                    </p>
                </div>
            )}

            {/* Upload Area */}
            {images.length < maxImages && (
                <div className="space-y-4">
                    {/* File Upload */}
                    <div
                        className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-8 text-center transition-colors cursor-pointer"
                        onDragOver={handleFileDragOver}
                        onDragEnter={handleFileDragEnter}
                        onDragLeave={handleFileDragLeave}
                        onDrop={handleFileDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            disabled={uploading}
                        />

                        {uploading ? (
                            <div className="flex flex-col items-center space-y-2">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin"/>
                                <p className="text-sm text-gray-600">Uploading images...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Upload className="w-6 h-6 text-blue-600"/>
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-gray-900 mb-1">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        PNG, JPG, GIF, WebP up to 10MB each • Maximum {maxImages} images
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {images.length} of {maxImages} images uploaded
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* URL Upload Option */}
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={() => setShowUrlInput(!showUrlInput)}
                            className="flex items-center justify-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            disabled={uploading}
                        >
                            <LinkIcon className="w-4 h-4"/>
                            <span>Upload from URL</span>
                        </button>

                        {showUrlInput && (
                            <div className="flex space-x-2">
                                <input
                                    type="url"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="Enter image URL..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={uploading}
                                />
                                <button
                                    onClick={handleUrlUpload}
                                    disabled={uploading || !urlInput.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? (
                                        <Loader2 className="w-4 h-4 animate-spin"/>
                                    ) : (
                                        <Plus className="w-4 h-4"/>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Image Limit Notice */}
            {images.length >= maxImages && (
                <div
                    className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                    <AlertCircle className="w-4 h-4"/>
                    <span className="text-sm">Maximum number of images reached ({maxImages})</span>
                </div>
            )}

            {/* Required Field Notice */}
            {required && images.length === 0 && (
                <div
                    className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                    <Camera className="w-4 h-4"/>
                    <span className="text-sm">At least one image is required for your listing</span>
                </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <img
                            src={previewImage.original_url || previewImage.medium_url || previewImage}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}