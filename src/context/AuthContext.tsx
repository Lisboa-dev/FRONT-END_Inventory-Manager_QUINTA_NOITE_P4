
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/auth';
import { api } from '../services/api'; // Import the api client

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>; // Modified login function
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = authService.getToken();
      if (savedToken) {
        setToken(savedToken);
        try {
          // Here you should have an endpoint to get the current user
          // For now, let's assume a function getUserProfile exists in the api client
          // const userData = await api.getUserProfile(); 
          // setUser(userData);
        } catch (e) {
          logout(); // Token might be invalid
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (newToken: string) => {
    setIsLoading(true);
    try {
      authService.setToken(newToken);
      setToken(newToken);
      
      // After setting the token, fetch user data
      // This is a placeholder, you'll need an actual API endpoint
      // For example: const userData = await api.getUserProfile();
      // setUser(userData);

      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred during login.');
      logout(); // Clear token if user fetch fails
      throw e; // Re-throw to be caught in the component
    }
    finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.removeToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
