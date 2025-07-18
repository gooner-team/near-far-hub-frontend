import {
    User, Edit3, Store, Settings, LogOut, CheckCircle, Camera
} from 'lucide-react'

const iconMap = {
    User, Edit3, Store, Settings
}

export const ProfileSidebar = ({
                                   user,
                                   sellerProfile,
                                   tabs,
                                   activeTab,
                                   onTabChange,
                                   onLogout
                               }) => (
    <div className="lg:w-1/4">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="text-center mb-6">
                <div className="relative inline-block">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover"
                            />
                        ) : (
                            user?.name?.charAt(0).toUpperCase() || 'U'
                        )}
                    </div>
                </div>
                <h3 className="font-semibold text-gray-900 mt-3">{user?.name}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <div className="flex items-center justify-center mt-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified Account
                </div>
                {sellerProfile && (
                    <div className="flex items-center justify-center mt-1 text-sm text-blue-600">
                        <Store className="w-4 h-4 mr-1" />
                        Seller Account
                    </div>
                )}
            </div>

            <nav className="space-y-2">
                {tabs.map((tab) => {
                    const IconComponent = iconMap[tab.icon] || User
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
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

            <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </div>
    </div>
)