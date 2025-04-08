import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCsrfToken as apiGetCsrfToken,
  fetchUserProfile
} from '../services/api';
import { User, LoginCredentials, RegisterCredentials } from '../types/User';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  getCsrfToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  getCsrfToken: async () => ''
});

export const useAuth = () => useContext(AuthContext);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isAuthenticated = !!user;

  const login = async (credentials: LoginCredentials): Promise<User> => {
    try {
      setIsLoading(true);
      const userData = await apiLogin(credentials);
      setUser(userData);
      return userData;
    }finally{
      setIsLoading(false);
    }
   
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setIsLoading(true);
      await apiRegister(credentials);
    }finally {
      setIsLoading(false);
    }
    
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const getCsrfToken = async () => {
    try {
      const csrfToken = await apiGetCsrfToken();
      return csrfToken || '';
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
      } catch {
        // Silent fail (already handled in API)
      }
    };

    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        getCsrfToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
