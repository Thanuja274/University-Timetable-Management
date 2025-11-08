import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { RefreshCw, Plus, Calendar, Clock, MapPin, User, Loader2, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getSubstitutionRequests, saveSubstitutionRequest } from '../../utils/supabase/database';
import { subscribeToSubstitutionRequests } from '../../utils/supabase/realtime';

interface SubstitutionRequestsProps {
  user: any;
}

export function SubstitutionRequests({ user }: SubstitutionRequestsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [substituteTeacher, setSubstituteTeacher] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);

  const upcomingClasses = [
    {
      id: '1',
      date: 'Nov 8, 2025',
      day: 'Wednesday',
      time: '10:00 AM - 11:00 AM',
      subject: 'Data Structures',
      section: 'CSE 5A',
      room: '301',
    },
    {
      id: '2',
      date: 'Nov 8, 2025',
      day: 'Wednesday',
      time: '2:00 PM - 4:00 PM',
      subject: 'DS Lab',
      section: 'CSE 5A',
      room: 'Lab-201',
    },
    {
      id: '3',
      date: 'Nov 9, 2025',
      day: 'Thursday',
      time: '11:00 AM - 12:00 PM',
      subject: 'Algorithms',
      section: 'CSE 5B',
      room: '301',
    },
    {
      id: '4',
      date: 'Nov 10, 2025',
      day: 'Friday',
      time: '10:00 AM - 11:00 AM',
      subject: 'Data Structures',
      section: 'CSE 5A',
      room: '301',
    },
    {
      id: '5',
      date: 'Nov 12, 2025',
      day: 'Sunday',
      time: '2:00 PM - 4:00 PM',
      subject: 'Algorithms Lab',
      section: 'CSE 5B',
      room: 'Lab-202',
    },
  ];

  const availableFaculty = [
    'Dr. Anita Sharma',
    'Prof. Vijay Patel',
    'Dr. Suresh Reddy',
    'Prof. Meera Gupta',
    'Dr. Arun Singh',
  ];

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      const data = await getSubstitutionRequests(user.id);
      setRequests(data);
      setLoading(false);
    };

    loadRequests();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToSubstitutionRequests(user.id, (updatedRequests) => {
      setRequests(updatedRequests);
    });

    return () => {
      unsubscribe();
    };
  }, [user.id]);

  const handleSubmitRequest = async () => {
    if (!selectedClass || !substituteTeacher || !reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedClassData = upcomingClasses.find(c => c.id === selectedClass);
    if (!selectedClassData) return;

    setSubmitting(true);
    try {
      const requestData = {
        facultyId: user.id,
        facultyName: user.name,
        classId: selectedClass,
        date: selectedClassData.date,
        time: selectedClassData.time,
        subject: selectedClassData.subject,
        section: selectedClassData.section,
        room: selectedClassData.room,
        substitute: substituteTeacher,
        reason: reason.trim(),
        status: 'pending',
        submittedOn: new Date().toISOString(),
      };

      const result = await saveSubstitutionRequest(requestData);

      if (result.success) {
        toast.success('Substitution request submitted successfully!');
        setIsDialogOpen(false);
        setSelectedClass('');
        setSubstituteTeacher('');
        setReason('');
      } else {
        toast.error('Failed to submit substitution request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('An error occurred while submitting');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    // Implementation for canceling request
    toast.info('Cancel functionality will be implemented');
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Substitution Requests</h1>
          <p className="text-gray-600">
            Request substitutions for your classes and track request status
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Substitution</DialogTitle>
              <DialogDescription>
                Fill in the details for your substitution request
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Select Class */}
              <div className="space-y-2">
                <Label>Select Class to Substitute</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {upcomingClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.subject} - {cls.section} | {cls.date} {cls.time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Class Details */}
              {selectedClass && (
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  {upcomingClasses
                    .filter((cls) => cls.id === selectedClass)
                    .map((cls) => (
                      <div key={cls.id} className="space-y-2">
                        <p className="text-gray-900">{cls.subject}</p>
                        <div className="grid grid-cols-2 gap-2 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{cls.date} ({cls.day})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{cls.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{cls.section}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{cls.room}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Substitute Faculty */}
              <div className="space-y-2">
                <Label>Preferred Substitute Faculty</Label>
                <Select value={substituteTeacher} onValueChange={setSubstituteTeacher}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a faculty member" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFaculty.map((faculty) => (
                      <SelectItem key={faculty} value={faculty}>
                        {faculty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-gray-500">
                  System will verify availability before confirming
                </p>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label>Reason for Substitution *</Label>
                <Textarea
                  placeholder="Please provide a detailed reason for the substitution request"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSubmitRequest} 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-600">Total Requests</p>
                <p className="text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-50 text-amber-600 p-3 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-600">Pending</p>
                <p className="text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-600">Approved</p>
                <p className="text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 text-red-600 p-3 rounded-lg">
                <X className="w-5 h-5" />
              </div>
              <div>
                <p className="text-gray-600">Rejected</p>
                <p className="text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request History */}
      <Card>
        <CardHeader>
          <CardTitle>Request History</CardTitle>
          <CardDescription>
            Track your substitution requests and their status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <RefreshCw className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No substitution requests yet</p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-gray-900">{request.subject}</p>
                      <Badge
                        variant="secondary"
                        className={
                          request.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : request.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-gray-600 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{request.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{request.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{request.section}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        <span>Sub: {request.substitute}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 italic mb-1">
                      Reason: {request.reason}
                    </p>
                    {request.status === 'rejected' && request.rejectionReason && (
                      <p className="text-red-600">
                        Rejection reason: {request.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>Submitted on {new Date(request.submittedOn).toLocaleDateString()}</span>
                  {request.status === 'pending' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancelRequest(request.id)}
                    >
                      Cancel Request
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
