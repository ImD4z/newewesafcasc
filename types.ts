export enum Role {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  nickname: string;
  role: Role;
  profilePicture: string;
  color?: string; // For custom moderator colors
  password?: string; // For moderators
}

export interface Message {
  id: string;
  user: User;
  text: string;
  timestamp: number;
  imageUrl?: string;
}

export interface Room {
  id: string;
  name: string;
  isPrivate: boolean;
  color?: string; // For custom room color theme
  password?: string;
  // For private chats
  isPrivateChat?: boolean;
  participants?: [string, string];
}

export interface Report {
    id: string;
    message: Message;
    reportedBy: User;
    timestamp: number;
    status: 'pending' | 'resolved';
}

export type Language = 'ar';
export type Theme = 'light' | 'dark';
