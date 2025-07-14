import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

function TestimonialSection() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0)

    const testimonials = [
        {
            id: 1,
            name: "Anna Krievina",
            role: "Small Business Owner",
            location: "Riga, Latvia",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1be?w=100&h=100&fit=crop&crop=face",
            rating: 5,
            text: "NearFar Hub transformed my small business. I can now reach customers globally while still maintaining my local presence. The appointment booking feature is a game-changer!",
            product: "Handmade Jewelry"
        },
        {
            id: 2,
            name: "Marcus Andersson",
            role: "Tech Enthusiast",
            location: "Stockholm, Sweden",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            rating: 5,
            text: "I found the perfect vintage camera from a seller in Germany. The secure payment system and global delivery made the entire process smooth and worry-free.",
            product: "Vintage Camera Equipment"
        },
        {
            id: 3,
            name: "Elena Popescu",
            role: "Interior Designer",
            location: "Bucharest, Romania",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            rating: 5,
            text: "The quality of sellers on this platform is outstanding. I've furnished three client projects with unique pieces found here. The local viewing option saved me so much time!",
            product: "Unique Furniture"
        },
        {
            id: 4,
            name: "Janis Berzins",
            role: "Car Collector",
            location: "Daugavpils, Latvia",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            rating: 5,
            text: "Bought my dream classic car through NearFar Hub. The seller verification and secure transaction process gave me confidence in making such a large purchase.",
            product: "Classic Mercedes-Benz"
        },
        {
            id: 5,
            name: "Sophie Laurent",
            role: "Fashion Blogger",
            location: "Paris, France",
            avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face",
            rating: 5,
            text: "As a fashion blogger, I'm always looking for unique pieces. This platform connects me with amazing local designers and vintage sellers from around Europe.",
            product: "Designer Clothing"
        }
    ]

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    const currentTestimonialData = testimonials[currentTestimonial]

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        What Our Users Say
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Real stories from real people who have found success buying and selling on our platform.
                    </p>
                </div>

                {/* Main Testimonial */}
                <div className="max-w-4xl mx-auto mb-16">
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/10 to-blue-500/10 rounded-full translate-y-12 -translate-x-12"></div>

                        {/* Quote Icon */}
                        <div className="flex justify-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                <Quote className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        {/* Testimonial Text */}
                        <blockquote className="text-xl md:text-2xl text-gray-700 text-center leading-relaxed mb-8 font-light">
                            "{currentTestimonialData.text}"
                        </blockquote>

                        {/* Rating */}
                        <div className="flex justify-center mb-6">
                            {[...Array(currentTestimonialData.rating)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                            ))}
                        </div>

                        {/* User Info */}
                        <div className="flex items-center justify-center">
                            <img
                                src={currentTestimonialData.avatar}
                                alt={currentTestimonialData.name}
                                className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-gray-100"
                            />
                            <div className="text-center">
                                <h4 className="text-lg font-semibold text-gray-900">
                                    {currentTestimonialData.name}
                                </h4>
                                <p className="text-gray-600">
                                    {currentTestimonialData.role}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {currentTestimonialData.location}
                                </p>
                                <p className="text-sm text-blue-600 font-medium mt-1">
                                    Purchased: {currentTestimonialData.product}
                                </p>
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevTestimonial}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <button
                            onClick={nextTestimonial}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Testimonial Indicators */}
                <div className="flex justify-center space-x-2 mb-12">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentTestimonial(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>

                {/* Additional Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.slice(0, 3).map((testimonial, index) => (
                        <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center mb-4">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover mr-3"
                                />
                                <div>
                                    <h5 className="font-semibold text-gray-900">{testimonial.name}</h5>
                                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                                </div>
                            </div>
                            <div className="flex mb-3">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                ))}
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                "{testimonial.text.substring(0, 120)}..."
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TestimonialSection