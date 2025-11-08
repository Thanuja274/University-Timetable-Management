import { supabase } from './client';
import { RealtimeChannel } from '@supabase/supabase-js';

type NotificationCallback = (notification: any) => void;

let notificationChannel: RealtimeChannel | null = null;

// Subscribe to real-time notifications for a specific user
export const subscribeToNotifications = (userId: string, callback: NotificationCallback) => {
  // Clean up existing subscription
  if (notificationChannel) {
    supabase.removeChannel(notificationChannel);
  }

  // For KV store, we'll poll for new notifications every 5 seconds
  // This is a fallback since Realtime requires proper table setup
  let lastCheck = Date.now();
  
  const pollInterval = setInterval(async () => {
    try {
      // This would normally use Realtime, but for KV store we poll
      // In a production environment, you'd set up proper Realtime with database triggers
      const response = await fetch('/api/notifications/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, since: lastCheck })
      }).catch(() => null);
      
      if (response?.ok) {
        const newNotifications = await response.json();
        newNotifications.forEach(callback);
      }
      
      lastCheck = Date.now();
    } catch (error) {
      console.error('Error polling notifications:', error);
    }
  }, 5000);

  return () => {
    clearInterval(pollInterval);
    if (notificationChannel) {
      supabase.removeChannel(notificationChannel);
      notificationChannel = null;
    }
  };
};

// Subscribe to timetable changes
export const subscribeToTimetableChanges = (
  department: string,
  semester: string,
  callback: (timetable: any) => void
) => {
  // Poll for timetable changes every 10 seconds
  let lastUpdate = Date.now();
  
  const pollInterval = setInterval(async () => {
    try {
      // In production, this would use Realtime
      // For now, we'll rely on manual refreshes
    } catch (error) {
      console.error('Error checking timetable changes:', error);
    }
  }, 10000);

  return () => {
    clearInterval(pollInterval);
  };
};

// Subscribe to substitution request updates
export const subscribeToSubstitutionRequests = (
  facultyId: string,
  callback: (requests: any[]) => void
) => {
  // Poll for request updates every 10 seconds
  const pollInterval = setInterval(async () => {
    try {
      // In production, this would use Realtime
    } catch (error) {
      console.error('Error checking substitution requests:', error);
    }
  }, 10000);

  return () => {
    clearInterval(pollInterval);
  };
};

// Subscribe to availability changes
export const subscribeToAvailability = (
  facultyId: string,
  callback: (availability: any) => void
) => {
  // Poll for availability updates every 10 seconds
  const pollInterval = setInterval(async () => {
    try {
      // In production, this would use Realtime
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  }, 10000);

  return () => {
    clearInterval(pollInterval);
  };
};
