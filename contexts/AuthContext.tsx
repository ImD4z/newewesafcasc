import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import { ADMIN_USER, DEFAULT_PROFILE_PICTURE } from '../constants';

type LoginResult = {
  success: boolean;
  reason?: 'incorrectPassword' | 'banned';
  expiry?: number;
}

interface AuthContextProps {
  user: User | null;
  moderators: User[];
  pictureGallery: string[];
  bannedUsers: { [nickname: string]: number };
  login: (nickname: string, profilePicture: string, password?: string) => LoginResult;
  loginAsAdmin: (password: string) => boolean;
  logout: () => void;
  updateAdminPassword: (newPassword: string) => void;
  addModerator: (mod: User) => void;
  removeModerator: (modId: string) => void;
  addPictureToGallery: (url: string) => void;
  removePictureFromGallery: (url: string) => void;
  banUser: (nickname: string, durationMinutes: number) => void;
  unbanUser: (nickname: string) => void;
}

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = sessionStorage.getItem('chatzone-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [moderators, setModerators] = useState<User[]>(() => {
    const savedMods = localStorage.getItem('chatzone-moderators');
    return savedMods ? JSON.parse(savedMods) : [];
  });

  const [pictureGallery, setPictureGallery] = useState<string[]>(() => {
    const savedGallery = localStorage.getItem('chatzone-gallery');
    const gallery = savedGallery ? JSON.parse(savedGallery) : [];
    return [DEFAULT_PROFILE_PICTURE, ...gallery];
  });

  const [bannedUsers, setBannedUsers] = useState<{ [nickname: string]: number }>(() => {
    const savedBans = localStorage.getItem('chatzone-banned-users');
    const bans = savedBans ? JSON.parse(savedBans) : {};
    // Clean up expired bans on load
    const now = Date.now();
    for (const nickname in bans) {
        if (bans[nickname] < now) {
            delete bans[nickname];
        }
    }
    return bans;
  });

  const getAdminPassword = (): string => {
    return localStorage.getItem('chatzone-admin-password') || ADMIN_USER.password!;
  };

  useEffect(() => {
    // Set default admin password if not already set
    if (!localStorage.getItem('chatzone-admin-password')) {
      localStorage.setItem('chatzone-admin-password', ADMIN_USER.password!);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatzone-moderators', JSON.stringify(moderators));
  }, [moderators]);
  
  useEffect(() => {
    // Exclude default pic from saving to avoid duplicates
    const galleryToSave = pictureGallery.filter(p => p !== DEFAULT_PROFILE_PICTURE);
    localStorage.setItem('chatzone-gallery', JSON.stringify(galleryToSave));
  }, [pictureGallery]);

  useEffect(() => {
    localStorage.setItem('chatzone-banned-users', JSON.stringify(bannedUsers));
  }, [bannedUsers]);

  const banUser = (nickname: string, durationMinutes: number) => {
    const expiry = Date.now() + durationMinutes * 60 * 1000;
    setBannedUsers(prev => ({ ...prev, [nickname.toLowerCase()]: expiry }));
  }

  const unbanUser = (nickname: string) => {
    setBannedUsers(prev => {
        const newBans = { ...prev };
        delete newBans[nickname.toLowerCase()];
        return newBans;
    });
  }

  const login = (nickname: string, profilePicture: string, password?: string): LoginResult => {
    const lowerNickname = nickname.toLowerCase();
    const banExpiry = bannedUsers[lowerNickname];
    if (banExpiry && Date.now() < banExpiry) {
        return { success: false, reason: 'banned', expiry: banExpiry };
    }

    const existingMod = moderators.find(m => m.nickname.toLowerCase() === lowerNickname);
    
    if (existingMod) {
        if (existingMod.password === password) {
            const modUser: User = { ...existingMod, role: Role.MODERATOR, profilePicture };
            sessionStorage.setItem('chatzone-user', JSON.stringify(modUser));
            setUser(modUser);
            return { success: true };
        } else {
            return { success: false, reason: 'incorrectPassword' };
        }
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      nickname,
      role: Role.USER,
      profilePicture,
    };
    sessionStorage.setItem('chatzone-user', JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const loginAsAdmin = (password: string): boolean => {
    const storedPassword = getAdminPassword();
    if (password === storedPassword) {
      sessionStorage.setItem('chatzone-user', JSON.stringify(ADMIN_USER));
      setUser(ADMIN_USER);
      return true;
    }
    return false;
  };

  const updateAdminPassword = (newPassword: string) => {
    localStorage.setItem('chatzone-admin-password', newPassword);
  };
  
  const addModerator = (mod: User) => {
    setModerators(prev => [...prev, mod]);
  }

  const removeModerator = (modId: string) => {
    setModerators(prev => prev.filter(m => m.id !== modId));
  }

  const addPictureToGallery = (url: string) => {
    if (!pictureGallery.includes(url)) {
      setPictureGallery(prev => [...prev, url]);
    }
  }

  const removePictureFromGallery = (url: string) => {
    setPictureGallery(prev => prev.filter(p => p !== url));
  }

  const logout = () => {
    sessionStorage.removeItem('chatzone-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, moderators, pictureGallery, bannedUsers, login, loginAsAdmin, logout, addModerator, removeModerator, addPictureToGallery, removePictureFromGallery, updateAdminPassword, banUser, unbanUser }}>
      {children}
    </AuthContext.Provider>
  );
};