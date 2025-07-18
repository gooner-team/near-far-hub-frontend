export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        LOGOUT: '/api/auth/logout',
        USER: '/api/auth/user',
    },
    ROLES: {
        PERMISSIONS: '/api/roles/permissions',
        UPGRADE_TO_SELLER: '/api/roles/upgrade-to-seller',
    },
    SELLER: {
        PROFILE: '/api/seller/profile',
        AVAILABILITY: '/api/seller/availability',
    }
}