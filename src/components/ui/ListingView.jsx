import { useState } from 'react'
import { Grid, List, Search } from 'lucide-react'
import { Button, DataRenderer } from './index.jsx'
import { ListingCard } from '../listings/ListingCard'

export const ListingView = ({
                                listings,
                                loading,
                                error,
                                onLike,
                                likedItems = new Set(),
                                sortOptions = [],
                                onSortChange,
                                currentSort = ''
                            }) => {
    const [viewMode, setViewMode] = useState('grid')

    if (error) return <div className="text-center text-red-600">Error: {error}</div>

    const ViewModeButtons = () => (
        <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 mr-2">View:</span>
            {[
                { mode: 'grid', icon: Grid },
                { mode: 'list', icon: List }
            ].map(({ mode, icon: Icon }) => (
                <Button
                    key={mode}
                    variant={viewMode === mode ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode(mode)}
                >
                    <Icon className="w-4 h-4" />
                </Button>
            ))}
        </div>
    )

    const SortSelect = () => sortOptions.length > 0 && (
        <select
            value={currentSort}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            {sortOptions.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <SortSelect />
                <ViewModeButtons />
            </div>

            <DataRenderer
                data={listings}
                loading={loading}
                container="div"
                containerProps={{
                    className: viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        : 'space-y-4'
                }}
                renderItem={(listing) => (
                    <ListingCard
                        key={listing.id}
                        listing={listing}
                        onLike={onLike}
                        isLiked={likedItems.has(listing.id)}
                        variant={viewMode}
                    />
                )}
                emptyState={
                    <div className="text-center py-12">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria</p>
                    </div>
                }
            />
        </div>
    )
}