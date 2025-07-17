import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ListingForm from '../components/listings/ListingForm'

function EditListingPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const handleSuccess = (listing) => {
        navigate('/profile', {
            state: {
                message: {
                    type: 'success',
                    text: 'Listing updated successfully!'
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
                        Back to Listings
                    </button>
                </div>

                <ListingForm listingId={parseInt(id)} onSuccess={handleSuccess} />
            </div>
        </div>
    )
}

export default EditListingPage