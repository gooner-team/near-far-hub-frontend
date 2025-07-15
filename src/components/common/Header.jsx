import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {Search, Menu, X, User, Heart, ShoppingBag, MapPin, Globe, LogOut} from 'lucide-react'
import {useAuth} from '../../contexts/AuthContext'

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isGlobalMode, setIsGlobalMode] = useState(false)
    const navigate = useNavigate()
    const {user, isAuthenticated, logout, isLoading} = useAuth()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    const toggleMode = () => {
        setIsGlobalMode(!isGlobalMode)
    }

    const handleLogout = async () => {
        await logout()
        setIsMenuOpen(false)
        navigate('/')
    }

    const handleProfileClick = () => {
        setIsMenuOpen(false)
        navigate('/profile')
    }

    const handleLoginClick = () => {
        setIsMenuOpen(false)
        navigate('/login')
    }

    return (
        <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-gray-900 text-white py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-4">
                            <span>Welcome to NearFar Hub</span>
                            <button
                                onClick={toggleMode}
                                className="flex items-center space-x-1 px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                {isGlobalMode ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                <span>{isGlobalMode ? 'Global' : 'Local'}</span>
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/help" className="hover:text-blue-300 transition-colors">Help</Link>
                            <Link to="/sell" className="hover:text-blue-300 transition-colors">Sell</Link>
                            {isAuthenticated && user && (
                                <span className="text-blue-300">
                                    Hello, {user.name}!
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div
                            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">NF</span>
                        </div>
                        <span
                            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            NearFar Hub
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-8">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for products, services, or anything..."
                                className="w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Search
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Navigation Icons */}
                    <div className="flex items-center space-x-4">
                        <Link to="/favorites" className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Heart className="w-6 h-6"/>
                        </Link>
                        <Link to="/cart" className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative">
                            <ShoppingBag className="w-6 h-6"/>
                            <span
                                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                2
                            </span>
                        </Link>

                        {!isLoading && (
                            isAuthenticated ? (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleProfileClick}
                                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                        title="Profile"
                                    >
                                        <User className="w-6 h-6"/>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut className="w-6 h-6"/>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleLoginClick}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Sign In
                                </button>
                            )
                        )}

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 py-2 space-y-2">
                        <Link
                            to="/categories"
                            className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Categories
                        </Link>
                        <Link
                            to="/favorites"
                            className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Favorites
                        </Link>
                        <Link
                            to="/cart"
                            className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Cart
                        </Link>

                        {!isLoading && (
                            isAuthenticated ? (
                                <>
                                    <button
                                        onClick={handleProfileClick}
                                        className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleLoginClick}
                                    className="block w-full text-center px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                    Sign In
                                </button>
                            )
                        )}

                        <Link
                            to="/sell"
                            className="block px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors text-center"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Start Selling
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header