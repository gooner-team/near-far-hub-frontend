import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Store,
    Clock,
    MapPin,
    Phone,
    Building,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    Calendar,
    CreditCard,
    ArrowLeft
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'

function SellerSetupPage() {
    const navigate = useNavigate()
    const { user, apiCall } = useAuth()
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [sellerProfile, setSellerProfile] = useState(null)

    // Step 1: Business Information
    const [businessData, setBusinessData] = useState({
        businessName: '',
        businessDescription: '',
        businessType: 'individual',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Latvia'
    })

    // Step 2: Availability
    const [availability, setAvailability] = useState([
        { dayOfWeek: 'monday', startTime: '09:00', endTime: '17:00', isActive: true },
        { dayOfWeek: 'tuesday', startTime: '09:00', endTime: '17:00', isActive: true },
        { dayOfWeek: 'wednesday', startTime: '09:00', endTime: '17:00', isActive: true },
        { dayOfWeek: 'thursday', startTime: '09:00', endTime: '17:00', isActive: true },
        { dayOfWeek: 'friday', startTime: '09:00', endTime: '17:00', isActive: true },
        { dayOfWeek: 'saturday', startTime: '10:00', endTime: '14:00', isActive: false },
        { dayOfWeek: 'sunday', startTime: '10:00', endTime: '14:00', isActive: false }
    ])

    const steps = [
        { id: 1, title: 'Business Info', description: 'Tell us about your business' },
        { id: 2, title: 'Availability', description: 'Set your working hours' },
        { id: 3, title: 'Complete', description: 'Review and finish' }
    ]

    const businessTypes = [
        { value: 'individual', label: 'Individual Seller' },
        { value: 'business', label: 'Small Business' },
        { value: 'company', label: 'Company' }
    ]

    const dayNames = {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
    }

    // Check if user already has a seller profile
    useEffect(() => {
        const checkSellerProfile = async () => {
            try {
                const response = await apiCall('http://localhost:8000/api/seller/profile')
                if (response.ok) {
                    const data = await response.json()
                    if (data.data) {
                        // User already has a seller profile, redirect to dashboard
                        navigate('/profile')
                    }
                }
            } catch (error) {
                // User doesn't have a seller profile yet, continue with setup
            }
        }

        checkSellerProfile()
    }, [apiCall, navigate])

    const handleBusinessDataChange = (field, value) => {
        setBusinessData(prev => ({ ...prev, [field]: value }))
    }

    const handleAvailabilityChange = (index, field, value) => {
        setAvailability(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
    }

    const toggleDayActive = (index) => {
        setAvailability(prev => {
            const updated = [...prev]
            updated[index].isActive = !updated[index].isActive
            return updated
        })
    }

    const validateStep1 = () => {
        const required = ['businessName', 'businessType', 'phone', 'address', 'city', 'postalCode', 'country']
        return required.every(field => businessData[field].trim() !== '')
    }

    const validateStep2 = () => {
        return availability.some(day => day.isActive)
    }

    const createSellerProfile = async () => {
        setIsLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const response = await apiCall('http://localhost:8000/api/seller/profile', {
                method: 'POST',
                body: JSON.stringify({
                    business_name: businessData.businessName,
                    business_description: businessData.businessDescription,
                    business_type: businessData.businessType,
                    phone: businessData.phone,
                    address: businessData.address,
                    city: businessData.city,
                    postal_code: businessData.postalCode,
                    country: businessData.country
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to create seller profile')
            }

            const data = await response.json()
            setSellerProfile(data.data)
            setCurrentStep(2)
            setMessage({ type: 'success', text: 'Seller profile created successfully!' })
        } catch (error) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    const setAvailabilitySchedule = async () => {
        setIsLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const response = await apiCall('http://localhost:8000/api/seller/availability', {
                method: 'POST',
                body: JSON.stringify({
                    availability: availability.map(day => ({
                        day_of_week: day.dayOfWeek,
                        start_time: day.startTime,
                        end_time: day.endTime,
                        is_active: day.isActive
                    }))
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to set availability')
            }

            setCurrentStep(3)
            setMessage({ type: 'success', text: 'Availability set successfully!' })
        } catch (error) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setIsLoading(false)
        }
    }

    const handleNext = () => {
        if (currentStep === 1) {
            if (!validateStep1()) {
                setMessage({ type: 'error', text: 'Please fill in all required fields' })
                return
            }
            createSellerProfile()
        } else if (currentStep === 2) {
            if (!validateStep2()) {
                setMessage({ type: 'error', text: 'Please set at least one day as available' })
                return
            }
            setAvailabilitySchedule()
        }
    }

    const handleComplete = () => {
        setMessage({ type: 'success', text: 'Seller setup complete! Redirecting to dashboard...' })
        setTimeout(() => {
            navigate('/profile')
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Store className="w-12 h-12 text-blue-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">Become a Seller</h1>
                    </div>
                    <p className="text-gray-600">
                        Start selling on NearFar Hub and reach customers worldwide
                    </p>
                </div>

                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Profile
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                    currentStep >= step.id
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'border-gray-300 text-gray-300'
                                }`}>
                                    {currentStep > step.id ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        <span className="font-semibold">{step.id}</span>
                                    )}
                                </div>
                                <div className="ml-4 text-left">
                                    <div className={`text-sm font-medium ${
                                        currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                                    }`}>
                                        {step.title}
                                    </div>
                                    <div className="text-xs text-gray-500">{step.description}</div>
                                </div>
                                {index < steps.length - 1 && (
                                    <ArrowRight className="w-5 h-5 text-gray-400 mx-8" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
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

                {/* Step Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    {currentStep === 1 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <Building className="w-6 h-6 mr-3 text-blue-600" />
                                Business Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={businessData.businessName}
                                        onChange={(e) => handleBusinessDataChange('businessName', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Your business or store name"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Description
                                    </label>
                                    <textarea
                                        value={businessData.businessDescription}
                                        onChange={(e) => handleBusinessDataChange('businessDescription', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={4}
                                        placeholder="Tell customers about your business..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Type *
                                    </label>
                                    <select
                                        value={businessData.businessType}
                                        onChange={(e) => handleBusinessDataChange('businessType', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {businessTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={businessData.phone}
                                        onChange={(e) => handleBusinessDataChange('phone', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="+371 123 456 789"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={businessData.address}
                                        onChange={(e) => handleBusinessDataChange('address', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Street address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        value={businessData.city}
                                        onChange={(e) => handleBusinessDataChange('city', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Riga"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Postal Code *
                                    </label>
                                    <input
                                        type="text"
                                        value={businessData.postalCode}
                                        onChange={(e) => handleBusinessDataChange('postalCode', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="LV-1001"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        value={businessData.country}
                                        onChange={(e) => handleBusinessDataChange('country', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Latvia"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <Clock className="w-6 h-6 mr-3 text-blue-600" />
                                Set Your Availability
                            </h2>

                            <p className="text-gray-600 mb-6">
                                Set your working hours so customers can book appointments when you're available.
                            </p>

                            <div className="space-y-4">
                                {availability.map((day, index) => (
                                    <div key={day.dayOfWeek} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3 w-32">
                                            <input
                                                type="checkbox"
                                                checked={day.isActive}
                                                onChange={() => toggleDayActive(index)}
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <span className="font-medium text-gray-900">
                                                {dayNames[day.dayOfWeek]}
                                            </span>
                                        </div>

                                        {day.isActive && (
                                            <div className="flex items-center space-x-4 flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-600">From:</span>
                                                    <input
                                                        type="time"
                                                        value={day.startTime}
                                                        onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-600">To:</span>
                                                    <input
                                                        type="time"
                                                        value={day.endTime}
                                                        onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {!day.isActive && (
                                            <div className="flex-1 text-gray-500">
                                                Not available
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-900">
                                            Appointment Booking
                                        </p>
                                        <p className="text-xs text-blue-700">
                                            Customers will be able to book appointments during your available hours.
                                            You can approve or reject each appointment request.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="text-center">
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Congratulations!
                                </h2>
                                <p className="text-gray-600">
                                    Your seller account has been set up successfully. You can now start accepting appointments and listing products.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <Store className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">Create Listings</p>
                                        <p className="text-xs text-gray-600">Add products to sell</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <Calendar className="w-6 h-6 text-green-600" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">Manage Appointments</p>
                                        <p className="text-xs text-gray-600">Accept customer meetings</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <CreditCard className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">Add Balance</p>
                                        <p className="text-xs text-gray-600">Pay for listing fees</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleComplete}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {currentStep < 3 && (
                    <div className="flex justify-between mt-8">
                        <button
                            onClick={() => navigate('/profile')}
                            className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>{currentStep === 1 ? 'Create Profile' : 'Set Availability'}</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SellerSetupPage