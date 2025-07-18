import { X, SlidersHorizontal } from 'lucide-react'
import { Button, Input } from './index'

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
                    <Button variant="ghost" size="sm" onClick={onToggle} className="lg:hidden">
                        <X className="w-4 h-4" />
                    </Button>
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