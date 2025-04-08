import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';


const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});



export const getCsrfToken = async (): Promise<string | null> => {
  // Helper to read CSRF from cookies
  const getFromCookies = (): string | null => {
    const cookies = document.cookie.split(";").map(cookie => cookie.trim());
    const csrf = cookies.find(cookie => cookie.startsWith("csrftoken="));
    return csrf ? decodeURIComponent(csrf.split("=")[1]) : null;
  };

  // Try to get token from cookie first
  let token = getFromCookies();
  console.log("cookieToken:",token)

  // If not found, try fetching from API
  if (!token) {
    try {
      const response = await api.get('/user/get_csrf/');
      token = response.data?.csrfToken || null; // assumes API returns { csrfToken: "..." }
      console.log("apiToken:",token);

    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
      return null;
    }
  }

  return token;
};


import { User, LoginCredentials, RegisterCredentials } from '../types/User';

export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await api.post('/user/account/signin/', credentials);
    toast.success(response.data.message || 'Login successful');
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log(error)
      toast.error(error.response.data.message || 'Login failed', {
        description: error.response.data.detail || error.message || String(error)
      });
      throw new Error(error.response.data.message || 'Login failed');
    }
    toast.error('Login failed', {
      description: error instanceof Error ? error.message : String(error)
    });
    throw new Error('Login failed');
  }
};

export const register = async (credentials: RegisterCredentials): Promise<User> => {
  try {
    const response = await api.post('/user/account/signup/', credentials);
    toast.success(response.data.message || 'Registration successful');
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      toast.error(error.response.data.message || 'Registration failed', {
        description: error.response.data.description || error.message || String(error)
      });
      throw new Error(error.response.data.message || 'Registration failed');
    }
    toast.error('Registration failed', {
      description: error instanceof Error ? error.message : String(error)
    });
    throw new Error('Registration failed');
  }
};

export const fetchUserProfile = async (): Promise<User> => {
  try {
    // const csrfToken = await getCsrfToken();
    const response = await api.get('/user/getuser/');
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // toast.error(error.response.data.message || 'Failed to fetch user', {
      //   description: error.response.data.description || error.message || String(error)
      // });
      throw new Error(error.response.data.message || 'Failed to fetch user profile');
    }
    // toast.error('Failed to fetch user profile', {
    //   description: error instanceof Error ? error.message : String(error)
    // });
    throw new Error('Failed to fetch user profile');
  }
};

export const logout = async (): Promise<void> => {
  try {
    // const csrfToken = await getCsrfToken();
    const response = await api.post('/user/account/logout/');
    toast.success(response.data.message || 'Logged out successfully');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log(error)
      toast.error(error.response.data.message || 'Logout failed', {
        description: error.response.data.detail || error.response || String(error)
      });
      throw new Error(error.response.data.message || 'Logout failed');
    }
    toast.error('Logout failed', {
      description: error instanceof Error ? error.message : String(error)
    });
    throw new Error('Logout failed');
  }
};

api.interceptors.request.use(
  async (config) => {
    if (config.method !== 'get') {
      const csrfToken = await getCsrfToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
