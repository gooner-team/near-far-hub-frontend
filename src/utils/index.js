export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const formatPrice = (price) => `€${parseFloat(price).toFixed(2)}`

export const formatDate = (date) => new Date(date).toLocaleDateString()

export const formatTimeAgo = (date) => {
    const now = new Date()
    const diffMs = now - new Date(date)
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(date)
}

export const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? null : 'Invalid email'

export const validateRequired = (value) =>
    value?.trim() ? null : 'Required field'

export const validateMinLength = (min) => (value) =>
    value?.length >= min ? null : `Minimum ${min} characters`