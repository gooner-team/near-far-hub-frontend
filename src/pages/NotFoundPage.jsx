export function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
                    <p className="text-xl text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                    <a
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage