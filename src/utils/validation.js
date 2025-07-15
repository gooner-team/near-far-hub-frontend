export const validators = {
    email: {
        required: (value) => {
            if (!value || !value.trim()) {
                return 'Email is required'
            }
            return null
        },
        format: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (value && !emailRegex.test(value)) {
                return 'Please enter a valid email address'
            }
            return null
        }
    },

    password: {
        required: (value) => {
            if (!value) {
                return 'Password is required'
            }
            return null
        },
        minLength: (value, minLength = 8) => {
            if (value && value.length < minLength) {
                return `Password must be at least ${minLength} characters long`
            }
            return null
        },
        strength: (value) => {
            if (!value) return null

            const hasUpperCase = /[A-Z]/.test(value)
            const hasLowerCase = /[a-z]/.test(value)
            const hasNumbers = /\d/.test(value)
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)

            if (value.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers) {
                return null
            }

            if (value.length < 8) {
                return 'Password must be at least 8 characters long'
            }

            const missing = []
            if (!hasUpperCase) missing.push('uppercase letter')
            if (!hasLowerCase) missing.push('lowercase letter')
            if (!hasNumbers) missing.push('number')

            if (missing.length > 0) {
                return `Password should include: ${missing.join(', ')}`
            }

            return null
        }
    },

    name: {
        required: (value) => {
            if (!value || !value.trim()) {
                return 'Name is required'
            }
            return null
        },
        minLength: (value, minLength = 2) => {
            if (value && value.trim().length < minLength) {
                return `Name must be at least ${minLength} characters long`
            }
            return null
        },
        maxLength: (value, maxLength = 50) => {
            if (value && value.length > maxLength) {
                return `Name must not exceed ${maxLength} characters`
            }
            return null
        },
        format: (value) => {
            const nameRegex = /^[a-zA-Z\s'-]+$/
            if (value && !nameRegex.test(value)) {
                return 'Name can only contain letters, spaces, hyphens, and apostrophes'
            }
            return null
        }
    },

    phone: {
        required: (value) => {
            if (!value || !value.trim()) {
                return 'Phone number is required'
            }
            return null
        },
        format: (value) => {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
            if (value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                return 'Please enter a valid phone number'
            }
            return null
        }
    },

    required: (value) => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            return 'This field is required'
        }
        return null
    },

    minLength: (value, minLength) => {
        if (value && value.length < minLength) {
            return `Must be at least ${minLength} characters long`
        }
        return null
    },

    maxLength: (value, maxLength) => {
        if (value && value.length > maxLength) {
            return `Must not exceed ${maxLength} characters`
        }
        return null
    },

    passwordMatch: (password, confirmPassword) => {
        if (confirmPassword && password !== confirmPassword) {
            return 'Passwords do not match'
        }
        return null
    },

    url: (value) => {
        if (!value) return null
        try {
            new URL(value)
            return null
        } catch {
            return 'Please enter a valid URL'
        }
    },

    number: (value) => {
        if (value && isNaN(Number(value))) {
            return 'Please enter a valid number'
        }
        return null
    },

    min: (value, min) => {
        if (value && Number(value) < min) {
            return `Value must be at least ${min}`
        }
        return null
    },

    max: (value, max) => {
        if (value && Number(value) > max) {
            return `Value must not exceed ${max}`
        }
        return null
    }
}

export const validateField = (value, rules) => {
    for (const rule of rules) {
        const error = rule(value)
        if (error) {
            return error
        }
    }
    return null
}

export const validateForm = (formData, validationRules) => {
    const errors = {}

    Object.keys(validationRules).forEach(fieldName => {
        const rules = validationRules[fieldName]
        const value = formData[fieldName]
        const error = validateField(value, rules)

        if (error) {
            errors[fieldName] = error
        }
    })

    return errors
}

export const commonRules = {
    email: [
        validators.email.required,
        validators.email.format
    ],

    password: [
        validators.password.required,
        validators.password.minLength
    ],

    strongPassword: [
        validators.password.required,
        validators.password.strength
    ],

    name: [
        validators.name.required,
        validators.name.minLength,
        validators.name.maxLength,
        validators.name.format
    ],

    phone: [
        validators.phone.required,
        validators.phone.format
    ]
}

export const useValidation = (initialData, validationRules) => {
    const [data, setData] = useState(initialData)
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    const validateSingleField = (fieldName, value) => {
        const rules = validationRules[fieldName]
        if (rules) {
            const error = validateField(value, rules)
            setErrors(prev => ({
                ...prev,
                [fieldName]: error
            }))
            return error
        }
        return null
    }

    const handleChange = (fieldName, value) => {
        setData(prev => ({
            ...prev,
            [fieldName]: value
        }))

        if (errors[fieldName]) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: null
            }))
        }
    }

    const handleBlur = (fieldName) => {
        setTouched(prev => ({
            ...prev,
            [fieldName]: true
        }))

        const value = data[fieldName]
        validateSingleField(fieldName, value)
    }

    const validateAll = () => {
        const allErrors = validateForm(data, validationRules)
        setErrors(allErrors)
        return Object.keys(allErrors).length === 0
    }

    const reset = () => {
        setData(initialData)
        setErrors({})
        setTouched({})
    }

    return {
        data,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateAll,
        reset,
        isValid: Object.keys(errors).length === 0
    }
}

export const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: 'No password', color: 'gray' }

    let score = 0

    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1

    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/\d/.test(password)) score += 1
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1

    if (score < 3) return { strength: score, label: 'Weak', color: 'red' }
    if (score < 5) return { strength: score, label: 'Medium', color: 'yellow' }
    return { strength: score, label: 'Strong', color: 'green' }
}