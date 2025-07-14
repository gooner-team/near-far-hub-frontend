import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import ProfilePage from './pages/ProfilePage'
import CategoryPage from './pages/CategoryPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/category/:category" element={<CategoryPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Layout>
        </Router>
    )
}

export default App