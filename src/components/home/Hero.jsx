import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Globe, Calendar, Truck, Sparkles } from 'lucide-react'

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
        { id: 'services', name: 'Services' }
    ]

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`)
        }
    }

    const features = [
        {
            icon: MapPin,
            title: 'Local & Global',
            desc: 'Shop nearby or worldwide'
        },
        {
            icon: Calendar,
            title: 'Book Meetings',
            desc: 'Schedule with sellers'
        },
        {
            icon: Truck,
            title: 'Safe Delivery',
            desc: 'Secure shipping'
        }
    ]

    return (
        <div className="relative gradient-bg text-white overflow-hidden min-h-screen-mobile">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />

            {/* Animated Background Elements */}
            <div className="absolute top-10 left-4 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse" />
            <div className="absolute top-32 right-8 w-32 h-32 bg-purple-300/10 rounded-full blur-2xl animate-pulse delay-1000" />
            <div className="absolute bottom-40 left-8 w-24 h-24 bg-blue-300/10 rounded-full blur-xl animate-pulse delay-500" />

            <div className="relative container-mobile py-8 md:py-20 flex flex-col justify-center min-h-screen-mobile">
                <div className="text-center mb-8 md:mb-12">
                    {/* Mobile Badge */}
                    <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-4 md:mb-6 border border-white/20">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span className="text-sm font-medium">New marketplace experience</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                        Discover, Connect,
                        <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                            Buy & Sell
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
                        Your modern marketplace connecting buyers and sellers locally and globally
                    </p>

                    {/* Search Section */}
                    <div className="max-w-3xl mx-auto mb-6 md:mb-8">
                        <div className="glass rounded-2xl p-4 md:p-6">
                            <form onSubmit={handleSearch} className="space-y-3 md:space-y-0 md:flex md:gap-3">
                                {/* Search Input */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="What are you looking for?"
                                        className="w-full pl-12 pr-4 py-3 md:py-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 text-base"
                                    />
                                </div>

                                {/* Category Selector - Mobile: Full width, Desktop: Fixed width */}
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full md:w-48 px-4 py-3 md:py-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 text-base"
                                >
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Search Button */}
                                <button
                                    type="submit"
                                    className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 dark:from-orange-400 dark:to-red-400 dark:hover:from-orange-500 dark:hover:to-red-500 text-white px-6 py-3 md:py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg min-h-[48px] md:min-h-auto"
                                >
                                    Search Now
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Features - Mobile: Stack, Desktop: Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto mb-6 md:mb-8">
                        {features.map((feature, index) => (
                            <div key={index} className="glass rounded-xl p-4 md:p-6 border border-white/20">
                                <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-blue-300 dark:text-blue-200 mx-auto mb-2 md:mb-3" />
                                <h3 className="font-semibold mb-1 text-sm md:text-base">{feature.title}</h3>
                                <p className="text-blue-100 dark:text-blue-200 text-xs md:text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons - Mobile: Stack, Desktop: Side by side */}
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md mx-auto">
                        <button
                            onClick={() => navigate('/categories')}
                            className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg min-h-[48px]"
                        >
                            Start Buying
                        </button>
                        <button
                            onClick={() => navigate('/sell')}
                            className="bg-transparent border-2 border-white dark:border-gray-300 text-white dark:text-gray-100 hover:bg-white dark:hover:bg-gray-300 hover:text-blue-600 dark:hover:text-gray-900 font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-200 min-h-[48px]"
                        >
                            Start Selling
                        </button>
                    </div>
                </div>

                {/* Mobile-only Quick Stats */}
                <div className="mobile-only mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className="glass rounded-lg p-3 border border-white/20">
                        <div className="text-lg font-bold">150K+</div>
                        <div className="text-xs text-blue-100 dark:text-blue-200">Users</div>
                    </div>
                    <div className="glass rounded-lg p-3 border border-white/20">
                        <div className="text-lg font-bold">500K+</div>
                        <div className="text-xs text-blue-100 dark:text-blue-200">Products</div>
                    </div>
                    <div className="glass rounded-lg p-3 border border-white/20">
                        <div className="text-lg font-bold">25+</div>
                        <div className="text-xs text-blue-100 dark:text-blue-200">Countries</div>
                    </div>
                </div>
            </div>

            {/* Wave Transition */}
            <div className="absolute bottom-0 w-full">
                <svg className="w-full h-8 md:h-12 text-gray-50 dark:text-gray-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,120 C150,60 350,0 600,30 C850,60 1050,120 1200,60 L1200,120 Z" fill="currentColor" />
                </svg>
            </div>
        </div>
    )
}

export default Hero