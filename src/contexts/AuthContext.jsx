import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const clearError = useCallback(() => setError(null), [])

    // API call helper with auth headers
    const apiCall = useCallback(async (url, options = {}) => {
        const token = localStorage.getItem('auth_token')

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            }
        }

        const response = await fetch(url, config)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || `HTTP ${response.status}`)
        }

        return response
    }, [])

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem('auth_token')
                const userData = localStorage.getItem('auth_user')

                if (token && userData) {
                    const parsedUser = JSON.parse(userData)
                    setUser(parsedUser)
                }
            } catch (err) {
                console.error('Auth initialization error:', err)
                localStorage.removeItem('auth_token')
                localStorage.removeItem('auth_user')
            } finally {
                setIsLoading(false)
            }
        }

        initAuth()
    }, [])

    const login = useCallback(async (credentials) => {
        try {
            setError(null)
            setIsLoading(true)

            const { data } = await authAPI.login(credentials)

            localStorage.setItem('auth_token', data.token)
            localStorage.setItem('auth_user', JSON.stringify(data.user))

            setUser(data.user)
            return data
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    const logout = useCallback(async () => {
        try {
            await authAPI.logout().catch(() => {})
        } finally {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
            setUser(null)
            setError(null)
        }
    }, [])

    const updateUser = useCallback((userData) => {
        setUser(userData)
        localStorage.setItem('auth_user', JSON.stringify(userData))
    }, [])

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        updateUser,
        clearError,
        apiCall
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider