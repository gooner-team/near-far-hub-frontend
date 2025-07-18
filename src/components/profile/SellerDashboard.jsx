import { Store } from 'lucide-react'
import SellerListingsDashboard from '../seller/SellerListingsDashboard'

export const SellerDashboard = ({ sellerProfile, loadingSellerProfile, navigate }) => {
    if (loadingSellerProfile) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading seller profile...</p>
                </div>
            </div>
        )
    }

    return sellerProfile ? (
        <SellerListingsDashboard />
    ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="text-center py-12">
                <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Start Selling on NearFar Hub</h4>
                <p className="text-gray-600 mb-6">Set up your seller account to start listing and selling items</p>
                <button
                    onClick={() => navigate('/seller/setup')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                    Setup Seller Account
                </button>
            </div>
        </div>
    )
}