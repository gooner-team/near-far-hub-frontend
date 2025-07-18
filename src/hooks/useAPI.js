import { useState, useEffect, useCallback } from 'react'

export function useAPI(apiCall, dependencies = [], immediate = true) {
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