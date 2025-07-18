import { forwardRef } from 'react'
import { cn } from '../../utils'

// Base Button Component
export const Button = forwardRef(({
                                      variant = 'primary',
                                      size = 'md',
                                      icon: Icon,
                                      loading,
                                      children,
                                      className,
                                      ...props
                                  }, ref) => {
    const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white',
        secondary: 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 text-gray-700',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
        danger: 'bg-red-600 hover:bg-red-700 text-white'
    }

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-lg'
    }

    return (
        <button
            ref={ref}
            className={cn(
                'font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
            ) : Icon && <Icon className="w-5 h-5" />}
            {children && <span>{children}</span>}
        </button>
    )
})

// Input Component
export const Input = forwardRef(({
                                     label,
                                     error,
                                     icon: Icon,
                                     className,
                                     ...props
                                 }, ref) => (
    <div className="space-y-2">
        {label && (
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
        )}
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />}
            <input
                ref={ref}
                className={cn(
                    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
                    Icon && 'pl-10',
                    error ? 'border-red-300 bg-red-50' : 'border-gray-300',
                    className
                )}
                {...props}
            />
        </div>
        {error && (
            <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
            </p>
        )}
    </div>
))

// Card Component
export const Card = ({ children, className, ...props }) => (
    <div
        className={cn(
            'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100',
            className
        )}
        {...props}
    >
        {children}
    </div>
)

// Badge Component
export const Badge = ({ variant = 'default', children, className }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
        red: 'bg-red-100 text-red-800',
        yellow: 'bg-yellow-100 text-yellow-800'
    }

    return (
        <span className={cn('px-2 py-1 text-xs font-medium rounded-full', variants[variant], className)}>
      {children}
    </span>
    )
}