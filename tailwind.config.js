/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            colors: {
                // Custom colors for better dark mode
                slate: {
                    850: '#1a202c',
                    950: '#0f1419',
                },
                blue: {
                    450: '#5d90d9',
                    550: '#2563eb',
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'bounce-subtle': 'bounceSubtle 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-2px)' },
                },
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.1)',
                'medium': '0 4px 25px 0 rgba(0, 0, 0, 0.1)',
                'hard': '0 10px 40px 0 rgba(0, 0, 0, 0.15)',
                'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                'dark-soft': '0 2px 15px 0 rgba(0, 0, 0, 0.3)',
                'dark-medium': '0 4px 25px 0 rgba(0, 0, 0, 0.4)',
                'dark-hard': '0 10px 40px 0 rgba(0, 0, 0, 0.5)',
            },
            backdropBlur: {
                xs: '2px',
            },
            screens: {
                'xs': '475px',
                '3xl': '1600px',
            },
        },
    },
    plugins: [
        // Custom plugin for additional utilities
        function({ addUtilities, theme }) {
            addUtilities({
                '.text-shadow': {
                    textShadow: '0 2px 4px rgba(0,0,0,0.10)',
                },
                '.text-shadow-md': {
                    textShadow: '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
                },
                '.text-shadow-lg': {
                    textShadow: '0 15px 35px rgba(0,0,0,0.12), 0 5px 15px rgba(0,0,0,0.07)',
                },
                '.text-shadow-none': {
                    textShadow: 'none',
                },
                // Safe area utilities
                '.pt-safe': {
                    paddingTop: 'env(safe-area-inset-top, 1rem)',
                },
                '.pb-safe': {
                    paddingBottom: 'env(safe-area-inset-bottom, 1rem)',
                },
                '.pb-safe-md-0': {
                    paddingBottom: 'env(safe-area-inset-bottom, 1rem)',
                    '@media (min-width: 768px)': {
                        paddingBottom: '0',
                    },
                },
                // Theme transition
                '.theme-transition': {
                    transitionProperty: 'background-color, border-color, color, fill, stroke, box-shadow',
                    transitionDuration: '300ms',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                },
            })
        }
    ],
}