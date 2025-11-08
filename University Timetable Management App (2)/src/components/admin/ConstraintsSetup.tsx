import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Save, RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getConstraints, saveConstraints } from '../../utils/supabase/database';

interface ConstraintsSetupProps {
  user: any;
}

export function ConstraintsSetup({ user }: ConstraintsSetupProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [constraints, setConstraints] = useState<any>(null);
  const [maxTeachingHours, setMaxTeachingHours] = useState([20]);
  const [minGapBetweenClasses, setMinGapBetweenClasses] = useState([30]);
  const [maxConsecutiveClasses, setMaxConsecutiveClasses] = useState([3]);

  useEffect(() => {
    const loadConstraints = async () => {
      setLoading(true);
      const data = await getConstraints();
      setConstraints(data);
      setMaxTeachingHours([data.maxTeachingHours || 20]);
      setMinGapBetweenClasses([data.minGapBetweenClasses || 30]);
      setMaxConsecutiveClasses([data.maxConsecutiveClasses || 3]);
      setLoading(false);
    };

    loadConstraints();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedConstraints = {
        ...constraints,
        maxTeachingHours: maxTeachingHours[0],
        minGapBetweenClasses: minGapBetweenClasses[0],
        maxConsecutiveClasses: maxConsecutiveClasses[0],
      };

      const result = await saveConstraints(updatedConstraints);
      
      if (result.success) {
        setConstraints(updatedConstraints);
        toast.success('Constraints saved successfully!');
      } else {
        toast.error('Failed to save constraints');
      }
    } catch (error) {
      console.error('Error saving constraints:', error);
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setMaxTeachingHours([20]);
    setMinGapBetweenClasses([30]);
    setMaxConsecutiveClasses([3]);
    toast.info('Constraints reset to defaults');
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
        <h1 className="text-gray-900 mb-2">Constraints Setup</h1>
        <p className="text-gray-600">
          Define scheduling rules and limitations for timetable generation
        </p>
      </div>

      <Tabs defaultValue="faculty" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="classroom">Classroom</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Faculty Constraints */}
        <TabsContent value="faculty">
          <Card>
            <CardHeader>
              <CardTitle>Faculty Constraints</CardTitle>
              <CardDescription>
                Set teaching hour limits and availability rules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Maximum Teaching Hours per Week</Label>
                    <span className="text-gray-900">{maxTeachingHours[0]} hours</span>
                  </div>
                  <Slider
                    value={maxTeachingHours}
                    onValueChange={setMaxTeachingHours}
                    min={10}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-gray-500">
                    Recommended: 18-22 hours per week
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Max Consecutive Teaching Hours</Label>
                    <span className="text-gray-900">{maxConsecutiveClasses[0]} hours</span>
                  </div>
                  <Slider
                    value={maxConsecutiveClasses}
                    onValueChange={setMaxConsecutiveClasses}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow Back-to-Back Classes</Label>
                      <p className="text-gray-500 mt-1">
                        Permit consecutive classes without gaps
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enforce Faculty Availability</Label>
                      <p className="text-gray-500 mt-1">
                        Respect marked unavailable time slots
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow Teaching Across Campuses</Label>
                      <p className="text-gray-500 mt-1">
                        Permit assignments in different campus locations
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classroom Constraints */}
        <TabsContent value="classroom">
          <Card>
            <CardHeader>
              <CardTitle>Classroom Constraints</CardTitle>
              <CardDescription>
                Define room capacity and facility requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enforce Room Capacity</Label>
                    <p className="text-gray-500 mt-1">
                      Ensure student count doesn't exceed room capacity
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Lab Equipment</Label>
                    <p className="text-gray-500 mt-1">
                      Match lab courses with equipped classrooms
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Room Sharing</Label>
                    <p className="text-gray-500 mt-1">
                      Multiple sections can use the same room at different times
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Minimum Capacity Buffer (%)</Label>
                  <Input type="number" defaultValue="10" placeholder="10" />
                  <p className="text-gray-500">
                    Extra capacity buffer for classroom assignments
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Priority Rooms (comma-separated)</Label>
                  <Input placeholder="301, 302, Lab-201" />
                  <p className="text-gray-500">
                    Rooms to prioritize during allocation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Constraints */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Constraints</CardTitle>
              <CardDescription>
                Set timing and scheduling preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Working Days per Week</Label>
                  <Input type="number" defaultValue="6" min="5" max="7" />
                </div>

                <div className="space-y-2">
                  <Label>Classes per Day</Label>
                  <Input type="number" defaultValue="7" min="4" max="10" />
                </div>

                <div className="space-y-2">
                  <Label>First Class Starts At</Label>
                  <Input type="time" defaultValue="09:00" />
                </div>

                <div className="space-y-2">
                  <Label>Last Class Ends At</Label>
                  <Input type="time" defaultValue="17:00" />
                </div>

                <div className="space-y-2">
                  <Label>Lunch Break Duration (minutes)</Label>
                  <Input type="number" defaultValue="60" />
                </div>

                <div className="space-y-2">
                  <Label>Lunch Break Starts At</Label>
                  <Input type="time" defaultValue="12:00" />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Minimum Gap Between Classes (minutes)</Label>
                  <span className="text-gray-900">{minGapBetweenClasses[0]} min</span>
                </div>
                <Slider
                  value={minGapBetweenClasses}
                  onValueChange={setMinGapBetweenClasses}
                  min={0}
                  max={60}
                  step={5}
                  className="w-full"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Avoid First Hour Scheduling</Label>
                    <p className="text-gray-500 mt-1">
                      Minimize first-hour class assignments
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Balance Daily Load</Label>
                    <p className="text-gray-500 mt-1">
                      Distribute classes evenly across days
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekend Classes</Label>
                    <p className="text-gray-500 mt-1">
                      Allow Saturday/Sunday scheduling
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Preferences</CardTitle>
              <CardDescription>
                Fine-tune optimization and special requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Optimize for Faculty Preference</Label>
                    <p className="text-gray-500 mt-1">
                      Prioritize faculty time preferences
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Optimize for Student Convenience</Label>
                    <p className="text-gray-500 mt-1">
                      Minimize gaps in student schedules
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Group Related Subjects</Label>
                    <p className="text-gray-500 mt-1">
                      Schedule related courses on same days
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Elective Conflicts</Label>
                    <p className="text-gray-500 mt-1">
                      Permit time conflicts for elective courses
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Conflict Resolution Strategy</Label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option>Prioritize Room Availability</option>
                    <option>Prioritize Faculty Availability</option>
                    <option>Balance Both Equally</option>
                    <option>Manual Resolution Only</option>
                  </select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Optimization Level</Label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option>Quick (Faster, may have minor conflicts)</option>
                    <option>Balanced (Recommended)</option>
                    <option>Thorough (Slower, minimal conflicts)</option>
                    <option>Perfect (Slowest, zero conflicts)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
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
              Save Constraints
            </>
          )}
        </Button>
        <Button onClick={handleReset} variant="outline" disabled={saving}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
