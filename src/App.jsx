import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/common/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductPage from './pages/ProductPage'
import ProfilePage from './pages/ProfilePage'
import CategoryPage from './pages/CategoryPage'
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
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    )
}

export default App