import { useState, useCallback } from 'react'
import { uploadService } from '../services/uploadService'

export function useImageUpload(config = {}) {
    const [images, setImages] = useState([])
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState({})
    const [errors, setErrors] = useState([])

    const uploadFiles = useCallback(async (files, folder) => {
        setUploading(true)
        setErrors([])

        try {
            const results = await uploadService.uploadMultiple(
                files,
                folder,
                (index, progress) => {
                    setProgress(prev => ({
                        ...prev,
                        [index]: progress
                    }))
                }
            )

            const successful = results
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value.data)

            const failed = results
                .filter(result => result.status === 'rejected')
                .map(result => result.reason.message)

            if (failed.length > 0) {
                setErrors(failed)
            }

            setImages(prev => [...prev, ...successful])
            setProgress({})

        } catch (error) {
            setErrors([error.message])
        } finally {
            setUploading(false)
        }
    }, [])

    const removeImage = useCallback(async (index) => {
        const image = images[index]

        try {
            if (image.url) {
                await uploadService.deleteImage(image.url)
            }
        } catch (error) {
            console.warn('Failed to delete image:', error)
        }

        setImages(prev => prev.filter((_, i) => i !== index))
    }, [images])

    const reorderImages = useCallback((fromIndex, toIndex) => {
        setImages(prev => {
            const newImages = [...prev]
            const [moved] = newImages.splice(fromIndex, 1)
            newImages.splice(toIndex, 0, moved)
            return newImages
        })
    }, [])

    return {
        images,
        setImages,
        uploading,
        progress,
        errors,
        uploadFiles,
        removeImage,
        reorderImages,
        clearErrors: () => setErrors([])
    }
}
