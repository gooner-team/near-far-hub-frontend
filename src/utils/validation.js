export const validators = {
    required: (value) =>
        (!value || !String(value).trim()) ? 'This field is required' : null,

    email: (value) =>
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email address' : null,

    minLength: (min) => (value) =>
        (value && value.length < min) ? `Must be at least ${min} characters` : null,

    maxLength: (max) => (value) =>
        (value && value.length > max) ? `Must not exceed ${max} characters` : null,

    price: (value) =>
        (!value || isNaN(value) || parseFloat(value) <= 0) ? 'Valid price required' : null,

    url: (value) => {
        if (!value) return null
        try {
            new URL(value)
            return null
        } catch {
            return 'Invalid URL format'
        }
    }
}