import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'business_hours' | 'employee_availability';
  message: string;
  appointmentId: string;
  createdAt: Date;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  hasUnread: () => boolean;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications]
        }));
      },
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },
      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
      hasUnread: () => {
        return get().notifications.some((n) => !n.read);
      },
    }),
    {
      name: 'notification-store',
    }
  )
);