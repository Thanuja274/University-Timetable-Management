import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, Building2, Calendar, Clock } from 'lucide-react';

interface AnalyticsProps {
  user: any;
}

export function Analytics({ user }: AnalyticsProps) {
  const utilizationData = [
    { name: 'Mon', classrooms: 85, faculty: 78 },
    { name: 'Tue', classrooms: 92, faculty: 85 },
    { name: 'Wed', classrooms: 88, faculty: 82 },
    { name: 'Thu', classrooms: 95, faculty: 88 },
    { name: 'Fri', classrooms: 90, faculty: 84 },
    { name: 'Sat', classrooms: 75, faculty: 70 },
  ];

  const departmentData = [
    { name: 'CSE', value: 35, color: '#3b82f6' },
    { name: 'ECE', value: 28, color: '#10b981' },
    { name: 'Mech', value: 20, color: '#8b5cf6' },
    { name: 'Civil', value: 17, color: '#f59e0b' },
  ];

  const timeSlotData = [
    { time: '9 AM', usage: 75 },
    { time: '10 AM', usage: 88 },
    { time: '11 AM', usage: 92 },
    { time: '12 PM', usage: 45 },
    { time: '2 PM', usage: 85 },
    { time: '3 PM', usage: 90 },
    { time: '4 PM', usage: 78 },
  ];

  const facultyLoadData = [
    { name: 'Dr. Kumar', hours: 22 },
    { name: 'Prof. Sharma', hours: 20 },
    { name: 'Dr. Patel', hours: 18 },
    { name: 'Prof. Singh', hours: 21 },
    { name: 'Dr. Reddy', hours: 19 },
    { name: 'Prof. Gupta', hours: 17 },
  ];

  const stats = [
    {
      label: 'Avg. Room Utilization',
      value: '87.5%',
      change: '+5.2%',
      trend: 'up',
      icon: <Building2 className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Avg. Faculty Load',
      value: '19.5 hrs',
      change: '+2.1 hrs',
      trend: 'up',
      icon: <Users className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Schedule Efficiency',
      value: '94%',
      change: '+3.8%',
      trend: 'up',
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Avg. Gap Time',
      value: '35 min',
      change: '-8 min',
      trend: 'down',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Analytics & Reports</h1>
          <p className="text-gray-600">
            Comprehensive insights into resource utilization and scheduling efficiency
          </p>
        </div>
        <Select defaultValue="week">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="semester">This Semester</SelectItem>
          </SelectContent>
        </Select>
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
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-gray-600">{stat.label}</p>
                <p className="text-gray-900">{stat.value}</p>
                <p className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change} vs last week
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="utilization" className="space-y-6">
        <TabsList>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="faculty">Faculty Load</TabsTrigger>
          <TabsTrigger value="timeslots">Time Slots</TabsTrigger>
        </TabsList>

        {/* Daily Utilization */}
        <TabsContent value="utilization">
          <Card>
            <CardHeader>
              <CardTitle>Daily Resource Utilization</CardTitle>
              <CardDescription>
                Classroom and faculty utilization across the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={utilizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="classrooms" fill="#3b82f6" name="Classroom Utilization %" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="faculty" fill="#10b981" name="Faculty Utilization %" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Department Distribution */}
        <TabsContent value="distribution">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department-wise Distribution</CardTitle>
                <CardDescription>
                  Timetable allocation by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Statistics</CardTitle>
                <CardDescription>
                  Key metrics by department
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { dept: 'Computer Science & Engineering', rooms: 15, faculty: 42, courses: 38 },
                  { dept: 'Electronics & Communication', rooms: 12, faculty: 35, courses: 32 },
                  { dept: 'Mechanical Engineering', rooms: 10, faculty: 28, courses: 24 },
                  { dept: 'Civil Engineering', rooms: 8, faculty: 22, courses: 20 },
                ].map((dept, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-900 mb-3">{dept.dept}</p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-gray-600">Rooms</p>
                        <p className="text-gray-900">{dept.rooms}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Faculty</p>
                        <p className="text-gray-900">{dept.faculty}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Courses</p>
                        <p className="text-gray-900">{dept.courses}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Faculty Load */}
        <TabsContent value="faculty">
          <Card>
            <CardHeader>
              <CardTitle>Faculty Teaching Load</CardTitle>
              <CardDescription>
                Hours assigned per faculty member this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={facultyLoadData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#8b5cf6" name="Teaching Hours" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-900">
                  ⚠️ Dr. Kumar is above the recommended 20-hour weekly limit
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Slot Usage */}
        <TabsContent value="timeslots">
          <Card>
            <CardHeader>
              <CardTitle>Time Slot Utilization</CardTitle>
              <CardDescription>
                Usage percentage across different time slots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeSlotData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="usage"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Utilization %"
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-900 mb-1">Peak Usage</p>
                  <p className="text-blue-700">11 AM - 92% utilization</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-900 mb-1">Low Usage</p>
                  <p className="text-green-700">12 PM - 45% utilization (Lunch)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
