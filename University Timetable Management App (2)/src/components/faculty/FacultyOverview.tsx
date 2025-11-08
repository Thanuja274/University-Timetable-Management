import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Calendar, Clock, MapPin, BookOpen, Users, Download, RefreshCw, CalendarOff, UserX } from 'lucide-react';
import { saveLeaveRequest, saveUnavailability, saveSubstitutionRequest } from '../../utils/supabase/database';
import { toast } from 'sonner@2.0.3';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface FacultyOverviewProps {
  user: any;
}

export function FacultyOverview({ user }: FacultyOverviewProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showUnavailabilityDialog, setShowUnavailabilityDialog] = useState(false);
  const [showSubstitutionDialog, setShowSubstitutionDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Leave request form
  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Unavailability form
  const [unavailabilityForm, setUnavailabilityForm] = useState({
    date: '',
    timeSlots: [] as string[],
    recurring: false,
    reason: ''
  });

  // Substitution request form
  const [substitutionForm, setSubstitutionForm] = useState({
    date: '',
    timeSlot: '',
    subject: '',
    section: '',
    reason: ''
  });

  const stats = [
    {
      label: 'Weekly Hours',
      value: '18',
      subtext: 'of 20 max',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Active Courses',
      value: '4',
      subtext: 'this semester',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Students',
      value: '240',
      subtext: 'across sections',
      icon: <Users className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Classes Today',
      value: '3',
      subtext: 'remaining',
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  const weeklySchedule = [
    { day: 'Monday', time: '10:00 AM - 11:00 AM', subject: 'Data Structures', section: 'CSE 5A', room: '301' },
    { day: 'Monday', time: '11:00 AM - 12:00 PM', subject: 'Algorithms', section: 'CSE 5B', room: '301' },
    { day: 'Monday', time: '2:00 PM - 4:00 PM', subject: 'DS Lab', section: 'CSE 5A', room: 'Lab-201' },
    { day: 'Tuesday', time: '9:00 AM - 10:00 AM', subject: 'Data Structures', section: 'CSE 5B', room: '302' },
    { day: 'Tuesday', time: '10:00 AM - 11:00 AM', subject: 'Algorithms', section: 'CSE 5A', room: '301' },
    { day: 'Wednesday', time: '10:00 AM - 11:00 AM', subject: 'Data Structures', section: 'CSE 5A', room: '301' },
    { day: 'Wednesday', time: '2:00 PM - 4:00 PM', subject: 'Algo Lab', section: 'CSE 5B', room: 'Lab-202' },
    { day: 'Thursday', time: '9:00 AM - 10:00 AM', subject: 'Algorithms', section: 'CSE 5B', room: '302' },
    { day: 'Thursday', time: '11:00 AM - 12:00 PM', subject: 'Data Structures', section: 'CSE 5A', room: '301' },
    { day: 'Friday', time: '10:00 AM - 11:00 AM', subject: 'Algorithms', section: 'CSE 5A', room: '301' },
    { day: 'Friday', time: '11:00 AM - 12:00 PM', subject: 'Data Structures', section: 'CSE 5B', room: '302' },
  ];

  const todayClasses = [
    {
      time: '10:00 AM - 11:00 AM',
      subject: 'Data Structures',
      section: 'CSE 5A',
      room: '301',
      status: 'completed',
    },
    {
      time: '11:00 AM - 12:00 PM',
      subject: 'Algorithms',
      section: 'CSE 5B',
      room: '301',
      status: 'ongoing',
    },
    {
      time: '2:00 PM - 3:00 PM',
      subject: 'Data Structures Lab',
      section: 'CSE 5A',
      room: 'Lab-201',
      status: 'upcoming',
    },
    {
      time: '3:00 PM - 4:00 PM',
      subject: 'Algorithms',
      section: 'CSE 5A',
      room: '301',
      status: 'upcoming',
    },
  ];

  const upcomingEvents = [
    {
      title: 'Department Meeting',
      date: 'Tomorrow, 3:00 PM',
      location: 'Conference Room A',
      type: 'meeting',
    },
    {
      title: 'Mid-Term Exam - Data Structures',
      date: 'Nov 10, 2025',
      location: 'Exam Hall 1',
      type: 'exam',
    },
    {
      title: 'Faculty Development Program',
      date: 'Nov 15, 2025',
      location: 'Auditorium',
      type: 'event',
    },
  ];

  const downloadSchedulePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Faculty Weekly Schedule', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Faculty: ${user?.name || 'Dr. Kumar'}`, 14, 32);
    doc.text(`Department: ${user?.department || 'CSE'}`, 14, 38);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 44);
    
    const tableData = weeklySchedule.map(item => [
      item.day,
      item.time,
      item.subject,
      item.section,
      item.room
    ]);
    
    autoTable(doc, {
      startY: 50,
      head: [['Day', 'Time', 'Subject', 'Section', 'Room']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] },
    });
    
    doc.save(`${user?.name || 'Faculty'}_Schedule.pdf`);
    toast.success('Schedule downloaded as PDF');
  };

  const handleLeaveRequest = async () => {
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await saveLeaveRequest({
        facultyId: user?.id || 'FAC001',
        facultyName: user?.name || 'Dr. Kumar',
        department: user?.department || 'CSE',
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        reason: leaveForm.reason
      });

      if (result.success) {
        toast.success('Leave request submitted successfully');
        setLeaveForm({ startDate: '', endDate: '', reason: '' });
        setShowLeaveDialog(false);
      } else {
        toast.error('Failed to submit leave request');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkUnavailability = async () => {
    if (!unavailabilityForm.date || unavailabilityForm.timeSlots.length === 0) {
      toast.error('Please select date and time slots');
      return;
    }

    setLoading(true);
    try {
      const result = await saveUnavailability(user?.id || 'FAC001', {
        facultyId: user?.id || 'FAC001',
        facultyName: user?.name || 'Dr. Kumar',
        date: unavailabilityForm.date,
        timeSlots: unavailabilityForm.timeSlots,
        recurring: unavailabilityForm.recurring,
        reason: unavailabilityForm.reason,
        createdAt: Date.now()
      });

      if (result.success) {
        toast.success('Unavailability marked successfully');
        setUnavailabilityForm({ date: '', timeSlots: [], recurring: false, reason: '' });
        setShowUnavailabilityDialog(false);
      } else {
        toast.error('Failed to mark unavailability');
      }
    } catch (error) {
      console.error('Error marking unavailability:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubstitutionRequest = async () => {
    if (!substitutionForm.date || !substitutionForm.timeSlot || !substitutionForm.subject || !substitutionForm.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const result = await saveSubstitutionRequest({
        facultyId: user?.id || 'FAC001',
        facultyName: user?.name || 'Dr. Kumar',
        department: user?.department || 'CSE',
        date: substitutionForm.date,
        timeSlot: substitutionForm.timeSlot,
        subject: substitutionForm.subject,
        section: substitutionForm.section,
        reason: substitutionForm.reason,
        status: 'pending'
      });

      if (result.success) {
        toast.success('Substitution request submitted successfully');
        setSubstitutionForm({ date: '', timeSlot: '', subject: '', section: '', reason: '' });
        setShowSubstitutionDialog(false);
      } else {
        toast.error('Failed to submit substitution request');
      }
    } catch (error) {
      console.error('Error submitting substitution request:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Faculty Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's your schedule and recent updates.
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* View Full Schedule */}
            <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Full Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Weekly Schedule</DialogTitle>
                  <DialogDescription>
                    Your complete timetable for this week
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {weeklySchedule.map((item, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900">{item.day} - {item.time}</p>
                          <p className="text-gray-600">{item.subject} | {item.section} | Room: {item.room}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={downloadSchedulePDF} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download as PDF
                </Button>
              </DialogContent>
            </Dialog>

            {/* Mark Unavailability */}
            <Dialog open={showUnavailabilityDialog} onOpenChange={setShowUnavailabilityDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Mark Unavailability
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mark Unavailable Slots</DialogTitle>
                  <DialogDescription>
                    Select dates and time slots when you're unavailable
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="unavail-date">Date</Label>
                    <Input
                      id="unavail-date"
                      type="date"
                      value={unavailabilityForm.date}
                      onChange={(e) => setUnavailabilityForm({ ...unavailabilityForm, date: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unavail-time">Time Slot</Label>
                    <Input
                      id="unavail-time"
                      type="text"
                      placeholder="e.g., 10:00 AM - 11:00 AM"
                      value={unavailabilityForm.timeSlots.join(', ')}
                      onChange={(e) => setUnavailabilityForm({ ...unavailabilityForm, timeSlots: [e.target.value] })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unavail-reason">Reason</Label>
                    <Textarea
                      id="unavail-reason"
                      placeholder="Enter reason for unavailability"
                      value={unavailabilityForm.reason}
                      onChange={(e) => setUnavailabilityForm({ ...unavailabilityForm, reason: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleMarkUnavailability} disabled={loading} className="w-full">
                    {loading ? 'Submitting...' : 'Submit to Admin'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Request Substitution */}
            <Dialog open={showSubstitutionDialog} onOpenChange={setShowSubstitutionDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Request Substitution
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Substitute Faculty</DialogTitle>
                  <DialogDescription>
                    Request a substitute for specific classes
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sub-date">Date</Label>
                    <Input
                      id="sub-date"
                      type="date"
                      value={substitutionForm.date}
                      onChange={(e) => setSubstitutionForm({ ...substitutionForm, date: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sub-time">Time Slot</Label>
                    <Input
                      id="sub-time"
                      type="text"
                      placeholder="e.g., 10:00 AM - 11:00 AM"
                      value={substitutionForm.timeSlot}
                      onChange={(e) => setSubstitutionForm({ ...substitutionForm, timeSlot: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sub-subject">Subject</Label>
                    <Input
                      id="sub-subject"
                      placeholder="e.g., Data Structures"
                      value={substitutionForm.subject}
                      onChange={(e) => setSubstitutionForm({ ...substitutionForm, subject: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sub-section">Section</Label>
                    <Input
                      id="sub-section"
                      placeholder="e.g., CSE 5A"
                      value={substitutionForm.section}
                      onChange={(e) => setSubstitutionForm({ ...substitutionForm, section: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sub-reason">Reason</Label>
                    <Textarea
                      id="sub-reason"
                      placeholder="Enter reason for substitution request"
                      value={substitutionForm.reason}
                      onChange={(e) => setSubstitutionForm({ ...substitutionForm, reason: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleSubstitutionRequest} disabled={loading} className="w-full">
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Request Leave */}
            <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarOff className="w-4 h-4 mr-2" />
                  Request Leave
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Leave Request</DialogTitle>
                  <DialogDescription>
                    Request leave for specific dates
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="leave-start">Start Date</Label>
                    <Input
                      id="leave-start"
                      type="date"
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leave-end">End Date</Label>
                    <Input
                      id="leave-end"
                      type="date"
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leave-reason">Reason</Label>
                    <Textarea
                      id="leave-reason"
                      placeholder="Enter reason for leave"
                      value={leaveForm.reason}
                      onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleLeaveRequest} disabled={loading} className="w-full">
                    {loading ? 'Submitting...' : 'Submit Leave Request'}
                  </Button>
                  <p className="text-sm text-gray-500">
                    Your request will be sent to admin for approval. Upon approval, timetable will be regenerated with substitute assignment.
                  </p>
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
                        : 'bg-green-100 text-green-700'
                    }
                  >
                    {cls.status}
                  </Badge>
                </div>
                <p className="text-gray-900 mb-2">{cls.subject}</p>
                <div className="flex items-center gap-4 text-gray-600">
                  <span>{cls.section}</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{cls.room}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Meetings, exams, and important dates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-gray-900">{event.title}</p>
                  <Badge
                    variant="outline"
                    className={
                      event.type === 'meeting'
                        ? 'border-blue-300 text-blue-700'
                        : event.type === 'exam'
                        ? 'border-red-300 text-red-700'
                        : 'border-purple-300 text-purple-700'
                    }
                  >
                    {event.type}
                  </Badge>
                </div>
                <div className="space-y-1 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Course Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Course Summary</CardTitle>
          <CardDescription>
            Your assigned courses for this semester
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Data Structures', code: 'CSE401', students: 60, hours: 5 },
              { name: 'Algorithms', code: 'CSE402', students: 58, hours: 5 },
              { name: 'DS Lab', code: 'CSE401L', students: 60, hours: 4 },
              { name: 'Algo Lab', code: 'CSE402L', students: 58, hours: 4 },
            ].map((course, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
              >
                <p className="text-gray-900 mb-1">{course.name}</p>
                <p className="text-gray-600 mb-3">{course.code}</p>
                <div className="flex items-center justify-between text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.hours}h/wk</span>
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
