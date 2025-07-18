export const CATEGORIES = {
    electronics: { name: 'Electronics', icon: 'Smartphone', gradient: 'from-blue-500 to-cyan-500' },
    vehicles: { name: 'Vehicles', icon: 'Car', gradient: 'from-red-500 to-orange-500' },
    'real-estate': { name: 'Real Estate', icon: 'Home', gradient: 'from-green-500 to-emerald-500' },
    fashion: { name: 'Fashion', icon: 'Shirt', gradient: 'from-pink-500 to-rose-500' },
    'home-garden': { name: 'Home & Garden', icon: 'Sofa', gradient: 'from-purple-500 to-violet-500' },
    services: { name: 'Services', icon: 'Wrench', gradient: 'from-yellow-500 to-amber-500' }
}

export const CONDITIONS = {
    new: 'New',
    like_new: 'Like New',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair'
}

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    PROFILE: '/profile',
    CATEGORIES: '/categories',
    CATEGORY: '/category/:id',
    PRODUCT: '/product/:id',
    CREATE_LISTING: '/create-listing',
    SELLER_SETUP: '/seller/setup'
}