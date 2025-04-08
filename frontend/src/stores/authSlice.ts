import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import api from '../services/api';
import { User, LoginCredentials as Login, RegisterCredentials as Register } from '../types/User';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  csrfToken: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  csrfToken: '',
};

const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (typeof error.response?.data === 'string') return error.response.data;
    if (typeof error.response?.data?.detail === 'string') return error.response.data.detail;
  }
  return 'AuthSlice: Something went wrong';
};

export const getCsrfToken = createAsyncThunk<string>('auth/getCsrfToken', async () => {
  const match = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
});

export const register = createAsyncThunk<User, Register, { rejectValue: string }>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post<User>('/register/', credentials);
      toast.success('Registered successfully!');
      return res.data;
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getUser = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<User>('/user/');
      return res.data;
    } catch (error) {
      const message = extractErrorMessage(error);
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk<User, Login, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post<User>('/login/', credentials);
      toast.success('Logged in successfully!');
      return res.data;
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/logout/');
      toast.success('Logged out successfully!');
    } catch (error) {
      const message = extractErrorMessage(error);
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user';
      })

      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload || 'Login failed';
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload || 'Logout failed';
      })

      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload || 'Registration failed';
      })

      .addCase(getCsrfToken.fulfilled, (state, action: PayloadAction<string>) => {
        state.csrfToken = action.payload;
      });
  },
});

export default authSlice.reducer;
