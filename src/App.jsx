import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/common/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductPage from './pages/ProductPage'
import ProfilePage from './pages/ProfilePage'
import CategoryPage from './pages/CategoryPage'
import SellerSetupPage from './pages/SellerSetupPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/category/:category" element={<CategoryPage />} />
                        <Route path="/product/:id" element={<ProductPage />} />
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
                </Layout>
            </Router>
        </AuthProvider>
    )
}

export default App