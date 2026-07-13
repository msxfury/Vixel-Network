import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export type TagType = 'Announcement' | 'Event' | 'Alert';

export interface Announcement {
  id: string;
  title: string;
  description: string;
  links: string;
  tag: TagType;
  banner: string | null;
  timestamp: number;
}

export interface DiscordUser {
  username: string;
  id: string;
  avatarUrl: string;
}

interface AppContextType {
  announcements: Announcement[];
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'timestamp'>) => void;
  deleteAnnouncement: (id: string) => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  user: DiscordUser | null;
  login: (userData?: DiscordUser) => void;
  logout: () => void;
  authError: string | null;
  setAuthError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const saved = localStorage.getItem('vixel_announcements');
      if (saved) {
        setAnnouncements(JSON.parse(saved));
      } else {
        setAnnouncements([
          {
            id: '1',
            title: 'Welcome to Vixel Network',
            description: 'We are thrilled to launch our new website! Join our discord to stay updated.',
            links: 'discord.gg/GDTsV7ttJZ',
            tag: 'Announcement',
            banner: null,
            timestamp: Date.now() - 86400000,
          }
        ]);
      }
      
      // Verify session with server
      try {
          const response = await fetch('/api/auth/me');
          if (response.ok) {
              const data = await response.json();
              setUser(data.user);
              setIsLoggedIn(true);
          } else {
              localStorage.removeItem('vixel_user');
          }
      } catch (e) {
          console.error('Session verification failed', e);
      }

      setIsLoading(false);
      setIsInitialized(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Synchronize state on tab/window focus or localStorage changes (extremely robust for new tabs)
  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem('vixel_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setIsLoggedIn(true);
        } catch (e) {
          console.error(e);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vixel_user') {
        checkUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', checkUser);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', checkUser);
    };
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('vixel_announcements', JSON.stringify(announcements));
    }
  }, [announcements, isInitialized]);

  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'timestamp'>) => {
    const newAnn = {
      ...ann,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setAnnouncements([newAnn, ...announcements]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  const handleLogin = (userData?: DiscordUser) => {
    if (userData) {
      setUser(userData);
      localStorage.setItem('vixel_user', JSON.stringify(userData));
    } else {
      const mockUser = {
        username: 'Vixel_Warrior',
        id: '000000001',
        avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png'
      };
      setUser(mockUser);
      localStorage.setItem('vixel_user', JSON.stringify(mockUser));
    }
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } catch (error) {
      console.error('Logout failed', error);
    }

    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('vixel_user');
  };

  return (
    <AppContext.Provider value={{ 
      announcements, 
      addAnnouncement, 
      deleteAnnouncement, 
      isLoggedIn, 
      isLoading, 
      user, 
      login: handleLogin, 
      logout: handleLogout,
      authError,
      setAuthError
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
