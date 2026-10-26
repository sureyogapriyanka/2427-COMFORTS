import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { apiRequest } from '../lib/api';

export interface AccountUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
}

interface AuthContextValue {
  user: AccountUser | null;
  isLoading: boolean;
  shouldMergeGuestShopping: boolean;
  signIn: (email: string, password: string) => Promise<AccountUser>;
  signUp: (name: string, email: string, password: string) => Promise<AccountUser>;
  updateProfile: (updates: { name?: string; phone?: string }) => Promise<void>;
  completeShoppingSync: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldMergeGuestShopping, setShouldMergeGuestShopping] = useState(false);
  const authRevision = useRef(0);

  useEffect(() => {
    let active = true;
    const revision = authRevision.current;
    apiRequest<AccountUser>('/auth/me')
      .then((account) => {
        if (active && revision === authRevision.current) setUser(account);
      })
      .catch(() => {
        if (active && revision === authRevision.current) setUser(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const account = await apiRequest<AccountUser>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    authRevision.current += 1;
    setShouldMergeGuestShopping(!user);
    setUser(account);
    return account;
  }, [user]);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const account = await apiRequest<AccountUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    authRevision.current += 1;
    setShouldMergeGuestShopping(!user);
    setUser(account);
    return account;
  }, [user]);

  const signOut = useCallback(async () => {
    await apiRequest('/auth/logout', { method: 'POST' });
    authRevision.current += 1;
    setShouldMergeGuestShopping(false);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates: { name?: string; phone?: string }) => {
    const account = await apiRequest<AccountUser>('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    authRevision.current += 1;
    setUser(account);
  }, []);

  const completeShoppingSync = useCallback(() => {
    setShouldMergeGuestShopping(false);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      shouldMergeGuestShopping,
      signIn,
      signUp,
      updateProfile,
      completeShoppingSync,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider.');
  return context;
}
