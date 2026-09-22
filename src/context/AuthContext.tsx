import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  isLoggedIn: boolean;
  tier: 'iQOO Monster Pilot' | 'Standard Explorer';
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  authModalType: 'signin' | 'signup';
  openAuthModal: (type?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  signInMock: (email: string) => Promise<boolean>;
  signUpMock: (name: string, email: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'signin' | 'signup'>('signin');

  const openAuthModal = (type: 'signin' | 'signup' = 'signin') => {
    setAuthModalType(type);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signInMock = async (email: string): Promise<boolean> => {
    // Simulated auth delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    setUser({
      name: email.split('@')[0] || 'iQOO Pilot',
      email,
      isLoggedIn: true,
      tier: 'iQOO Monster Pilot',
    });
    setIsAuthModalOpen(false);
    return true;
  };

  const signUpMock = async (name: string, email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    setUser({
      name: name || 'iQOO Pilot',
      email,
      isLoggedIn: true,
      tier: 'iQOO Monster Pilot',
    });
    setIsAuthModalOpen(false);
    return true;
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        authModalType,
        openAuthModal,
        closeAuthModal,
        signInMock,
        signUpMock,
        signOut,
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
