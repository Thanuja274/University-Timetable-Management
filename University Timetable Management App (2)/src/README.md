# UniSchedule - University Timetable Management System

A comprehensive, real-time university timetable management platform with multi-role dashboards (Admin, Faculty, Student) built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### Core Functionality
- **Role-Based Access Control**: Separate dashboards for Admin, Faculty, and Students
- **Real-Time Notifications**: Instant updates across all dashboards using Supabase Realtime
- **Supabase Integration**: Complete backend connectivity for data persistence
- **Responsive Design**: Mobile-friendly layouts with smooth navigation
- **Professional UI**: Clean, academic-style interface with pastel colors

### Admin Dashboard
- **Overview**: 
  - Stats dashboard with real-time metrics
  - **Pending Leave Approvals**: Review faculty leave requests with detailed information
    - Approve/Reject with comments
    - Auto-triggers timetable regeneration on approval
    - Automatic substitute faculty assignment
  - Recent activity feed
  - System status monitoring
  - **Sample Data Display**: View structured data for courses, classrooms, students, and faculty
  - **Faculty Template Download**: CSV template for bulk faculty upload
- **Data Upload**: CSV import for faculty, courses, classrooms, and students with drag-and-drop
- **Timetable Generator**: 
  - Interactive drag-and-drop editor with conflict detection
  - **Regenerate Button**: Regenerate timetable with updated constraints and room assignments
  - **Export PDF**: Download timetable with filters (by department, faculty, or section)
  - **Add Class Dynamically**: Insert new classes with conflict validation
  - Automatic room number assignment
  - Real-time conflict detection and resolution
- **Constraints Setup**: Configure scheduling rules (faculty hours, room capacity, time preferences)
- **Analytics**: Visual charts showing utilization, distribution, faculty load, time slots

### Faculty Dashboard
- **Overview**: 
  - Weekly hours, active courses, today's classes, upcoming events
  - **Quick Actions**:
    - **View Full Schedule**: Modal with complete weekly timetable
    - **Download Schedule as PDF**: Export personal timetable with faculty details
    - **Mark Unavailability**: Submit unavailable time slots with reasons
    - **Request Substitution**: Form to request substitute for specific classes
    - **Request Leave**: Submit leave requests with date range and reason
- **My Schedule**: 
  - Detailed weekly timetable with room assignments
  - Subject, section, and room number for each class
  - PDF export functionality
- **Availability Manager**: 
  - Interactive calendar/grid to select unavailable dates and times
  - Recurring unavailability support (e.g., every Monday 2-3 PM)
  - Submit to admin for timetable adjustments
  - Real-time sync with admin dashboard
- **Substitution Requests**:
  - Submit requests with date, time slot, subject, section, and reason
  - Track request status (pending/approved/rejected)
  - Real-time notifications on status changes
  - Request appears in Admin dashboard for approval
- **Leave Management**:
  - Submit leave requests with start/end dates and reason
  - Track approval status in notifications
  - Upon approval: automatic timetable regeneration with substitute assignment

### Student Dashboard
- **Overview**: 
  - Semester info, enrolled courses, today's classes, assignments
  - **Quick Actions**:
    - **Download Timetable**: Generate and download weekly timetable as PDF
      - Includes subject names, faculty, room numbers, and timings
      - File name format: `Timetable_StudentName_Section_Date.pdf`
    - **Browse Course Materials**: View and download course materials
- **Course Materials**:
  - Display list of enrolled courses
  - For each course: downloadable materials (PDFs, documents)
  - View upload date and file count
  - One-click download for each file
  - Faculty can upload materials (triggers student notifications)
- **My Timetable**: 
  - Complete weekly schedule with all class details
  - Subject, faculty, room number, and time for each class
  - PDF export with student details
- **Notifications**:
  - **Timetable Change Alerts**: When admin regenerates timetable
    - Display: Changed class, old vs new time/room
    - Mark as read/unread
    - Timestamp for each notification
  - **Course Material Alerts**: New materials uploaded
