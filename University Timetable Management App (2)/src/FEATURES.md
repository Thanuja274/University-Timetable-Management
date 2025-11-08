# Complete Feature List - UniSchedule

## 📋 ADMIN DASHBOARD

### 1️⃣ Overview Section

#### Pending Approvals - Review Button
- **Functionality**: Display detailed leave request information
- **Features**:
  - View faculty name, department, dates (start/end), and reason
  - Approve/Reject options with admin comments
  - After approval/rejection: automatic status update
  - Notification sent to faculty with admin comments
  - Approval triggers timetable regeneration workflow

#### Statistics Cards
- Total Faculty count with monthly growth
- Active Courses with semester additions
- Classrooms with utilization percentage
- Timetables with approval status

#### Recent Activity Feed
- Real-time activity log
- Color-coded status indicators
- Timestamp for each activity
- Action types: timetable generated, conflicts resolved, data uploaded, constraints modified

### 2️⃣ Leave Management System

#### Faculty Leave Application Flow:
1. **Faculty Submission**: Faculty applies for leave in their dashboard
2. **Admin Review**: Request appears in Admin Dashboard → Pending Approvals
3. **Admin Action**: Admin can approve or reject with comments
4. **Auto-Regeneration**: Upon approval, system automatically:
   - Regenerates timetable
   - Assigns substitute faculty for affected classes
   - Includes room numbers in regenerated timetable
   - Sends notifications to all affected parties

#### Leave Request Details:
- Faculty name and department
- Start date and end date
- Reason for leave
- Request submission timestamp
- Status tracking (pending/approved/rejected)
- Admin comments field

### 3️⃣ Upload Data Section

#### Display Sample Data Button:
Shows structured data with proper formatting:

**Courses Data:**
- Course code (e.g., CSE401)
- Course name (e.g., Data Structures)
- Credits (e.g., 4)
- Department (e.g., CSE)
- Type (Theory/Lab)

**Classrooms Data:**
- Room number (e.g., 301, Lab-201)
- Capacity (number of seats)
- Building name
- Type (Lecture Hall/Computer Lab/Electronics Lab/Auditorium)

**Students Data:**
- Student ID (e.g., STU001)
- Student name
- Year (e.g., 3)
- Section (e.g., A, B)
- Department

**Faculty Data:**
- Faculty ID (e.g., FAC001)
- Name (e.g., Dr. Kumar)
- Department
- Email address
- Phone number
- Subjects taught (array)
- Availability schedule

### 4️⃣ Faculty Details Section

#### Template Download Button:
- **Format**: CSV file
- **Columns Included**:
  - Name
  - Employee ID
  - Department
  - Email
  - Phone
  - Subjects (comma-separated)
- **Sample Data**: Template includes 3 example rows
- **Usage**: Download → Fill → Upload in Upload Data section
- **Filename**: `faculty_upload_template.csv`

### 5️⃣ Generate Timetable Section

#### Regenerate Button:
- **Purpose**: Regenerate timetable based on updated constraints
- **Automatic Features**:
  - Assigns room numbers to each class
  - Handles scheduling conflicts
  - Resolves overlaps (faculty/room/time)
  - Validates against all constraints
- **Progress Indicator**: Shows generation steps with percentage
- **Conflict Detection**: Displays remaining conflicts after regeneration

#### Export PDF Button:
- **Export Options**:
  - Filter by department
  - Filter by faculty
  - Filter by student section
  - Export all sections
- **PDF Contents**:
  - Complete timetable in table format
  - Department and semester information
  - Generation date
  - Filter applied
  - All class details: Day, Time, Subject, Faculty, Room, Section
- **Filename Format**: `Timetable_{Department}_Sem{Number}.pdf`

#### Drag and Drop Functionality:
- **Features**:
  - Manual rearrangement of classes in timetable grid
  - Visual drag handles on each class card
  - Real-time conflict validation
  - Automatic database update when classes are moved
- **Conflict Validation**:
  - Room availability check
  - Faculty availability check
  - Time slot overlap detection
  - Visual feedback on conflicts

#### Add Class Dynamically:
- **Form Fields**:
  - Subject name (required)
  - Faculty name (required)
  - Room number (required)
  - Day of week (dropdown)
  - Time slot (text input)
  - Section (text input)
- **Validation**:
  - All required fields check
  - Conflict detection before adding
  - Room capacity validation
  - Faculty availability check
- **Success**: Class added to timetable immediately
- **Auto-Save**: Changes persist to database

---

