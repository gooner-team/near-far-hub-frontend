import {
    Package, Heart, ShoppingBag, Star, User, Store,
    Calendar, Mail
} from 'lucide-react'

export const ProfileOverview = ({ user, sellerProfile, navigate }) => {
    const stats = [
        { label: 'Active Listings', value: sellerProfile ? '12' : '0', icon: Package, color: 'text-blue-600 bg-blue-100' },
        { label: 'Favorites', value: '8', icon: Heart, color: 'text-red-600 bg-red-100' },
        { label: 'Total Sales', value: sellerProfile ? '24' : '0', icon: ShoppingBag, color: 'text-green-600 bg-green-100' },
        { label: 'Rating', value: sellerProfile ? '4.8' : 'N/A', icon: Star, color: 'text-yellow-600 bg-yellow-100' }
    ]

    const getRecentActivity = () =>
        sellerProfile ? [
            { action: 'Listed new item', item: 'MacBook Pro 16"', time: '2 hours ago', type: 'listing', icon: Package },
            { action: 'Received message about', item: 'Vintage Camera', time: '1 day ago', type: 'message', icon: Mail },
            { action: 'Sold item', item: 'Gaming Chair', time: '3 days ago', type: 'sale', icon: ShoppingBag }
        ] : [
            { action: 'Account created', item: 'Welcome to NearFar Hub!', time: 'Today', type: 'account', icon: User }
        ]

    const getQuickActions = () =>
        sellerProfile ? [
            { label: 'Create Listing', icon: Package, color: 'blue', onClick: () => navigate('/create-listing') },
            { label: 'Appointments', icon: Calendar, color: 'green' },
            { label: 'View Favorites', icon: Heart, color: 'purple' }
        ] : [
            { label: 'Become a Seller', icon: Store, color: 'blue', onClick: () => navigate('/seller/setup') },
            { label: 'Browse Products', icon: ShoppingBag, color: 'green', onClick: () => navigate('/categories') },
            { label: 'View Favorites', icon: Heart, color: 'purple' }
        ]

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon
                    return (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.color}`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                    {getRecentActivity().map((activity, index) => {
                        const IconComponent = activity.icon
                        const colorMap = {
                            listing: 'bg-blue-100 text-blue-600',
                            message: 'bg-yellow-100 text-yellow-600',
                            sale: 'bg-green-100 text-green-600',
                            account: 'bg-purple-100 text-purple-600'
                        }

                        return (
                            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                <div className={`p-2 rounded-lg ${colorMap[activity.type]}`}>
                                    <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900">
                                        {activity.action} <span className="font-medium">{activity.item}</span>
                                    </p>
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getQuickActions().map((action, index) => {
                        const IconComponent = action.icon
                        const colorMap = {
                            blue: 'bg-blue-50 hover:bg-blue-100 text-blue-900',
                            green: 'bg-green-50 hover:bg-green-100 text-green-900',
                            purple: 'bg-purple-50 hover:bg-purple-100 text-purple-900'
                        }

                        return (
                            <button
                                key={index}
                                onClick={action.onClick}
                                className={`flex items-center space-x-3 p-4 rounded-xl transition-colors group ${colorMap[action.color]}`}
                            >
                                <div className={`p-2 bg-${action.color}-600 rounded-lg group-hover:bg-${action.color}-700 transition-colors`}>
                                    <IconComponent className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-medium">{action.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
