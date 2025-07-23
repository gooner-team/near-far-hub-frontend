import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Search, Menu, X, User, Heart, ShoppingBag, MapPin, Globe,
    LogOut, Crown, Shield, Star, Bell, Settings, ChevronDown
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import ThemeToggle from '../common/ThemeToggle'

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isGlobalMode, setIsGlobalMode] = useState(false)
    const navigate = useNavigate()
    const { user, isAuthenticated, logout, isLoading } = useAuth()
    const { isDark } = useTheme()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
            setIsSearchOpen(false)
        }
    }

    const handleLogout = async () => {
        await logout()
        setIsMenuOpen(false)
        setIsProfileOpen(false)
        navigate('/')
    }

    const getRoleConfig = (roleName) => {
        const configs = {
            admin: { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' },
            moderator: { icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
            seller: { icon: Star, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
            default: { icon: User, color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-800', border: 'border-gray-200 dark:border-gray-700' }
        }
        return configs[roleName] || configs.default
    }

    const roleConfig = getRoleConfig(user?.role?.name)

    return (
        <>
            <header className="glass sticky top-0 z-50 border-b border-white/10">
                {/* Top Bar - Desktop Only */}
                <div className="hidden lg:block border-b border-white/5">
                    <div className="container-modern">
                        <div className="flex justify-between items-center py-2 text-sm">
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-600 dark:text-gray-300">
                                    Welcome to NearFar Hub
                                </span>
                                <button
                                    onClick={() => setIsGlobalMode(!isGlobalMode)}
                                    className={`
                                        flex items-center space-x-2 px-3 py-1.5 rounded-full
                                        transition-all duration-300 transform hover:scale-105
                                        ${isGlobalMode
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }
                                    `}
                                >
                                    {isGlobalMode ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                    <span className="font-medium">
                                        {isGlobalMode ? 'Global' : 'Local'}
                                    </span>
                                </button>
                            </div>

                            <div className="flex items-center space-x-6">
                                <Link
                                    to="/help"
                                    className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium"
                                >
                                    Help
                                </Link>

                                <ThemeToggle size="sm" showLabel={false} variant="minimal" />

                                {isAuthenticated && user ? (
                                    <div className="flex items-center space-x-3">
                                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                                            Hi, {user.name}!
                                        </span>
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${roleConfig.bg} ${roleConfig.border}`}>
                                            <roleConfig.icon className={`w-3 h-3 mr-1 ${roleConfig.color}`} />
                                            <span className={roleConfig.color}>
                                                {user.role?.displayName || 'Buyer'}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Header */}
                <div className="container-mobile">
                    <div className="flex items-center justify-between h-16 md:h-18">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="relative">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                                    <span className="text-white font-bold text-lg md:text-xl">NF</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                            </div>
                            <span className="text-xl md:text-2xl font-bold text-gradient hidden sm:inline">
                                NearFar Hub
                            </span>
                        </Link>

                        {/* Desktop Search */}
                        <div className="flex-1 max-w-2xl mx-8 hidden lg:block">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                                    <div className="flex items-center">
                                        <Search className="absolute left-4 w-5 h-5 text-gray-400 z-10" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search products, services..."
                                            className="w-full pl-12 pr-32 py-4 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Navigation Icons */}
                        <div className="flex items-center space-x-2">
                            {/* Mobile Search Toggle */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="lg:hidden btn-icon hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Theme Toggle - Mobile */}
                            <div className="lg:hidden">
                                <ThemeToggle showLabel={false} size="sm" variant="minimal" />
                            </div>

                            {/* Notifications */}
                            {isAuthenticated && (
                                <button className="btn-icon relative hover:bg-gray-100 dark:hover:bg-gray-800">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                                        3
                                    </span>
                                </button>
                            )}

                            {/* Favorites - Desktop */}
                            <Link
                                to="/favorites"
                                className="hidden lg:flex btn-icon hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <Heart className="w-5 h-5" />
                            </Link>

                            {/* Cart */}
                            <Link to="/cart" className="btn-icon relative hover:bg-gray-100 dark:hover:bg-gray-800">
                                <ShoppingBag className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                    2
                                </span>
                            </Link>

                            {/* User Actions */}
                            {!isLoading && (
                                isAuthenticated ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="hidden lg:flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                        </button>

                                        {/* Profile Dropdown */}
                                        {isProfileOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setIsProfileOpen(false)}
                                                />
                                                <div className="absolute right-0 mt-2 w-64 glass rounded-2xl border border-white/10 shadow-2xl z-20">
                                                    <div className="p-4 border-b border-white/10">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                                    {user?.name}
                                                                </p>
                                                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleConfig.bg} ${roleConfig.border}`}>
                                                                    <roleConfig.icon className={`w-3 h-3 mr-1 ${roleConfig.color}`} />
                                                                    <span className={roleConfig.color}>
                                                                        {user?.role?.displayName || 'Buyer'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-2">
                                                        <Link
                                                            to="/profile"
                                                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                                                            onClick={() => setIsProfileOpen(false)}
                                                        >
                                                            <User className="w-4 h-4" />
                                                            <span>Profile</span>
                                                        </Link>
                                                        <Link
                                                            to="/settings"
                                                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                                                            onClick={() => setIsProfileOpen(false)}
                                                        >
                                                            <Settings className="w-4 h-4" />
                                                            <span>Settings</span>
                                                        </Link>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                                                        >
                                                            <LogOut className="w-4 h-4" />
                                                            <span>Sign Out</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <Link to="/login" className="btn-primary text-sm">
                                        Sign In
                                    </Link>
                                )
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden btn-icon hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {isSearchOpen && (
                    <div className="lg:hidden border-t border-white/10 backdrop-blur-xl">
                        <div className="container-mobile py-4">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="glass rounded-2xl border border-white/10">
                                    <div className="flex items-center">
                                        <Search className="absolute left-4 w-5 h-5 text-gray-400 z-10" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search products, services..."
                                            className="w-full pl-12 pr-24 py-4 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                                            autoFocus
                                        />
                                        <button
                                            type="submit"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium text-sm"
                                        >
                                            Go
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile Drawer */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="fixed inset-y-0 right-0 w-80 glass border-l border-white/10 shadow-2xl transform transition-transform duration-500">
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Menu</h3>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="btn-icon hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {/* User Info */}
                                {isAuthenticated && user && (
                                    <div className="mb-6 p-4 glass rounded-2xl border border-white/10">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {user.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleConfig.bg} ${roleConfig.border}`}>
                                                    <roleConfig.icon className={`w-3 h-3 mr-1 ${roleConfig.color}`} />
                                                    <span className={roleConfig.color}>
                                                        {user.role?.displayName || 'Buyer'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Links */}
                                <nav className="space-y-2">
                                    {[
                                        { to: "/categories", label: "Categories" },
                                        { to: "/favorites", label: "Favorites" },
                                        { to: "/help", label: "Help Center" }
                                    ].map((link) => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}

                                    {/* Mode Toggle */}
                                    <div className="px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-700 dark:text-gray-300 font-medium">Browse Mode</span>
                                            <button
                                                onClick={() => setIsGlobalMode(!isGlobalMode)}
                                                className={`
                                                    flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium
                                                    transition-all duration-300 transform hover:scale-105
                                                    ${isGlobalMode
                                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                }
                                                `}
                                            >
                                                {isGlobalMode ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                                <span>{isGlobalMode ? 'Global' : 'Local'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Theme Toggle */}
                                    <div className="px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-700 dark:text-gray-300 font-medium">Theme</span>
                                            <ThemeToggle showLabel={true} size="sm" variant="minimal" />
                                        </div>
                                    </div>
                                </nav>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-white/10 space-y-2">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <User className="w-5 h-5" />
                                            <span>Profile</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium w-full"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>Sign Out</span>
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="btn-primary w-full text-center"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header