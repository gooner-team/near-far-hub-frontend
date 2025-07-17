import {useState, useRef} from 'react'
import {
    Upload,
    X,
    Image as ImageIcon,
    AlertCircle,
    CheckCircle,
    Loader2,
    Plus,
    Link as LinkIcon
} from 'lucide-react'
import {useAuth} from '../../contexts/AuthContext'

export default function ImageUpload({
                                        onImagesChange,
                                        maxImages = 10,
                                        folder = 'listings',
                                        existingImages = [],
                                        className = ''
                                    }) {
    const {apiCall} = useAuth()
    const fileInputRef = useRef(null)
    const [images, setImages] = useState(existingImages)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({})
    const [errors, setErrors] = useState([])
    const [showUrlInput, setShowUrlInput] = useState(false)
    const [urlInput, setUrlInput] = useState('')

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

        try {
            const formData = new FormData()
            files.forEach(file => {
                formData.append('images[]', file)
            })
            formData.append('folder', folder)

            const response = await apiCall('/api/upload/images', {
                method: 'POST',
                body: formData,
                headers: {
                    // Don't set Content-Type for FormData, let browser set it
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
                const newImages = [...images, ...data.data]
                setImages(newImages)
                onImagesChange(newImages)
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
            const response = await apiCall('/api/upload/from-url', {
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
                const newImages = [...images, data.data]
                setImages(newImages)
                onImagesChange(newImages)
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
            // Try to delete from server if it has a path
            if (imageToRemove.original_url) {
                await apiCall('/api/upload/image', {
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
        onImagesChange(newImages)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e) => {
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={image.medium_url || image.thumbnail_url || image.original_url || image}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NSA3NUgxMTVWMTA1SDg1Vjc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNzUgMTI1SDE0NVYxNTVINzVWMTI1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3"/>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            {images.length < maxImages && (
                <div className="space-y-4">
                    {/* File Upload */}
                    <div
                        className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-8 text-center transition-colors cursor-pointer"
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
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
        </div>
    )
}