## 👨‍🏫 FACULTY DASHBOARD

### 1️⃣ Overview Section - Quick Actions

#### View Full Schedule Button:
- **Display**: Complete weekly timetable in modal dialog
- **Information Shown**:
  - Day of week
  - Time slot
  - Subject name
  - Section (e.g., CSE 5A)
  - Room number with building
- **Actions**: 
  - Scroll through all week's classes
  - Download as PDF option in modal

#### Download Schedule as PDF:
- **PDF Contents**:
  - Title: "Faculty Weekly Schedule"
  - Faculty name and department
  - Generation date
  - Complete weekly schedule in table format
  - Columns: Day, Time, Subject, Section, Room
- **Filename Format**: `{FacultyName}_Schedule.pdf`
- **Styling**: Professional layout with university branding colors

#### Mark Unavailability Button:
- **Opens**: Modal/form with following fields
  - Date picker (single or range)
  - Time slot input
  - Recurring option checkbox
  - Reason textarea (optional)
- **Functionality**:
  - Submit request to admin for approval
  - Saves to database immediately
  - Creates notification for admin
  - Display confirmation message
- **Tracking**: Can view submitted unavailability in Availability Manager

#### Request Substitution Button:
- **Form Fields**:
  - Date (date picker)
  - Time slot (text or dropdown)
  - Subject name
  - Section
  - Reason for substitution (required)
- **Workflow**:
  - Submit request to admin dashboard
  - Track request status (pending/approved/rejected)
  - Receive notification on status change
- **Status Display**: Shows in "My Requests" section

#### Request Leave Button:
- **Form Fields**:
  - Start date (date picker)
  - End date (date picker)
  - Reason for leave (textarea, required)
- **Submission**:
  - Saves to database with "pending" status
  - Creates notification for admin
  - Appears in Admin → Pending Approvals
- **Post-Submission**:
  - Track status in notifications
  - Receive notification on admin decision
  - If approved: timetable regenerated with substitute

### 2️⃣ Availability Section

#### Mark Unavailability Slots:
- **Interface**: Calendar/grid interface
- **Features**:
  - Select unavailable dates
  - Select unavailable time slots
  - Option to mark recurring unavailability (e.g., every Monday 2-3 PM)
  - Add reason/notes for each unavailability
- **Submission**: 
  - Submit to admin for timetable adjustments
  - Admin receives notification
  - Can review in Admin dashboard

### 3️⃣ Leave Request Flow:

**Step 1: Faculty Submission**
- Faculty fills leave request form
- Specifies start date, end date, reason
- Submits through "Request Leave" button

**Step 2: Admin Review**
- Request appears in Admin Dashboard → Pending Approvals
- Admin can see all details
- Admin adds comments (optional)

**Step 3: Admin Decision**
- Admin clicks Approve or Reject
- Admin can add comments
- Decision saved to database

**Step 4: Faculty Notification**
- Response appears in Faculty Dashboard → Notifications
- Shows approved/rejected status
- Displays admin comments if any

**Step 5: If Approved**
- Timetable is regenerated automatically
- Substitute faculty is assigned
- All affected parties notified
- New timetable includes room assignments

---

## 🎓 STUDENT DASHBOARD

### 1️⃣ Overview Section - Quick Actions

#### Download Timetable Button:
- **Functionality**: Generate and download student's weekly timetable as PDF
- **PDF Contents**:
  - Title: "Student Timetable"
  - Student name
  - Section (e.g., CSE 5A)
  - Semester number
  - Generation date
  - Complete weekly schedule table
  - Columns: Day, Time, Subject, Faculty, Room
- **File Name Format**: 
  ```
  Timetable_StudentName_Section_Date.pdf
  Example: Timetable_Rahul_Kumar_CSE5A_2025-11-06.pdf
  ```
- **Styling**: Clean table layout with color-coded headers

#### Browse Course Material Button:
- **Opens**: Modal dialog with course materials browser
- **Display**: List of all enrolled courses
- **For Each Course Shows**:
  - Course name and code
  - Faculty name
  - Number of files available
  - File list with:
    - File title
    - File type icon
    - Upload date
    - Download button

#### Course Materials Browser:
- **Course Cards**: Each enrolled course has a card showing:
  - Course name (e.g., Data Structures)
  - Course code (e.g., CSE401)
  - Faculty name
  - Credits
  - Material count badge
- **Clicking a Course**: 
  - Expands to show all materials
  - Materials listed with icons
  - Each material has download button
- **Empty State**: Shows "No materials uploaded yet" for courses without files

