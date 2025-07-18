import { useState, useRef } from 'react'
import { Upload, X, Loader2, AlertCircle } from 'lucide-react'

const IMAGE_CONFIGS = {
    LISTING_GALLERY: { maxSize: 5 * 1024 * 1024, maxCount: 10 },
    USER_AVATAR: { maxSize: 2 * 1024 * 1024, maxCount: 1 },
    SELLER_PROFILE: { maxSize: 5 * 1024 * 1024, maxCount: 1 }
}

function ImageUpload({
                         type = 'LISTING_GALLERY',
                         onImagesChange,
                         existingImages = [],
                         required = false
                     }) {
    const config = IMAGE_CONFIGS[type]
    const fileInputRef = useRef(null)
    const [images, setImages] = useState(existingImages)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')

    const uploadFiles = async (files) => {
        if (images.length + files.length > config.maxCount) {
            setError(`Maximum ${config.maxCount} images allowed`)
            return
        }

        setUploading(true)
        setError('')

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                if (file.size > config.maxSize) {
                    throw new Error(`File too large: ${file.name}`)
                }

                // Create preview URL - in production, upload to server
                return {
                    id: Date.now() + Math.random(),
                    url: URL.createObjectURL(file),
                    filename: file.name,
                    file
                }
            })

            const results = await Promise.all(uploadPromises)
            const newImages = [...images, ...results]
            setImages(newImages)
            onImagesChange?.(newImages)
        } catch (err) {
            setError(err.message)
        } finally {
            setUploading(false)
        }
    }

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index)
        setImages(newImages)
        onImagesChange?.(newImages)
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                </div>
            )}

            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={image.id || index} className="relative group">
                            <img
                                src={image.url}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                            {index === 0 && type === 'LISTING_GALLERY' && (
                                <div className="absolute bottom-1 left-1 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                                    Main
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {images.length < config.maxCount && (
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple={config.maxCount > 1}
                        accept="image/*"
                        onChange={(e) => uploadFiles(e.target.files)}
                        className="hidden"
                        disabled={uploading}
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                            <p className="text-sm text-gray-600">Uploading...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Click to upload images</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {images.length} of {config.maxCount} images • Max {Math.round(config.maxSize / 1024 / 1024)}MB each
                            </p>
                        </div>
                    )}
                </div>
            )}

            {required && images.length === 0 && (
                <p className="text-sm text-red-600">At least one image is required</p>
            )}
        </div>
    )
}

export default ImageUpload