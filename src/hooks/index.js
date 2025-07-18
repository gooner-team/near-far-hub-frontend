import { useState, useEffect, useCallback } from 'react'
import { listingsAPI } from '../services/api'

// Form Hook
export const useForm = (initialData, validationRules = {}) => {
    const [data, setData] = useState(initialData)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = useCallback((field, value) => {
        setData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }))
        }
    }, [errors])

    const validate = useCallback(() => {
        const newErrors = {}
        Object.entries(validationRules).forEach(([field, rules]) => {
            const value = data[field]
            const error = rules.find(rule => rule(value))
            if (error) newErrors[field] = error(value)
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

    return { data, errors, loading, handleChange, submit, setData, setErrors }
}

// API Hook
export const useAPI = (apiCall, dependencies = [], immediate = true) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(immediate)
    const [error, setError] = useState(null)

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true)
            setError(null)
            const result = await apiCall(...args)
            setData(result)
            return result
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [apiCall])

    useEffect(() => {
        if (immediate) execute()
    }, dependencies)

    return { data, loading, error, execute, refetch: execute }
}

// Listings Hook
export const useListings = (filters = {}) => {
    const { data, loading, error, execute } = useAPI(
        () => listingsAPI.getAll(filters),
        [JSON.stringify(filters)]
    )

    return {
        listings: data?.data || [],
        pagination: data?.pagination,
        loading,
        error,
        refetch: execute
    }
}