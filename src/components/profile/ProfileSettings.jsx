import { Bell, Shield, CreditCard } from 'lucide-react'

export const ProfileSettings = () => {
    const SettingItem = ({ icon: Icon, title, description, action, actionType = 'toggle' }) => (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-gray-600" />
                <div>
                    <h4 className="font-medium text-gray-900">{title}</h4>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
            {actionType === 'toggle' ? (
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
            ) : (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    {action}
                </button>
            )}
        </div>
    )

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h3>
            <div className="space-y-6">
                <SettingItem
                    icon={Bell}
                    title="Email Notifications"
                    description="Receive updates about your listings and messages"
                />
                <SettingItem
                    icon={Shield}
                    title="Two-Factor Authentication"
                    description="Add an extra layer of security to your account"
                    action="Enable"
                    actionType="button"
                />
                <SettingItem
                    icon={CreditCard}
                    title="Payment Methods"
                    description="Manage your payment methods for selling"
                    action="Manage"
                    actionType="button"
                />
            </div>
        </div>
    )
}
