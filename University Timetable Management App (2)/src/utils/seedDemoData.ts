// Seed demo data using localStorage fallback
export const seedDemoData = async () => {
  try {
    // Check if demo data already exists
    const existingAdmin = localStorage.getItem('kv:user:admin-001');
    if (existingAdmin) {
      console.log('Demo data already exists');
      return;
    }

    console.log('Seeding demo data to localStorage...');

    // Create demo users
    const demoUsers = [
      {
        id: 'admin-001',
        name: 'Dr. Admin',
        email: 'admin@vignan.edu',
        role: 'admin',
        department: 'Administration',
      },
      {
        id: 'faculty-001',
        name: 'Prof. Kumar',
        email: 'faculty@vignan.edu',
        role: 'faculty',
        department: 'CSE',
      },
      {
        id: 'student-001',
        name: 'Ravi Sharma',
        email: 'student@vignan.edu',
        role: 'student',
        department: 'CSE',
        semester: '5',
        section: 'A',
      },
    ];

    for (const user of demoUsers) {
      localStorage.setItem(`kv:user:${user.id}`, JSON.stringify(user));
    }

    // Create demo notifications
    const demoNotifications = [
      {
        userId: 'faculty-001',
        type: 'schedule',
        title: 'Welcome to UniSchedule',
        message: 'Your timetable management system is ready to use.',
      },
      {
        userId: 'student-001',
        type: 'info',
        title: 'Welcome Student',
        message: 'Check your timetable for the semester.',
      },
      {
        userId: 'admin-001',
        type: 'success',
        title: 'System Ready',
        message: 'UniSchedule is configured and ready for use.',
      },
    ];

    for (const notif of demoNotifications) {
      const notificationId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(
        `kv:notification:${notif.userId}:${notificationId}`,
        JSON.stringify({
          id: notificationId,
          ...notif,
          read: false,
          time: new Date().toISOString(),
          createdAt: Date.now(),
        })
      );
    }

    console.log('Demo data seeded successfully to localStorage');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
};
