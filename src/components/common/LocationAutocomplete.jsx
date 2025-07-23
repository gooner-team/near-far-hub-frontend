// src/components/common/LocationAutocomplete.jsx
import { useState, useEffect, useRef } from 'react'
import { MapPin, Search, X } from 'lucide-react'
import { locationAPI } from '../../services/api.js'

function LocationAutocomplete({
                                  value,
                                  onChange,
                                  placeholder = "Enter your location",
                                  className = "",
                                  disabled = false
                              }) {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const inputRef = useRef(null)
    const suggestionsRef = useRef(null)

    // Initialize with existing value
    useEffect(() => {
        if (value) {
            if (typeof value === 'string') {
                setQuery(value)
                setSelectedLocation({ description: value })
            } else if (value.description) {
                setQuery(value.description)
                setSelectedLocation(value)
            }
        }
    }, [value])

    // Fetch suggestions when query changes
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions([])
                return
            }

            setIsLoading(true)
            try {
                const response = await locationAPI.getSuggestions(query, 10)
                setSuggestions(response.suggestions || [])
            } catch (error) {
                console.error('Failed to fetch location suggestions:', error)
                setSuggestions([])
            } finally {
                setIsLoading(false)
            }
        }

        const timeoutId = setTimeout(fetchSuggestions, 300)
        return () => clearTimeout(timeoutId)
    }, [query])

    const handleInputChange = (e) => {
        const newQuery = e.target.value
        setQuery(newQuery)
        setShowSuggestions(true)
        setSelectedLocation(null)

        // If user clears the input, clear the selection
        if (!newQuery.trim()) {
            onChange(null)
        }
    }

    const handleSuggestionClick = async (suggestion) => {
        setQuery(suggestion.description)
        setShowSuggestions(false)
        setSelectedLocation(suggestion)

        // Validate and enrich the location
        try {
            const response = await locationAPI.validateLocation(suggestion)
            if (response.success && response.location) {
                onChange(response.location)
            } else {
                onChange(suggestion)
            }
        } catch (error) {
            console.error('Failed to validate location:', error)
            onChange(suggestion)
        }
    }

    const handleClear = () => {
        setQuery('')
        setSelectedLocation(null)
        setSuggestions([])
        setShowSuggestions(false)
        onChange(null)
        inputRef.current?.focus()
    }

    const handleFocus = () => {
        setShowSuggestions(true)
    }

    const handleBlur = (e) => {
        // Delay hiding suggestions to allow clicks
        setTimeout(() => {
            if (!suggestionsRef.current?.contains(e.relatedTarget)) {
                setShowSuggestions(false)
            }
        }, 200)
    }

    return (
        <div className="relative">
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
                />

                {query && !disabled && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (query.length >= 2 || suggestions.length > 0) && (
                <div
                    ref={suggestionsRef}
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                    {isLoading ? (
                        <div className="p-3 text-center text-gray-500">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                <span>Searching...</span>
                            </div>
                        </div>
                    ) : suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => (
                            <button
                                key={suggestion.id || index}
                                type="button"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start space-x-3 border-b border-gray-100 last:border-b-0"
                            >
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                        {suggestion.main_text || suggestion.description}
                                    </div>
                                    {suggestion.secondary_text && (
                                        <div className="text-sm text-gray-500 truncate">
                                            {suggestion.secondary_text}
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                                            suggestion.source === 'local'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {suggestion.source === 'local' ? 'Local' : 'Global'}
                                        </span>
                                        <span className="text-xs text-gray-400 capitalize">
                                            {suggestion.type}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : query.length >= 2 ? (
                        <div className="p-3 text-center text-gray-500">
                            <div className="flex flex-col items-center space-y-2">
                                <Search className="w-5 h-5 text-gray-400" />
                                <span>No locations found</span>
                                <span className="text-xs">Try a different search term</span>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Selected Location Info */}
            {selectedLocation && (
                <div className="mt-2 text-xs text-gray-500">
                    <span>Selected: </span>
                    <span className="font-medium">{selectedLocation.description}</span>
                    {selectedLocation.coordinates && (
                        <span className="ml-2">
                            ({selectedLocation.coordinates.latitude?.toFixed(4)}, {selectedLocation.coordinates.longitude?.toFixed(4)})
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}

export default LocationAutocomplete