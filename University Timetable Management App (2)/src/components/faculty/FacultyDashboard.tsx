import { useState } from 'react';
import { DashboardLayout } from '../shared/DashboardLayout';
import { FacultyOverview } from './FacultyOverview';
import { MySchedule } from './MySchedule';
import { AvailabilityManager } from './AvailabilityManager';
import { SubstitutionRequests } from './SubstitutionRequests';
import { LayoutDashboard, Calendar, Clock, RefreshCw } from 'lucide-react';

interface FacultyDashboardProps {
  user: any;
  onLogout: () => void;
}

export function FacultyDashboard({ user, onLogout }: FacultyDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const navigation = [
    {
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
      active: activeTab === 'overview',
      onClick: () => setActiveTab('overview'),
    },
    {
      label: 'My Schedule',
      icon: <Calendar className="w-5 h-5" />,
      active: activeTab === 'schedule',
      onClick: () => setActiveTab('schedule'),
    },
    {
      label: 'Availability',
      icon: <Clock className="w-5 h-5" />,
      active: activeTab === 'availability',
      onClick: () => setActiveTab('availability'),
    },
    {
      label: 'Substitutions',
      icon: <RefreshCw className="w-5 h-5" />,
      active: activeTab === 'substitutions',
      onClick: () => setActiveTab('substitutions'),
    },
  ];

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      navigation={navigation}
    >
      {activeTab === 'overview' && <FacultyOverview user={user} />}
      {activeTab === 'schedule' && <MySchedule user={user} />}
      {activeTab === 'availability' && <AvailabilityManager user={user} />}
      {activeTab === 'substitutions' && <SubstitutionRequests user={user} />}
    </DashboardLayout>
  );
}
