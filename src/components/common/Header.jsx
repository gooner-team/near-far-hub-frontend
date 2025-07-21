import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Search, Menu, X, User, Heart, ShoppingBag, MapPin, Globe,
    LogOut, Crown, Shield, Star, Bell, Settings
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import ThemeToggle from '../common/ThemeToggle'

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
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
        navigate('/')
    }

    const getRoleIcon = (roleName) => {
        const icons = {
            admin: <Crown className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />,
            moderator: <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
            seller: <Star className="w-4 h-4 text-green-600 dark:text-green-400" />,
            default: <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        }
        return icons[roleName] || icons.default
    }

    const getRoleBadgeColor = (roleName) => {
        const colors = {
            admin: 'badge-yellow',
            moderator: 'badge-blue',
            seller: 'badge-green',
            default: 'badge-gray'
        }
        return `badge ${colors[roleName] || colors.default}`
    }

    return (
        <>
            <header className="bg-white dark:bg-slate-900 shadow-lg dark:shadow-dark-medium border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50 transition-all duration-300">
                {/* Top Bar - Desktop Only */}
                <div className="bg-gray-900 dark:bg-slate-800 text-white desktop-only">
                    <div className="container-modern">
                        <div className="flex justify-between items-center py-2 text-sm">
                            <div className="flex items-center space-x-3">
                                <span className="text-gray-300 dark:text-slate-400">Welcome to NearFar Hub</span>
                                <button
                                    onClick={() => setIsGlobalMode(!isGlobalMode)}
                                    className="flex items-center space-x-1 px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    {isGlobalMode ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                    <span>{isGlobalMode ? 'Global' : 'Local'}</span>
                                </button>
                            </div>

                            <div className="flex items-center space-x-4">
                                <Link to="/help" className="hover:text-blue-300 dark:hover:text-blue-400 transition-colors font-medium">
                                    Help
                                </Link>
                                <ThemeToggle size="sm" showLabel={false} />
                                {isAuthenticated && user ? (
                                    <div className="flex items-center space-x-3">
                                        <span className="text-blue-300 dark:text-blue-400 font-medium">Hi, {user.name}!</span>
                                        <div className={getRoleBadgeColor(user.role?.name)}>
                                            {getRoleIcon(user.role?.name)}
                                            <span className="ml-1">{user.role?.displayName || 'Buyer'}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <Link to="/login" className="hover:text-blue-300 dark:hover:text-blue-400 transition-colors font-medium">
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Header */}
                <div className="container-mobile bg-white dark:bg-slate-900 transition-all duration-300">
                    <div className="flex items-center justify-between h-14 md:h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <span className="text-white font-bold text-sm md:text-xl">NF</span>
                            </div>
                            <span className="text-lg md:text-xl font-bold text-gradient hidden sm:inline">
                                NearFar Hub
                            </span>
                        </Link>

                        {/* Desktop Search */}
                        <div className="flex-1 max-w-2xl mx-8 desktop-only">
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products, services..."
                                    className="input pl-12 pr-20 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-slate-100"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary py-2">
                                    Search
                                </button>
                            </form>
                        </div>

                        {/* Navigation Icons */}
                        <div className="flex items-center space-x-1 md:space-x-2">
                            {/* Mobile Search Toggle */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="btn-icon mobile-only text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Theme Toggle - Mobile */}
                            <div className="mobile-only">
                                <ThemeToggle showLabel={false} size="sm" />
                            </div>

                            {/* Notifications */}
                            {isAuthenticated && (
                                <button className="btn-icon relative text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-2 h-2 md:w-4 md:h-4 flex items-center justify-center md:text-[10px] animate-pulse">
                                        <span className="hidden md:inline">3</span>
                                    </span>
                                </button>
                            )}

                            {/* Heart */}
                            <Link to="/favorites" className="btn-icon desktop-only text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100">
                                <Heart className="w-5 h-5" />
                            </Link>

                            {/* Cart */}
                            <Link to="/cart" className="btn-icon relative text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100">
                                <ShoppingBag className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center md:w-5 md:h-5 md:text-[10px] font-semibold">
                                    2
                                </span>
                            </Link>

                            {/* User Actions */}
                            {!isLoading && (
                                isAuthenticated ? (
                                    <div className="flex items-center space-x-1 md:space-x-2">
                                        <Link to="/profile" className="btn-icon desktop-only text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100">
                                            <User className="w-5 h-5" />
                                        </Link>
                                        <button onClick={handleLogout} className="btn-icon text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 desktop-only">
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <Link to="/login" className="btn-primary text-sm md:text-base">
                                        Sign In
                                    </Link>
                                )
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="btn-icon mobile-only text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100"
                            >
                                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {isSearchOpen && (
                    <div className="mobile-search border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-all duration-300">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products, services..."
                                className="input pl-12 pr-20 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-slate-100"
                                autoFocus
                            />
                            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary py-2 text-sm">
                                Search
                            </button>
                        </form>
                    </div>
                )}
            </header>

            {/* Mobile Drawer */}
            {isMenuOpen && (
                <div className="mobile-drawer">
                    <div
                        className="mobile-drawer-backdrop opacity-100"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="mobile-drawer-content translate-x-0 bg-white dark:bg-slate-900 shadow-2xl">
                        <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 dark:text-slate-100">Menu</h3>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="btn-icon text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
                            {/* User Info */}
                            {isAuthenticated && user && (
                                <div className="pb-4 border-b border-gray-200 dark:border-slate-700">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-slate-100">{user.name}</p>
                                            <div className={getRoleBadgeColor(user.role?.name)}>
                                                {getRoleIcon(user.role?.name)}
                                                <span className="ml-1">{user.role?.displayName || 'Buyer'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Links */}
                            <div className="space-y-2">
                                <Link
                                    to="/categories"
                                    className="block px-3 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-300 font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Categories
                                </Link>
                                <Link
                                    to="/favorites"
                                    className="block px-3 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-300 font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Favorites
                                </Link>
                                <Link
                                    to="/help"
                                    className="block px-3 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-300 font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Help Center
                                </Link>

                                {/* Mode Toggle */}
                                <div className="px-3 py-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700 dark:text-slate-300 font-medium">Browse Mode</span>
                                        <button
                                            onClick={() => setIsGlobalMode(!isGlobalMode)}
                                            className="flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                                        >
                                            {isGlobalMode ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                            <span className="text-sm font-medium">{isGlobalMode ? 'Global' : 'Local'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Theme Toggle */}
                                <div className="px-3 py-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700 dark:text-slate-300 font-medium">Theme</span>
                                        <ThemeToggle showLabel={true} size="sm" />
                                    </div>
                                </div>
                            </div>

                            {/* Auth Actions */}
                            <div className="pt-4 border-t border-gray-200 dark:border-slate-700 space-y-2">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            className="block px-3 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-300 font-medium"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <User className="w-5 h-5" />
                                                <span>Profile</span>
                                            </div>
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="block px-3 py-3 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-300 font-medium"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Settings className="w-5 h-5" />
                                                <span>Settings</span>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-3 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 font-medium"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <LogOut className="w-5 h-5" />
                                                <span>Sign Out</span>
                                            </div>
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="block px-3 py-3 btn-primary text-center rounded-lg font-semibold"
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