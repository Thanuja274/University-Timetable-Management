import { ReactNode, useState } from 'react';
import { Button } from '../ui/button';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { NotificationPanel } from './NotificationPanel';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useNotifications } from '../../hooks/useNotifications';

interface DashboardLayoutProps {
  children: ReactNode;
  user: any;
  onLogout: () => void;
  navigation: Array<{
    label: string;
    icon: ReactNode;
    active?: boolean;
    onClick: () => void;
  }>;
}

export function DashboardLayout({
  children,
  user,
  onLogout,
  navigation,
}: DashboardLayoutProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Use real-time notifications hook
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user.id);

  const NavigationContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-gray-900">{user.name}</p>
            <p className="text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.onClick();
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              item.active
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 shadow-sm">
        <NavigationContent />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <NavigationContent />
          </SheetContent>
        </Sheet>

        <span className="text-gray-900">{user.name}</span>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </header>

      {/* Main Content */}
      <main className="md:ml-64 pt-16 md:pt-0">
        {/* Top Bar */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
          <div>
            <h2 className="text-gray-900">UniSchedule</h2>
            <p className="text-gray-600">Welcome back, {user.name}</p>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500">{unreadCount}</Badge>
            )}
          </Button>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8">{children}</div>
      </main>

      {/* Notification Panel */}
      {showNotifications && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowNotifications(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-full md:w-96 bg-white shadow-2xl z-50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-gray-900">Notifications</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <NotificationPanel 
              notifications={notifications} 
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
            />
          </div>
        </>
      )}
    </div>
  );
}
