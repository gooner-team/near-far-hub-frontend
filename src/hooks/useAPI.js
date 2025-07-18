import {useCallback, useEffect, useRef, useState} from "react";

export const useAPI = (apiCall, immediate = true) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(immediate)
    const [error, setError] = useState(null)
    const abortControllerRef = useRef(null)

    const execute = useCallback(async (...args) => {
        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        // Create new AbortController
        abortControllerRef.current = new AbortController()

        try {
            setLoading(true)
            setError(null)

            const result = await apiCall(...args, {
                signal: abortControllerRef.current.signal
            })

            if (!abortControllerRef.current.signal.aborted) {
                setData(result)
                return result
            }
        } catch (err) {
            if (!abortControllerRef.current.signal.aborted) {
                const errorMessage = err.name === 'AbortError' ?
                    'Request cancelled' :
                    err.message || 'An error occurred'
                setError(errorMessage)
                throw err
            }
        } finally {
            if (!abortControllerRef.current.signal.aborted) {
                setLoading(false)
            }
        }
    }, [apiCall])

    useEffect(() => {
        if (immediate) {
            execute()
        }

        // Cleanup function to abort request on unmount
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [execute, immediate])

    return {
        data,
        loading,
        error,
        execute,
        refetch: execute,
        cancel: () => abortControllerRef.current?.abort()
    }
}