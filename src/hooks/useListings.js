import { useMemo } from 'react'
import { listingService } from '../services'
import { useAPI } from './useAPI'

export function useListings(filters = {}) {
    const { data, loading, error, execute } = useAPI(
        () => listingService.getAll(filters),
        [JSON.stringify(filters)]
    )

    const listings = useMemo(() => data?.data || [], [data])
    const pagination = useMemo(() => data?.pagination || {}, [data])

    return {
        listings,
        pagination,
        loading,
        error,
        refetch: execute
    }
}