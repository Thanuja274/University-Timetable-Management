import { useState, useEffect, useCallback } from 'react';
import { getNotifications, markNotificationAsRead } from '../utils/supabase/database';
import { toast } from 'sonner@2.0.3';

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!userId) return;
    
    try {
      const data = await getNotifications(userId);
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    // Load initial notifications
    loadNotifications();

    // Poll for new notifications every 10 seconds
    const pollInterval = setInterval(() => {
      loadNotifications();
    }, 10000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [userId, loadNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(userId, notificationId);
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(n => markNotificationAsRead(userId, n.id))
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    unreadCount: notifications.filter(n => !n.read).length,
    refresh: loadNotifications
  };
}
