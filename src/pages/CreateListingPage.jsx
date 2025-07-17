// src/pages/CreateListingPage.jsx
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ListingForm from '../components/listings/ListingForm'

function CreateListingPage() {
    const navigate = useNavigate()

    const handleSuccess = (listing) => {
        // Navigate to listing detail or back to dashboard
        navigate('/profile', {
            state: {
                message: {
                    type: 'success',
                    text: 'Listing created successfully!'
                }
            }
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </button>
                </div>

                <ListingForm onSuccess={handleSuccess} />
            </div>
        </div>
    )
}

export default CreateListingPage
