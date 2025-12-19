import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user, logout } = useAuth()
  const { items } = useCart()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-primary font-bold text-xl">
            Daraz MVP
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            {user?.role === 'seller' && (
              <Link to="/dashboard" className="hover:text-primary">
                Seller Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/dashboard" className="hover:text-primary">
                Admin
              </Link>
            )}
            <Link to="/" className="hover:text-primary">
              Cart ({items.length})
            </Link>
            {user ? (
              <button onClick={logout} className="btn-primary text-sm">
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn-primary text-sm">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">{children}</main>
      <footer className="bg-slate-900 text-white text-center py-4">Multi-vendor commerce MVP</footer>
    </div>
  )
}

export default Layout
