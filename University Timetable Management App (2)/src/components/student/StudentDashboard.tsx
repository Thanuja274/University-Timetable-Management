import { useState } from 'react';
import { DashboardLayout } from '../shared/DashboardLayout';
import { StudentOverview } from './StudentOverview';
import { StudentTimetable } from './StudentTimetable';
import { LayoutDashboard, Calendar } from 'lucide-react';

interface StudentDashboardProps {
  user: any;
  onLogout: () => void;
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const navigation = [
    {
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
      active: activeTab === 'overview',
      onClick: () => setActiveTab('overview'),
    },
    {
      label: 'My Timetable',
      icon: <Calendar className="w-5 h-5" />,
      active: activeTab === 'timetable',
      onClick: () => setActiveTab('timetable'),
    },
  ];

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      navigation={navigation}
    >
      {activeTab === 'overview' && <StudentOverview user={user} />}
      {activeTab === 'timetable' && <StudentTimetable user={user} />}
    </DashboardLayout>
  );
}
