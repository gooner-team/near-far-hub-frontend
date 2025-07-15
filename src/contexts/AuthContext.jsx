import {createContext, useContext, useState, useEffect} from 'react'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedToken = localStorage.getItem('auth_token')
                const storedUser = localStorage.getItem('auth_user')

                if (storedToken && storedUser) {
                    const parsedUser = JSON.parse(storedUser)
                    setToken(storedToken)
                    setUser(parsedUser)
                }
            } catch (error) {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('auth_user')
                localStorage.removeItem('token_type')
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()
    }, [])

    const login = async (credentials) => {
        const response = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(credentials),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Login failed')
        }

        const response_data = await response.json()
        const data = response_data.data || response_data

        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_user', JSON.stringify(data.user))
        localStorage.setItem('token_type', data.tokenType)

        setUser(data.user)
        setToken(data.token)

        await new Promise(resolve => setTimeout(resolve, 100))

        return data
    }

    const logout = async () => {
        try {
            if (token) {
                await fetch('http://localhost:8000/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                })
            }
        } finally {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
            localStorage.removeItem('token_type')
            setUser(null)
            setToken(null)
        }
    }

    const getCurrentUser = async () => {
        if (!token) return null

        try {
            const response = await fetch('http://localhost:8000/api/auth/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            })

            if (!response.ok) {
                await logout()
                return null
            }

            const userData = await response.json()
            setUser(userData)
            return userData
        } catch (error) {
            await logout()
            return null
        }
    }

    const isAuthenticated = Boolean(user && token)

    const apiCall = async (url, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        return fetch(url, {
            ...options,
            headers,
        })
    }

    const value = {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        logout,
        getCurrentUser,
        apiCall,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}