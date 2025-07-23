import { Sun, Moon, Monitor, Palette } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

function ThemeToggle({ showLabel = true, size = 'md', variant = 'default' }) {
    const { theme, toggleTheme, currentTheme, isDark, isSystem } = useTheme()

    const getIcon = () => {
        const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
        const iconClass = `${iconSize} transition-all duration-500`

        if (isSystem) {
            return <Monitor className={`${iconClass} text-purple-500`} />
        }

        if (isDark) {
            return (
                <Moon className={`${iconClass} text-blue-300 rotate-0 scale-100 transition-all duration-500`} />
            )
        }

        return (
            <Sun className={`${iconClass} text-amber-500 rotate-0 scale-100 transition-all duration-500`} />
        )
    }

    const getLabel = () => {
        switch (theme) {
            case 'light': return 'Light'
            case 'dark': return 'Dark'
            case 'system': return 'Auto'
            default: return 'Theme'
        }
    }

    const getButtonClass = () => {
        const baseClass = `
            flex items-center justify-center space-x-2 rounded-xl font-medium
            transition-all duration-300 transform hover:scale-105 active:scale-95
            min-h-[44px] md:min-h-auto touch-manipulation relative overflow-hidden
        `

        const sizeClass = size === 'sm' ? 'px-3 py-2 text-sm' : 'px-4 py-3'

        if (variant === 'floating') {
            return `${baseClass} ${sizeClass} glass shadow-lg hover:shadow-xl border border-white/20`
        }

        if (variant === 'minimal') {
            return `${baseClass} ${sizeClass} bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400`
        }

        // Default variant
        return `${baseClass} ${sizeClass} bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700`
    }

    const getBackgroundGradient = () => {
        if (isDark) {
            return 'from-blue-500/20 to-purple-500/20'
        }
        if (isSystem) {
            return 'from-purple-500/20 to-pink-500/20'
        }
        return 'from-amber-500/20 to-orange-500/20'
    }

    return (
        <button
            onClick={toggleTheme}
            className={getButtonClass()}
            title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
            aria-label={`Current theme: ${getLabel()}. Click to change theme.`}
        >
            {/* Animated background */}
            <div
                className={`absolute inset-0 bg-gradient-to-r ${getBackgroundGradient()} opacity-0 hover:opacity-100 transition-opacity duration-300`}
            />

            {/* Icon container with animation */}
            <div className="relative z-10 flex items-center justify-center">
                <div className="relative">
                    {getIcon()}

                    {/* Pulse effect for system theme */}
                    {isSystem && (
                        <div className="absolute inset-0 animate-ping rounded-full bg-purple-400 opacity-20" />
                    )}
                </div>
            </div>

            {/* Label */}
            {showLabel && (
                <span className="relative z-10 hidden sm:inline font-medium">
                    {getLabel()}
                </span>
            )}

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            </div>
        </button>
    )
}

// Alternative compact version for mobile/tight spaces
export function CompactThemeToggle() {
    const { toggleTheme, currentTheme, themeIcon } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className="
                w-10 h-10 rounded-full glass flex items-center justify-center
                transition-all duration-300 transform hover:scale-110 active:scale-95
                shadow-lg hover:shadow-xl text-lg
            "
            title="Toggle theme"
        >
            <span className="animate-pulse">{themeIcon}</span>
        </button>
    )
}

// Advanced theme toggle with dropdown
export function AdvancedThemeToggle() {
    const { theme, setTheme, currentTheme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)

    const themes = [
        { id: 'light', name: 'Light', icon: Sun, color: 'text-amber-500' },
        { id: 'dark', name: 'Dark', icon: Moon, color: 'text-blue-400' },
        { id: 'system', name: 'System', icon: Monitor, color: 'text-purple-500' }
    ]

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
                    flex items-center space-x-2 px-4 py-2 rounded-xl
                    bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                    transition-all duration-300 transform hover:scale-105
                    border border-gray-200 dark:border-gray-700
                "
            >
                <Palette className="w-4 h-4" />
                <span className="text-sm font-medium">Theme</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 py-2 w-48 glass rounded-xl shadow-xl border border-white/20 z-20">
                        {themes.map(({ id, name, icon: Icon, color }) => (
                            <button
                                key={id}
                                onClick={() => {
                                    setTheme(id)
                                    setIsOpen(false)
                                }}
                                className={`
                                    w-full flex items-center space-x-3 px-4 py-2 text-sm
                                    transition-colors duration-200
                                    ${theme === id
                                    ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                }
                                `}
                            >
                                <Icon className={`w-4 h-4 ${color}`} />
                                <span>{name}</span>
                                {theme === id && (
                                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default ThemeToggle