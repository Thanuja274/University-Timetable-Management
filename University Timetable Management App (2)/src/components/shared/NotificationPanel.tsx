import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Bell, CheckCircle, AlertCircle, Info, Calendar, Check } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'schedule';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
}

export function NotificationPanel({ notifications, onMarkAsRead, onMarkAllAsRead }: NotificationPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'schedule':
        return <Calendar className="w-5 h-5 text-indigo-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'schedule':
        return 'bg-indigo-50 border-indigo-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return date.toLocaleDateString();
    } catch {
      return timeString;
    }
  };

  return (
    <>
      {onMarkAllAsRead && notifications.some(n => !n.read) && (
        <div className="p-4 border-b border-gray-200">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onMarkAllAsRead}
            className="w-full"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        </div>
      )}
      <ScrollArea className="h-[calc(100vh-145px)]">
        <div className="p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${getBgColor(
                  notification.type
                )} ${notification.read ? 'opacity-60' : ''}`}
                onClick={() => onMarkAsRead && !notification.read && onMarkAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-gray-900">{notification.title}</p>
                      {!notification.read && (
                        <Badge variant="secondary" className="bg-indigo-600 text-white text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-gray-400">{formatTime(notification.time)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </>
  );
}
