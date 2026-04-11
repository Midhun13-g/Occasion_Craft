import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/authService';

interface User {
  id?: string;
  name?: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await AuthService.login({ email, password });
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('auth_token', response.token);
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await AuthService.register({ name, email, password });
    setUser(response.user);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('auth_token', response.token);
  };

  const logout = () => {
    setUser(null);
    AuthService.logout();
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
