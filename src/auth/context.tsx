import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  api,
  setTokens,
  clearTokens,
  getAccessToken,
  ApiError,
  type User,
} from '../lib/api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      setIsLoading(false);
      return;
    }
    api.getMe()
      .then(setUser)
      .catch(() => {
        clearTokens();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const res = await api.login(email, password);
      setTokens(res.access_token, res.refresh_token);
      const me = await api.getMe();
      setUser(me);
    } catch (e) {
      const msg = e instanceof ApiError && e.status === 401
        ? 'Invalid email or password'
        : e instanceof ApiError
          ? e.message
          : 'An error occurred';
      setError(msg);
      throw e;
    }
  }, []);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    setError(null);
    try {
      const res = await api.register(email, password, displayName);
      setTokens(res.access_token, res.refresh_token);
      const me = await api.getMe();
      setUser(me);
    } catch (e) {
      const msg = e instanceof ApiError && e.status === 409
        ? 'Email already registered'
        : e instanceof ApiError
          ? e.message
          : 'An error occurred';
      setError(msg);
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, setUser, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
