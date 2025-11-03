
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { Room, User, Message, Role, Report } from '../types';
import { INITIAL_ROOMS, BOT_USER } from '../constants';
import { AuthContext } from './AuthContext';
import { getBotResponse } from '../services/geminiService';
import { useSound } from '../hooks/useSound';

interface ChatContextProps {
  rooms: Room[];
  currentRoom: Room | null;
  users: User[];
  messages: Message[];
  reports: Report[];
  joinRoom: (room: Room, password?: string) => boolean;
  leaveRoom: () => void;
  sendMessage: (text: string) => void;
  kickUser: (userId: string) => void;
  deleteMessage: (roomId: string, messageId: string) => void;
  createRoom: (name: string, isPrivate: boolean, password?: string, color?: string) => void;
  reportMessage: (message: Message) => void;
  startPrivateChat: (targetUser: User) => void;
  getPrivateChatPartner: (room: Room) => User | undefined;
  resolveReport: (reportId: string, action: 'dismiss' | 'delete') => void;
}

export const ChatContext = createContext<ChatContextProps>({} as ChatContextProps);

const MESSAGE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  
  const [allMessages, setAllMessages] = useState<{ [roomId: string]: Message[] }>(() => {
    const savedMessages = localStorage.getItem('chatzone-messages');
    const parsed = savedMessages ? JSON.parse(savedMessages) : {};
    // Clean up expired messages on load
    const now = Date.now();
    for (const roomId in parsed) {
      parsed[roomId] = parsed[roomId].filter((msg: Message) => (now - msg.timestamp) < MESSAGE_EXPIRATION_MS);
    }
    return parsed;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const savedReports = localStorage.getItem('chatzone-reports');
    return savedReports ? JSON.parse(savedReports) : [];
  });
  
  const notificationSound = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gUmVjb3JkZWQgYnkgU1VCVEYuTE9M Banj'
  const playNotification = useSound(notificationSound);
  
  const messages = currentRoom ? allMessages[currentRoom.id] || [] : [];

  useEffect(() => {
    localStorage.setItem('chatzone-messages', JSON.stringify(allMessages));
  }, [allMessages]);

  useEffect(() => {
    localStorage.setItem('chatzone-reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    if (currentRoom && user) {
        const currentParticipants = currentRoom.isPrivateChat 
            ? [user, getPrivateChatPartner(currentRoom)!].filter(Boolean)
            : [user, BOT_USER];
      setUsers(currentParticipants);

      if (!allMessages[currentRoom.id]) {
         const welcomeText = currentRoom.isPrivateChat 
            ? `Started a private chat with ${getPrivateChatPartner(currentRoom)?.nickname}.`
            : `Welcome ${user.nickname} to ${currentRoom.name}!`;
            
        const welcomeMessage = {
          id: `msg-${Date.now()}`,
          user: BOT_USER,
          text: welcomeText,
          timestamp: Date.now(),
        };
        setAllMessages(prev => ({...prev, [currentRoom.id]: [welcomeMessage]}));
      }
    } else {
      setUsers([]);
    }
  }, [currentRoom, user]);

  const getPrivateChatPartner = (room: Room): User | undefined => {
      if (!room.isPrivateChat || !user) return undefined;
      const partnerId = room.participants?.find(id => id !== user.id);
      // In a real app, you'd look this user up from a central user list
      // For now, we'll check the current users in the room.
      return users.find(u => u.id === partnerId);
  }

  const joinRoom = (room: Room, password?: string): boolean => {
    if (room.isPrivate && user?.role !== Role.ADMIN && room.password !== password) {
      return false;
    }
    setCurrentRoom(room);
    return true;
  };
  
  const startPrivateChat = (targetUser: User) => {
    if (!user || user.id === targetUser.id) return;
    
    const sortedIds: [string, string] = [user.id, targetUser.id].sort() as [string, string];
    const roomId = `private-${sortedIds.join('-')}`;
    
    const existingRoom = rooms.find(r => r.id === roomId);
    if(existingRoom) {
        setCurrentRoom(existingRoom);
    } else {
        const newPrivateRoom: Room = {
            id: roomId,
            name: `${user.nickname} & ${targetUser.nickname}`,
            isPrivate: true,
            isPrivateChat: true,
            participants: sortedIds,
        };
        setRooms(prev => [...prev, newPrivateRoom]);
        setCurrentRoom(newPrivateRoom);
    }
  }

  const leaveRoom = () => {
    setCurrentRoom(null);
  };
  
  const createRoom = (name: string, isPrivate: boolean, password?: string, color?: string) => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name,
      isPrivate,
      password: isPrivate ? password : undefined,
      color: color || '#3b82f6',
    };
    setRooms(prev => [...prev, newRoom]);
  };

  const addMessage = (roomId: string, message: Message) => {
     setAllMessages(prev => {
         const existing = prev[roomId] || [];
         const now = Date.now();
         const updated = [...existing, message].filter(msg => (now - msg.timestamp) < MESSAGE_EXPIRATION_MS);
         return {...prev, [roomId]: updated};
     });
     if (message.user.id !== user?.id) {
         playNotification();
     }
  }

  const sendMessage = async (text: string) => {
    if (!user || !currentRoom) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      user,
      text,
      timestamp: Date.now(),
    };
    addMessage(currentRoom.id, newMessage);

    if (!currentRoom.isPrivateChat) {
        const updatedHistory = [...(allMessages[currentRoom.id] || []), newMessage];
        setTimeout(async () => {
            const botResponseText = await getBotResponse(updatedHistory);
            const botMessage: Message = {
                id: `msg-${Date.now() + 1}`,
                user: BOT_USER,
                text: botResponseText,
                timestamp: Date.now(),
            };
            addMessage(currentRoom.id, botMessage);
        }, 1000);
    }
  };

  const kickUser = (userId: string) => {
    if (user?.id === userId) {
        alert("You have been kicked.");
        leaveRoom();
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const deleteMessage = (roomId: string, messageId: string) => {
    if (!roomId) return;
    setAllMessages(prev => ({
        ...prev,
        [roomId]: prev[roomId]?.filter(msg => msg.id !== messageId) || []
    }));
  };
  
  const reportMessage = (message: Message) => {
    if (!user) return;
    const newReport: Report = {
        id: `report-${Date.now()}`,
        message,
        reportedBy: user,
        timestamp: Date.now(),
        status: 'pending',
    };
    setReports(prev => [...prev, newReport]);
    alert(`Message from ${message.user.nickname} has been reported.`);
  }

  const resolveReport = (reportId: string, action: 'dismiss' | 'delete') => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    if (action === 'delete') {
      // FIX: Correctly find the room that contains the message to be deleted.
      // The previous logic was flawed and could select the wrong room, which may have caused the TypeScript error.
      const room = rooms.find(room => allMessages[room.id]?.some(m => m.id === report.message.id));
      if(room){
        deleteMessage(room.id, report.message.id);
      }
    }
    setReports(prev => prev.filter(r => r.id !== reportId));
  }

  return (
    <ChatContext.Provider value={{ rooms, currentRoom, users, messages, reports, joinRoom, leaveRoom, sendMessage, kickUser, deleteMessage, createRoom, reportMessage, startPrivateChat, getPrivateChatPartner, resolveReport }}>
      {children}
    </ChatContext.Provider>
  );
};