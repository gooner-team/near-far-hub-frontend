import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, Eye, Upload, X } from 'lucide-react'
import { listingsAPI } from '../../services/api'
import { useForm } from '../../hooks'
import { Button, Input, Card } from '../ui'
import { CATEGORIES, CONDITIONS } from '../../constants'
import { validateRequired, validateMinLength } from '../../utils'

export const ListingForm = ({ listingId, onSuccess }) => {
    const navigate = useNavigate()
    const isEditing = !!listingId
    const [imageUrls, setImageUrls] = useState([''])

    const { data, errors, loading, handleChange, submit, setData } = useForm(
        {
            title: '',
            description: '',
            price: '',
            category: '',
            condition: '',
            images: [],
            location: { city: '', country: 'Latvia' },
            can_deliver_globally: false,
            requires_appointment: false,
            status: 'draft'
        },
        {
            title: [validateRequired, validateMinLength(3)],
            price: [validateRequired, (v) => v > 0 ? null : 'Price must be greater than 0'],
            category: [validateRequired]
        }
    )

    const handleImageChange = (index, value) => {
        const newUrls = [...imageUrls]
        newUrls[index] = value
        setImageUrls(newUrls)
        setData(prev => ({ ...prev, images: newUrls.filter(url => url.trim()) }))
    }

    const addImageUrl = () => setImageUrls([...imageUrls, ''])
    const removeImageUrl = (index) => {
        const newUrls = imageUrls.filter((_, i) => i !== index)
        setImageUrls(newUrls)
        setData(prev => ({ ...prev, images: newUrls.filter(url => url.trim()) }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        submit(async (formData) => {
            const result = isEditing
                ? await listingsAPI.update(listingId, formData)
                : await listingsAPI.create(formData)

            onSuccess?.(result.data) || navigate('/profile')
        })
    }

    return (
        <Card className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isEditing ? 'Edit Listing' : 'Create New Listing'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <Input
                            label="Title *"
                            value={data.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            error={errors.title}
                            placeholder="Enter listing title"
                            maxLength={255}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select
                            value={data.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select category</option>
                            {Object.entries(CATEGORIES).map(([key, cat]) => (
                                <option key={key} value={key}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                    </div>

                    {data.category !== 'services' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                            <select
                                value={data.condition}
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

                    <Input
                        label="Price (€) *"
                        type="number"
                        step="0.01"
                        min="0"
                        value={data.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        error={errors.price}
                        placeholder="0.00"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your item..."
                        maxLength={5000}
                    />
                </div>

                {/* Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                    <div className="space-y-2">
                        {imageUrls.map((url, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <Input
                                    type="url"
                                    value={url}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                    placeholder="Enter image URL"
                                    className="flex-1"
                                />
                                {imageUrls.length > 1 && (
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeImageUrl(index)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        {imageUrls.length < 10 && (
                            <Button type="button" variant="ghost" onClick={addImageUrl}>
                                <Upload className="w-4 h-4 mr-2" />
                                Add Image
                            </Button>
                        )}
                    </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={data.can_deliver_globally}
                            onChange={(e) => handleChange('can_deliver_globally', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Can deliver globally</span>
                    </label>

                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={data.requires_appointment}
                            onChange={(e) => handleChange('requires_appointment', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">Requires appointment</span>
                    </label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setData(prev => ({ ...prev, status: 'draft' }))}
                        className="flex-1"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save as Draft
                    </Button>
                    <Button type="submit" loading={loading} className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        {isEditing ? 'Update & Publish' : 'Create & Publish'}
                    </Button>
                </div>
            </form>
        </Card>
    )
}