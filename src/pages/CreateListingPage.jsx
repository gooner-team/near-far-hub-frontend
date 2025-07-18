import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ListingForm from '../components/listings/ListingForm'
import { listingService } from '../services'

export default function CreateListingPage() {
    const navigate = useNavigate()

    const handleSubmit = async (formData) => {
        try {
            const result = await listingService.create(formData)

            // Show success message
            navigate('/profile', {
                state: {
                    message: {
                        type: 'success',
                        text: 'Listing created successfully!'
                    }
                }
            })

            return result
        } catch (error) {
            throw new Error(error.message || 'Failed to create listing')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </button>
                </div>

                <ListingForm onSubmit={handleSubmit} />
            </div>
        </div>
    )
}
