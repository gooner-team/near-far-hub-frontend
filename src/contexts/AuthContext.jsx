import { createContext, useContext, useState, useEffect } from 'react'
import { API_BASE_URL } from '../config/api'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// Mock user data for development since localStorage is not available
const MOCK_USERS = {
    'test@example.com': {
        id: 1,
        email: 'test@example.com',
        name: 'John Doe',
        phone: '+371 12345678',
        location: 'Riga, Latvia',
        avatar: null,
        role: {
            id: 1,
            name: 'buyer',
            displayName: 'Buyer'
        },
        permissions: {
            canSell: false,
            canUpgradeToSeller: true,
            canCreateListings: false,
            canManageAccount: true
        }
    },
    'seller@example.com': {
        id: 2,
        email: 'seller@example.com',
        name: 'Jane Smith',
        phone: '+371 87654321',
        location: 'Tallinn, Estonia',
        avatar: null,
        role: {
            id: 2,
            name: 'seller',
            displayName: 'Seller'
        },
        permissions: {
            canSell: true,
            canUpgradeToSeller: false,
            canCreateListings: true,
            canManageAccount: true
        }
    }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Initialize with demo user or empty state
        setIsLoading(false)
    }, [])

    const login = async (credentials) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        const { email, password } = credentials

        // Check mock users
        if (email in MOCK_USERS && (password === 'password' || password === '123456')) {
            const userData = MOCK_USERS[email]
            const mockToken = `mock_token_${Date.now()}`

            setUser(userData)
            setToken(mockToken)

            return {
                user: userData,
                token: mockToken,
                tokenType: 'Bearer'
            }
        }

        // In production, make real API call
        if (API_BASE_URL && !API_BASE_URL.includes('localhost')) {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
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

            const data = await response.json()
            setUser(data.user)
            setToken(data.token)
            return data
        }

        throw new Error('Invalid email or password')
    }

    const logout = async () => {
        // In production, call logout endpoint
        if (token && API_BASE_URL && !API_BASE_URL.includes('localhost')) {
            try {
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                })
            } catch (error) {
                console.warn('Logout API call failed:', error)
            }
        }

        setUser(null)
        setToken(null)
    }

    const getCurrentUser = async () => {
        if (!token) return null

        // In development, return current user
        if (API_BASE_URL && API_BASE_URL.includes('localhost')) {
            return user
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/user`, {
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

    const upgradeToSeller = async () => {
        // Simulate upgrade
        if (user) {
            const updatedUser = {
                ...user,
                role: {
                    id: 2,
                    name: 'seller',
                    displayName: 'Seller'
                },
                permissions: {
                    ...user.permissions,
                    canSell: true,
                    canUpgradeToSeller: false,
                    canCreateListings: true
                }
            }
            setUser(updatedUser)
            return updatedUser
        }
        throw new Error('No user to upgrade')
    }

    const isAuthenticated = Boolean(user && token)

    const apiCall = async (url, options = {}) => {
        const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        // For mock endpoints, return mock data
        if (fullUrl.includes('/seller/profile')) {
            await new Promise(resolve => setTimeout(resolve, 500))

            if (user?.role?.name === 'seller') {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        data: {
                            id: 1,
                            businessName: user.name + "'s Store",
                            businessType: 'individual',
                            verified: true,
                            rating: 4.8,
                            totalSales: 24
                        }
                    })
                })
            } else {
                return Promise.resolve({
                    ok: false,
                    status: 404
                })
            }
        }

        if (fullUrl.includes('/roles/upgrade-to-seller')) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            upgradeToSeller()
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    message: 'Successfully upgraded to seller account!'
                })
            })
        }

        return fetch(fullUrl, {
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
        upgradeToSeller,
        apiCall,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}