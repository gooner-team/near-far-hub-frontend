import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

function ThemeToggle({ showLabel = true, size = 'md' }) {
    const { theme, toggleTheme, currentTheme } = useTheme()

    const getIcon = () => {
        if (theme === 'system') {
            return <Monitor className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} transition-transform duration-200`} />
        }
        return currentTheme === 'dark'
            ? <Moon className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} transition-transform duration-200`} />
            : <Sun className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} transition-transform duration-200`} />
    }

    const getLabel = () => {
        switch (theme) {
            case 'light': return 'Light'
            case 'dark': return 'Dark'
            case 'system': return 'System'
            default: return 'Theme'
        }
    }

    return (
        <button
            onClick={toggleTheme}
            className={`flex items-center space-x-2 ${
                size === 'sm'
                    ? 'px-2 py-1 text-sm'
                    : 'px-3 py-2'
            } rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-200 touch-manipulation min-h-[44px] md:min-h-auto`}
            title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
        >
            {getIcon()}
            {showLabel && (
                <span className="font-medium hidden sm:inline">
                    {getLabel()}
                </span>
            )}
        </button>
    )
}

export default ThemeToggle