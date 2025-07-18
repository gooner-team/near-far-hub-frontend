import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('auth_user')

        if (token && userData) {
            try {
                setUser(JSON.parse(userData))
            } catch {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('auth_user')
            }
        }
        setLoading(false)
    }, [])

    const login = async (credentials) => {
        const { data } = await authAPI.login(credentials)
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_user', JSON.stringify(data.user))
        setUser(data.user)
        return data
    }

    const logout = async () => {
        try {
            await authAPI.logout()
        } finally {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated: !!user,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}