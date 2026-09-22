import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { apiClient } from '../services/apiClient';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isLoggedIn: boolean;
  tier: 'iQOO Monster Pilot' | 'Standard Explorer';
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalType: 'signin' | 'signup';
  openAuthModal: (type?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  signInMock: (email: string) => Promise<boolean>;
  signUpMock: (name: string, email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'signin' | 'signup'>('signin');

  const openAuthModal = (type: 'signin' | 'signup' = 'signin') => {
    setAuthModalType(type);
    setError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setError(null);
  };

  const clearError = () => setError(null);

  // Helper to format Supabase user into frontend UserProfile
  const mapSupabaseUser = (sbUser: any): UserProfile => {
    const fullName =
      sbUser.user_metadata?.full_name ||
      sbUser.user_metadata?.name ||
      sbUser.email?.split('@')[0] ||
      'iQOO Pilot';

    return {
      id: sbUser.id,
      name: fullName,
      email: sbUser.email || '',
      avatarUrl: sbUser.user_metadata?.avatar_url,
      isLoggedIn: true,
      tier: 'iQOO Monster Pilot',
    };
  };

  // Restore session & listen to auth state changes
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        if (!isSupabaseConfigured()) {
          // Check local storage for prototype offline session
          const savedMock = localStorage.getItem('iqoo_mock_user');
          if (savedMock && isMounted) {
            setUser(JSON.parse(savedMock));
          }
          if (isMounted) setIsLoading(false);
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session?.user && isMounted) {
          setUser(mapSupabaseUser(session.user));
          // Optionally ping backend session validation
          try {
            await apiClient.get('/auth/me');
          } catch {
            // Silently allow local auth session if backend is momentarily unreachable
          }
        }
      } catch (err: any) {
        console.warn('Auth initialization error:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to Supabase auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        // Only clear if not in standalone mock mode
        if (isSupabaseConfigured()) {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Real Supabase Sign In
  const signIn = useCallback(
    async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
      setError(null);
      setIsLoading(true);

      try {
        if (!isSupabaseConfigured() || !password) {
          // Local prototype fallback
          const mockUser: UserProfile = {
            name: email.split('@')[0] || 'iQOO Pilot',
            email,
            isLoggedIn: true,
            tier: 'iQOO Monster Pilot',
          };
          setUser(mockUser);
          localStorage.setItem('iqoo_mock_user', JSON.stringify(mockUser));
          setIsAuthModalOpen(false);
          return { success: true };
        }

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          const message =
            signInError.message === 'Invalid login credentials'
              ? 'Invalid email or password. Please check your credentials.'
              : signInError.message;
          setError(message);
          return { success: false, error: message };
        }

        if (data.user) {
          setUser(mapSupabaseUser(data.user));
          setIsAuthModalOpen(false);
          return { success: true };
        }

        return { success: false, error: 'Sign in failed.' };
      } catch (err: any) {
        const msg = err.message || 'An unexpected error occurred during sign in.';
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Real Supabase Sign Up
  const signUp = useCallback(
    async (
      name: string,
      email: string,
      password?: string
    ): Promise<{ success: boolean; error?: string; message?: string }> => {
      setError(null);
      setIsLoading(true);

      try {
        if (!isSupabaseConfigured() || !password) {
          // Local prototype fallback
          const mockUser: UserProfile = {
            name: name || 'iQOO Pilot',
            email,
            isLoggedIn: true,
            tier: 'iQOO Monster Pilot',
          };
          setUser(mockUser);
          localStorage.setItem('iqoo_mock_user', JSON.stringify(mockUser));
          setIsAuthModalOpen(false);
          return { success: true };
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          return { success: false, error: signUpError.message };
        }

        if (data.user) {
          // If auto-confirmed or session established
          if (data.session) {
            setUser(mapSupabaseUser(data.user));
            setIsAuthModalOpen(false);
            return { success: true };
          }
          // If email confirmation is required
          return {
            success: true,
            message: 'Registration successful! Please check your email to confirm your account.',
          };
        }

        return { success: false, error: 'Sign up failed.' };
      } catch (err: any) {
        const msg = err.message || 'An unexpected error occurred during sign up.';
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Backward compatibility mock aliases
  const signInMock = useCallback(
    async (email: string): Promise<boolean> => {
      const res = await signIn(email);
      return res.success;
    },
    [signIn]
  );

  const signUpMock = useCallback(
    async (name: string, email: string): Promise<boolean> => {
      const res = await signUp(name, email);
      return res.success;
    },
    [signUp]
  );

  // Sign Out
  const signOut = useCallback(async () => {
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
        try {
          await apiClient.post('/auth/logout');
        } catch {
          // continue
        }
      }
    } catch (err) {
      console.warn('Sign out error:', err);
    } finally {
      localStorage.removeItem('iqoo_mock_user');
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthModalOpen,
        authModalType,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        signInMock,
        signUpMock,
        signOut,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
