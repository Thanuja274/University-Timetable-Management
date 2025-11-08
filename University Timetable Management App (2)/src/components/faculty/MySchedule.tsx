import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, Download, MapPin, Users, Clock } from 'lucide-react';

interface MyScheduleProps {
  user: any;
}

export function MySchedule({ user }: MyScheduleProps) {
  const [viewMode, setViewMode] = useState('week');

  const weekSchedule = [
    {
      day: 'Monday',
      classes: [
        { time: '10:00 AM', subject: 'Data Structures', section: 'CSE 5A', room: '301', type: 'lecture' },
        { time: '2:00 PM', subject: 'DS Lab', section: 'CSE 5A', room: 'Lab-201', type: 'lab' },
      ],
    },
    {
      day: 'Tuesday',
      classes: [
        { time: '9:00 AM', subject: 'Algorithms', section: 'CSE 5B', room: '301', type: 'lecture' },
        { time: '11:00 AM', subject: 'Data Structures', section: 'CSE 5B', room: '302', type: 'lecture' },
        { time: '3:00 PM', subject: 'Algo Lab', section: 'CSE 5B', room: 'Lab-202', type: 'lab' },
      ],
    },
    {
      day: 'Wednesday',
      classes: [
        { time: '10:00 AM', subject: 'Data Structures', section: 'CSE 5A', room: '301', type: 'lecture' },
        { time: '2:00 PM', subject: 'Algorithms', section: 'CSE 5A', room: '301', type: 'lecture' },
      ],
    },
    {
      day: 'Thursday',
      classes: [
        { time: '11:00 AM', subject: 'Algorithms', section: 'CSE 5B', room: '301', type: 'lecture' },
        { time: '2:00 PM', subject: 'DS Lab', section: 'CSE 5B', room: 'Lab-201', type: 'lab' },
        { time: '4:00 PM', subject: 'Tutorial', section: 'CSE 5A', room: '301', type: 'tutorial' },
      ],
    },
    {
      day: 'Friday',
      classes: [
        { time: '10:00 AM', subject: 'Data Structures', section: 'CSE 5A', room: '301', type: 'lecture' },
        { time: '3:00 PM', subject: 'Algo Lab', section: 'CSE 5A', room: 'Lab-202', type: 'lab' },
      ],
    },
    {
      day: 'Saturday',
      classes: [
        { time: '9:00 AM', subject: 'Algorithms', section: 'CSE 5A', room: '301', type: 'lecture' },
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">My Schedule</h1>
          <p className="text-gray-600">
            View your complete teaching schedule and assignments
          </p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="current">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Semester</SelectItem>
              <SelectItem value="next">Next Semester</SelectItem>
              <SelectItem value="previous">Previous Semester</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-600">Total Hours</p>
                <p className="text-gray-900">18 hrs/week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-50 text-green-600 p-2 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-600">Classes/Week</p>
                <p className="text-gray-900">15 classes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-50 text-purple-600 p-2 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-600">Sections</p>
                <p className="text-gray-900">2 sections</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-600">Main Room</p>
                <p className="text-gray-900">Room 301</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule View */}
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
                <TabsTrigger value="month">Month</TabsTrigger>
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
                      <h3>{day.day}</h3>
                      <Badge className="bg-white/20 text-white">
                        {day.classes.length} {day.classes.length === 1 ? 'class' : 'classes'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {day.classes.length > 0 ? (
                      day.classes.map((cls, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border-2 ${getTypeColor(cls.type)}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span className="text-gray-900">{cls.time}</span>
                            </div>
                            <Badge variant="outline" className={getTypeColor(cls.type)}>
                              {cls.type}
                            </Badge>
                          </div>
                          <p className="text-gray-900 mb-2">{cls.subject}</p>
                          <div className="flex items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{cls.section}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{cls.room}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No classes scheduled
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-700 mb-2">Month View</p>
              <p className="text-gray-500">Calendar month view with all scheduled classes</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Room Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Frequent Room Assignments</CardTitle>
          <CardDescription>
            Rooms where you teach most often
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { room: 'Room 301', building: 'A Block', frequency: 8, capacity: 60 },
              { room: 'Lab-201', building: 'B Block', frequency: 4, capacity: 30 },
              { room: 'Lab-202', building: 'B Block', frequency: 3, capacity: 30 },
            ].map((room, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-gray-900">{room.room}</p>
                    <p className="text-gray-600">{room.building}</p>
                  </div>
                  <Badge variant="secondary">{room.frequency}x/week</Badge>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Capacity: {room.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
