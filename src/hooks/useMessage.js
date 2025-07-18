import {useCallback, useEffect, useRef, useState} from "react";

export const useMessage = (duration = 3000) => {
    const [message, setMessage] = useState({ type: '', text: '' })
    const timeoutRef = useRef(null)

    const showMessage = useCallback((type, text) => {
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        setMessage({ type, text })

        // Auto-clear message after duration
        timeoutRef.current = setTimeout(() => {
            setMessage({ type: '', text: '' })
        }, duration)
    }, [duration])

    const clearMessage = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setMessage({ type: '', text: '' })
    }, [])

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return { message, showMessage, clearMessage }
}