import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Calendar, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getFacultyAvailability, saveFacultyAvailability } from '../../utils/supabase/database';
import { subscribeToAvailability } from '../../utils/supabase/realtime';

interface AvailabilityManagerProps {
  user: any;
}

export function AvailabilityManager({ user }: AvailabilityManagerProps) {
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAvailability, setSavedAvailability] = useState<any[]>([]);
  const [preferences, setPreferences] = useState({
    eveningClasses: true,
    weekends: false,
    morningPreferred: true,
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const times = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
  ];

  useEffect(() => {
    const loadAvailability = async () => {
      setLoading(true);
      const data = await getFacultyAvailability(user.id);
      setSavedAvailability(data);
      setLoading(false);
    };

    loadAvailability();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToAvailability(user.id, (availability) => {
      setSavedAvailability(availability);
    });

    return () => {
      unsubscribe();
    };
  }, [user.id]);

  const toggleSlot = (day: string, time: string) => {
    const key = `${day}-${time}`;
    const newSelected = new Set(selectedSlots);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedSlots(newSelected);
  };

  const handleSave = async () => {
    if (selectedSlots.size === 0) {
      toast.error('Please select at least one unavailable time slot');
      return;
    }
    if (!reason.trim()) {
      toast.error('Please provide a reason for unavailability');
      return;
    }

    setSaving(true);
    try {
      const newEntry = {
        id: Date.now().toString(),
        slots: Array.from(selectedSlots),
        reason: reason.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const updatedAvailability = [...savedAvailability, newEntry];
      const result = await saveFacultyAvailability(user.id, updatedAvailability);

      if (result.success) {
        toast.success('Availability preferences saved successfully!');
        setSelectedSlots(new Set());
        setReason('');
        setSavedAvailability(updatedAvailability);
      } else {
        toast.error('Failed to save availability preferences');
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      const updatedAvailability = savedAvailability.filter(item => item.id !== id);
      const result = await saveFacultyAvailability(user.id, updatedAvailability);

      if (result.success) {
        toast.success('Unavailability removed successfully!');
        setSavedAvailability(updatedAvailability);
      } else {
        toast.error('Failed to remove unavailability');
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const isSlotSelected = (day: string, time: string) => {
    return selectedSlots.has(`${day}-${time}`);
  };

  const isSlotUnavailable = (day: string, time: string) => {
    return savedAvailability.some(entry => 
      entry.slots.includes(`${day}-${time}`) && entry.status === 'approved'
    );
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
      <div>
        <h1 className="text-gray-900 mb-2">Availability Manager</h1>
        <p className="text-gray-600">
          Mark your unavailable time slots for scheduling consideration
        </p>
      </div>

      {/* Quick Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Settings</CardTitle>
          <CardDescription>
            Set your general availability preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900">Available for Evening Classes</p>
              <p className="text-gray-600">After 5:00 PM</p>
            </div>
            <Switch 
              checked={preferences.eveningClasses}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, eveningClasses: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900">Available on Weekends</p>
              <p className="text-gray-600">Saturday and Sunday</p>
            </div>
            <Switch 
              checked={preferences.weekends}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, weekends: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900">Prefer Morning Classes</p>
              <p className="text-gray-600">Before 12:00 PM</p>
            </div>
            <Switch 
              checked={preferences.morningPreferred}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, morningPreferred: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Availability Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mark Unavailable Slots</CardTitle>
              <CardDescription>
                Click on time slots to mark as unavailable
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {selectedSlots.size} slot{selectedSlots.size !== 1 ? 's' : ''} selected
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Header */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
                  <p className="text-white text-center">Time</p>
                </div>
                {days.map((day) => (
                  <div key={day} className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                    <p className="text-white text-center">{day}</p>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {times.map((time) => (
                <div key={time} className="grid grid-cols-7 gap-2 mb-2">
                  <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center border border-indigo-200">
                    <p className="text-gray-900 text-center">{time}</p>
                  </div>
                  {days.map((day) => {
                    const unavailable = isSlotUnavailable(day, time);
                    const selected = isSlotSelected(day, time);
                    
                    return (
                      <button
                        key={`${day}-${time}`}
                        onClick={() => !unavailable && toggleSlot(day, time)}
                        disabled={unavailable}
                        className={`p-3 rounded-lg border-2 transition-all min-h-[60px] ${
                          unavailable
                            ? 'bg-gray-200 border-gray-300 cursor-not-allowed'
                            : selected
                            ? 'bg-red-100 border-red-300 hover:bg-red-200'
                            : 'bg-green-50 border-green-200 hover:bg-green-100'
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          {unavailable ? (
                            <span className="text-gray-500">🔒</span>
                          ) : selected ? (
                            <X className="w-5 h-5 text-red-600" />
                          ) : (
                            <span className="text-green-600">✓</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <span className="text-gray-700">Legend:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-200 border border-green-300" />
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-200 border border-red-300" />
              <span className="text-gray-600">Marking Unavailable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-200 border border-gray-300" />
              <span className="text-gray-600">Already Marked</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reason for Unavailability */}
      {selectedSlots.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Reason for Unavailability</CardTitle>
            <CardDescription>
              Please provide a brief explanation (required)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., Medical appointment, conference, research work, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
            <div className="flex gap-3">
              <Button 
                onClick={handleSave} 
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Availability
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSlots(new Set());
                  setReason('');
                }}
                disabled={saving}
              >
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Unavailability */}
      <Card>
        <CardHeader>
          <CardTitle>Marked Unavailability</CardTitle>
          <CardDescription>
            Your saved unavailable time periods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {savedAvailability.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No unavailability marked yet</p>
            </div>
          ) : (
            savedAvailability.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{item.slots.length} slot{item.slots.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={item.status === 'approved' ? 'default' : 'secondary'}
                      className={
                        item.status === 'approved'
                          ? 'bg-green-600'
                          : 'bg-amber-600'
                      }
                    >
                      {item.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={saving}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-2">{item.reason}</p>
                <p className="text-gray-400">
                  Created: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