- **Removed**: Attendance feature (as requested)

## 🗄️ Database Architecture

### Supabase KV Store Schema
All data is stored using Supabase's key-value store with the following key patterns:

```
user:{userId}                          - User profile data
timetable:{department}:{semester}      - Timetable data
availability:{facultyId}               - Faculty availability
unavailability:{facultyId}             - Faculty unavailability slots
substitution:{facultyId}:{requestId}   - Substitution requests
leave:{facultyId}:{requestId}          - Leave requests
course_materials:{courseId}            - Course materials and files
notification:{userId}:{notificationId} - User notifications
constraints:global                     - System constraints
sample_data:all                        - Sample/seed data
```

## 🔔 Real-Time Features

### Cross-Dashboard Notification System

#### Admin → Faculty Notifications:
- Leave request approved/rejected (with admin comments)
- Substitution request approved/rejected
- Timetable regenerated notification
- Status updates with detailed information

#### Admin → Student Notifications:
- Timetable updated (class time/room changed)
  - Shows old vs new time/room
  - Affected classes highlighted
- New course material uploaded (per course)
- Exam schedule published
- Important announcements

#### Faculty → Admin Notifications:
- New leave request submitted
- New substitution request submitted
- Unavailability marked
- Request details and urgency level

#### Notification Features:
- **Automatic Triggers**: Sent on all relevant actions
- **Real-Time Delivery**: Using Supabase with polling fallback
- **Toast Notifications**: Immediate visual feedback
- **Read/Unread Status**: Track and filter notifications
- **Mark All as Read**: Bulk action support
- **Timestamps**: Relative time display (e.g., "5 minutes ago")
- **Color-Coded**: Different colors for different notification types

### Live Updates
- **Timetable Changes**: Automatically reflected across all user dashboards
- **Substitution Status**: Faculty receives instant updates on request approval/rejection
- **Availability Sync**: Admin dashboard updates when faculty marks unavailability

## 🔐 Authentication

### Demo Accounts
For quick testing, use these demo accounts (any password works):

- **Admin**: admin@vignan.edu
- **Faculty**: faculty@vignan.edu
- **Student**: student@vignan.edu

### Real Authentication
- Sign up with email/password
- Supabase Auth integration
- Role-based profile creation
- Session persistence

## 💾 Data Persistence

### Auto-Save Functionality
All user interactions automatically save to Supabase:
- ✅ Faculty availability changes
- ✅ Substitution requests
- ✅ Timetable modifications
- ✅ Constraint updates
- ✅ User preferences

### No Manual Save Needed
Changes are persisted instantly with visual feedback (loading states, success messages, error handling).

## 🎯 Functional Buttons

Every button in the application has working functionality:

### Admin Actions
- **Upload Data**: Process CSV files and save to database
- **Display Sample Data**: View structured courses, classrooms, students, faculty data
- **Download Faculty Template**: CSV template with proper columns for bulk upload
- **Review Leave Requests**: View, approve/reject with comments
- **Generate Timetable**: Create optimized schedules with conflict detection
- **Regenerate Timetable**: Update with new constraints and room assignments
- **Add Class Dynamically**: Insert classes with validation
- **Save Timetable**: Persist timetable changes
- **Export PDF**: Download timetable with filters (department/faculty/section)
- **Save Constraints**: Update system constraints
- **Reset Defaults**: Restore default constraint values
- **Drag & Drop Timetable**: Manual class rearrangement with conflict validation

### Faculty Actions
- **View Full Schedule**: Display complete weekly timetable in modal
- **Download Schedule as PDF**: Export personal timetable with details
- **Mark Unavailability**: Submit unavailable time slots with dates and reasons
- **Request Substitution**: Create requests with date, time, subject, section, reason
- **Request Leave**: Submit leave with date range and reason
- **Track Requests**: Monitor status (pending/approved/rejected)
- **Cancel Request**: Remove pending requests
- **Update Preferences**: Save availability preferences
- **Receive Notifications**: Real-time updates on all request statuses

