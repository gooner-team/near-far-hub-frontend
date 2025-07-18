import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Edit3, Save, X } from 'lucide-react'

export const ProfileEdit = ({ user, showMessage }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        avatar: null
    })

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

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setProfileData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            showMessage('success', 'Profile updated successfully!')
            setIsEditing(false)
        } catch (error) {
            showMessage('error', 'Failed to update profile. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const FormField = ({ label, name, type = 'text', icon: Icon, readonly = false, placeholder }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            {isEditing && !readonly ? (
                type === 'textarea' ? (
                    <textarea
                        name={name}
                        value={profileData[name]}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={placeholder}
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={profileData[name]}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={placeholder}
                    />
                )
            ) : (
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{profileData[name] || 'Not set'}</span>
                    {readonly && name === 'email' && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Verified</span>
                    )}
                </div>
            )}
        </div>
    )

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Profile</span>
                    </button>
                ) : (
                    <div className="flex space-x-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isSaving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            <span>{isSaving ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                            <span>Cancel</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Full Name" name="name" icon={User} placeholder="Enter your full name" />
                <FormField label="Email Address" name="email" icon={Mail} readonly />
                <FormField label="Phone Number" name="phone" type="tel" icon={Phone} placeholder="Enter your phone number" />
                <FormField label="Location" name="location" icon={MapPin} placeholder="Enter your location" />
                <div className="md:col-span-2">
                    <FormField label="Bio" name="bio" type="textarea" icon={User} placeholder="Tell others about yourself..." />
                </div>
            </div>
        </div>
    )
}