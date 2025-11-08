import { supabase } from './client';

// Flag to track if we're using localStorage fallback
let useLocalStorageFallback = false;

// Database initialization - creates tables if they don't exist
export const initializeDatabase = async () => {
  try {
    // Test if KV store table exists
    const { error } = await supabase
      .from('kv_store_9d13e869')
      .select('key')
      .limit(1);

    if (error && error.code === 'PGRST205') {
      console.log('KV store table not found, using localStorage fallback for demo');
      useLocalStorageFallback = true;
    } else {
      console.log('Database ready (using Supabase KV store)');
    }
    
    return { success: true };
  } catch (error) {
    console.log('Database check failed, using localStorage fallback:', error);
    useLocalStorageFallback = true;
    return { success: true };
  }
};

// Helper function to get from storage (Supabase or localStorage)
const kvGet = async (key: string): Promise<any> => {
  try {
    if (useLocalStorageFallback) {
      const data = localStorage.getItem(`kv:${key}`);
      return data ? JSON.parse(data) : null;
    }

    const { data, error } = await supabase
      .from('kv_store_9d13e869')
      .select('value')
      .eq('key', key)
      .maybeSingle();

    if (error && error.code === 'PGRST205') {
      // Table doesn't exist, switch to localStorage
      useLocalStorageFallback = true;
      const localData = localStorage.getItem(`kv:${key}`);
      return localData ? JSON.parse(localData) : null;
    }

    if (error && error.code !== 'PGRST116') {
      console.error('KV get error:', error);
      return null;
    }
    
    return data?.value || null;
  } catch (error) {
    console.error('KV get exception:', error);
    // Fallback to localStorage
    const localData = localStorage.getItem(`kv:${key}`);
    return localData ? JSON.parse(localData) : null;
  }
};

