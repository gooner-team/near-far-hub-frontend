import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

function Footer() {
    const quickLinks = [
        { to: '/categories', label: 'Browse Categories' },
        { to: '/sell', label: 'Start Selling' },
        { to: '/help', label: 'Help Center' },
        { to: '/safety', label: 'Safety Tips' }
    ]

    const supportLinks = [
        { to: '/terms', label: 'Terms of Service' },
        { to: '/privacy', label: 'Privacy Policy' },
        { to: '/contact', label: 'Contact Us' },
        { to: '/about', label: 'About Us' }
    ]

    const socialLinks = [
        { href: '#', icon: Facebook, label: 'Facebook' },
        { href: '#', icon: Twitter, label: 'Twitter' },
        { href: '#', icon: Instagram, label: 'Instagram' }
    ]

    return (
        <footer className="bg-gray-900 text-white">
            <div className="container-modern py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">NF</span>
                            </div>
                            <span className="text-xl font-bold">NearFar Hub</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Your modern marketplace for buying and selling locally and globally.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.to}
                                        className="text-gray-300 hover:text-white transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Support</h3>
                        <ul className="space-y-2">
                            {supportLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.to}
                                        className="text-gray-300 hover:text-white transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-blue-400" />
                                <span className="text-gray-300 text-sm">support@nearfarhub.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-blue-400" />
                                <span className="text-gray-300 text-sm">+371 123 456 789</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <span className="text-gray-300 text-sm">Riga, Latvia</span>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold mb-2">Stay Updated</h4>
                            <div className="flex space-x-2">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container-modern py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            © 2025 NearFar Hub. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Terms
                            </Link>
                            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Privacy
                            </Link>
                            <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer