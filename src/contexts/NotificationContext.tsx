'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Notification {
    _id: string;
    recipientEmail: string;
    type: 'help_offered' | 'help_requested' | 'new_post' | 'post_resolved' | 'system';
    title: string;
    message: string;
    postId?: string;
    postTitle?: string;
    senderName?: string;
    senderEmail?: string;
    isRead: boolean;
    urgency?: 'Low' | 'Medium' | 'High';
    createdAt: string;
}

interface Toast {
    id: string;
    notification: Notification;
    visible: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    toasts: Toast[];
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    dismissToast: (id: string) => void;
    showToast: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const POLLING_INTERVAL = 30000; // 30 seconds

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { user, isLoggedIn } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);

    // Use refs to avoid dependency issues
    const lastFetchedIdsRef = useRef<Set<string>>(new Set());
    const isFirstFetchRef = useRef(true);

    const showToast = useCallback((notification: Notification) => {
        const id = `toast-${notification._id}-${Date.now()}`;
        setToasts(prev => [...prev, { id, notification, visible: true }]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            setToasts(prev =>
                prev.map(t => t.id === id ? { ...t, visible: false } : t)
            );
            // Remove from DOM after animation
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 300);
        }, 5000);
    }, []);

    const fetchNotifications = useCallback(async () => {
        if (!user?.email) return;

        try {
            setIsLoading(true);
            const res = await fetch(`/api/notifications?email=${encodeURIComponent(user.email)}&limit=50`);
            if (res.ok) {
                const data = await res.json();
                const newNotifications = data.notifications as Notification[];

                // Only show toasts for new notifications (not on first load)
                if (!isFirstFetchRef.current && lastFetchedIdsRef.current.size > 0) {
                    const newUnread = newNotifications.filter(
                        n => !n.isRead && !lastFetchedIdsRef.current.has(n._id)
                    );
                    newUnread.forEach(n => showToast(n));
                }

                // Update ref with current IDs
                lastFetchedIdsRef.current = new Set(newNotifications.map(n => n._id));
                isFirstFetchRef.current = false;

                setNotifications(newNotifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.email, showToast]);

    const markAsRead = useCallback(async (id: string) => {
        try {
            const res = await fetch(`/api/notifications/${id}/read`, {
                method: 'PATCH'
            });
            if (res.ok) {
                setNotifications(prev =>
                    prev.map(n => n._id === id ? { ...n, isRead: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        if (!user?.email) return;

        try {
            const res = await fetch('/api/notifications/read-all', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email })
            });
            if (res.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    }, [user?.email]);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev =>
            prev.map(t => t.id === id ? { ...t, visible: false } : t)
        );
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 300);
    }, []);

    // Initial fetch and polling - only depend on isLoggedIn and user?.email
    useEffect(() => {
        if (!isLoggedIn || !user?.email) {
            setNotifications([]);
            setUnreadCount(0);
            lastFetchedIdsRef.current = new Set();
            isFirstFetchRef.current = true;
            return;
        }

        // Initial fetch
        fetchNotifications();

        // Set up polling interval
        const interval = setInterval(fetchNotifications, POLLING_INTERVAL);

        return () => clearInterval(interval);
    }, [isLoggedIn, user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            isLoading,
            toasts,
            fetchNotifications,
            markAsRead,
            markAllAsRead,
            dismissToast,
            showToast
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
