import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Layout } from './components/common/Layout'
import { ProtectedRoute } from './components/common/ProtectedRoute'

const pages = {
    HomePage: lazy(() => import('./pages/HomePage')),
    LoginPage: lazy(() => import('./pages/LoginPage')),
    ProfilePage: lazy(() => import('./pages/ProfilePage')),
    CategoryPage: lazy(() => import('./pages/CategoryPage')),
    ListingDetailPage: lazy(() => import('./pages/ListingDetailPage')),
    CreateListingPage: lazy(() => import('./pages/CreateListingPage')),
    SellerSetupPage: lazy(() => import('./pages/SellerSetupPage')),
    NotFoundPage: lazy(() => import('./pages/NotFoundPage'))
}

const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
)

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                            <Route path="/" element={<pages.HomePage />} />
                            <Route path="/login" element={<pages.LoginPage />} />
                            <Route path="/categories" element={<pages.CategoryPage />} />
                            <Route path="/category/:id" element={<pages.CategoryPage />} />
                            <Route path="/product/:id" element={<pages.ListingDetailPage />} />
                            <Route path="/profile" element={<ProtectedRoute><pages.ProfilePage /></ProtectedRoute>} />
                            <Route path="/create-listing" element={<ProtectedRoute><pages.CreateListingPage /></ProtectedRoute>} />
                            <Route path="/seller/setup" element={<ProtectedRoute><pages.SellerSetupPage /></ProtectedRoute>} />
                            <Route path="*" element={<pages.NotFoundPage />} />
                        </Routes>
                    </Suspense>
                </Layout>
            </Router>
        </AuthProvider>
    )
}