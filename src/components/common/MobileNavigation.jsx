import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Heart, ShoppingBag, User, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

function MobileNavigation() {
    const location = useLocation()
    const { isAuthenticated } = useAuth()

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/'
        }
        return location.pathname.startsWith(path)
    }

    const navItems = [
        {
            path: '/',
            icon: Home,
            label: 'Home',
            requireAuth: false
        },
        {
            path: '/categories',
            icon: Search,
            label: 'Search',
            requireAuth: false
        },
        {
            path: '/favorites',
            icon: Heart,
            label: 'Favorites',
            requireAuth: true
        },
        {
            path: '/cart',
            icon: ShoppingBag,
            label: 'Cart',
            requireAuth: false
        },
        {
            path: isAuthenticated ? '/profile' : '/login',
            icon: User,
            label: isAuthenticated ? 'Profile' : 'Login',
            requireAuth: false
        }
    ]

    // Don't show on login/register pages
    if (['/login', '/register', '/forgot-password'].includes(location.pathname)) {
        return null
    }

    return (
        <>
            {/* Spacer to prevent content from being hidden behind nav */}
            <div className="h-16 md:hidden" />

            {/* Mobile Navigation Bar */}
            <nav className="mobile-nav safe-bottom">
                <div className="flex">
                    {navItems.map((item, index) => {
                        const IconComponent = item.icon
                        const active = isActive(item.path)

                        // Don't show auth-required items if not authenticated
                        if (item.requireAuth && !isAuthenticated) {
                            return <div key={index} className="mobile-nav-item" />
                        }

                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className={`mobile-nav-item ${active ? 'active' : ''}`}
                            >
                                <IconComponent className="w-5 h-5 mb-1" />
                                <span>{item.label}</span>
                                {/* Active indicator */}
                                {active && (
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Floating Action Button for Sell (if authenticated and has sell permissions) */}
            {isAuthenticated && (
                <Link
                    to="/sell"
                    className="fab"
                    title="Start Selling"
                >
                    <Plus className="w-6 h-6" />
                </Link>
            )}
        </>
    )
}

export default MobileNavigation