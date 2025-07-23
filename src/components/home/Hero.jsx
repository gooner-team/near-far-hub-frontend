import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Globe, Calendar, Truck, Sparkles, ArrowRight, Play } from 'lucide-react'

function Hero() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0)

    const categories = [
        { id: 'all', name: 'All Categories' },
        { id: 'electronics', name: 'Electronics' },
        { id: 'vehicles', name: 'Vehicles' },
        { id: 'real-estate', name: 'Real Estate' },
        { id: 'fashion', name: 'Fashion' },
        { id: 'services', name: 'Services' }
    ]

    const features = [
        {
            icon: MapPin,
            title: 'Local & Global',
            desc: 'Shop nearby or worldwide',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Calendar,
            title: 'Book Meetings',
            desc: 'Schedule with sellers',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Truck,
            title: 'Safe Delivery',
            desc: 'Secure shipping',
            color: 'from-green-500 to-emerald-500'
        }
    ]

    const stats = [
        { label: 'Active Users', value: '150K+', suffix: '' },
        { label: 'Products Listed', value: '500K+', suffix: '' },
        { label: 'Countries Served', value: '25+', suffix: '' }
    ]

    // Rotate features automatically
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeatureIndex((prev) => (prev + 1) % features.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [features.length])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`)
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900" />

                {/* Animated orbs */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-500" />

                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full animate-ping"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}

                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <div className="container-mobile py-20 min-h-screen flex flex-col justify-center">
                    <div className="text-center mb-12 animate-fade-in">
                        {/* Badge */}
                        <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-8 border border-white/20 shadow-2xl">
                            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                            <span className="text-white font-medium">Welcome to the future of commerce</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 leading-tight">
                            <span className="text-white">Discover, Connect,</span>
                            <br />
                            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                                Buy & Sell
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Your modern marketplace connecting buyers and sellers{' '}
                            <span className="text-cyan-400 font-semibold">locally</span> and{' '}
                            <span className="text-purple-400 font-semibold">globally</span>
                        </p>

                        {/* Search Section */}
                        <div className="max-w-4xl mx-auto mb-12">
                            <form onSubmit={handleSearch} className="glass rounded-3xl p-6 border border-white/20 shadow-2xl backdrop-blur-xl">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Search Input */}
                                    <div className="flex-1 relative group">
                                        <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 z-10 group-focus-within:text-blue-400 transition-colors" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="What are you looking for today?"
                                            className="w-full pl-16 pr-6 py-5 text-lg bg-white/10 text-white placeholder-gray-300 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    </div>

                                    {/* Category Selector */}
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="lg:w-48 px-6 py-5 text-lg bg-white/10 text-white rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm"
                                    >
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id} className="bg-gray-800">
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Search Button */}
                                    <button
                                        type="submit"
                                        className="lg:w-auto bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25 group"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span>Search Now</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Features Carousel */}
                        <div className="mb-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                {features.map((feature, index) => {
                                    const IconComponent = feature.icon
                                    const isActive = index === currentFeatureIndex

                                    return (
                                        <div
                                            key={index}
                                            className={`glass rounded-2xl p-6 border transition-all duration-500 transform ${
                                                isActive
                                                    ? 'border-white/40 scale-105 shadow-2xl'
                                                    : 'border-white/20 scale-100 shadow-xl'
                                            }`}
                                        >
                                            <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${isActive ? 'animate-pulse' : ''}`}>
                                                <IconComponent className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                                            <p className="text-blue-100 text-sm">{feature.desc}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <button
                                onClick={() => navigate('/categories')}
                                className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/25"
                            >
                                <div className="flex items-center space-x-2">
                                    <span>Start Exploring</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/sell')}
                                className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25"
                            >
                                <div className="flex items-center space-x-2">
                                    <span>Start Selling</span>
                                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </div>
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center group">
                                    <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                                        {stat.value}
                                    </div>
                                    <div className="text-blue-200 text-sm md:text-base font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Wave Transition */}
            <div className="absolute bottom-0 w-full">
                <svg
                    className="w-full h-20 text-gray-50 dark:text-gray-900"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,120 C150,60 350,0 600,30 C850,60 1050,120 1200,60 L1200,120 Z"
                        fill="currentColor"
                        className="animate-pulse"
                    />
                </svg>
            </div>
        </div>
    )
}

export default Hero