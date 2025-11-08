import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import {
  Users,
  BookOpen,
  Building2,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  FileText,
} from 'lucide-react';
import { getLeaveRequests, updateLeaveRequest, getSampleData } from '../../utils/supabase/database';
import { toast } from 'sonner@2.0.3';

interface AdminOverviewProps {
  user: any;
}

export function AdminOverview({ user }: AdminOverviewProps) {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminComments, setAdminComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [sampleData, setSampleData] = useState<any>(null);
  const [showSampleData, setShowSampleData] = useState(false);

  const stats = [
    {
      label: 'Total Faculty',
      value: '248',
      change: '+12 this month',
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Active Courses',
      value: '156',
      change: '+8 this semester',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Classrooms',
      value: '89',
      change: '94% utilization',
      icon: <Building2 className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Timetables',
      value: '24',
      change: '18 approved',
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  useEffect(() => {
    loadLeaveRequests();
    loadSampleData();
  }, []);

  const loadLeaveRequests = async () => {
    try {
      const requests = await getLeaveRequests();
      setLeaveRequests(requests.filter((r: any) => r.status === 'pending'));
    } catch (error) {
      console.error('Error loading leave requests:', error);
    }
  };

  const loadSampleData = async () => {
    try {
      const data = await getSampleData();
      setSampleData(data);
    } catch (error) {
      console.error('Error loading sample data:', error);
    }
  };

  const handleApproveLeave = async (request: any) => {
    setLoading(true);
    try {
      const result = await updateLeaveRequest(request.id, request.facultyId, {
        status: 'approved',
        adminComments: adminComments || 'Leave approved'
      });
      
      if (result.success) {
        toast.success('Leave request approved successfully');
        await loadLeaveRequests();
        setSelectedRequest(null);
        setAdminComments('');
      } else {
        toast.error('Failed to approve leave request');
      }
    } catch (error) {
      console.error('Error approving leave:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectLeave = async (request: any) => {
    setLoading(true);
    try {
      const result = await updateLeaveRequest(request.id, request.facultyId, {
        status: 'rejected',
        adminComments: adminComments || 'Leave rejected'
      });
      
      if (result.success) {
        toast.success('Leave request rejected');
        await loadLeaveRequests();
        setSelectedRequest(null);
        setAdminComments('');
      } else {
        toast.error('Failed to reject leave request');
      }
    } catch (error) {
      console.error('Error rejecting leave:', error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadFacultyTemplate = () => {
    const template = `Name,Employee ID,Department,Email,Phone,Subjects
Dr. Kumar,FAC001,CSE,kumar@university.edu,+91-9876543210,"Data Structures, Algorithms"
Prof. Sharma,FAC002,CSE,sharma@university.edu,+91-9876543211,"Database Management, Software Engineering"
Dr. Singh,FAC003,ECE,singh@university.edu,+91-9876543212,"Digital Signal Processing, Communication Systems"`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faculty_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Faculty template downloaded');
  };

  const recentActivity = [
    {
      action: 'Timetable generated',
      department: 'CSE - Semester 5',
      time: '5 minutes ago',
      status: 'success',
    },
    {
      action: 'Conflict resolved',
      department: 'ECE - Semester 3',
      time: '1 hour ago',
      status: 'success',
    },
    {
      action: 'Data uploaded',
      department: 'Faculty availability',
      time: '2 hours ago',
      status: 'info',
    },
    {
      action: 'Constraint modified',
      department: 'Room capacity updated',
      time: '3 hours ago',
      status: 'info',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage timetables, resources, and scheduling across all departments
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
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-gray-600">{stat.label}</p>
                <p className="text-gray-900">{stat.value}</p>
                <p className="text-gray-500">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Approvals - Leave Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Leave Approvals</CardTitle>
            <CardDescription>
              Faculty leave requests awaiting your review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {leaveRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending leave requests</p>
            ) : (
              leaveRequests.map((request, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">{request.facultyName}</p>
                    <p className="text-gray-600">{request.startDate} to {request.endDate}</p>
                    <p className="text-gray-500 mt-1">Reason: {request.reason}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(request);
                            setAdminComments('');
                          }}
                        >
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Review Leave Request</DialogTitle>
                          <DialogDescription>
                            Approve or reject this leave request
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="text-gray-700"><strong>Faculty:</strong> {request.facultyName}</p>
                            <p className="text-gray-700"><strong>Department:</strong> {request.department}</p>
                            <p className="text-gray-700"><strong>Period:</strong> {request.startDate} to {request.endDate}</p>
                            <p className="text-gray-700"><strong>Reason:</strong> {request.reason}</p>
                          </div>
                          <div>
                            <Label htmlFor="comments">Admin Comments</Label>
                            <Textarea
                              id="comments"
                              placeholder="Enter your comments (optional)"
                              value={adminComments}
                              onChange={(e) => setAdminComments(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleApproveLeave(request)}
                              disabled={loading}
                              className="flex-1"
                            >
                              {loading ? 'Processing...' : 'Approve'}
                            </Button>
                            <Button 
                              onClick={() => handleRejectLeave(request)}
                              disabled={loading}
                              variant="destructive"
                              className="flex-1"
                            >
                              {loading ? 'Processing...' : 'Reject'}
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500">
                            Note: Upon approval, timetable will need to be regenerated with substitute faculty assignment
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-gray-900">{activity.action}</p>
                  <p className="text-gray-600">{activity.department}</p>
                  <div className="flex items-center gap-1 text-gray-400 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Sample Data Display and Faculty Template */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sample Data</CardTitle>
            <CardDescription>View uploaded data structure and format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setShowSampleData(!showSampleData)}
              variant="outline"
              className="w-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              {showSampleData ? 'Hide Sample Data' : 'Display Sample Data'}
            </Button>
            
            {showSampleData && sampleData && (
              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="text-gray-900 mb-2">Courses ({sampleData.courses.length})</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {sampleData.courses.slice(0, 3).map((course: any, i: number) => (
                      <p key={i}>{course.code} - {course.name} ({course.credits} credits, {course.type})</p>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-gray-900 mb-2">Classrooms ({sampleData.classrooms.length})</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {sampleData.classrooms.slice(0, 3).map((room: any, i: number) => (
                      <p key={i}>{room.roomNumber} - Capacity: {room.capacity}, {room.building}, {room.type}</p>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-gray-900 mb-2">Students ({sampleData.students.length})</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {sampleData.students.slice(0, 3).map((student: any, i: number) => (
                      <p key={i}>{student.studentId} - {student.name}, Year {student.year}, Sec {student.section}, {student.department}</p>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-gray-900 mb-2">Faculty ({sampleData.faculty.length})</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {sampleData.faculty.slice(0, 3).map((faculty: any, i: number) => (
                      <p key={i}>{faculty.facultyId} - {faculty.name}, {faculty.department}, {faculty.email}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faculty Details</CardTitle>
            <CardDescription>Download template for bulk faculty upload</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={downloadFacultyTemplate}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Faculty Template (CSV)
            </Button>
            
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Template includes:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Name</li>
                <li>Employee ID</li>
                <li>Department</li>
                <li>Email</li>
                <li>Phone</li>
                <li>Subjects (comma-separated)</li>
              </ul>
              <p className="text-gray-500 mt-2">
                Download the template, fill in your faculty data, and upload it in the Upload Data section.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current resource utilization and capacity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Classroom Utilization</span>
              <span className="text-gray-900">94%</span>
            </div>
            <Progress value={94} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Faculty Assignment</span>
              <span className="text-gray-900">87%</span>
            </div>
            <Progress value={87} className="h-2" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Timetable Completion</span>
              <span className="text-gray-900">75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
