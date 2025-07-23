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

    // Detect system theme preference with improved detection
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const updateSystemTheme = (matches) => {
            setSystemTheme(matches ? 'dark' : 'light')
        }

        // Initial detection
        updateSystemTheme(mediaQuery.matches)

        const handleChange = (e) => updateSystemTheme(e.matches)

        // Use addEventListener for better compatibility
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        } else {
            // Fallback for older browsers
            mediaQuery.addListener(handleChange)
            return () => mediaQuery.removeListener(handleChange)
        }
    }, [])

    // Load saved theme preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('nearfar-theme')
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
            setTheme(savedTheme)
        } else {
            setTheme('system')
            localStorage.setItem('nearfar-theme', 'system')
        }
    }, [])

    // Apply theme with immediate visual feedback
    useEffect(() => {
        const effectiveTheme = theme === 'system' ? systemTheme : theme
        const root = document.documentElement

        // Remove existing theme classes
        root.classList.remove('light', 'dark')

        // Set data-theme attribute for our modern CSS
        root.setAttribute('data-theme', effectiveTheme)

        // Also add class for Tailwind compatibility
        root.classList.add(effectiveTheme)

        // Set color scheme for better browser integration
        root.style.colorScheme = effectiveTheme

        // Update meta theme-color for mobile browsers with modern colors
        let metaThemeColor = document.querySelector('meta[name="theme-color"]')
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta')
            metaThemeColor.name = 'theme-color'
            document.head.appendChild(metaThemeColor)
        }

        // Modern colors for mobile browser chrome
        metaThemeColor.content = effectiveTheme === 'dark' ? '#020617' : '#f8fafc'

        // Update status bar style for mobile
        let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
        if (!statusBarMeta) {
            statusBarMeta = document.createElement('meta')
            statusBarMeta.name = 'apple-mobile-web-app-status-bar-style'
            document.head.appendChild(statusBarMeta)
        }
        statusBarMeta.content = effectiveTheme === 'dark' ? 'black-translucent' : 'default'

        // Animate theme transition
        root.style.transition = 'background-color 0.3s ease, color 0.3s ease'
        setTimeout(() => {
            root.style.transition = ''
        }, 300)

    }, [theme, systemTheme])

    const toggleTheme = () => {
        const themes = ['light', 'dark', 'system']
        const currentIndex = themes.indexOf(theme)
        const nextTheme = themes[(currentIndex + 1) % themes.length]

        setTheme(nextTheme)
        localStorage.setItem('nearfar-theme', nextTheme)

        // Add subtle feedback animation
        const root = document.documentElement
        root.style.transform = 'scale(0.999)'
        setTimeout(() => {
            root.style.transform = ''
        }, 150)
    }

    const setSpecificTheme = (newTheme) => {
        if (['light', 'dark', 'system'].includes(newTheme)) {
            setTheme(newTheme)
            localStorage.setItem('nearfar-theme', newTheme)
        }
    }

    const getCurrentTheme = () => {
        return theme === 'system' ? systemTheme : theme
    }

    const getThemeIcon = () => {
        switch (theme) {
            case 'light': return '☀️'
            case 'dark': return '🌙'
            case 'system': return '💻'
            default: return '☀️'
        }
    }

    const value = {
        theme,
        systemTheme,
        currentTheme: getCurrentTheme(),
        toggleTheme,
        setTheme: setSpecificTheme,
        isDark: getCurrentTheme() === 'dark',
        isLight: getCurrentTheme() === 'light',
        isSystem: theme === 'system',
        themeIcon: getThemeIcon()
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}