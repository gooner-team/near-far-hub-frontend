import { Users, Package, Globe, Shield } from 'lucide-react'

function StatsSection() {
    const stats = [
        {
            icon: Users,
            number: "150K+",
            label: "Active Users",
            description: "Buyers and sellers worldwide",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: Package,
            number: "500K+",
            label: "Items Listed",
            description: "Products available right now",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: Globe,
            number: "25+",
            label: "Countries",
            description: "Global marketplace reach",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: Shield,
            number: "99.8%",
            label: "Secure Transactions",
            description: "Protected by our guarantee",
            color: "from-orange-500 to-red-500"
        }
    ]

    return (
        <section className="py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-black/20">
                {/*<div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="2"/%3E%3Ccircle cx="37" cy="37" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>*/}
        </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by Users Worldwide
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Join a thriving community of buyers and sellers who trust our platform
                for safe, secure, and convenient transactions.
            </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                    <div key={index} className="text-center group">
                        {/* Icon */}
                        <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <IconComponent className="w-8 h-8 text-white" />
                        </div>

                        {/* Number */}
                        <div className="mb-2">
                  <span className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.number}
                  </span>
                        </div>

                        {/* Label */}
                        <h3 className="text-xl font-semibold text-white mb-2">
                            {stat.label}
                        </h3>

                        {/* Description */}
                        <p className="text-blue-100 text-sm">
                            {stat.description}
                        </p>
                    </div>
                )
            })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Bank-Level Security</h4>
                <p className="text-blue-100 text-sm">
                    Your data and transactions are protected with enterprise-grade encryption
                </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Verified Sellers</h4>
                <p className="text-blue-100 text-sm">
                    All sellers go through our verification process for your safety
                </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
                <div className="w-12 h-12 bg-purple-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold mb-2">24/7 Support</h4>
                <p className="text-blue-100 text-sm">
                    Our customer support team is available around the clock to help you
                </p>
            </div>
        </div>
    </div>
</section>
)
}

export default StatsSection