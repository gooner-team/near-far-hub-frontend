import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Globe, Calendar, Truck } from 'lucide-react'

function Hero() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    const categories = [
        { id: 'all', name: 'All Categories' },
        { id: 'electronics', name: 'Electronics' },
        { id: 'vehicles', name: 'Vehicles' },
        { id: 'real-estate', name: 'Real Estate' },
        { id: 'fashion', name: 'Fashion' },
        { id: 'home-garden', name: 'Home & Garden' },
        { id: 'services', name: 'Services' }
    ]

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`)
        }
    }

    const handleStartBuying = () => {
        navigate('/categories')
    }

    const handleStartSelling = () => {
        navigate('/sell')
    }

    return (
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Discover, Connect,
                        <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            Buy & Sell
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Your modern marketplace where distance doesn't matter. Shop locally or globally,
                        book appointments with sellers, and get items delivered anywhere.
                    </p>

                    {/* Main Search */}
                    <div className="max-w-4xl mx-auto mb-8">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                                {/* Search Input */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="What are you looking for?"
                                            className="w-full pl-12 pr-4 py-4 text-gray-700 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                                        />
                                    </div>
                                </div>

                                {/* Category Selector */}
                                <div className="lg:w-64">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-4 py-4 text-gray-700 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-300 text-lg"
                                    >
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Search Button */}
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                                >
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Feature Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                            <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Local & Global</h3>
                            <p className="text-blue-100 text-sm">
                                Shop from your neighborhood or explore products from around the world
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                            <div className="w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Book Appointments</h3>
                            <p className="text-blue-100 text-sm">
                                Schedule meetings with sellers to inspect items before buying
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                            <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Truck className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Safe Delivery</h3>
                            <p className="text-blue-100 text-sm">
                                Buy online and get secure delivery right to your doorstep
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleStartBuying}
                            className="bg-white text-blue-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            Start Buying
                        </button>
                        <button
                            onClick={handleStartSelling}
                            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-xl transition-all duration-200"
                        >
                            Start Selling
                        </button>
                    </div>
                </div>
            </div>

            {/* Wave Transition */}
            <div className="absolute bottom-0 w-full">
                <svg className="w-full h-16 text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,120 C150,60 350,0 600,30 C850,60 1050,120 1200,60 L1200,120 Z" fill="currentColor" />
                </svg>
            </div>
        </div>
    )
}

export default Hero