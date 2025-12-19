import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import DashboardPage from '../pages/DashboardPage'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

const Protected = ({ roles, children }: { roles?: string[]; children: JSX.Element }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

const AppRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route
        path="/dashboard"
        element={
          <Protected roles={['seller', 'admin']}>
            <DashboardPage />
          </Protected>
        }
      />
    </Routes>
  </Layout>
)

export default AppRoutes
