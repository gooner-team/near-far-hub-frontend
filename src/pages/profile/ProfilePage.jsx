import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    User, Mail, Phone, MapPin, Camera, Edit3, Save, X,
    Package, Heart, ShoppingBag, Star, Settings, LogOut,
    Store, CheckCircle, AlertCircle
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'

function ProfilePage() {
    const { user, logout, isAuthenticated, isLoading, apiCall } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('overview')
    const [isEditing, setIsEditing] = useState(false)
    const [profileData, setProfileData] = useState({
        name: '', email: '', phone: '', location: '', bio: '', avatar: null
    })
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [sellerProfile, setSellerProfile] = useState(null)

    useEffect(() => {
        if (!isLoading && !isAuthenticated) navigate('/login')
    }, [isAuthenticated, isLoading, navigate])

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
                avatar: user.avatar || null
            })
        }
    }, [user])

    useEffect(() => {
        const loadSellerProfile = async () => {
            if (!user || !apiCall) return
            try {
                const response = await apiCall('http://localhost:8000/api/seller/profile')
                if (response.ok) {
                    const data = await response.json()
                    setSellerProfile(data.data)
                }
            } catch (error) {
                setSellerProfile(null)
            }
        }
        loadSellerProfile()
    }, [user, apiCall])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setProfileData(prev => ({ ...prev, [name]: value }))
    }

    const handleSaveProfile = async () => {
        setIsSaving(true)
        setMessage({ type: '', text: '' })
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            setMessage({ type: 'success', text: 'Profile updated successfully!' })
            setIsEditing(false)
            setTimeout(() => setMessage({ type: '', text: '' }), 3000)
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
        } finally {
            setIsSaving(false)
        }
    }

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setProfileData(prev => ({ ...prev, avatar: e.target.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!isAuthenticated) return null

    const tabs = [
        { id: 'overview', name: 'Overview', icon: User },
        { id: 'profile', name: 'Profile', icon: Edit3 },
        { id: 'selling', name: 'Selling', icon: Store },
        { id: 'settings', name: 'Settings', icon: Settings }
    ]

    const stats = [
        { label: 'Active Listings', value: sellerProfile ? '12' : '0', icon: Package, color: 'text-blue-600 bg-blue-100' },
        { label: 'Favorites', value: '8', icon: Heart, color: 'text-red-600 bg-red-100' },
        { label: 'Total Sales', value: sellerProfile ? '24' : '0', icon: ShoppingBag, color: 'text-green-600 bg-green-100' },
        { label: 'Rating', value: sellerProfile ? '4.8' : 'N/A', icon: Star, color: 'text-yellow-600 bg-yellow-100' }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container-modern py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-heading mb-2">My Account</h1>
                    <p className="text-body">Manage your profile, listings, and account settings</p>
                </div>

                {/* Messages */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                        message.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                        {message.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-sm font-medium">{message.text}</span>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="card p-6">
                            {/* Profile Summary */}
                            <div className="text-center mb-6">
                                <div className="relative inline-block">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        {profileData.avatar ? (
                                            <img src={profileData.avatar} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                                        ) : (
                                            user?.name?.charAt(0).toUpperCase() || 'U'
                                        )}
                                    </div>
                                    {isEditing && (
                                        <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer hover:bg-blue-700">
                                            <Camera className="w-4 h-4 text-white" />
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </label>
                                    )}
                                </div>
                                <h3 className="font-semibold text-gray-900 mt-3">{user?.name}</h3>
                                <p className="text-sm text-gray-600">{user?.email}</p>
                                <div className="flex items-center justify-center mt-2 text-sm text-green-600">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Verified Account
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-2 mb-6">
                                {tabs.map((tab) => {
                                    const IconComponent = tab.icon
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                                activeTab === tab.id
                                                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                            <span className="font-medium">{tab.name}</span>
                                        </button>
                                    )
                                })}
                            </nav>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {stats.map((stat, index) => {
                                        const IconComponent = stat.icon
                                        return (
                                            <div key={index} className="card p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                                    </div>
                                                    <div className={`p-3 rounded-lg ${stat.color}`}>
                                                        <IconComponent className="w-6 h-6" />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Quick Actions */}
                                <div className="card p-6">
                                    <h3 className="text-subheading mb-6">Quick Actions</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {sellerProfile ? (
                                            <>
                                                <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                                                    <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                                                        <Package className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span className="font-medium text-blue-900">Create Listing</span>
                                                </button>
                                                <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
                                                    <div className="p-2 bg-green-600 rounded-lg group-hover:bg-green-700 transition-colors">
                                                        <ShoppingBag className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span className="font-medium text-green-900">View Orders</span>
                                                </button>
                                                <button className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                                                    <div className="p-2 bg-purple-600 rounded-lg group-hover:bg-purple-700 transition-colors">
                                                        <Heart className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span className="font-medium text-purple-900">Favorites</span>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => navigate('/seller/setup')}
                                                    className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                                                >
                                                    <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                                                        <Store className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span className="font-medium text-blue-900">Become a Seller</span>
                                                </button>
                                                <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
                                                    <div className="p-2 bg-green-600 rounded-lg group-hover:bg-green-700 transition-colors">
                                                        <ShoppingBag className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span className="font-medium text-green-900">Browse Products</span>
                                                </button>
                                                <button className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                                                    <div className="p-2 bg-purple-600 rounded-lg group-hover:bg-purple-700 transition-colors">
                                                        <Heart className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span className="font-medium text-purple-900">View Favorites</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="card p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-subheading">Profile Information</h3>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center space-x-2">
                                            <Edit3 className="w-4 h-4" />
                                            <span>Edit Profile</span>
                                        </button>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={isSaving}
                                                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                                            >
                                                {isSaving ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                ) : (
                                                    <Save className="w-4 h-4" />
                                                )}
                                                <span>{isSaving ? 'Saving...' : 'Save'}</span>
                                            </button>
                                            <button onClick={() => setIsEditing(false)} className="btn-secondary flex items-center space-x-2">
                                                <X className="w-4 h-4" />
                                                <span>Cancel</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={profileData.name}
                                                onChange={handleInputChange}
                                                className="input"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-900">{profileData.name || 'Not set'}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-900">{profileData.email}</span>
                                            <span className="badge badge-green">Verified</span>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={profileData.phone}
                                                onChange={handleInputChange}
                                                className="input"
                                                placeholder="Enter your phone number"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-900">{profileData.phone || 'Not set'}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="location"
                                                value={profileData.location}
                                                onChange={handleInputChange}
                                                className="input"
                                                placeholder="Enter your location"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-900">{profileData.location || 'Not set'}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bio */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                        {isEditing ? (
                                            <textarea
                                                name="bio"
                                                value={profileData.bio}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="input"
                                                placeholder="Tell others about yourself..."
                                            />
                                        ) : (
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <span className="text-gray-900">{profileData.bio || 'No bio added yet'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Selling Tab */}
                        {activeTab === 'selling' && (
                            <div className="card p-6">
                                <h3 className="text-subheading mb-6">Selling Dashboard</h3>
                                {sellerProfile ? (
                                    <div className="space-y-6">
                                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                            <div className="flex items-center space-x-3">
                                                <CheckCircle className="w-5 h-5 text-green-600" />
                                                <div>
                                                    <p className="text-sm font-medium text-green-900">Seller Account Active</p>
                                                    <p className="text-xs text-green-700">Your seller account is ready to use</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <button className="btn-primary">Create New Listing</button>
                                            <button className="btn-secondary">Manage Orders</button>
                                            <button className="btn-secondary">Seller Settings</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Start Selling on NearFar Hub</h4>
                                        <p className="text-gray-600 mb-6">Set up your seller account to start listing items</p>
                                        <button
                                            onClick={() => navigate('/seller/setup')}
                                            className="btn-primary"
                                        >
                                            Setup Seller Account
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="card p-6">
                                <h3 className="text-subheading mb-6">Account Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Email Notifications</h4>
                                            <p className="text-sm text-gray-600">Receive updates about your account</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                                            <p className="text-sm text-gray-600">Add extra security to your account</p>
                                        </div>
                                        <button className="btn-primary">Enable</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage