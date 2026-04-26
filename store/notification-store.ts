import { create } from "zustand";
import { notificationService, Notification as BackendNotification } from "../services/notification.service";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "info" | "success" | "warning" | "error";
  raw: BackendNotification;
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  isOpen: boolean;
  fetchNotifications: () => Promise<void>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const mapBackendToFrontend = (n: BackendNotification): Notification => {
  // Simple mapping logic based on event_type or payload
  let title = n.event_type.replace(/_/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  let message = n.payload_json?.message || "Nouvelle mise à jour dans votre projet.";
  let type: "info" | "success" | "warning" | "error" = "info";

  if (n.event_type.includes("error") || n.event_type.includes("failed")) type = "error";
  if (n.event_type.includes("success") || n.event_type.includes("completed")) type = "success";
  if (n.event_type.includes("warning") || n.event_type.includes("expired")) type = "warning";

  return {
    id: n.id,
    title,
    message,
    time: new Date(n.created_at).toLocaleDateString("fr-FR", { hour: '2-digit', minute: '2-digit' }),
    isRead: n.is_read,
    type,
    raw: n
  };
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  loading: false,
  isOpen: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const data = await notificationService.getNotifications();
      set({ notifications: data.map(mapBackendToFrontend) });
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      set({ loading: false });
    }
  },

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => {
    const { isOpen, fetchNotifications } = get();
    if (!isOpen) {
      fetchNotifications();
    }
    set({ isOpen: !isOpen });
  },

  markAsRead: async (id) => {
    try {
      await notificationService.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
      }));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      }));
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  },
}));
