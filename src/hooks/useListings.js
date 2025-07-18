import {useCallback, useEffect, useRef, useState} from 'react'
import {listingsAPI} from '../services'

export const useListings = (filters = {}) => {
    const [listings, setListings] = useState([])
    const [pagination, setPagination] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const abortControllerRef = useRef(null)

    const fetchListings = useCallback(async (newFilters = filters) => {
        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        abortControllerRef.current = new AbortController()

        try {
            setLoading(true)
            setError(null)

            const response = await listingsAPI.getAll(newFilters)

            if (!abortControllerRef.current.signal.aborted) {
                setListings(response.data || [])
                setPagination(response.pagination || {})
            }
        } catch (err) {
            if (!abortControllerRef.current.signal.aborted) {
                setError(err.message)
                setListings([])
                setPagination({})
            }
        } finally {
            if (!abortControllerRef.current.signal.aborted) {
                setLoading(false)
            }
        }
    }, [filters])

    useEffect(() => {
        fetchListings(filters)

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [fetchListings, filters])

    return {
        listings,
        pagination,
        loading,
        error,
        refetch: () => fetchListings(filters),
        refresh: fetchListings
    }
}