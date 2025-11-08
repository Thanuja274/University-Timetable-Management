import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { GraduationCap, User, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../../utils/supabase/client';
import { getUserProfile, saveUserProfile } from '../../utils/supabase/database';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('student');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Demo accounts for quick testing (no database needed)
      const mockUsers: any = {
        'admin@vignan.edu': { name: 'Dr. Admin', role: 'admin', id: 'admin-001', department: 'Administration' },
        'faculty@vignan.edu': { name: 'Prof. Kumar', role: 'faculty', id: 'faculty-001', department: 'CSE' },
        'student@vignan.edu': { name: 'Ravi Sharma', role: 'student', id: 'student-001', department: 'CSE', semester: '5', section: 'A' },
      };

      if (mockUsers[loginEmail]) {
        const user = mockUsers[loginEmail];
        toast.success('Demo login successful!');
        onLogin({ ...user, email: loginEmail });
        return;
      }

      // Real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      if (data.user) {
        const profile = await getUserProfile(data.user.id);
        if (profile) {
          toast.success('Login successful!');
          onLogin(profile);
        } else {
          toast.error('User profile not found. Please contact administrator.');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid credentials. Try demo accounts: admin@vignan.edu, faculty@vignan.edu, or student@vignan.edu');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupName || !signupEmail || !signupPassword || !signupRole) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            name: signupName,
            role: signupRole,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        const userProfile = {
          id: data.user.id,
          name: signupName,
          email: signupEmail,
          role: signupRole,
          department: signupRole === 'student' || signupRole === 'faculty' ? 'CSE' : 'Administration',
          semester: signupRole === 'student' ? '5' : undefined,
          section: signupRole === 'student' ? 'A' : undefined,
        };

        await saveUserProfile(data.user.id, userProfile);
        toast.success('Account created successfully!');
        onLogin(userProfile);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center md:text-left space-y-6 p-8">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
              <GraduationCap className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">UniSchedule</h1>
              <p className="text-gray-600">Intelligent Timetable Management</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              Streamline academic scheduling for universities with automated timetable generation, 
              real-time updates, and comprehensive analytics.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { label: 'Universities', value: '50+' },
                { label: 'Active Users', value: '10K+' },
                { label: 'Timetables', value: '5K+' },
                { label: 'Satisfaction', value: '98%' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/60 backdrop-blur rounded-lg p-4 text-center border border-indigo-100">
                  <div className="text-indigo-600">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-2">
              <p className="text-gray-600">Trusted by leading institutions:</p>
              <div className="flex flex-wrap gap-3 text-gray-500">
                <span>Vignan University</span>
                <span>•</span>
                <span>SRM Institute</span>
                <span>•</span>
                <span>Amrita Vishwa Vidyapeetham</span>
                <span>•</span>
                <span>KL University</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <Card className="shadow-2xl border-indigo-100">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Login or create an account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your.email@university.edu"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <button type="button" className="text-indigo-600 hover:text-indigo-700">
                      Forgot password?
                    </button>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                    Login
                  </Button>

                  <div className="text-center text-gray-500 border-t pt-4">
                    <p className="mb-2">Demo Accounts:</p>
                    <div className="space-y-1">
                      <p>Admin: admin@vignan.edu</p>
                      <p>Faculty: faculty@vignan.edu</p>
                      <p>Student: student@vignan.edu</p>
                      <p className="text-gray-400">(Any password works)</p>
                    </div>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-name"
                        placeholder="Enter your full name"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@university.edu"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Role</Label>
                    <Select value={signupRole} onValueChange={setSignupRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="faculty">Faculty Member</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