// Helper function to set in storage (Supabase or localStorage)
const kvSet = async (key: string, value: any): Promise<boolean> => {
  try {
    if (useLocalStorageFallback) {
      localStorage.setItem(`kv:${key}`, JSON.stringify(value));
      return true;
    }

    const { error } = await supabase
      .from('kv_store_9d13e869')
      .upsert({ key, value });

    if (error && error.code === 'PGRST205') {
      // Table doesn't exist, switch to localStorage
      useLocalStorageFallback = true;
      localStorage.setItem(`kv:${key}`, JSON.stringify(value));
      return true;
    }

    if (error) {
      console.error('KV set error:', error);
      // Fallback to localStorage
      localStorage.setItem(`kv:${key}`, JSON.stringify(value));
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('KV set exception:', error);
    // Fallback to localStorage
    localStorage.setItem(`kv:${key}`, JSON.stringify(value));
    return true;
  }
};

// Helper function to get by prefix from storage
const kvGetByPrefix = async (prefix: string): Promise<any[]> => {
  try {
    if (useLocalStorageFallback) {
      const results: any[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`kv:${prefix}`)) {
          const data = localStorage.getItem(key);
          if (data) {
            try {
              results.push(JSON.parse(data));
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
      return results;
    }

    const { data, error } = await supabase
      .from('kv_store_9d13e869')
      .select('value')
      .like('key', `${prefix}%`);

    if (error && error.code === 'PGRST205') {
      // Table doesn't exist, switch to localStorage
      useLocalStorageFallback = true;
      const results: any[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`kv:${prefix}`)) {
          const localData = localStorage.getItem(key);
          if (localData) {
            try {
              results.push(JSON.parse(localData));
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
      return results;
    }

    if (error && error.code !== 'PGRST116') {
      console.error('KV getByPrefix error:', error);
      return [];
    }
    
    return data?.map(item => item.value) || [];
  } catch (error) {
    console.error('KV getByPrefix exception:', error);
    // Fallback to localStorage
    const results: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`kv:${prefix}`)) {
        const localData = localStorage.getItem(key);
        if (localData) {
          try {
            results.push(JSON.parse(localData));
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
    return results;
  }
};

// User operations
export const getUserProfile = async (userId: string) => {
  try {
    const value = await kvGet(`user:${userId}`);
    return value;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const saveUserProfile = async (userId: string, profile: any) => {
  try {
    const success = await kvSet(`user:${userId}`, profile);
    return { success };
  } catch (error) {
    console.error('Error saving user profile:', error);
    return { success: false, error };
  }
};

// Timetable operations
export const getTimetable = async (department: string, semester: string) => {
  try {
    const value = await kvGet(`timetable:${department}:${semester}`);
    return value;
  } catch (error) {
    console.error('Error fetching timetable:', error);
    return null;
  }
};

export const saveTimetable = async (department: string, semester: string, timetableData: any) => {
  try {
    const success = await kvSet(`timetable:${department}:${semester}`, timetableData);
    
    if (success) {
      // Trigger notifications for all affected users
      await notifyTimetableChange(department, semester);
    }
    
    return { success };
  } catch (error) {
    console.error('Error saving timetable:', error);
    return { success: false, error };
  }
};

// Faculty availability operations
export const getFacultyAvailability = async (facultyId: string) => {
  try {
    const value = await kvGet(`availability:${facultyId}`);
    return value || [];
  } catch (error) {
    console.error('Error fetching availability:', error);
    return [];
  }
};

export const saveFacultyAvailability = async (facultyId: string, availability: any[]) => {
  try {
    const success = await kvSet(`availability:${facultyId}`, availability);
    return { success };
  } catch (error) {
    console.error('Error saving availability:', error);
    return { success: false, error };
  }
};

// Substitution request operations
export const getSubstitutionRequests = async (facultyId?: string) => {
  try {
    const prefix = facultyId ? `substitution:${facultyId}:` : 'substitution:';
    const values = await kvGetByPrefix(prefix);
    return values;
  } catch (error) {
    console.error('Error fetching substitution requests:', error);
    return [];
  }
};

export const saveSubstitutionRequest = async (request: any) => {
  try {
    const requestId = request.id || `${Date.now()}`;
    const success = await kvSet(
      `substitution:${request.facultyId}:${requestId}`,
      { ...request, id: requestId }
    );
    
    if (success) {
      // Create notification for admin
      await createNotification({
        userId: 'admin-001',
        type: 'info',
        title: 'New Substitution Request',
        message: `${request.facultyName} requested substitution for ${request.subject}`,
        metadata: { requestId, type: 'substitution' }
      });
    }
    
    return { success, requestId };
  } catch (error) {
    console.error('Error saving substitution request:', error);
    return { success: false, error };
  }
};

export const updateSubstitutionRequest = async (requestId: string, facultyId: string, updates: any) => {
  try {
    const value = await kvGet(`substitution:${facultyId}:${requestId}`);
    if (!value) throw new Error('Request not found');

    const existingRequest = value;
    const updatedRequest = { ...existingRequest, ...updates };

    const success = await kvSet(`substitution:${facultyId}:${requestId}`, updatedRequest);
    
    if (success && updates.status) {
      // Notify faculty of status change
      await createNotification({
        userId: facultyId,
        type: updates.status === 'approved' ? 'success' : 'warning',
        title: `Substitution Request ${updates.status}`,
        message: `Your request for ${existingRequest.subject} has been ${updates.status}`,
        metadata: { requestId, type: 'substitution' }
      });
    }
    
    return { success };
  } catch (error) {
    console.error('Error updating substitution request:', error);
    return { success: false, error };
  }
};

// Notification operations
export const getNotifications = async (userId: string) => {
  try {
    const values = await kvGetByPrefix(`notification:${userId}:`);
    // Sort by createdAt descending
    return values.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const createNotification = async (notification: {
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: any;
}) => {
  try {
    const notificationId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const notificationData = {
      id: notificationId,
      ...notification,
      read: false,
      time: new Date().toISOString(),
      createdAt: Date.now()
    };

    const success = await kvSet(
      `notification:${notification.userId}:${notificationId}`,
      notificationData
    );
    
    return { success, notificationId };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error };
  }
};

export const markNotificationAsRead = async (userId: string, notificationId: string) => {
  try {
    const value = await kvGet(`notification:${userId}:${notificationId}`);
    if (!value) throw new Error('Notification not found');

    const notification = value;
    notification.read = true;

    const success = await kvSet(`notification:${userId}:${notificationId}`, notification);
    return { success };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error };
  }
};

// Helper function to notify all users about timetable changes
const notifyTimetableChange = async (department: string, semester: string) => {
  try {
    // Get all user keys
    const userValues = await kvGetByPrefix('user:');
    
    if (!userValues || userValues.length === 0) return;

    const affectedUsers = userValues.filter((userData: any) => {
      try {
        return userData.department === department && (
          userData.role === 'student' || 
          userData.role === 'faculty'
        );
      } catch {
        return false;
      }
    });

    // Create notifications for all affected users
    await Promise.all(
      affectedUsers.map((userData: any) => {
        try {
          return createNotification({
            userId: userData.id,
            type: 'schedule',
            title: 'Timetable Updated',
            message: `The timetable for ${department} Semester ${semester} has been updated.`,
            metadata: { department, semester, type: 'timetable_update' }
          });
        } catch {
          return Promise.resolve();
        }
      })
    );
  } catch (error) {
    console.error('Error notifying timetable change:', error);
  }
};

// Constraints operations
export const getConstraints = async () => {
  try {
    const value = await kvGet('constraints:global');
    return value || getDefaultConstraints();
  } catch (error) {
    console.error('Error fetching constraints:', error);
    return getDefaultConstraints();
  }
};

export const saveConstraints = async (constraints: any) => {
  try {
    const success = await kvSet('constraints:global', constraints);
    return { success };
  } catch (error) {
    console.error('Error saving constraints:', error);
    return { success: false, error };
  }
};

const getDefaultConstraints = () => ({
  maxTeachingHours: 20,
  minGapBetweenClasses: 30,
  maxConsecutiveClasses: 3,
  allowBackToBack: true,
  enforceAvailability: true,
  allowCrossCampus: false,
  enforceRoomCapacity: true,
  requireLabEquipment: true,
  allowRoomSharing: true,
  workingDaysPerWeek: 6,
  classesPerDay: 7,
  firstClassTime: '09:00',
  lastClassTime: '17:00',
  lunchBreakDuration: 60,
  lunchBreakStart: '12:00'
});

// Leave request operations
export const getLeaveRequests = async (facultyId?: string) => {
  try {
    const prefix = facultyId ? `leave:${facultyId}:` : 'leave:';
    const values = await kvGetByPrefix(prefix);
    return values.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return [];
  }
};

export const saveLeaveRequest = async (request: any) => {
  try {
    const requestId = request.id || `${Date.now()}`;
    const success = await kvSet(
      `leave:${request.facultyId}:${requestId}`,
      { ...request, id: requestId, createdAt: Date.now(), status: 'pending' }
    );
    
    if (success) {
      // Create notification for admin
      await createNotification({
        userId: 'admin-001',
        type: 'info',
        title: 'New Leave Request',
        message: `${request.facultyName} requested leave from ${request.startDate} to ${request.endDate}`,
        metadata: { requestId, type: 'leave', facultyId: request.facultyId }
      });
    }
    
    return { success, requestId };
  } catch (error) {
    console.error('Error saving leave request:', error);
    return { success: false, error };
  }
};

export const updateLeaveRequest = async (requestId: string, facultyId: string, updates: any) => {
  try {
    const value = await kvGet(`leave:${facultyId}:${requestId}`);
    if (!value) throw new Error('Request not found');

    const existingRequest = value;
    const updatedRequest = { ...existingRequest, ...updates, updatedAt: Date.now() };

    const success = await kvSet(`leave:${facultyId}:${requestId}`, updatedRequest);
    
    if (success && updates.status) {
      // Notify faculty of status change
      await createNotification({
        userId: facultyId,
        type: updates.status === 'approved' ? 'success' : 'warning',
        title: `Leave Request ${updates.status}`,
        message: updates.adminComments 
          ? `Your leave request has been ${updates.status}. Admin comment: ${updates.adminComments}`
          : `Your leave request from ${existingRequest.startDate} to ${existingRequest.endDate} has been ${updates.status}`,
        metadata: { requestId, type: 'leave' }
      });
      
      // If approved, trigger timetable regeneration
      if (updates.status === 'approved') {
        await createNotification({
          userId: 'admin-001',
          type: 'info',
          title: 'Timetable Regeneration Required',
          message: `Leave approved for ${existingRequest.facultyName}. Please regenerate timetable and assign substitute.`,
          metadata: { requestId, type: 'timetable_regeneration', facultyId }
        });
      }
    }
    
    return { success };
  } catch (error) {
    console.error('Error updating leave request:', error);
    return { success: false, error };
  }
};

// Unavailability operations
export const getUnavailability = async (facultyId: string) => {
  try {
    const value = await kvGet(`unavailability:${facultyId}`);
    return value || [];
  } catch (error) {
    console.error('Error fetching unavailability:', error);
    return [];
  }
};

export const saveUnavailability = async (facultyId: string, unavailabilityData: any) => {
  try {
    const success = await kvSet(`unavailability:${facultyId}`, unavailabilityData);
    
    if (success) {
      // Notify admin about unavailability update
      await createNotification({
        userId: 'admin-001',
        type: 'info',
        title: 'Faculty Unavailability Updated',
        message: `${unavailabilityData.facultyName} has marked unavailability slots`,
        metadata: { facultyId, type: 'unavailability' }
      });
    }
    
    return { success };
  } catch (error) {
    console.error('Error saving unavailability:', error);
    return { success: false, error };
  }
};

// Course materials operations
export const getCourseMaterials = async (courseId: string) => {
  try {
    const value = await kvGet(`course_materials:${courseId}`);
    return value || [];
  } catch (error) {
    console.error('Error fetching course materials:', error);
    return [];
  }
};

export const saveCourseMaterial = async (courseId: string, material: any) => {
  try {
    const existingMaterials = await getCourseMaterials(courseId);
    const materialId = material.id || `${Date.now()}`;
    const newMaterial = {
      ...material,
      id: materialId,
      uploadedAt: Date.now()
    };
    
    const updatedMaterials = [...existingMaterials, newMaterial];
    const success = await kvSet(`course_materials:${courseId}`, updatedMaterials);
    
    if (success) {
      // Notify students enrolled in this course
      const userValues = await kvGetByPrefix('user:');
      const students = userValues.filter((userData: any) => {
        try {
          return userData.role === 'student' && 
                 userData.courses?.includes(courseId);
        } catch {
          return false;
        }
      });
      
      await Promise.all(
        students.map((student: any) =>
          createNotification({
            userId: student.id,
            type: 'info',
            title: 'New Course Material',
            message: `New material uploaded for ${material.courseName}: ${material.title}`,
            metadata: { courseId, materialId, type: 'course_material' }
          })
        )
      );
    }
    
    return { success, materialId };
  } catch (error) {
    console.error('Error saving course material:', error);
    return { success: false, error };
  }
};

// Sample data operations
export const getSampleData = async () => {
  try {
    const value = await kvGet('sample_data:all');
    if (value) return value;
    
    // Return default sample data
    return {
      courses: [
        { code: 'CSE401', name: 'Data Structures', credits: 4, department: 'CSE', type: 'Theory' },
        { code: 'CSE402', name: 'Database Management', credits: 4, department: 'CSE', type: 'Theory' },
        { code: 'CSE401L', name: 'DS Lab', credits: 2, department: 'CSE', type: 'Lab' },
        { code: 'ECE301', name: 'Digital Signal Processing', credits: 4, department: 'ECE', type: 'Theory' },
        { code: 'MECH201', name: 'Thermodynamics', credits: 3, department: 'MECH', type: 'Theory' }
      ],
      classrooms: [
        { roomNumber: '301', capacity: 60, building: 'Academic Block A', type: 'Lecture Hall' },
        { roomNumber: '302', capacity: 60, building: 'Academic Block A', type: 'Lecture Hall' },
        { roomNumber: 'Lab-201', capacity: 30, building: 'Lab Block', type: 'Computer Lab' },
        { roomNumber: 'Lab-202', capacity: 30, building: 'Lab Block', type: 'Electronics Lab' },
        { roomNumber: 'Auditorium', capacity: 200, building: 'Main Block', type: 'Auditorium' }
      ],
      students: [
        { studentId: 'STU001', name: 'Rahul Kumar', year: 3, section: 'A', department: 'CSE' },
        { studentId: 'STU002', name: 'Priya Sharma', year: 3, section: 'A', department: 'CSE' },
        { studentId: 'STU003', name: 'Amit Singh', year: 2, section: 'B', department: 'ECE' },
        { studentId: 'STU004', name: 'Sneha Patel', year: 2, section: 'A', department: 'MECH' }
      ],
      faculty: [
        { 
          facultyId: 'FAC001', 
          name: 'Dr. Kumar', 
          department: 'CSE', 
          email: 'kumar@university.edu',
          phone: '+91-9876543210',
          subjects: ['Data Structures', 'Algorithms'],
          availability: 'Mon-Fri: 9AM-5PM'
        },
        { 
          facultyId: 'FAC002', 
          name: 'Prof. Sharma', 
          department: 'CSE', 
          email: 'sharma@university.edu',
          phone: '+91-9876543211',
          subjects: ['Database Management', 'Software Engineering'],
          availability: 'Mon-Sat: 9AM-4PM'
        },
        { 
          facultyId: 'FAC003', 
          name: 'Dr. Singh', 
          department: 'ECE', 
          email: 'singh@university.edu',
          phone: '+91-9876543212',
          subjects: ['Digital Signal Processing', 'Communication Systems'],
          availability: 'Mon-Fri: 10AM-6PM'
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching sample data:', error);
    return null;
  }
};

export const saveSampleData = async (data: any) => {
  try {
    const success = await kvSet('sample_data:all', data);
    return { success };
  } catch (error) {
    console.error('Error saving sample data:', error);
    return { success: false, error };
  }
};
