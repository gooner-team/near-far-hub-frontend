import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageUpload from '../common/ImageUpload'

const CATEGORIES = {
    electronics: 'Electronics',
    vehicles: 'Vehicles',
    'real-estate': 'Real Estate',
    fashion: 'Fashion',
    'home-garden': 'Home & Garden',
    services: 'Services'
}

const CONDITIONS = {
    new: 'New',
    like_new: 'Like New',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair'
}

export default function ListingForm({ listing, onSubmit }) {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: listing?.title || '',
        description: listing?.description || '',
        price: listing?.price || '',
        category: listing?.category || '',
        condition: listing?.condition || '',
        location: listing?.location || '',
        canDeliverGlobally: listing?.canDeliverGlobally || false,
        requiresAppointment: listing?.requiresAppointment || false,
        images: listing?.images || []
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }))
        }
    }

    const handleImagesChange = (images) => {
        handleChange('images', images)
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.title.trim()) newErrors.title = 'Title is required'
        if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required'
        if (!formData.category) newErrors.category = 'Category is required'
        if (formData.images.length === 0) newErrors.images = 'At least one image is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validate()) return

        setLoading(true)
        try {
            await onSubmit(formData)
            navigate('/profile')
        } catch (error) {
            setErrors({ submit: error.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">
                {listing ? 'Edit Listing' : 'Create New Listing'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.title ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Enter listing title"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.category ? 'border-red-300' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select category</option>
                            {Object.entries(CATEGORIES).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (€) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.price ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                        />
                        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                    </div>

                    {formData.category !== 'services' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Condition
                            </label>
                            <select
                                value={formData.condition}
                                onChange={(e) => handleChange('condition', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select condition</option>
                                {Object.entries(CONDITIONS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="City, Country"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your item..."
                    />
                </div>

                {/* Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Images *
                    </label>
                    <ImageUpload
                        type="LISTING_GALLERY"
                        onImagesChange={handleImagesChange}
                        existingImages={formData.images}
                        required
                    />
                    {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={formData.canDeliverGlobally}
                            onChange={(e) => handleChange('canDeliverGlobally', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Can deliver globally</span>
                    </label>

                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={formData.requiresAppointment}
                            onChange={(e) => handleChange('requiresAppointment', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Requires appointment</span>
                    </label>
                </div>

                {/* Submit */}
                {errors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        {errors.submit}
                    </div>
                )}

                <div className="flex gap-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => navigate('/profile')}
                        className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Saving...' : (listing ? 'Update Listing' : 'Create Listing')}
                    </button>
                </div>
            </form>
        </div>
    )
}