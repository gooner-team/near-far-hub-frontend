import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('system')
    const [systemTheme, setSystemTheme] = useState('light')

    // Detect system theme preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        setSystemTheme(mediaQuery.matches ? 'dark' : 'light')

        const handleChange = (e) => {
            setSystemTheme(e.matches ? 'dark' : 'light')
            console.log('System theme changed to:', e.matches ? 'dark' : 'light')
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    // Load saved theme or use system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('nearfar-theme')
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
            setTheme(savedTheme)
            console.log('Loaded saved theme:', savedTheme)
        } else {
            setTheme('system')
            localStorage.setItem('nearfar-theme', 'system')
        }
    }, [])

    // Apply theme to document with immediate effect
    useEffect(() => {
        const effectiveTheme = theme === 'system' ? systemTheme : theme
        const root = document.documentElement

        console.log('Applying theme:', effectiveTheme, 'from setting:', theme)

        // Remove existing theme classes
        root.classList.remove('light', 'dark')

        // Add new theme class
        root.classList.add(effectiveTheme)

        // Also set data attribute for additional styling
        root.setAttribute('data-theme', effectiveTheme)

        // Force a repaint to ensure changes take effect
        root.style.colorScheme = effectiveTheme

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]')
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#111827' : '#ffffff')
        } else {
            const meta = document.createElement('meta')
            meta.name = 'theme-color'
            meta.content = effectiveTheme === 'dark' ? '#111827' : '#ffffff'
            document.head.appendChild(meta)
        }

    }, [theme, systemTheme])

    const toggleTheme = () => {
        const themes = ['light', 'dark', 'system']
        const currentIndex = themes.indexOf(theme)
        const nextTheme = themes[(currentIndex + 1) % themes.length]
        setTheme(nextTheme)
        localStorage.setItem('nearfar-theme', nextTheme)
        console.log('Theme toggled to:', nextTheme)
    }

    const setSpecificTheme = (newTheme) => {
        if (['light', 'dark', 'system'].includes(newTheme)) {
            setTheme(newTheme)
            localStorage.setItem('nearfar-theme', newTheme)
            console.log('Theme set to:', newTheme)
        }
    }

    const getCurrentTheme = () => {
        return theme === 'system' ? systemTheme : theme
    }

    const value = {
        theme,
        systemTheme,
        currentTheme: getCurrentTheme(),
        toggleTheme,
        setTheme: setSpecificTheme,
        isDark: getCurrentTheme() === 'dark',
        isLight: getCurrentTheme() === 'light'
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}