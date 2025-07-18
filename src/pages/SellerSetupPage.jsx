import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import { useForm } from '../hooks'
import { Card, Button, Input, Section } from '../components/ui/index.jsx'
import { validateRequired } from '../utils'

const steps = [
    { id: 1, title: 'Business Info', description: 'Tell us about your business' },
    { id: 2, title: 'Availability', description: 'Set your working hours' },
    { id: 3, title: 'Complete', description: 'Review and finish' }
]

const businessTypes = [
    ['individual', 'Individual Seller'],
    ['business', 'Small Business'],
    ['company', 'Company']
]

const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

const SellerSetupPage = () => {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [availability, setAvailability] = useState(
        daysOfWeek.map(day => ({
            day: day.toLowerCase(),
            active: day !== 'Saturday' && day !== 'Sunday',
            start: '09:00',
            end: '17:00'
        }))
    )

    const { data, errors, loading, handleChange, submit } = useForm(
        {
            businessName: '',
            businessType: 'individual',
            phone: '',
            address: '',
            city: '',
            country: 'Latvia'
        },
        {
            businessName: [validateRequired],
            phone: [validateRequired],
            address: [validateRequired],
            city: [validateRequired]
        }
    )

    const handleNext = () => {
        if (currentStep === 1) {
            submit(async () => {
                // API call to create seller profile
                setCurrentStep(2)
            })
        } else if (currentStep === 2) {
            // Save availability
            setCurrentStep(3)
        }
    }

    const StepContent = {
        1: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Business Name *"
                    value={data.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    error={errors.businessName}
                    className="md:col-span-2"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Type *</label>
                    <select
                        value={data.businessType}
                        onChange={(e) => handleChange('businessType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {businessTypes.map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <Input
                    label="Phone *"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    error={errors.phone}
                />

                <Input
                    label="Address *"
                    value={data.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    error={errors.address}
                    className="md:col-span-2"
                />

                <Input
                    label="City *"
                    value={data.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    error={errors.city}
                />

                <Input
                    label="Country *"
                    value={data.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                />
            </div>
        ),

        2: (
            <div className="space-y-4">
                {availability.map((day, index) => (
                    <div key={day.day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-32">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={day.active}
                                    onChange={(e) => {
                                        const newAvailability = [...availability]
                                        newAvailability[index].active = e.target.checked
                                        setAvailability(newAvailability)
                                    }}
                                    className="w-5 h-5 text-blue-600 rounded"
                                />
                                <span className="font-medium">{daysOfWeek[index]}</span>
                            </label>
                        </div>

                        {day.active && (
                            <div className="flex items-center space-x-4 flex-1">
                                <input
                                    type="time"
                                    value={day.start}
                                    onChange={(e) => {
                                        const newAvailability = [...availability]
                                        newAvailability[index].start = e.target.value
                                        setAvailability(newAvailability)
                                    }}
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                />
                                <span>to</span>
                                <input
                                    type="time"
                                    value={day.end}
                                    onChange={(e) => {
                                        const newAvailability = [...availability]
                                        newAvailability[index].end = e.target.value
                                        setAvailability(newAvailability)
                                    }}
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        ),

        3: (
            <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
                <p className="text-gray-600 mb-6">Your seller account has been set up successfully.</p>
                <Button onClick={() => navigate('/profile')}>Go to Dashboard</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Section
                title="Become a Seller"
                subtitle="Start selling on NearFar Hub and reach customers worldwide"
            >
                {/* Progress */}
                <div className="flex items-center justify-center mb-8">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                                currentStep >= step.id ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-300'
                            }`}>
                                {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                            </div>
                            {index < steps.length - 1 && <ArrowRight className="w-5 h-5 text-gray-400 mx-4" />}
                        </div>
                    ))}
                </div>

                <Card className="max-w-4xl mx-auto p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{steps[currentStep - 1].title}</h2>
                    {StepContent[currentStep]}
                </Card>

                {currentStep < 3 && (
                    <div className="flex justify-between mt-8 max-w-4xl mx-auto">
                        <Button variant="ghost" onClick={() => navigate('/profile')}>Cancel</Button>
                        <Button loading={loading} onClick={handleNext}>
                            {currentStep === 1 ? 'Create Profile' : 'Set Availability'}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                )}
            </Section>
        </div>
    )
}

export default SellerSetupPage