### 2️⃣ Notifications Section

#### Timetable Change Alerts:
- **Trigger**: When admin regenerates timetable
- **Notification Contains**:
  - Title: "Timetable Updated"
  - Changed class information
  - **Old time/room**: Previous schedule
  - **New time/room**: Updated schedule
  - Department and semester
  - Timestamp
- **Features**:
  - Mark as read/unread
  - Click to view full details
  - Color-coded for visibility
  - Sorted by timestamp (newest first)

#### Course Material Alerts:
- **Trigger**: When faculty uploads new material
- **Notification Contains**:
  - Title: "New Course Material"
  - Course name
  - Material title
  - Faculty who uploaded
  - Upload timestamp
- **Action**: Click notification to go to course materials

#### Notification Features:
- **Status Indicators**: Unread shows "New" badge
- **Time Display**: Relative time (e.g., "5 minutes ago")
- **Color Coding**: Different colors for different notification types
- **Actions**: Mark as read, mark all as read
- **Persistence**: Stored in database

---

## 🔔 NOTIFICATION SYSTEM (Cross-Dashboard)

### Admin → Faculty Notifications:

1. **Leave Request Approved/Rejected**
   - Status (approved/rejected)
   - Admin comments
   - Original request details
   - Next steps information

2. **Substitution Request Approved/Rejected**
   - Status update
   - Substitute assigned (if approved)
   - Class details
   - Date and time

3. **Timetable Regenerated**
   - Notification that timetable has been updated
   - Affects your schedule
   - View new schedule prompt
   - Changes summary

### Admin → Student Notifications:

1. **Timetable Updated**
   - Classes affected
   - Old schedule details
   - New schedule details
   - Comparison view
   - Reason for change

2. **New Course Material Uploaded**
   - Course name
   - Material title
   - Faculty name
   - Direct link to download
   - Upload date

3. **Exam Schedule Published**
   - Exam details
   - Date and time
   - Location/room
   - Instructions
   - Preparation time

### Faculty → Admin Notifications:

1. **New Leave Request Submitted**
   - Faculty name
   - Department
   - Date range
   - Reason summary
   - Direct link to review

2. **New Substitution Request Submitted**
   - Faculty name
   - Subject and section
   - Date and time
   - Urgency indicator
   - Reason provided

3. **Unavailability Marked**
   - Faculty name
   - Time slots marked unavailable
   - Dates affected
   - Recurring or one-time
   - Reason/notes

### Notification System Features:

- **Real-Time Delivery**: Polls every 10 seconds for new notifications
- **Toast Popups**: Immediate visual feedback for new notifications
- **Badge Counter**: Shows unread count in navigation
- **Sound Alerts**: Optional sound for important notifications
- **Persistent Storage**: All notifications saved to database
- **Filter Options**: Filter by type, read/unread, date
- **Search**: Search through notification history
- **Auto-Cleanup**: Optional auto-delete after 30 days
- **Priority Levels**: High/Medium/Low priority indicators
- **Action Buttons**: Quick actions directly from notification
- **Rich Content**: Supports formatted text and links

---

## 🎯 Additional Features

### PDF Generation:
- Uses jsPDF library
- Professional table layouts with autoTable
- Custom headers with university branding
- Proper formatting and pagination
- Download triggers browser save dialog

### Form Validation:
- Real-time validation on all forms
- Clear error messages
- Field-level validation
- Submit button disabled until valid
- Success/error toast notifications

### Loading States:
- Spinners for async operations
- Disabled buttons during processing
- Progress bars for multi-step operations
- Skeleton loaders for content
- Clear status messages

### Error Handling:
- Try-catch blocks on all async operations
- User-friendly error messages
- Console logging for debugging
- Fallback to localStorage if database fails
- Retry mechanisms for network issues

### Data Persistence:
- Automatic save on all changes
- Optimistic UI updates
- Background sync
- Conflict resolution
- Version control

### Accessibility:
- Keyboard navigation support
- ARIA labels on all interactive elements
- Screen reader friendly
- High contrast mode support
- Focus indicators

### Responsive Design:
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly buttons
- Collapsible navigation on mobile
- Adaptive layouts

---

## 🚀 Performance Optimizations

- Lazy loading of components
- Memoization of expensive calculations
- Debounced search inputs
- Paginated data loading
- Optimized re-renders
- Code splitting
- Asset optimization

---

**Last Updated**: November 6, 2025
**Version**: 2.0 - Complete Feature Implementation
