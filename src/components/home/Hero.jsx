import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Globe, Calendar, Truck } from 'lucide-react'
import { Button, Input } from '../ui/index.jsx'

const CATEGORIES = {
    all: 'All Categories',
    electronics: 'Electronics',
    vehicles: 'Vehicles',
    'real-estate': 'Real Estate',
    fashion: 'Fashion',
    'home-garden': 'Home & Garden',
    services: 'Services'
}

function Hero() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [category, setCategory] = useState('all')

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${category}`)
        }
    }

    const features = [
        { icon: MapPin, title: 'Local & Global', desc: 'Shop from your neighborhood or worldwide' },
        { icon: Calendar, title: 'Book Appointments', desc: 'Schedule meetings with sellers' },
        { icon: Truck, title: 'Safe Delivery', desc: 'Secure delivery to your doorstep' }
    ]

    return (
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
            <div className="absolute inset-0 bg-black/20" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Discover, Connect,
                        <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Buy & Sell
            </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                        Your modern marketplace where distance doesn't matter
                    </p>

                    {/* Search */}
                    <div className="max-w-4xl mx-auto mb-8">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                                <Input
                                    icon={Search}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="What are you looking for?"
                                    className="flex-1 bg-white text-gray-700"
                                />
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="lg:w-64 px-4 py-3 bg-white text-gray-700 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                                        <option key={key} value={key}>{cat}</option>
                                    ))}
                                </select>
                                <Button type="submit" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                                    Search
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {features.map(({ icon: Icon, title, desc }, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                                <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                                <p className="text-blue-100 text-sm">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                    <Button onClick={() => navigate('/categories')} variant="secondary">
                        Start Buying
                    </Button>
                    <Button onClick={() => navigate('/sell')} variant="ghost" className="border-2 border-white">
                        Start Selling
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Hero