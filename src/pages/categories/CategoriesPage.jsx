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
    Dumbbell,
    Search,
    Filter,
    Grid,
    List
} from 'lucide-react'

function CategoriesPage() {
    const categories = [
        {
            id: 'electronics',
            name: 'Electronics',
            icon: Smartphone,
            count: '12,450',
            gradient: 'from-blue-500 to-cyan-500',
            description: 'Phones, Laptops, Gaming, Smart Devices',
            subcategories: ['Smartphones', 'Laptops', 'Gaming', 'Audio', 'Smart Home']
        },
        {
            id: 'vehicles',
            name: 'Vehicles',
            icon: Car,
            count: '8,320',
            gradient: 'from-red-500 to-orange-500',
            description: 'Cars, Motorcycles, Boats, Parts',
            subcategories: ['Cars', 'Motorcycles', 'Boats', 'Parts & Accessories', 'Commercial']
        },
        {
            id: 'real-estate',
            name: 'Real Estate',
            icon: Home,
            count: '5,680',
            gradient: 'from-green-500 to-emerald-500',
            description: 'Houses, Apartments, Land, Commercial',
            subcategories: ['Houses', 'Apartments', 'Land', 'Commercial', 'Vacation Rentals']
        },
        {
            id: 'fashion',
            name: 'Fashion',
            icon: Shirt,
            count: '15,920',
            gradient: 'from-pink-500 to-rose-500',
            description: 'Clothing, Shoes, Accessories, Jewelry',
            subcategories: ['Clothing', 'Shoes', 'Accessories', 'Jewelry', 'Bags']
        },
        {
            id: 'home-garden',
            name: 'Home & Garden',
            icon: Sofa,
            count: '9,750',
            gradient: 'from-purple-500 to-violet-500',
            description: 'Furniture, Decor, Tools, Plants',
            subcategories: ['Furniture', 'Decor', 'Tools', 'Garden', 'Kitchen']
        },
        {
            id: 'services',
            name: 'Services',
            icon: Wrench,
            count: '6,420',
            gradient: 'from-yellow-500 to-amber-500',
            description: 'Repair, Cleaning, Tutoring, Professional',
            subcategories: ['Home Services', 'Professional', 'Tutoring', 'Health & Beauty', 'Events']
        },
        {
            id: 'gaming',
            name: 'Gaming',
            icon: Gamepad2,
            count: '4,890',
            gradient: 'from-indigo-500 to-blue-500',
            description: 'Consoles, Games, Accessories, PC Gaming',
            subcategories: ['Consoles', 'Games', 'Accessories', 'PC Gaming', 'Collectibles']
        },
        {
            id: 'books',
            name: 'Books & Media',
            icon: Book,
            count: '7,230',
            gradient: 'from-teal-500 to-cyan-500',
            description: 'Books, Music, Movies, Educational',
            subcategories: ['Books', 'Music', 'Movies', 'Educational', 'Magazines']
        },
        {
            id: 'sports',
            name: 'Sports & Outdoors',
            icon: Bike,
            count: '3,560',
            gradient: 'from-orange-500 to-red-500',
            description: 'Equipment, Gear, Fitness, Outdoor',
            subcategories: ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports', 'Winter Sports']
        },
        {
            id: 'photography',
            name: 'Photography',
            icon: Camera,
            count: '2,180',
            gradient: 'from-slate-500 to-gray-500',
            description: 'Cameras, Lenses, Equipment, Accessories',
            subcategories: ['Cameras', 'Lenses', 'Accessories', 'Lighting', 'Tripods']
        },
        {
            id: 'music',
            name: 'Musical Instruments',
            icon: Music,
            count: '1,840',
            gradient: 'from-emerald-500 to-teal-500',
            description: 'Guitars, Keyboards, Audio, Equipment',
            subcategories: ['Guitars', 'Keyboards', 'Audio Equipment', 'Drums', 'Wind Instruments']
        },
        {
            id: 'fitness',
            name: 'Health & Fitness',
            icon: Dumbbell,
            count: '2,950',
            gradient: 'from-red-500 to-pink-500',
            description: 'Gym Equipment, Supplements, Wellness',
            subcategories: ['Gym Equipment', 'Supplements', 'Wellness', 'Yoga', 'Running']
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Browse All Categories
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover thousands of products across all categories. Find exactly what you're looking for.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mt-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search within categories..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <span>Sort by: Popular</span>
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 bg-blue-600 text-white rounded-lg">
                            <Grid className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => {
                        const IconComponent = category.icon
                        return (
                            <Link
                                key={category.id}
                                to={`/category/${category.id}`}
                                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
                            >
                                {/* Icon Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                        {category.count}
                                    </span>
                                </div>

                                {/* Category Info */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {category.description}
                                    </p>
                                </div>

                                {/* Subcategories */}
                                <div className="space-y-1">
                                    {category.subcategories.slice(0, 4).map((sub, index) => (
                                        <div key={index} className="text-xs text-gray-500 hover:text-blue-600 transition-colors">
                                            • {sub}
                                        </div>
                                    ))}
                                    {category.subcategories.length > 4 && (
                                        <div className="text-xs text-blue-600 font-medium">
                                            +{category.subcategories.length - 4} more
                                        </div>
                                    )}
                                </div>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300"></div>
                            </Link>
                        )
                    })}
                </div>

                {/* Popular categories */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Most Popular Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.slice(0, 4).map((category) => {
                            const IconComponent = category.icon
                            return (
                                <Link
                                    key={category.id}
                                    to={`/category/${category.id}`}
                                    className="group flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                                >
                                    <div className={`w-10 h-10 bg-gradient-to-br ${category.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {category.name}
                                        </h4>
                                        <p className="text-sm text-gray-500">{category.count} items</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h3>
                        <p className="text-blue-100 mb-6">
                            Join thousands of sellers and list your items on NearFar Hub
                        </p>
                        <Link
                            to="/sell"
                            className="inline-block bg-white text-blue-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg"
                        >
                            Start Selling
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoriesPage