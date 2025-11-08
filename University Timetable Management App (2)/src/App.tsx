import { useState, useEffect } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from './components/ui/sonner';
import { supabase } from './utils/supabase/client';
import { getUserProfile, initializeDatabase } from './utils/supabase/database';

type UserRole = 'admin' | 'faculty' | 'student' | null;

interface User {
  name: string;
  email: string;
  role: UserRole;
  id: string;
  department?: string;
  semester?: string;
  section?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize database and seed demo data
    const initialize = async () => {
      await initializeDatabase();
      
      // Seed demo data if needed
      try {
        const { seedDemoData } = await import('./utils/seedDemoData');
        await seedDemoData();
      } catch (error) {
        console.log('Demo data seeding skipped:', error);
      }
    };

    initialize();

    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await getUserProfile(session.user.id);
        if (profile) {
          setUser(profile);
        }
      }
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await getUserProfile(session.user.id);
        if (profile) {
          setUser(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading UniSchedule...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <ErrorBoundary>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      {user.role === 'admin' && <AdminDashboard user={user} onLogout={handleLogout} />}
      {user.role === 'faculty' && <FacultyDashboard user={user} onLogout={handleLogout} />}
      {user.role === 'student' && <StudentDashboard user={user} onLogout={handleLogout} />}
      <Toaster />
    </ErrorBoundary>
  );
}
