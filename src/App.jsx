import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/common/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import MobileNavigation from './components/common/MobileNavigation'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/LoginPage'
import ProductPage from './pages/products/ProductPage'
import ProfilePage from './pages/profile/ProfilePage'
import CategoryPage from './pages/categories/CategoryPage'
import CategoriesPage from './pages/categories/CategoriesPage'
import SellerSetupPage from './pages/profile/SellerSetupPage'
import NotFoundPage from './pages/NotFoundPage'
import UpgradeToSellerPage from './pages/profile/UpgradeToSellerPage'

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="min-h-screen-mobile bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                        <Layout>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/categories" element={<CategoriesPage />} />
                                <Route path="/category/:category" element={<CategoryPage />} />
                                <Route path="/product/:id" element={<ProductPage />} />
                                <Route path="/upgrade-to-seller" element={<UpgradeToSellerPage />} />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <ProfilePage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/sell"
                                    element={
                                        <ProtectedRoute>
                                            <SellerSetupPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/seller/setup"
                                    element={
                                        <ProtectedRoute>
                                            <SellerSetupPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>

                            {/* Mobile Navigation */}
                            <MobileNavigation />
                        </Layout>
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App