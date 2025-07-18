import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useListings } from '../hooks'
import { Section, ListingView, Button } from '../components/ui'

function CategoryPage() {
    const { id } = useParams()
    const [likedItems, setLikedItems] = useState(new Set())

    const categoryInfo = {
        name: 'Category',
        description: 'Browse products in this category'
    }

    const { listings, loading, error } = useListings({ category: id })

    const toggleLike = (itemId) => {
        setLikedItems(prev => new Set(prev.has(itemId) ? [...prev].filter(i => i !== itemId) : [...prev, itemId]))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Section background="bg-white" className="border-b border-gray-200">
                <Button variant="ghost" onClick={() => window.history.back()} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Categories
                </Button>

                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryInfo.name}</h1>
                    <p className="text-gray-600 mb-2">{categoryInfo.description}</p>
                    <p className="text-sm text-gray-500">{listings?.length || 0} items available</p>
                </div>
            </Section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ListingView
                    listings={listings}
                    loading={loading}
                    error={error}
                    onLike={toggleLike}
                    likedItems={likedItems}
                />
            </div>
        </div>
    )
}

export default CategoryPage