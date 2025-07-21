import { Link } from 'react-router-dom'
import {
    Smartphone,
    Car,
    Home,
    Shirt,
    Sofa,
    Wrench,
    Gamepad2,
    Book,
    Bike,
    Camera,
    Music,
    Dumbbell
} from 'lucide-react'

function CategoryGrid() {
    const categories = [
        {
            id: 'electronics',
            name: 'Electronics',
            icon: Smartphone,
            count: '12,450',
            gradient: 'from-blue-500 to-cyan-500',
            description: 'Phones, Laptops, Gaming'
        },
        {
            id: 'vehicles',
            name: 'Vehicles',
            icon: Car,
            count: '8,320',
            gradient: 'from-red-500 to-orange-500',
            description: 'Cars, Motorcycles, Boats'
        },
        {
            id: 'real-estate',
            name: 'Real Estate',
            icon: Home,
            count: '5,680',
            gradient: 'from-green-500 to-emerald-500',
            description: 'Houses, Apartments, Land'
        },
        {
            id: 'fashion',
            name: 'Fashion',
            icon: Shirt,
            count: '15,920',
            gradient: 'from-pink-500 to-rose-500',
            description: 'Clothing, Shoes, Accessories'
        },
        {
            id: 'home-garden',
            name: 'Home & Garden',
            icon: Sofa,
            count: '9,750',
            gradient: 'from-purple-500 to-violet-500',
            description: 'Furniture, Decor, Tools'
        },
        {
            id: 'services',
            name: 'Services',
            icon: Wrench,
            count: '6,420',
            gradient: 'from-yellow-500 to-amber-500',
            description: 'Repair, Cleaning, Tutoring'
        },
        {
            id: 'gaming',
            name: 'Gaming',
            icon: Gamepad2,
            count: '4,890',
            gradient: 'from-indigo-500 to-blue-500',
            description: 'Consoles, Games, Accessories'
        },
        {
            id: 'books',
            name: 'Books & Media',
            icon: Book,
            count: '7,230',
            gradient: 'from-teal-500 to-cyan-500',
            description: 'Books, Music, Movies'
        },
        {
            id: 'sports',
            name: 'Sports',
            icon: Bike,
            count: '3,560',
            gradient: 'from-orange-500 to-red-500',
            description: 'Equipment, Gear, Fitness'
        },
        {
            id: 'photography',
            name: 'Photography',
            icon: Camera,
            count: '2,180',
            gradient: 'from-slate-500 to-gray-500',
            description: 'Cameras, Lenses, Equipment'
        },
        {
            id: 'music',
            name: 'Musical Instruments',
            icon: Music,
            count: '1,840',
            gradient: 'from-emerald-500 to-teal-500',
            description: 'Guitars, Keyboards, Audio'
        },
        {
            id: 'fitness',
            name: 'Fitness',
            icon: Dumbbell,
            count: '2,950',
            gradient: 'from-red-500 to-pink-500',
            description: 'Gym Equipment, Supplements'
        }
    ]

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Browse by Category
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover thousands of products across all categories. From electronics to real estate,
                        find exactly what you're looking for.
                    </p>
                </div>

                {/* categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {categories.map((category) => {
                        const IconComponent = category.icon
                        return (
                            <Link
                                key={category.id}
                                to={`/category/${category.id}`}
                                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                            >
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>

                                {/* Icon */}
                                <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                                    <IconComponent className="w-6 h-6 text-white" />
                                </div>

                                {/* Content */}
                                <div className="text-center">
                                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {category.description}
                                    </p>
                                    <span className="text-sm font-medium text-blue-600">
                    {category.count} items
                  </span>
                                </div>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300"></div>
                            </Link>
                        )
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        to="/categories"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        View All Categories
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default CategoryGrid