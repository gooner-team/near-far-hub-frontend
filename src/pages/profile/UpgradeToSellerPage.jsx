import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Crown, Shield, Check, X, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'

function UpgradeToSellerPage() {
    const [isUpgrading, setIsUpgrading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()
    const { user, apiCall, getCurrentUser } = useAuth()

    const handleUpgrade = async () => {
        setIsUpgrading(true)
        setError('')
        setSuccess('')

        try {
            const response = await apiCall('http://localhost:8000/api/roles/upgrade-to-seller', {
                method: 'POST',
            })

            if (response.ok) {
                const data = await response.json()
                setSuccess('Successfully upgraded to seller account!')

                // Refresh user data
                await getCurrentUser()

                // Redirect to seller dashboard after a short delay
                setTimeout(() => {
                    navigate('/seller/dashboard')
                }, 2000)
            } else {
                const errorData = await response.json()
                setError(errorData.message || 'Failed to upgrade account')
            }
        } catch (error) {
            setError('Network error. Please try again.')
        } finally {
            setIsUpgrading(false)
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Please log in to upgrade your account.</p>
                </div>
            </div>
        )
    }

    if (user.role?.name !== 'buyer') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-4">
                        {user.role?.name === 'seller' && <Star className="w-16 h-16 text-green-500 mx-auto" />}
                        {user.role?.name === 'admin' && <Crown className="w-16 h-16 text-yellow-500 mx-auto" />}
                        {user.role?.name === 'moderator' && <Shield className="w-16 h-16 text-blue-500 mx-auto" />}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        You're already a {user.role?.displayName}!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        You already have {user.role?.name === 'seller' ? 'selling' : 'elevated'} privileges.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Go to Homepage
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                            <Star className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Upgrade to Seller Account
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Unlock the power to sell your products and services on NearFar Hub.
                        Reach customers locally and globally with our comprehensive seller tools.
                    </p>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-green-800 font-medium">{success}</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center">
                            <X className="w-5 h-5 text-red-500 mr-3" />
                            <span className="text-red-800 font-medium">{error}</span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Benefits */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            What You'll Get
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <Check className="w-5 h-5 text-green-500 mr-3 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Create Unlimited Listings</h3>
                                    <p className="text-gray-600 text-sm">Post as many products and services as you want</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Check className="w-5 h-5 text-green-500 mr-3 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Seller Dashboard</h3>
                                    <p className="text-gray-600 text-sm">Comprehensive analytics and management tools</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Check className="w-5 h-5 text-green-500 mr-3 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Global Reach</h3>
                                    <p className="text-gray-600 text-sm">Sell locally and ship worldwide</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Check className="w-5 h-5 text-green-500 mr-3 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Appointment Booking</h3>
                                    <p className="text-gray-600 text-sm">Let customers schedule viewing appointments</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Check className="w-5 h-5 text-green-500 mr-3 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Direct Messaging</h3>
                                    <p className="text-gray-600 text-sm">Communicate directly with potential buyers</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Check className="w-5 h-5 text-green-500 mr-3 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-gray-900">Sales Analytics</h3>
                                    <p className="text-gray-600 text-sm">Track your performance and optimize sales</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upgrade Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Ready to Start Selling?
                        </h2>

                        <div className="mb-6">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Current Role</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {user.role?.displayName || 'Buyer'}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-8 h-8 text-gray-400" />
                                    <div>
                                        <p className="text-gray-600 text-sm">Upgrade To</p>
                                        <p className="text-lg font-semibold text-green-600">
                                            Seller
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <h3 className="font-semibold text-blue-900 mb-2">Special Launch Offer!</h3>
                                <p className="text-blue-800 text-sm">
                                    Upgrade to seller account for <strong>FREE</strong> during our launch period.
                                    Start selling today with no upfront costs!
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleUpgrade}
                                disabled={isUpgrading}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                            >
                                {isUpgrading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Upgrading Account...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <Star className="w-5 h-5 mr-2" />
                                        Upgrade to Seller - FREE
                                    </div>
                                )}
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
                            >
                                Maybe Later
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                By upgrading, you agree to our{' '}
                                <a href="/terms" className="text-blue-600 hover:text-blue-500">
                                    Seller Terms of Service
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Frequently Asked Questions
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Is the upgrade really free?</h3>
                            <p className="text-gray-600 text-sm">
                                Yes! During our launch period, seller upgrades are completely free.
                                We may introduce fees later, but early adopters get lifetime free access.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Can I sell both locally and globally?</h3>
                            <p className="text-gray-600 text-sm">
                                Absolutely! Our platform supports both local pickup and global shipping.
                                You can choose your preferred selling methods for each listing.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you support?</h3>
                            <p className="text-gray-600 text-sm">
                                We support all major payment methods including credit cards, PayPal,
                                bank transfers, and local payment options in your region.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Can I still buy items as a seller?</h3>
                            <p className="text-gray-600 text-sm">
                                Yes! Sellers maintain all buyer privileges. You can continue to
                                purchase items while also selling your own products.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpgradeToSellerPage