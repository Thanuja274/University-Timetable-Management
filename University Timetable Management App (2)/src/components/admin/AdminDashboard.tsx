import { useState } from 'react';
import { DashboardLayout } from '../shared/DashboardLayout';
import { AdminOverview } from './AdminOverview';
import { UploadData } from './UploadData';
import { TimetableGenerator } from './TimetableGenerator';
import { ConstraintsSetup } from './ConstraintsSetup';
import { Analytics } from './Analytics';
import { LayoutDashboard, Upload, Sparkles, Settings, BarChart3 } from 'lucide-react';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const navigation = [
    {
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
      active: activeTab === 'overview',
      onClick: () => setActiveTab('overview'),
    },
    {
      label: 'Upload Data',
      icon: <Upload className="w-5 h-5" />,
      active: activeTab === 'upload',
      onClick: () => setActiveTab('upload'),
    },
    {
      label: 'Generate Timetable',
      icon: <Sparkles className="w-5 h-5" />,
      active: activeTab === 'generate',
      onClick: () => setActiveTab('generate'),
    },
    {
      label: 'Constraints',
      icon: <Settings className="w-5 h-5" />,
      active: activeTab === 'constraints',
      onClick: () => setActiveTab('constraints'),
    },
    {
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      active: activeTab === 'analytics',
      onClick: () => setActiveTab('analytics'),
    },
  ];

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      navigation={navigation}
    >
      {activeTab === 'overview' && <AdminOverview user={user} />}
      {activeTab === 'upload' && <UploadData user={user} />}
      {activeTab === 'generate' && <TimetableGenerator user={user} />}
      {activeTab === 'constraints' && <ConstraintsSetup user={user} />}
      {activeTab === 'analytics' && <Analytics user={user} />}
    </DashboardLayout>
  );
}
