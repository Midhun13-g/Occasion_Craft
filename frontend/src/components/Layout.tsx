import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Sparkles, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-900">Occasion Craft</span>
            </Link>

            <div className="flex items-center space-x-6">
              <Link
                to="/templates"
                className="text-slate-700 hover:text-blue-600 font-medium transition"
              >
                Templates
              </Link>
              
              {isAuthenticated && user?.role?.includes('ADMIN') && (
                <Link
                  to="/admin"
                  className="text-slate-700 hover:text-blue-600 font-medium transition"
                >
                  Admin
                </Link>
              )}
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user?.name || user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-slate-700 hover:text-red-600 font-medium transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-1 text-slate-700 hover:text-blue-600 font-medium transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
