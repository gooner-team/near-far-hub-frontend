import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useValidation, commonRules, validators } from '../../utils/validation.js'

function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login, isAuthenticated } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const from = location.state?.from?.pathname || '/'

    const validationRules = {
        email: commonRules.email,
        password: [validators.required, (value) => validators.minLength(value, 6)]
    }

    const {
        data: formData,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateAll
    } = useValidation(
        { email: '', password: '', remember: false },
        validationRules
    )

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true })
        }
    }, [isAuthenticated, navigate, from])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        const inputValue = type === 'checkbox' ? checked : value
        handleChange(name, inputValue)
        if (message.text) setMessage({ type: '', text: '' })
    }

    const handleInputBlur = (e) => {
        handleBlur(e.target.name)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateAll()) return

        setIsLoading(true)
        setMessage({ type: '', text: '' })

        try {
            await login(formData)
            setMessage({ type: 'success', text: 'Login successful! Redirecting...' })
            setTimeout(() => navigate(from, { replace: true }), 1000)
        } catch (error) {
            const errorMessage = error.message.includes('credentials') || error.message.includes('Invalid')
                ? 'Invalid email or password'
                : error.status === 429
                    ? 'Too many login attempts. Please try again later.'
                    : 'Login failed. Please check your credentials and try again.'
            setMessage({ type: 'error', text: errorMessage })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDemoLogin = () => {
        handleChange('email', 'test@example.com')
        handleChange('password', 'password')
        setMessage({ type: '', text: '' })
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center space-x-2 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">NF</span>
                        </div>
                        <span className="text-2xl font-bold text-gradient">NearFar Hub</span>
                    </Link>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
                    <p className="text-gray-600">Sign in to your account to continue</p>

                    {location.state?.from && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">Please sign in to access your account</p>
                        </div>
                    )}
                </div>

                {/* Form */}
                <div className="card p-8">
                    {/* Messages */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                            message.type === 'success'
                                ? 'bg-green-50 border border-green-200 text-green-800'
                                : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                            {message.type === 'success' ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            )}
                            <span className="text-sm font-medium">{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    className={`input pl-10 ${touched.email && errors.email ? 'input-error' : ''}`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {touched.email && errors.email && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    onBlur={handleInputBlur}
                                    className={`input pl-10 pr-10 ${touched.password && errors.password ? 'input-error' : ''}`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={formData.remember}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign in'
                            )}
                        </button>

                        {/* Demo */}
                        <button type="button" onClick={handleDemoLogin} className="w-full btn-secondary text-sm">
                            Fill Demo Credentials
                        </button>
                    </form>

                    {/* Sign Up */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                Sign up here
                            </Link>
                        </p>
                    </div>

                    {/* Demo Info */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 text-center mb-2 font-medium">Demo Credentials</p>
                        <div className="text-xs text-gray-500 space-y-1">
                            <p><strong>Email:</strong> test@example.com</p>
                            <p><strong>Password:</strong> password</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center space-y-2">
                    <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        ← Back to homepage
                    </Link>
                    <div className="text-xs text-gray-500">
                        By signing in, you agree to our{' '}
                        <Link to="/terms" className="text-blue-600 hover:text-blue-500">Terms</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage