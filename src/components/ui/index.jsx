import { forwardRef, useState, cloneElement, isValidElement } from 'react'
import { AlertCircle } from 'lucide-react'

const cn = (...classes) => classes.filter(Boolean).join(' ')

// Button Component
export const Button = forwardRef(({
                                      variant = 'primary',
                                      size = 'md',
                                      icon: Icon,
                                      loading,
                                      children,
                                      className,
                                      asChild,
                                      ...props
                                  }, ref) => {
    const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white',
        secondary: 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 text-gray-700',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
        danger: 'bg-red-600 hover:bg-red-700 text-white'
    }

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-lg'
    }

    const baseClasses = cn(
        'font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2',
        variants[variant],
        sizes[size],
        className
    )

    // If asChild is true, clone the child element and merge props
    if (asChild && isValidElement(children)) {
        return cloneElement(children, {
            className: cn(baseClasses, children.props.className),
            ref,
            ...props,
            ...children.props
        })
    }

    return (
        <button
            ref={ref}
            className={baseClasses}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
            ) : Icon ? <Icon className="w-5 h-5" /> : null}
            {children ? <span>{children}</span> : null}
        </button>
    )
})

Button.displayName = 'Button'

// Input Component
export const Input = forwardRef(({
                                     label,
                                     error,
                                     icon: Icon,
                                     className,
                                     ...props
                                 }, ref) => (
    <div className="space-y-2">
        {label && (
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
        )}
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
            <input
                ref={ref}
                className={cn(
                    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
                    Icon && 'pl-10',
                    error ? 'border-red-300 bg-red-50' : 'border-gray-300',
                    className
                )}
                {...props}
            />
        </div>
        {error && (
            <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
            </p>
        )}
    </div>
))

Input.displayName = 'Input'

// Card Component
export const Card = ({ children, className, ...props }) => (
    <div
        className={cn(
            'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100',
            className
        )}
        {...props}
    >
        {children}
    </div>
)

// Badge Component
export const Badge = ({ variant = 'default', children, className, ...props }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
        red: 'bg-red-100 text-red-800',
        yellow: 'bg-yellow-100 text-yellow-800'
    }

    return (
        <span
            className={cn('px-2 py-1 text-xs font-medium rounded-full', variants[variant], className)}
            {...props}
        >
      {children}
    </span>
    )
}

// Section Component
export const Section = ({
                            title,
                            subtitle,
                            children,
                            background = 'bg-white',
                            className = '',
                            ...props
                        }) => (
    <section className={cn('py-16', background, className)} {...props}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(title || subtitle) && (
                <div className="text-center mb-12">
                    {title && <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>}
                    {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    </section>
)

// DataRenderer Component
export const DataRenderer = ({
                                 data,
                                 loading,
                                 error,
                                 container: Container = 'div',
                                 containerProps = {},
                                 renderItem,
                                 emptyState = <div className="text-center py-8 text-gray-500">No data found</div>,
                                 loadingState = (
                                     <div className="flex justify-center py-8">
                                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                                     </div>
                                 )
                             }) => {
    if (loading) return loadingState
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>
    if (!data || data.length === 0) return emptyState

    return (
        <Container {...containerProps}>
            {data.map((item, index) => renderItem(item, index))}
        </Container>
    )
}

// FilterPanel Component
export const FilterPanel = ({
                                filters,
                                onFilterChange,
                                onClear,
                                isVisible,
                                onToggle,
                                filterConfig = []
                            }) => (
    <div className={`lg:w-80 ${isVisible ? 'block' : 'hidden lg:block'}`}>
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={onClear}>Clear all</Button>
                </div>
            </div>

            <div className="space-y-6">
                {filterConfig.map(({ type, name, label, options, placeholder, ...props }, i) => (
                    <div key={i}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                        {type === 'select' ? (
                            <select
                                value={filters[name] || ''}
                                onChange={(e) => onFilterChange(name, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">{placeholder}</option>
                                {options?.map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        ) : type === 'checkbox' ? (
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filters[name] || false}
                                    onChange={(e) => onFilterChange(name, e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">{placeholder}</span>
                            </label>
                        ) : (
                            <Input
                                type={type}
                                value={filters[name] || ''}
                                onChange={(e) => onFilterChange(name, e.target.value)}
                                placeholder={placeholder}
                                {...props}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    </div>
)

// ListingView Component
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
    if (error) return <div className="text-center text-red-600">Error: {error}</div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                {sortOptions.length > 0 && (
                    <select
                        value={currentSort}
                        onChange={(e) => onSortChange?.(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {sortOptions.map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                )}
            </div>

            <DataRenderer
                data={listings}
                loading={loading}
                container="div"
                containerProps={{
                    className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                }}
                renderItem={(listing) => (
                    <div key={listing.id} className="listing-card">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="font-semibold">{listing.title}</h3>
                            <p className="text-gray-600">{listing.price}</p>
                        </div>
                    </div>
                )}
                emptyState={
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria</p>
                    </div>
                }
            />
        </div>
    )
}