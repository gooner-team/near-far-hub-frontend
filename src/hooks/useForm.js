import { useState, useEffect, useCallback, useRef } from 'react'
import { listingsAPI } from '../services/api'

export const useForm = (initialData, validationRules = {}) => {
    const [data, setData] = useState(initialData)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [touched, setTouched] = useState({})

    const handleChange = useCallback((field, value) => {
        setData(prev => ({ ...prev, [field]: value }))

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }))
        }
    }, [errors])

    const handleBlur = useCallback((field) => {
        setTouched(prev => ({ ...prev, [field]: true }))

        // Validate field on blur if touched
        const rules = validationRules[field]
        if (rules && touched[field]) {
            const error = rules.find(rule => rule(data[field]))
            if (error) {
                setErrors(prev => ({ ...prev, [field]: error(data[field]) }))
            }
        }
    }, [data, validationRules, touched])

    const validate = useCallback(() => {
        const newErrors = {}

        Object.entries(validationRules).forEach(([field, rules]) => {
            const value = data[field]
            const error = rules.find(rule => rule(value))
            if (error) {
                newErrors[field] = error(value)
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [data, validationRules])

    const submit = useCallback(async (submitFn) => {
        if (!validate()) return false

        setLoading(true)
        try {
            const result = await submitFn(data)
            return result
        } catch (error) {
            setErrors(prev => ({ ...prev, submit: error.message }))
            return false
        } finally {
            setLoading(false)
        }
    }, [data, validate])

    const reset = useCallback(() => {
        setData(initialData)
        setErrors({})
        setTouched({})
        setLoading(false)
    }, [initialData])

    return {
        data,
        setData,
        errors,
        loading,
        touched,
        handleChange,
        handleBlur,
        submit,
        reset,
        isValid: Object.keys(errors).length === 0
    }
}
