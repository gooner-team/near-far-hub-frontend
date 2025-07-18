import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { useListings } from '../hooks'
import { Section, FilterPanel, ListingView, Button } from '../components/ui'
import { CATEGORIES_DATA } from '../data'

const filterConfig = [
    { type: 'select', name: 'category', label: 'Category', placeholder: 'All categories', options: Object.entries(CATEGORIES_DATA.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.name }), {})) },
    { type: 'select', name: 'condition', label: 'Condition', placeholder: 'Any condition', options: [['new', 'New'], ['like_new', 'Like New'], ['good', 'Good']] },
    { type: 'number', name: 'min_price', label: 'Min Price (€)', placeholder: 'Min' },
    { type: 'number', name: 'max_price', label: 'Max Price (€)', placeholder: 'Max' },
    { type: 'text', name: 'location', label: 'Location', placeholder: 'City or region' },
    { type: 'checkbox', name: 'can_deliver_globally', placeholder: 'Global shipping available' },
    { type: 'checkbox', name: 'requires_appointment', placeholder: 'Appointment viewing' }
]

const sortOptions = [
    ['newest', 'Newest First'],
    ['oldest', 'Oldest First'],
    ['price_low', 'Price: Low to High'],
    ['price_high', 'Price: High to Low'],
    ['most_viewed', 'Most Viewed']
]

export const BrowseListingsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [showFilters, setShowFilters] = useState(false)
    const [likedItems, setLikedItems] = useState(new Set())

    const filters = Object.fromEntries(searchParams.entries())
    const { listings, loading, error } = useListings(filters)

    const handleFilterChange = (key, value) => {
        const newParams = new URLSearchParams(searchParams)
        if (value) {
            newParams.set(key, value)
        } else {
            newParams.delete(key)
        }
        setSearchParams(newParams)
    }

    const clearFilters = () => setSearchParams({})

    const toggleLike = (id) => {
        setLikedItems(prev => new Set(prev.has(id) ? [...prev].filter(i => i !== id) : [...prev, id]))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Section
                title="Browse Listings"
                subtitle={`${listings?.length || 0} listings available`}
                background="bg-white"
                className="border-b border-gray-200"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <FilterPanel
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClear={clearFilters}
                        isVisible={showFilters}
                        onToggle={() => setShowFilters(!showFilters)}
                        filterConfig={filterConfig}
                    />

                    <div className="flex-1">
                        <div className="flex items-center mb-6 lg:hidden">
                            <Button variant="ghost" onClick={() => setShowFilters(!showFilters)}>
                                <SlidersHorizontal className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                        </div>

                        <ListingView
                            listings={listings}
                            loading={loading}
                            error={error}
                            onLike={toggleLike}
                            likedItems={likedItems}
                            sortOptions={sortOptions}
                            onSortChange={(value) => handleFilterChange('sort_by', value)}
                            currentSort={filters.sort_by || ''}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}