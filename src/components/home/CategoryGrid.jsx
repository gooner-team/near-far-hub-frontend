import { Link } from 'react-router-dom'
import {
    Smartphone, Car, Home, Shirt, Sofa, Wrench,
    Gamepad2, Book, Bike, Camera, Music, Dumbbell,
    ArrowRight, TrendingUp
} from 'lucide-react'

function CategoryGrid() {
    const categories = [
        { id: 'electronics', name: 'Electronics', icon: Smartphone, count: '12.4k', gradient: 'from-blue-500 to-cyan-500', trending: true },
        { id: 'vehicles', name: 'Vehicles', icon: Car, count: '8.3k', gradient: 'from-red-500 to-orange-500', trending: false },
        { id: 'real-estate', name: 'Real Estate', icon: Home, count: '5.7k', gradient: 'from-green-500 to-emerald-500', trending: true },
        { id: 'fashion', name: 'Fashion', icon: Shirt, count: '15.9k', gradient: 'from-pink-500 to-rose-500', trending: true },
        { id: 'home-garden', name: 'Home & Garden', icon: Sofa, count: '9.8k', gradient: 'from-purple-500 to-violet-500', trending: false },
        { id: 'services', name: 'Services', icon: Wrench, count: '6.4k', gradient: 'from-yellow-500 to-amber-500', trending: true },
        { id: 'gaming', name: 'Gaming', icon: Gamepad2, count: '4.9k', gradient: 'from-indigo-500 to-blue-500', trending: true },
        { id: 'books', name: 'Books & Media', icon: Book, count: '7.2k', gradient: 'from-teal-500 to-cyan-500', trending: false },
        { id: 'sports', name: 'Sports', icon: Bike, count: '3.6k', gradient: 'from-orange-500 to-red-500', trending: false },
        { id: 'photography', name: 'Photography', icon: Camera, count: '2.2k', gradient: 'from-slate-500 to-gray-500', trending: false },
        { id: 'music', name: 'Music', icon: Music, count: '1.8k', gradient: 'from-emerald-500 to-teal-500', trending: false },
        { id: 'fitness', name: 'Fitness', icon: Dumbbell, count: '3.0k', gradient: 'from-red-500 to-pink-500', trending: true }
    ]

    // Split categories for different layouts
    const trendingCategories = categories.filter(cat => cat.trending).slice(0, 4)
    const allCategories = categories.slice(0, 8) // Show first 8 on mobile

    return (
        <section className="section bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="container-mobile">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3 md:mb-4">
                        Browse Categories
                    </h2>
                    <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
                        Discover thousands of products across all categories
                    </p>
                </div>

                {/* Trending Categories - Mobile Horizontal Scroll */}
                <div className="mobile-only mb-8">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                            Trending
                        </h3>
                        <Link to="/categories" className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                            View All
                        </Link>
                    </div>

                    <div className="scroll-snap-x pb-2">
                        <div className="flex space-x-3">
                            {trendingCategories.map((category) => {
                                const IconComponent = category.icon
                                return (
                                    <Link
                                        key={category.id}
                                        to={`/category/${category.id}`}
                                        className="scroll-snap-item card-mobile p-4 min-w-[140px] group hover:scale-105 transition-all duration-300"
                                    >
                                        <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 relative`}>
                                            <IconComponent className="w-6 h-6 text-white" />
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                                                <TrendingUp className="w-2 h-2 text-white" />
                                            </div>
                                        </div>

                                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {category.name}
                                        </h4>
                                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                            {category.count} items
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* All Categories Grid */}
                <div className="mb-8">
                    <div className="mobile-only mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 px-1">
                            All Categories
                        </h3>
                    </div>

                    <div className="grid-mobile-2 md:grid-responsive-4">
                        {(window.innerWidth < 768 ? allCategories : categories).map((category) => {
                            const IconComponent = category.icon
                            return (
                                <Link
                                    key={category.id}
                                    to={`/category/${category.id}`}
                                    className="card-mobile p-4 md:p-6 group hover:-translate-y-1 transition-all duration-300 relative"
                                >
                                    {/* Trending Badge */}
                                    {category.trending && (
                                        <div className="absolute top-2 right-2 md:top-3 md:right-3 w-2 h-2 md:w-3 md:h-3 bg-orange-500 rounded-full" />
                                    )}

                                    <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${category.gradient} rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                    </div>

                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm md:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {category.name}
                                    </h4>
                                    <span className="text-xs md:text-sm font-medium text-blue-600 dark:text-blue-400">
                                        {category.count} items
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Link
                        to="/categories"
                        className="inline-flex items-center btn-primary space-x-2 group"
                    >
                        <span>View All Categories</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                </div>

                {/* Mobile Quick Actions */}
                <div className="mobile-only mt-8 grid grid-cols-2 gap-3">
                    <Link
                        to="/search?trending=true"
                        className="card-mobile p-4 text-center group"
                    >
                        <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Trending Now</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Hot items</p>
                    </Link>

                    <Link
                        to="/search?discount=true"
                        className="card-mobile p-4 text-center group"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-bold text-sm">%</span>
                        </div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">On Sale</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Great deals</p>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default CategoryGrid