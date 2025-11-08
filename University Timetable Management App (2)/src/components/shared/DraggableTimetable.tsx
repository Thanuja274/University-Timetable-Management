import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Clock, MapPin, User } from 'lucide-react';

interface TimeSlot {
  id: string;
  subject: string;
  faculty: string;
  room: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

const initialTimetable: (TimeSlot | null)[][] = [
  [
    { id: '1', subject: 'Data Structures', faculty: 'Dr. Kumar', room: '301', type: 'lecture' },
    { id: '2', subject: 'DBMS', faculty: 'Prof. Sharma', room: '302', type: 'lecture' },
    null,
    { id: '3', subject: 'OS Lab', faculty: 'Dr. Patel', room: 'Lab-201', type: 'lab' },
    { id: '4', subject: 'Computer Networks', faculty: 'Dr. Singh', room: '303', type: 'lecture' },
    { id: '5', subject: 'Web Tech', faculty: 'Prof. Gupta', room: '304', type: 'tutorial' },
    null,
  ],
  [
    { id: '6', subject: 'Algorithms', faculty: 'Dr. Kumar', room: '301', type: 'lecture' },
    null,
    { id: '7', subject: 'DBMS Lab', faculty: 'Prof. Sharma', room: 'Lab-202', type: 'lab' },
    { id: '8', subject: 'Machine Learning', faculty: 'Dr. Reddy', room: '305', type: 'lecture' },
    { id: '9', subject: 'Compiler Design', faculty: 'Dr. Singh', room: '303', type: 'lecture' },
    null,
    { id: '10', subject: 'Seminar', faculty: 'Dr. Patel', room: '301', type: 'tutorial' },
  ],
  [
    { id: '11', subject: 'Data Structures', faculty: 'Dr. Kumar', room: '301', type: 'lecture' },
    { id: '12', subject: 'Computer Networks', faculty: 'Dr. Singh', room: '303', type: 'lecture' },
    { id: '13', subject: 'DBMS', faculty: 'Prof. Sharma', room: '302', type: 'lecture' },
    null,
    { id: '14', subject: 'DS Lab', faculty: 'Dr. Kumar', room: 'Lab-201', type: 'lab' },
    { id: '15', subject: 'Web Tech', faculty: 'Prof. Gupta', room: '304', type: 'lecture' },
    null,
  ],
  [
    null,
    { id: '16', subject: 'Algorithms', faculty: 'Dr. Kumar', room: '301', type: 'lecture' },
    { id: '17', subject: 'Machine Learning', faculty: 'Dr. Reddy', room: '305', type: 'lecture' },
    { id: '18', subject: 'CN Lab', faculty: 'Dr. Singh', room: 'Lab-203', type: 'lab' },
    { id: '19', subject: 'Compiler Design', faculty: 'Dr. Singh', room: '303', type: 'lecture' },
    null,
    { id: '20', subject: 'Project Work', faculty: 'Dr. Patel', room: '301', type: 'tutorial' },
  ],
  [
    { id: '21', subject: 'Data Structures', faculty: 'Dr. Kumar', room: '301', type: 'lecture' },
    { id: '22', subject: 'DBMS', faculty: 'Prof. Sharma', room: '302', type: 'lecture' },
    { id: '23', subject: 'Computer Networks', faculty: 'Dr. Singh', room: '303', type: 'lecture' },
    null,
    { id: '24', subject: 'Machine Learning', faculty: 'Dr. Reddy', room: '305', type: 'lecture' },
    { id: '25', subject: 'Web Tech Lab', faculty: 'Prof. Gupta', room: 'Lab-204', type: 'lab' },
    null,
  ],
  [
    { id: '26', subject: 'Algorithms', faculty: 'Dr. Kumar', room: '301', type: 'lecture' },
    { id: '27', subject: 'Compiler Design', faculty: 'Dr. Singh', room: '303', type: 'lecture' },
    null,
    { id: '28', subject: 'ML Lab', faculty: 'Dr. Reddy', room: 'Lab-205', type: 'lab' },
    null,
    null,
    null,
  ],
];

export function DraggableTimetable() {
  const [timetable, setTimetable] = useState(initialTimetable);
  const [draggedSlot, setDraggedSlot] = useState<{ slot: TimeSlot; dayIndex: number; timeIndex: number } | null>(null);

  const handleDragStart = (slot: TimeSlot, dayIndex: number, timeIndex: number) => {
    setDraggedSlot({ slot, dayIndex, timeIndex });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetDayIndex: number, targetTimeIndex: number) => {
    if (!draggedSlot) return;

    const newTimetable = [...timetable];
    
    // Clear the original position
    newTimetable[draggedSlot.dayIndex][draggedSlot.timeIndex] = null;
    
    // Place at new position
    newTimetable[targetDayIndex][targetTimeIndex] = draggedSlot.slot;
    
    setTimetable(newTimetable);
    setDraggedSlot(null);
  };

  const getSlotColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'lab':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'tutorial':
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-blue-100 text-blue-700';
      case 'lab':
        return 'bg-green-100 text-green-700';
      case 'tutorial':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* Header */}
        <div className="grid grid-cols-8 gap-2 mb-2">
          <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
            <p className="text-white text-center">Day / Time</p>
          </div>
          {times.map((time) => (
            <div key={time} className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
              <p className="text-white text-center">{time}</p>
            </div>
          ))}
        </div>

        {/* Timetable Grid */}
        {days.map((day, dayIndex) => (
          <div key={day} className="grid grid-cols-8 gap-2 mb-2">
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center border border-indigo-200">
              <p className="text-gray-900 text-center">{day}</p>
            </div>
            {timetable[dayIndex].map((slot, timeIndex) => (
              <div
                key={`${day}-${timeIndex}`}
                className={`p-3 rounded-lg border-2 transition-all min-h-[100px] ${
                  slot
                    ? `${getSlotColor(slot.type)} cursor-move`
                    : 'bg-gray-50 border-dashed border-gray-300 hover:bg-gray-100'
                }`}
                draggable={!!slot}
                onDragStart={() => slot && handleDragStart(slot, dayIndex, timeIndex)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(dayIndex, timeIndex)}
              >
                {slot ? (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-gray-900 line-clamp-2">
                        {slot.subject}
                      </p>
                      <Badge className={`${getTypeBadgeColor(slot.type)} text-xs`}>
                        {slot.type}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-gray-600">
                        <User className="w-3 h-3" />
                        <span className="truncate">{slot.faculty}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{slot.room}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <Clock className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 p-4 bg-white rounded-lg border border-gray-200">
        <span className="text-gray-700">Legend:</span>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-200 border border-blue-300" />
          <span className="text-gray-600">Lecture</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-200 border border-green-300" />
          <span className="text-gray-600">Lab</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-200 border border-purple-300" />
          <span className="text-gray-600">Tutorial</span>
        </div>
        <span className="text-gray-500 ml-auto">💡 Drag and drop slots to reschedule</span>
      </div>
    </div>
  );
}
