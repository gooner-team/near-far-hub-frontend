import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ProfileSidebar } from '../components/profile/ProfileSidebar'
import { ProfileOverview } from '../components/profile/ProfileOverview'
import { ProfileEdit } from '../components/profile/ProfileEdit'
import { SellerDashboard } from '../components/profile/SellerDashboard.jsx'
import { ProfileSettings } from '../components/profile/ProfileSettings'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { MessageAlert } from '../components/ui/MessageAlert'

function ProfilePage() {
    const { user, logout, isAuthenticated, isLoading, apiCall } = useAuth()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('overview')
    const [message, setMessage] = useState({ type: '', text: '' })
    const [sellerProfile, setSellerProfile] = useState(null)
    const [loadingSellerProfile, setLoadingSellerProfile] = useState(false)

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login', { replace: true })
        }
    }, [isAuthenticated, isLoading, navigate])

    // Load seller profile
    useEffect(() => {
        const loadSellerProfile = async () => {
            if (!user || !apiCall) return

            setLoadingSellerProfile(true)
            try {
                const response = await apiCall('http://localhost:8000/api/seller/profile')
                const data = await response.json()
                setSellerProfile(data.data)
            } catch (error) {
                setSellerProfile(null)
            } finally {
                setLoadingSellerProfile(false)
            }
        }

        if (user) loadSellerProfile()
    }, [user, apiCall])

    const showMessage = (type, text) => {
        setMessage({ type, text })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    if (isLoading) return <LoadingSpinner />
    if (!isAuthenticated) return null

    const tabs = [
        { id: 'overview', name: 'Overview', icon: 'User' },
        { id: 'profile', name: 'Profile', icon: 'Edit3' },
        { id: 'selling', name: 'Selling', icon: 'Store' },
        { id: 'settings', name: 'Settings', icon: 'Settings' }
    ]

    const renderTabContent = () => {
        const props = {
            user,
            sellerProfile,
            loadingSellerProfile,
            showMessage,
            navigate
        }

        switch (activeTab) {
            case 'overview':
                return <ProfileOverview {...props} />
            case 'profile':
                return <ProfileEdit {...props} />
            case 'selling':
                return <SellerDashboard {...props} />
            case 'settings':
                return <ProfileSettings {...props} />
            default:
                return <ProfileOverview {...props} />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
                    <p className="text-gray-600">Manage your profile, listings, and account settings</p>
                </div>

                <MessageAlert message={message} />

                <div className="flex flex-col lg:flex-row gap-8">
                    <ProfileSidebar
                        user={user}
                        sellerProfile={sellerProfile}
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onLogout={handleLogout}
                    />

                    <div className="lg:w-3/4">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage