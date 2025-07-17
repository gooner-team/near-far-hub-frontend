import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Save,
    Eye,
    X,
    MapPin,
    Euro,
    Calendar,
    Globe,
    Clock,
    AlertCircle,
    CheckCircle
} from 'lucide-react'
import { listingsAPI, LISTING_CATEGORIES, LISTING_CONDITIONS } from '../../services/listingsAPI'
import ImageUpload from '../common/ImageUpload'

export default function ListingForm({ listingId = null, onSuccess }) {
    const navigate = useNavigate()
    const isEditing = Boolean(listingId)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        images: [],
        location: {
            city: '',
            country: '',
            coordinates: null
        },
        can_deliver_globally: false,
        requires_appointment: false,
        status: 'draft',
        expires_at: ''
    })

    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        if (isEditing && listingId) {
            loadListing()
        }
    }, [isEditing, listingId])

    const loadListing = async () => {
        try {
            const response = await listingsAPI.getListingById(listingId)
            const listing = response.data

            setFormData({
                title: listing.title || '',
                description: listing.description || '',
                price: listing.price || '',
                category: listing.category || '',
                condition: listing.condition || '',
                images: listing.images || [],
                location: listing.location || { city: '', country: '', coordinates: null },
                can_deliver_globally: listing.canDeliverGlobally || false,
                requires_appointment: listing.requiresAppointment || false,
                status: listing.status || 'draft',
                expires_at: listing.expiresAt || ''
            })
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load listing data' })
        }
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    const handleLocationChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                [field]: value
            }
        }))
    }

    const handleImagesChange = (newImages) => {
        // Convert image objects to URL strings for the API
        const imageUrls = newImages.map(img => {
            if (typeof img === 'string') {
                return img
            }
            return img.original_url || img.medium_url || img.thumbnail_url || img
        })

        setFormData(prev => ({
            ...prev,
            images: imageUrls
        }))

        // Clear image errors if any
        if (errors.images) {
            setErrors(prev => ({
                ...prev,
                images: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required'
        } else if (formData.title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters'
        }

        if (!formData.price) {
            newErrors.price = 'Price is required'
        } else if (parseFloat(formData.price) <= 0) {
            newErrors.price = 'Price must be greater than 0'
        }

        if (!formData.category) {
            newErrors.category = 'Category is required'
        }

        if (formData.category && formData.category !== 'services' && !formData.condition) {
            newErrors.condition = 'Condition is required for this category'
        }

        if (formData.description && formData.description.length > 5000) {
            newErrors.description = 'Description must not exceed 5000 characters'
        }

        if (formData.images.length === 0) {
            newErrors.images = 'Please add at least one image'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const submitData = {
                ...formData,
                price: parseFloat(formData.price),
                expires_at: formData.expires_at || null
            }

            let response
            if (isEditing) {
                response = await listingsAPI.updateListing(listingId, submitData)
            } else {
                response = await listingsAPI.createListing(submitData)
            }

            setMessage({
                type: 'success',
                text: isEditing ? 'Listing updated successfully!' : 'Listing created successfully!'
            })

            if (onSuccess) {
                onSuccess(response.data)
            } else {
                setTimeout(() => {
                    navigate('/profile')
                }, 1500)
            }

        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to save listing' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveAsDraft = async () => {
        setFormData(prev => ({ ...prev, status: 'draft' }))
        await handleSubmit(new Event('submit'))
    }

    const handlePublish = async () => {
        setFormData(prev => ({ ...prev, status: 'active' }))
        await handleSubmit(new Event('submit'))
    }

    const requiresCondition = formData.category && formData.category !== 'services'

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isEditing ? 'Edit Listing' : 'Create New Listing'}
                </h2>
                <p className="text-gray-600">
                    {isEditing ? 'Update your listing details' : 'Fill in the details to create your listing'}
                </p>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                    message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                    {message.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Enter listing title"
                            maxLength={255}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select category</option>
                            {Object.entries(LISTING_CATEGORIES).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                        )}
                    </div>

                    {requiresCondition && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Condition *
                            </label>
                            <select
                                value={formData.condition}
                                onChange={(e) => handleInputChange('condition', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.condition ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            >
                                <option value="">Select condition</option>
                                {Object.entries(LISTING_CONDITIONS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                            {errors.condition && (
                                <p className="mt-1 text-sm text-red-600">{errors.condition}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (€) *
                        </label>
                        <div className="relative">
                            <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="0.00"
                            />
                        </div>
                        {errors.price && (
                            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Describe your item..."
                        maxLength={5000}
                    />
                    <div className="flex justify-between items-center mt-1">
                        {errors.description && (
                            <p className="text-sm text-red-600">{errors.description}</p>
                        )}
                        <p className="text-sm text-gray-500 ml-auto">
                            {formData.description.length}/5000
                        </p>
                    </div>
                </div>

                {/* Images Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Images *
                    </label>
                    <ImageUpload
                        onImagesChange={handleImagesChange}
                        maxImages={10}
                        folder="listings"
                        existingImages={formData.images}
                        className={errors.images ? 'border-red-300' : ''}
                    />
                    {errors.images && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.images}
                        </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                        Upload up to 10 high-quality images of your item. The first image will be used as the main photo.
                    </p>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                value={formData.location.city}
                                onChange={(e) => handleLocationChange('city', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="City"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={formData.location.country}
                                onChange={(e) => handleLocationChange('country', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Country"
                            />
                        </div>
                    </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="can_deliver_globally"
                            checked={formData.can_deliver_globally}
                            onChange={(e) => handleInputChange('can_deliver_globally', e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="can_deliver_globally" className="flex items-center text-sm text-gray-700">
                            <Globe className="w-4 h-4 mr-1" />
                            Can deliver globally
                        </label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="requires_appointment"
                            checked={formData.requires_appointment}
                            onChange={(e) => handleInputChange('requires_appointment', e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="requires_appointment" className="flex items-center text-sm text-gray-700">
                            <Clock className="w-4 h-4 mr-1" />
                            Requires appointment
                        </label>
                    </div>
                </div>

                {/* Expiration Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiration Date (Optional)
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="datetime-local"
                            value={formData.expires_at}
                            onChange={(e) => handleInputChange('expires_at', e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                        Leave blank for no expiration
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={handleSaveAsDraft}
                        disabled={isLoading}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        <Save className="w-4 h-4" />
                        <span>Save as Draft</span>
                    </button>

                    <button
                        type="submit"
                        onClick={handlePublish}
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                        <span>
                            {isLoading ? 'Saving...' : (isEditing ? 'Update & Publish' : 'Create & Publish')}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    )
}