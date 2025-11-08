import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Download, Calendar as CalendarIcon, MapPin, User, Clock, FileDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface StudentTimetableProps {
  user: any;
}

export function StudentTimetable({ user }: StudentTimetableProps) {
  const [viewMode, setViewMode] = useState('week');

  const weekSchedule = [
    {
      day: 'Monday',
      date: 'Nov 6',
      classes: [
        { time: '9:00 AM', duration: '1h', subject: 'Data Structures', faculty: 'Dr. Kumar', room: '301', type: 'lecture' },
        { time: '10:00 AM', duration: '1h', subject: 'DBMS', faculty: 'Prof. Sharma', room: '302', type: 'lecture' },
        { time: '11:00 AM', duration: '1h', subject: 'Computer Networks', faculty: 'Dr. Singh', room: '303', type: 'lecture' },
        { time: '2:00 PM', duration: '2h', subject: 'OS Lab', faculty: 'Dr. Patel', room: 'Lab-201', type: 'lab' },
        { time: '4:00 PM', duration: '1h', subject: 'Machine Learning', faculty: 'Dr. Reddy', room: '305', type: 'lecture' },
      ],
    },
    {
      day: 'Tuesday',
      date: 'Nov 7',
      classes: [
        { time: '9:00 AM', duration: '1h', subject: 'Algorithms', faculty: 'Dr. Kumar', room: '301', type: 'lecture' },
        { time: '10:00 AM', duration: '1h', subject: 'Web Technologies', faculty: 'Prof. Gupta', room: '304', type: 'lecture' },
        { time: '2:00 PM', duration: '2h', subject: 'DBMS Lab', faculty: 'Prof. Sharma', room: 'Lab-202', type: 'lab' },
        { time: '4:00 PM', duration: '1h', subject: 'Compiler Design', faculty: 'Dr. Singh', room: '303', type: 'lecture' },
      ],
    },
    {
      day: 'Wednesday',
      date: 'Nov 8',
      classes: [
        { time: '9:00 AM', duration: '1h', subject: 'Data Structures', faculty: 'Dr. Kumar', room: '301', type: 'lecture' },
        { time: '10:00 AM', duration: '1h', subject: 'Operating Systems', faculty: 'Dr. Patel', room: '302', type: 'lecture' },
        { time: '11:00 AM', duration: '1h', subject: 'DBMS', faculty: 'Prof. Sharma', room: '302', type: 'lecture' },
        { time: '2:00 PM', duration: '2h', subject: 'DS Lab', faculty: 'Dr. Kumar', room: 'Lab-201', type: 'lab' },
      ],
    },
    {
      day: 'Thursday',
      date: 'Nov 9',
      classes: [
        { time: '10:00 AM', duration: '1h', subject: 'Machine Learning', faculty: 'Dr. Reddy', room: '305', type: 'lecture' },
        { time: '11:00 AM', duration: '1h', subject: 'Computer Networks', faculty: 'Dr. Singh', room: '303', type: 'lecture' },
        { time: '2:00 PM', duration: '2h', subject: 'CN Lab', faculty: 'Dr. Singh', room: 'Lab-203', type: 'lab' },
        { time: '4:00 PM', duration: '1h', subject: 'Compiler Design', faculty: 'Dr. Singh', room: '303', type: 'lecture' },
      ],
    },
    {
      day: 'Friday',
      date: 'Nov 10',
      classes: [
        { time: '9:00 AM', duration: '1h', subject: 'Data Structures', faculty: 'Dr. Kumar', room: '301', type: 'lecture' },
        { time: '10:00 AM', duration: '1h', subject: 'DBMS', faculty: 'Prof. Sharma', room: '302', type: 'lecture' },
        { time: '11:00 AM', duration: '1h', subject: 'Operating Systems', faculty: 'Dr. Patel', room: '302', type: 'lecture' },
        { time: '2:00 PM', duration: '1h', subject: 'Machine Learning', faculty: 'Dr. Reddy', room: '305', type: 'lecture' },
        { time: '3:00 PM', duration: '2h', subject: 'Web Tech Lab', faculty: 'Prof. Gupta', room: 'Lab-204', type: 'lab' },
      ],
    },
    {
      day: 'Saturday',
      date: 'Nov 11',
      classes: [
        { time: '9:00 AM', duration: '1h', subject: 'Algorithms', faculty: 'Dr. Kumar', room: '301', type: 'lecture' },
        { time: '10:00 AM', duration: '1h', subject: 'Compiler Design', faculty: 'Dr. Singh', room: '303', type: 'lecture' },
        { time: '2:00 PM', duration: '2h', subject: 'ML Lab', faculty: 'Dr. Reddy', room: 'Lab-205', type: 'lab' },
      ],
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'lab':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'tutorial':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleDownloadPDF = () => {
    toast.success('Timetable PDF downloaded successfully!');
  };

  const handleDownloadCalendar = () => {
    toast.success('Calendar file (.ics) downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">My Timetable</h1>
          <p className="text-gray-600">
            CSE Semester 5 - Section A | Academic Year 2024-25
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleDownloadPDF}>
            <FileDown className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={handleDownloadCalendar}>
            <Download className="w-4 h-4 mr-2" />
            Calendar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-600">Total Hours</p>
                <p className="text-gray-900">28 hrs/week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 text-green-600 p-2 rounded-lg">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-600">Classes</p>
                <p className="text-gray-900">24 per week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-50 text-purple-600 p-2 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-600">Faculty</p>
                <p className="text-gray-900">7 instructors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-600">Rooms</p>
                <p className="text-gray-900">8 locations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timetable View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>
                Week of November 6-12, 2025
              </CardDescription>
            </div>
            <Tabs value={viewMode} onValueChange={setViewMode}>
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'week' ? (
            <div className="space-y-4">
              {weekSchedule.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3>{day.day}</h3>
                        <p className="text-blue-100">{day.date}, 2025</p>
                      </div>
                      <Badge className="bg-white/20 text-white">
                        {day.classes.length} {day.classes.length === 1 ? 'class' : 'classes'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {day.classes.map((cls, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border-2 ${getTypeColor(cls.type)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4" />
                                <span className="text-gray-900">{cls.time}</span>
                                <Badge variant="outline" className="text-xs">
                                  {cls.duration}
                                </Badge>
                              </div>
                              <p className="text-gray-900">{cls.subject}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className={getTypeColor(cls.type)}>
                            {cls.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600 mt-2">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{cls.faculty}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{cls.room}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {weekSchedule.flatMap((day) =>
                day.classes.map((cls, idx) => (
                  <div
                    key={`${day.day}-${idx}`}
                    className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-gray-900">{cls.subject}</p>
                          <Badge variant="outline" className={getTypeColor(cls.type)}>
                            {cls.type}
                          </Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3 text-gray-600">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            <span>
                              {day.day}, {day.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {cls.time} ({cls.duration})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{cls.faculty}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{cls.room}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend & Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Class Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 border-2 border-blue-200 flex items-center justify-center">
                <span className="text-blue-700">L</span>
              </div>
              <div>
                <p className="text-gray-900">Lecture</p>
                <p className="text-gray-600">Theory classes - 1 hour duration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 border-2 border-green-200 flex items-center justify-center">
                <span className="text-green-700">Lab</span>
              </div>
              <div>
                <p className="text-gray-900">Laboratory</p>
                <p className="text-gray-600">Practical sessions - 2 hours duration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 border-2 border-purple-200 flex items-center justify-center">
                <span className="text-purple-700">T</span>
              </div>
              <div>
                <p className="text-gray-900">Tutorial</p>
                <p className="text-gray-600">Problem solving sessions - 1 hour</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-900 mb-1">📅 Lunch Break</p>
              <p className="text-blue-700">Daily lunch break from 12:00 PM to 2:00 PM</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-900 mb-1">🔔 Attendance</p>
              <p className="text-green-700">Minimum 75% attendance required for all courses</p>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-purple-900 mb-1">📱 Updates</p>
              <p className="text-purple-700">
                Check notifications for room changes and cancellations
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
