import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useForm } from '../../hooks'
import { Button, Input, Card } from '../ui/index.jsx'
import { validateEmail, validateRequired } from '../../utils'

const LoginForm = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuth()
    const [showPassword, setShowPassword] = useState(false)

    const { data, errors, loading, handleChange, submit } = useForm(
        { email: '', password: '', remember: false },
        {
            email: [validateRequired, validateEmail],
            password: [validateRequired]
        }
    )

    const handleSubmit = (e) => {
        e.preventDefault()
        submit(async (formData) => {
            await login(formData)
            navigate(location.state?.from?.pathname || '/')
        })
    }

    return (
        <Card className="w-full max-w-md mx-auto p-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
                <p className="text-gray-600">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email Address"
                    type="email"
                    icon={Mail}
                    value={data.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                    placeholder="Enter your email"
                />

                <div>
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        icon={Lock}
                        value={data.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        error={errors.password}
                        placeholder="Enter your password"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => handleChange('remember', e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Remember me</span>
                    </label>
                    <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                        Forgot password?
                    </a>
                </div>

                <Button type="submit" loading={loading} className="w-full">
                    Sign in
                </Button>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="/register" className="text-blue-600 hover:text-blue-500">
                            Sign up here
                        </a>
                    </p>
                </div>
            </form>
        </Card>
    )
}

export default LoginForm