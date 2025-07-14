import { useState } from 'react'

function App() {
    const [activeFeature, setActiveFeature] = useState(0)

    const features = [
        {
            icon: "📊",
            title: "Inventory Management",
            description: "Track tire stock, sizes, brands, and quantities in real-time with automated alerts for low inventory."
        },
        {
            icon: "🚗",
            title: "Vehicle Compatibility",
            description: "Match tires to specific vehicle makes and models with our comprehensive compatibility database."
        },
        {
            icon: "💰",
            title: "Price Optimization",
            description: "Dynamic pricing tools and profit margin analysis to maximize revenue and stay competitive."
        },
        {
            icon: "📈",
            title: "Sales Analytics",
            description: "Detailed reports and insights on sales performance, trends, and customer preferences."
        },
        {
            icon: "🔄",
            title: "Order Management",
            description: "Streamlined order processing from customer request to delivery with automated workflows."
        },
        {
            icon: "👥",
            title: "Customer Database",
            description: "Comprehensive customer profiles with purchase history and service recommendations."
        }
    ]

    const stats = [
        { number: "50K+", label: "Tires Managed" },
        { number: "99.9%", label: "Uptime" },
        { number: "500+", label: "Happy Businesses" },
        { number: "24/7", label: "Support" }
    ]

    return (
        <div className="min-h-screen bg-pattern">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">🛞</span>
                            </div>
                            <span className="text-2xl font-bold text-gradient">TireManager Pro</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Features</a>
                            <a href="#pricing" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Pricing</a>
                            <a href="#contact" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Contact</a>
                            <button className="btn-primary">Get Started</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-tire-50"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center animate-fade-in">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                            Revolutionize Your
                            <span className="block text-gradient animate-bounce-soft">Tire Business</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                            The complete tire management solution that helps you track inventory,
                            optimize pricing, and grow your business with powerful analytics and automation.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up">
                            <button className="btn-primary text-lg px-8 py-4">
                                Start Free Trial
                            </button>
                            <button className="btn-secondary text-lg px-8 py-4">
                                Watch Demo
                            </button>
                        </div>
                    </div>

                    {/* Hero Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-slide-up">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card text-center">
                                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.number}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Everything You Need to
                            <span className="text-gradient"> Manage Tires</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From inventory tracking to customer management, our platform provides all the tools
                            you need to run a successful tire business.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="feature-card cursor-pointer"
                                onMouseEnter={() => setActiveFeature(index)}
                            >
                                <div className="text-4xl mb-6">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto">
                        Join thousands of tire businesses already using TireManager Pro to streamline
                        operations and boost profits.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button className="bg-white text-primary-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Get Started Today
                        </button>
                        <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-4 px-8 rounded-xl transition-all duration-200">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-tire-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="col-span-2">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">🛞</span>
                                </div>
                                <span className="text-2xl font-bold">TireManager Pro</span>
                            </div>
                            <p className="text-gray-300 mb-6 max-w-md">
                                The ultimate tire management solution for modern businesses.
                                Streamline operations, boost profits, and grow with confidence.
                            </p>
                            <div className="flex space-x-4">
                                <div className="w-10 h-10 bg-tire-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                                    <span>🐦</span>
                                </div>
                                <div className="w-10 h-10 bg-tire-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                                    <span>💼</span>
                                </div>
                                <div className="w-10 h-10 bg-tire-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                                    <span>📧</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-300">
                                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-300">
                                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-tire-700 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 TireManager Pro. All rights reserved. Built with ❤️ for tire businesses.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default App