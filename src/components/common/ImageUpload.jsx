import { useState, useRef, useEffect } from 'react'
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
    Eye,
    Trash2
} from 'lucide-react'
import { uploadAPI } from '../../services/uploadAPI'

export default function ImageUpload({
                                        onImagesChange,
                                        maxImages = 10,
                                        folder = 'listings',
                                        existingImages = [],
                                        className = '',
                                        required = false
                                    }) {
    const fileInputRef = useRef(null)
    const [images, setImages] = useState([])
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({})
    const [errors, setErrors] = useState([])
    const [showUrlInput, setShowUrlInput] = useState(false)
    const [urlInput, setUrlInput] = useState('')
    const [draggedIndex, setDraggedIndex] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [dragActive, setDragActive] = useState(false)

    // Initialize with existing images
    useEffect(() => {
        if (existingImages && existingImages.length > 0) {
            const processedImages = existingImages.map((img, index) => {
                if (typeof img === 'string') {
                    return {
                        id: `existing-${index}`,
                        url: img,
                        original_url: img,
                        medium_url: img,
                        thumbnail_url: img,
                        filename: `image-${index + 1}`,
                        isExisting: true
                    }
                }
                return {
                    id: img.id || `existing-${index}`,
                    url: img.url || img.original_url || img.medium_url || img.thumbnail_url,
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

        await uploadFiles(files)
    }

    const uploadFiles = async (files) => {
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

        // Upload files one by one or in batches
        const uploadPromises = validFiles.map(async (file, index) => {
            const fileId = `upload-${Date.now()}-${index}`
            setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))

            try {
                setUploadProgress(prev => ({ ...prev, [fileId]: 50 }))

                const data = await uploadAPI.uploadImage(file, folder)

                if (data.success) {
                    setUploadProgress(prev => ({ ...prev, [fileId]: 100 }))
                    return {
                        id: fileId,
                        url: data.data.url || data.data.original_url,
                        original_url: data.data.original_url,
                        medium_url: data.data.medium_url,
                        thumbnail_url: data.data.thumbnail_url,
                        filename: data.data.filename || file.name,
                        isExisting: false
                    }
                } else {
                    throw new Error(data.message || 'Upload failed')
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
            const data = await uploadAPI.uploadFromUrl(urlInput.trim(), folder)

            if (data.success) {
                const newImage = {
                    id: `url-uploaded-${Date.now()}`,
                    url: data.data.url || data.data.original_url,
                    original_url: data.data.original_url,
                    medium_url: data.data.medium_url,
                    thumbnail_url: data.data.thumbnail_url,
                    filename: data.data.filename,
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

        // Don't try to delete existing images from server
        if (!imageToRemove.isExisting && imageToRemove.original_url) {
            try {
                await uploadAPI.deleteImage(imageToRemove.original_url)
            } catch (error) {
                console.warn('Failed to delete image from server:', error.message)
            }
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
        e.dataTransfer.setData('text/html', '')
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
        setDragActive(true)
    }

    const handleFileDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(true)
    }

    const handleFileDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
    }

    const handleFileDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type.startsWith('image/')
        )

        if (files.length > 0) {
            uploadFiles(files)
        }
    }

    const getImageUrl = (image) => {
        return image.url || image.medium_url || image.thumbnail_url || image.original_url
    }

    const getImageDisplayUrl = (image) => {
        return image.thumbnail_url || image.medium_url || image.url || image.original_url
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Error Messages */}
            {errors.length > 0 && (
                <div className="space-y-2">
                    {errors.map((error, index) => (
                        <div key={index}
                             className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                            <AlertCircle className="w-4 h-4 flex-shrink-0"/>
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
                                className={`relative group cursor-move border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                                    draggedIndex === index
                                        ? 'opacity-50 border-blue-400'
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="aspect-square bg-gray-100 relative">
                                    <img
                                        src={getImageDisplayUrl(image)}
                                        alt={`Upload ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSA3NUgxMTVWMTA1SDg1Vjc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNzUgMTI1SDE0NVYxNTVINzVWMTI1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                                        }}
                                    />
                                </div>

                                {/* Image Controls */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
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
                                            <Trash2 className="w-4 h-4 text-white" />
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
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
                            dragActive
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                        }`}
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
                                <button
                                    onClick={() => {
                                        setShowUrlInput(false)
                                        setUrlInput('')
                                    }}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4"/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Image Limit Notice */}
            {images.length >= maxImages && (
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                    <AlertCircle className="w-4 h-4"/>
                    <span className="text-sm">Maximum number of images reached ({maxImages})</span>
                </div>
            )}

            {/* Required Field Notice */}
            {required && images.length === 0 && (
                <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
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
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img
                            src={getImageUrl(previewImage)}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                            {previewImage.filename}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}