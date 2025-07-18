import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthProvider from './contexts/AuthContext'  // ✅ DEFAULT import
import Layout from './components/common/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'

const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const ListingDetailPage = lazy(() => import('./pages/ListingDetailPage'))
const CreateListingPage = lazy(() => import('./pages/CreateListingPage'))
const SellerSetupPage = lazy(() => import('./pages/SellerSetupPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
)

function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/categories" element={<CategoryPage />} />
                            <Route path="/category/:id" element={<CategoryPage />} />
                            <Route path="/product/:id" element={<ListingDetailPage />} />
                            <Routepath="/profile" element={<ProfilePage />} />
                        <Route path="/upgrade-to-seller" element={<UpgradeToSellerPage />} />
                        <Route path="/profile" element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            } />
                            <Route path="/create-listing" element={
                                <ProtectedRoute>
                                    <CreateListingPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/seller/setup" element={
                                <ProtectedRoute>
                                    <SellerSetupPage />
                                </ProtectedRoute>
                            } />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Suspense>
                </Layout>
            </Router>
        </AuthProvider>
    )
}

export default App