import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

// Form Hook
export const useForm = (initialData, validationRules = {}) => {
    const [data, setData] = useState(initialData)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
    }

    const validate = () => {
        const newErrors = {}
        Object.entries(validationRules).forEach(([field, rules]) => {
            const value = data[field]
            const error = rules.find(rule => rule(value))
            if (error) newErrors[field] = error(value)
        })
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const submit = async (submitFn) => {
        if (!validate()) return false
        setLoading(true)
        try {
            const result = await submitFn(data)
            return result
        } finally {
            setLoading(false)
        }
    }

    return { data, errors, loading, handleChange, submit, setData, setErrors }
}

// API Hook
export const useAPI = (apiFunction, dependencies = []) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const execute = async (...args) => {
        setLoading(true)
        setError(null)
        try {
            const result = await apiFunction(...args)
            setData(result)
            return result
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        execute()
    }, dependencies)

    return { data, loading, error, execute, refetch: execute }
}

// Listings Hook
export const useListings = (filters = {}) => {
    const { data, loading, error, execute } = useAPI(() => listingsAPI.getListings(filters), [filters])

    return {
        listings: data?.data || [],
        pagination: data?.pagination,
        loading,
        error,
        refetch: execute
    }
}