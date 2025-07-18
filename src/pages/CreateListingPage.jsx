import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Package } from 'lucide-react'
import { Card, Button, Input, Badge } from '../components/ui'
import ImageUpload from '../components/common/ImageUpload'

function CreateListingPage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        location: '',
        images: []
    })
    const [loading, setLoading] = useState(false)

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            console.log('Creating listing:', formData)
            setLoading(false)
            navigate('/profile')
        }, 1000)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
                    <p className="text-gray-600 mt-2">Add your item details to start selling</p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <Input
                                    label="Title *"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Enter listing title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select category</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="vehicles">Vehicles</option>
                                    <option value="real-estate">Real Estate</option>
                                    <option value="fashion">Fashion</option>
                                    <option value="home-garden">Home & Garden</option>
                                    <option value="services">Services</option>
                                </select>
                            </div>

                            <div>
                                <Input
                                    label="Price (€) *"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Condition
                                </label>
                                <select
                                    value={formData.condition}
                                    onChange={(e) => handleInputChange('condition', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select condition</option>
                                    <option value="new">New</option>
                                    <option value="like_new">Like New</option>
                                    <option value="excellent">Excellent</option>
                                    <option value="good">Good</option>
                                    <option value="fair">Fair</option>
                                </select>
                            </div>

                            <div>
                                <Input
                                    label="Location"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Describe your item..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Images *
                            </label>
                            <ImageUpload
                                type="LISTING_GALLERY"
                                onImagesChange={(images) => handleInputChange('images', images)}
                                existingImages={formData.images}
                                required
                            />
                        </div>

                        <div className="flex gap-4 pt-6 border-t">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/profile')}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={loading}
                                className="flex-1"
                            >
                                Create Listing
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}

export default CreateListingPage