### Student Actions
- **Download Timetable**: PDF export with student details and filename format
- **Browse Course Materials**: View all enrolled courses and their materials
- **Download Materials**: One-click download for PDFs and documents
- **View Course Details**: Access course info, faculty, credits, and file count
- **Receive Notifications**: 
  - Timetable change alerts (old vs new)
  - New course material alerts
  - Important announcements

## 🎨 UI/UX Features

### Visual Feedback
- **Loading States**: Spinners for async operations
- **Success/Error Messages**: Toast notifications
- **Disabled States**: Prevent duplicate submissions
- **Progress Indicators**: Show operation progress

### Responsive Design
- **Desktop**: Full-featured dashboard layout
- **Tablet**: Optimized grid layouts
- **Mobile**: Collapsible navigation, touch-friendly interface

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Semantic HTML
- **Color Contrast**: WCAG compliant
- **Clear Labels**: Descriptive form labels

## 📊 Analytics & Reporting

### Admin Analytics
- **Utilization Charts**: Bar charts showing classroom/faculty usage
- **Distribution**: Pie charts for department allocation
- **Faculty Load**: Horizontal bar charts for teaching hours
- **Time Slot Usage**: Line charts for hourly utilization

### Real-Time Stats
- **Live Updates**: Stats refresh automatically
- **Drill-Down**: Detailed views for each metric
- **Export Options**: Download reports

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4.0
- **UI Components**: Shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **State Management**: React Hooks
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

## 🚦 Getting Started

### Prerequisites
- Node.js 16+
- Supabase account (automatically configured)

### Demo Accounts Quick Start
1. Open the application
2. Use demo credentials:
   - Admin: admin@vignan.edu
   - Faculty: faculty@vignan.edu
   - Student: student@vignan.edu
3. Any password works for demo accounts

### Features to Try

#### As Admin:
1. Review and approve faculty leave requests with comments
2. View sample data structure (courses, classrooms, students, faculty)
3. Download faculty upload template (CSV)
4. Upload sample data (CSV templates provided)
5. Generate timetables with automatic conflict detection
6. Regenerate timetables with room assignments
7. Add classes dynamically with conflict validation
8. Export timetables as PDF with filters
9. Review and approve substitution requests
10. View analytics and utilization reports
11. Drag and drop to manually adjust timetable

#### As Faculty:
1. View full schedule in interactive modal
2. Download personal schedule as PDF
3. Mark unavailable time slots with dates and reasons
4. Submit substitution requests with details
5. Request leave for specific date ranges
6. Track all request statuses in real-time
7. Receive notifications on approvals/rejections
8. View today's classes and upcoming events

#### As Student:
1. View personalized timetable with all class details
2. Download timetable as PDF (with formatted filename)
3. Browse course materials by course
4. Download study materials, lecture notes, assignments
5. Check today's classes and upcoming assignments
6. Receive notifications for:
   - Timetable changes (with old vs new comparison)
   - New course materials uploaded
   - Important announcements

## 🔧 Configuration

### Supabase Setup
The application is pre-configured to use Supabase. The KV store pattern allows flexible data modeling without migrations.

### Real-Time Subscriptions
Automatic subscriptions are set up for:
- Notifications (per user)
- Timetable changes (per department/semester)
- Substitution requests (per faculty)
- Availability updates (per faculty)

## 📝 Future Enhancements

- Email notifications for important updates
- Mobile app (React Native)
- Exam schedule integration
- Room booking system
- Faculty workload balancing algorithms
- Multi-campus support
- Attendance tracking (for admin only)
- Parent portal

## 🎓 Supported Universities

Designed for institutions like:
- Vignan University
- SRM Institute
- Amrita Vishwa Vidyapeetham
- KL University
- And any other university or college

## 🤝 Support

For issues or questions:
1. Check the demo accounts work correctly
2. Verify Supabase connection
3. Check browser console for errors
4. Review notification permissions

## 📄 License

Proprietary - University Timetable Management System

---

**Built with ❤️ for modern universities**
