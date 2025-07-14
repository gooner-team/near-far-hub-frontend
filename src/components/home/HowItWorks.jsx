import { Search, Calendar, Shield, Truck, CreditCard, Star } from 'lucide-react'

function HowItWorks() {
    const steps = [
        {
            icon: Search,
            title: "Search & Discover",
            description: "Browse thousands of products locally or globally. Use filters to find exactly what you need.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: Calendar,
            title: "Book or Buy Online",
            description: "Schedule an appointment to view items in person, or purchase directly for delivery.",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: Shield,
            title: "Secure Transaction",
            description: "Your payment is protected. We ensure safe transactions between buyers and sellers.",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: Truck,
            title: "Get Your Item",
            description: "Pick up locally after viewing, or receive secure delivery anywhere in the world.",
            color: "from-orange-500 to-red-500"
        }
    ]

    const sellingSteps = [
        {
            icon: CreditCard,
            title: "List Your Item",
            description: "Create a listing with photos and description. Set your price and delivery options.",
            color: "from-indigo-500 to-blue-500"
        },
        {
            icon: Calendar,
            title: "Manage Appointments",
            description: "Accept viewing requests and schedule meetings with potential buyers.",
            color: "from-teal-500 to-cyan-500"
        },
        {
            icon: Shield,
            title: "Secure Payment",
            description: "Receive payments safely through our protected platform with seller guarantees.",
            color: "from-violet-500 to-purple-500"
        },
        {
            icon: Star,
            title: "Build Reputation",
            description: "Get rated by buyers and build your seller reputation for future sales.",
            color: "from-yellow-500 to-orange-500"
        }
    ]

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Simple, secure, and convenient. Whether you're buying or selling,
                        our platform makes it easy to connect with people near and far.
                    </p>
                </div>

                {/* Buying Process */}
                <div className="mb-20">
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
                        For Buyers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon
                            return (
                                <div key={index} className="relative">
                                    {/* Connection Line */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-300 z-0">
                                            <div className="absolute top-1/2 transform -translate-y-1/2 right-4 w-3 h-3 bg-gray-300 rounded-full"></div>
                                        </div>
                                    )}

                                    <div className="relative z-10 text-center">
                                        {/* Step Number */}
                                        <div className="relative mb-6">
                                            <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                                                <IconComponent className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                                                <span className="text-sm font-bold text-gray-700">{index + 1}</span>
                                            </div>
                                        </div>

                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                            {step.title}
                                        </h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Selling Process */}
                <div>
                    <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
                        For Sellers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {sellingSteps.map((step, index) => {
                            const IconComponent = step.icon
                            return (
                                <div key={index} className="relative">
                                    {/* Connection Line */}
                                    {index < sellingSteps.length - 1 && (
                                        <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-300 z-0">
                                            <div className="absolute top-1/2 transform -translate-y-1/2 right-4 w-3 h-3 bg-gray-300 rounded-full"></div>
                                        </div>
                                    )}

                                    <div className="relative z-10 text-center">
                                        {/* Step Number */}
                                        <div className="relative mb-6">
                                            <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                                                <IconComponent className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100">
                                                <span className="text-sm font-bold text-gray-700">{index + 1}</span>
                                            </div>
                                        </div>

                                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                            {step.title}
                                        </h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Ready to Get Started?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Join thousands of users buying and selling on NearFar Hub
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105">
                                Start Buying
                            </button>
                            <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105">
                                Start Selling
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks