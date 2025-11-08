import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Calendar, Clock, MapPin, User, BookOpen, GraduationCap, Download, FileText } from 'lucide-react';
import { getCourseMaterials } from '../../utils/supabase/database';
import { toast } from 'sonner@2.0.3';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface StudentOverviewProps {
  user: any;
}

export function StudentOverview({ user }: StudentOverviewProps) {
  const [showCourseMaterials, setShowCourseMaterials] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courseMaterials, setCourseMaterials] = useState<any[]>([]);

  const stats = [
    {
      label: 'Current Semester',
      value: '5',
      subtext: 'CSE Department',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Enrolled Courses',
      value: '8',
      subtext: 'this semester',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Weekly Hours',
      value: '28',
      subtext: 'class hours',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Classes Today',
      value: '5',
      subtext: 'remaining',
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  const weeklyTimetable = [
    { day: 'Monday', time: '9:00 AM - 10:00 AM', subject: 'Data Structures', faculty: 'Dr. Kumar', room: '301' },
    { day: 'Monday', time: '10:00 AM - 11:00 AM', subject: 'Database Management', faculty: 'Prof. Sharma', room: '302' },
    { day: 'Monday', time: '11:00 AM - 12:00 PM', subject: 'Computer Networks', faculty: 'Dr. Singh', room: '303' },
    { day: 'Monday', time: '2:00 PM - 4:00 PM', subject: 'OS Lab', faculty: 'Dr. Patel', room: 'Lab-201' },
    { day: 'Tuesday', time: '9:00 AM - 10:00 AM', subject: 'Operating Systems', faculty: 'Dr. Patel', room: '304' },
    { day: 'Tuesday', time: '10:00 AM - 11:00 AM', subject: 'Machine Learning', faculty: 'Dr. Reddy', room: '305' },
    { day: 'Tuesday', time: '11:00 AM - 12:00 PM', subject: 'Web Technologies', faculty: 'Prof. Gupta', room: '306' },
    { day: 'Wednesday', time: '9:00 AM - 10:00 AM', subject: 'Data Structures', faculty: 'Dr. Kumar', room: '301' },
    { day: 'Wednesday', time: '10:00 AM - 11:00 AM', subject: 'Database Management', faculty: 'Prof. Sharma', room: '302' },
    { day: 'Wednesday', time: '2:00 PM - 4:00 PM', subject: 'CN Lab', faculty: 'Dr. Singh', room: 'Lab-202' },
    { day: 'Thursday', time: '9:00 AM - 10:00 AM', subject: 'Computer Networks', faculty: 'Dr. Singh', room: '303' },
    { day: 'Thursday', time: '10:00 AM - 11:00 AM', subject: 'Operating Systems', faculty: 'Dr. Patel', room: '304' },
    { day: 'Thursday', time: '11:00 AM - 12:00 PM', subject: 'Machine Learning', faculty: 'Dr. Reddy', room: '305' },
    { day: 'Friday', time: '9:00 AM - 10:00 AM', subject: 'Web Technologies', faculty: 'Prof. Gupta', room: '306' },
    { day: 'Friday', time: '10:00 AM - 11:00 AM', subject: 'Data Structures', faculty: 'Dr. Kumar', room: '301' },
    { day: 'Friday', time: '11:00 AM - 12:00 PM', subject: 'Database Management', faculty: 'Prof. Sharma', room: '302' },
  ];

  const todayClasses = [
    {
      time: '9:00 AM - 10:00 AM',
      subject: 'Data Structures',
      faculty: 'Dr. Kumar',
      room: '301',
      type: 'lecture',
      status: 'completed',
    },
    {
      time: '10:00 AM - 11:00 AM',
      subject: 'Database Management',
      faculty: 'Prof. Sharma',
      room: '302',
      type: 'lecture',
      status: 'ongoing',
    },
    {
      time: '11:00 AM - 12:00 PM',
      subject: 'Computer Networks',
      faculty: 'Dr. Singh',
      room: '303',
      type: 'lecture',
      status: 'upcoming',
    },
    {
      time: '2:00 PM - 4:00 PM',
      subject: 'Operating Systems Lab',
      faculty: 'Dr. Patel',
      room: 'Lab-201',
      type: 'lab',
      status: 'upcoming',
    },
    {
      time: '4:00 PM - 5:00 PM',
      subject: 'Machine Learning',
      faculty: 'Dr. Reddy',
      room: '305',
      type: 'lecture',
      status: 'upcoming',
    },
  ];

  const upcomingAssignments = [
    {
      title: 'Data Structures Assignment',
      course: 'CSE401',
      dueDate: 'Nov 10, 2025',
      priority: 'high',
    },
    {
      title: 'DBMS Project Phase 2',
      course: 'CSE402',
      dueDate: 'Nov 12, 2025',
      priority: 'high',
    },
    {
      title: 'CN Lab Report',
      course: 'CSE403L',
      dueDate: 'Nov 15, 2025',
      priority: 'medium',
    },
    {
      title: 'ML Research Paper Review',
      course: 'CSE405',
      dueDate: 'Nov 18, 2025',
      priority: 'low',
    },
  ];

  const enrolledCourses = [
    { 
      id: 'CSE401',
      name: 'Data Structures', 
      code: 'CSE401', 
      credits: 4, 
      faculty: 'Dr. Kumar',
      materials: [
        { id: 1, title: 'Lecture Notes - Week 1', type: 'pdf', uploadedAt: '2025-10-15' },
        { id: 2, title: 'Assignment 1', type: 'pdf', uploadedAt: '2025-10-20' },
        { id: 3, title: 'Previous Year Papers', type: 'pdf', uploadedAt: '2025-10-25' }
      ]
    },
    { 
      id: 'CSE402',
      name: 'Database Management', 
      code: 'CSE402', 
      credits: 4, 
      faculty: 'Prof. Sharma',
      materials: [
        { id: 1, title: 'SQL Tutorial', type: 'pdf', uploadedAt: '2025-10-16' },
        { id: 2, title: 'ER Diagrams Guide', type: 'pdf', uploadedAt: '2025-10-22' }
      ]
    },
    { 
      id: 'CSE403',
      name: 'Computer Networks', 
      code: 'CSE403', 
      credits: 3, 
      faculty: 'Dr. Singh',
      materials: [
        { id: 1, title: 'OSI Model Notes', type: 'pdf', uploadedAt: '2025-10-17' }
      ]
    },
    { 
      id: 'CSE404',
      name: 'Operating Systems', 
      code: 'CSE404', 
      credits: 4, 
      faculty: 'Dr. Patel',
      materials: [
        { id: 1, title: 'Process Scheduling', type: 'pdf', uploadedAt: '2025-10-18' },
        { id: 2, title: 'Memory Management', type: 'pdf', uploadedAt: '2025-10-28' }
      ]
    },
    { 
      id: 'CSE405',
      name: 'Machine Learning', 
      code: 'CSE405', 
      credits: 3, 
      faculty: 'Dr. Reddy',
      materials: []
    },
    { 
      id: 'CSE406',
      name: 'Web Technologies', 
      code: 'CSE406', 
      credits: 3, 
      faculty: 'Prof. Gupta',
      materials: [
        { id: 1, title: 'HTML & CSS Basics', type: 'pdf', uploadedAt: '2025-10-19' }
      ]
    },
    { 
      id: 'CSE404L',
      name: 'OS Lab', 
      code: 'CSE404L', 
      credits: 2, 
      faculty: 'Dr. Patel',
      materials: []
    },
    { 
      id: 'CSE403L',
      name: 'CN Lab', 
      code: 'CSE403L', 
      credits: 2, 
      faculty: 'Dr. Singh',
      materials: []
    },
  ];

  const downloadTimetablePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Student Timetable', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Student: ${user?.name || 'Student Name'}`, 14, 32);
    doc.text(`Section: ${user?.section || 'CSE 5A'}`, 14, 38);
    doc.text(`Semester: ${user?.semester || '5'}`, 14, 44);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 50);
    
    const tableData = weeklyTimetable.map(item => [
      item.day,
      item.time,
      item.subject,
      item.faculty,
      item.room
    ]);
    
    autoTable(doc, {
      startY: 56,
      head: [['Day', 'Time', 'Subject', 'Faculty', 'Room']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] },
    });
    
    const fileName = `Timetable_${user?.name?.replace(/\s/g, '_') || 'Student'}_${user?.section || 'CSE5A'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    toast.success('Timetable downloaded as PDF');
  };

  const handleViewCourseMaterial = async (course: any) => {
    setSelectedCourse(course);
    setCourseMaterials(course.materials || []);
    setShowCourseMaterials(true);
  };

  const handleDownloadMaterial = (material: any) => {
    // Simulate file download
    toast.success(`Downloading ${material.title}...`);
    // In a real app, this would download the actual file from storage
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's your schedule and upcoming deadlines.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-gray-600">{stat.label}</p>
                <p className="text-gray-900">{stat.value}</p>
                <p className="text-gray-500">{stat.subtext}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={downloadTimetablePDF}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Timetable
            </Button>
            <Dialog open={showCourseMaterials} onOpenChange={setShowCourseMaterials}>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Course Materials
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Course Materials</DialogTitle>
                  <DialogDescription>
                    Browse and download materials for your enrolled courses
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-gray-900">{course.name}</p>
                          <p className="text-gray-600">{course.code} - {course.faculty}</p>
                        </div>
                        <Badge variant="outline">
                          {course.materials.length} files
                        </Badge>
                      </div>
                      
                      {course.materials.length > 0 ? (
                        <div className="space-y-2">
                          {course.materials.map((material: any) => (
                            <div 
                              key={material.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-700">{material.title}</span>
                              </div>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleDownloadMaterial(material)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No materials uploaded yet</p>
                      )}
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
            <CardDescription>
              Your schedule for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayClasses.map((cls, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-colors ${
                  cls.status === 'completed'
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : cls.status === 'ongoing'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{cls.time}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      cls.status === 'completed'
                        ? 'bg-gray-200 text-gray-700'
                        : cls.status === 'ongoing'
                        ? 'bg-blue-600 text-white'
                        : cls.type === 'lab'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }
                  >
                    {cls.type}
                  </Badge>
                </div>
                <p className="text-gray-900 mb-2">{cls.subject}</p>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{cls.faculty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{cls.room}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>
              Important deadlines and submissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAssignments.map((assignment, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-gray-900">{assignment.title}</p>
                  <Badge
                    variant="outline"
                    className={
                      assignment.priority === 'high'
                        ? 'border-red-300 text-red-700'
                        : assignment.priority === 'medium'
                        ? 'border-amber-300 text-amber-700'
                        : 'border-green-300 text-green-700'
                    }
                  >
                    {assignment.priority}
                  </Badge>
                </div>
                <div className="space-y-1 text-gray-600">
                  <p>{assignment.course}</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {assignment.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Course List */}
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Courses</CardTitle>
          <CardDescription>
            Your registered courses for Semester 5
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer"
                onClick={() => handleViewCourseMaterial(course)}
              >
                <p className="text-gray-900 mb-1">{course.name}</p>
                <p className="text-gray-600 mb-3">{course.code}</p>
                <div className="flex items-center justify-between text-gray-600">
                  <span>{course.credits} credits</span>
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span className="text-xs">{course.materials.length} files</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
