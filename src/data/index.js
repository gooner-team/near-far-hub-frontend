export const CATEGORIES_DATA = [
    { id: 'electronics', name: 'Electronics', icon: 'Smartphone' },
    { id: 'vehicles', name: 'Vehicles', icon: 'Car' },
    { id: 'real-estate', name: 'Real Estate', icon: 'Home' },
    { id: 'fashion', name: 'Fashion', icon: 'Shirt' },
    { id: 'home-garden', name: 'Home & Garden', icon: 'Sofa' },
    { id: 'services', name: 'Services', icon: 'Wrench' }
]

// Mock data for development
export const MOCK_LISTINGS = [
    {
        id: 1,
        title: 'MacBook Pro 16" 2023',
        price: 2500,
        formattedPrice: '€2,500.00',
        categoryLabel: 'Electronics',
        mainImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=300&fit=crop',
        locationString: 'Riga, Latvia',
        seller: { businessName: 'Tech Store', verified: true },
        viewsCount: 124,
        requiresAppointment: false,
        canDeliverGlobally: true,
        isNew: true
    },
    {
        id: 2,
        title: 'Vintage Camera Collection',
        price: 450,
        formattedPrice: '€450.00',
        categoryLabel: 'Photography',
        mainImage: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=300&fit=crop',
        locationString: 'Tallinn, Estonia',
        seller: { businessName: 'Camera Shop', verified: false },
        viewsCount: 67,
        requiresAppointment: true,
        canDeliverGlobally: false,
        isNew: false
    }
]