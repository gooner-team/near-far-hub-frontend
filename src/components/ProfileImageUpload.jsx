import React from 'react'
import ImageUpload from './common/ImageUpload'

export default function ProfileImageUpload({ userType, onImageChange, currentImage }) {
    const getImageType = () => {
        switch (userType) {
            case 'avatar': return 'USER_AVATAR'
            case 'seller': return 'SELLER_PROFILE'
            default: return 'USER_AVATAR'
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                    {currentImage ? (
                        <img
                            src={currentImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            <ImageUpload
                type={getImageType()}
                onImagesChange={(images) => onImageChange(images[0]?.url)}
                existingImages={currentImage ? [{ url: currentImage }] : []}
                className="w-full max-w-md"
            />
        </div>
    )
}