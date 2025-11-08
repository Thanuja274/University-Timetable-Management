import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { DraggableTimetable } from '../shared/DraggableTimetable';
import { Sparkles, Download, Save, RefreshCw, AlertTriangle, CheckCircle, Loader2, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getTimetable, saveTimetable } from '../../utils/supabase/database';
import { subscribeToTimetableChanges } from '../../utils/supabase/realtime';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TimetableGeneratorProps {
  user: any;
}

interface TimetableClass {
  id: string;
  subject: string;
  faculty: string;
  room: string;
  day: string;
  timeSlot: string;
  section: string;
}

interface GeneratedTimetable {
  department: string;
  semester: string;
  generatedAt: string;
  generatedBy: string;
  conflicts: number;
  data: {
    classes: TimetableClass[];
    sectionTimetables?: any;
    facultyTimetables?: any;
  };
  stats?: {
    generations?: number;
    fitness?: number;
    executionTime?: number;
  };
}

// ============= DEPARTMENT-SPECIFIC DATA =============
const departmentData = {
  cse: {
    name: 'Computer Science & Engineering',
    subjects: ['Data Structures', 'Algorithms', 'DBMS', 'Computer Networks', 'Operating Systems', 'Machine Learning', 'Web Technologies', 'Software Engineering'],
    faculties: ['Dr. Kumar CS', 'Prof. Sharma CS', 'Dr. Singh CS', 'Dr. Patel CS', 'Dr. Reddy CS', 'Prof. Gupta CS', 'Dr. Anita CS', 'Prof. Rajesh CS'],
    rooms: ['CS-301', 'CS-302', 'CS-303', 'CS-Lab-1', 'CS-Lab-2', 'CS-Lab-3', 'CS-304', 'CS-305']
  },
  ece: {
    name: 'Electronics & Communication',
    subjects: ['Digital Electronics', 'Signals & Systems', 'Analog Circuits', 'Microprocessors', 'Communication Systems', 'VLSI Design', 'Electromagnetics', 'Control Systems'],
    faculties: ['Dr. Rao ECE', 'Prof. Iyer ECE', 'Dr. Menon ECE', 'Dr. Nair ECE', 'Prof. Krishna ECE', 'Dr. Swamy ECE', 'Prof. Murthy ECE', 'Dr. Lakshmi ECE'],
    rooms: ['ECE-201', 'ECE-202', 'ECE-203', 'ECE-Lab-1', 'ECE-Lab-2', 'ECE-204', 'ECE-205', 'ECE-Lab-3']
  },
  mech: {
    name: 'Mechanical Engineering',
    subjects: ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing Process', 'Heat Transfer', 'Automobile Engineering', 'CAD/CAM', 'Industrial Engineering'],
    faculties: ['Dr. Verma MECH', 'Prof. Pandey MECH', 'Dr. Joshi MECH', 'Dr. Desai MECH', 'Prof. Kulkarni MECH', 'Dr. Patil MECH', 'Prof. Rane MECH', 'Dr. Shinde MECH'],
    rooms: ['MECH-101', 'MECH-102', 'MECH-103', 'MECH-Workshop', 'MECH-Lab-1', 'MECH-Lab-2', 'MECH-104', 'MECH-105']
  },
  civil: {
    name: 'Civil Engineering',
    subjects: ['Structural Analysis', 'Concrete Technology', 'Surveying', 'Soil Mechanics', 'Hydraulics', 'Transportation Engineering', 'Environmental Engineering', 'Construction Management'],
    faculties: ['Dr. Saxena CIVIL', 'Prof. Mishra CIVIL', 'Dr. Agarwal CIVIL', 'Dr. Chopra CIVIL', 'Prof. Bhatia CIVIL', 'Dr. Malhotra CIVIL', 'Prof. Sinha CIVIL', 'Dr. Kapoor CIVIL'],
    rooms: ['CIVIL-401', 'CIVIL-402', 'CIVIL-403', 'CIVIL-Lab-1', 'CIVIL-Lab-2', 'CIVIL-404', 'CIVIL-405', 'CIVIL-Lab-3']
  }
};

export function TimetableGenerator({ user }: TimetableGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState('cse');
  const [selectedSemester, setSelectedSemester] = useState('5');
  const [conflicts, setConflicts] = useState(0);
  const [timetableData, setTimetableData] = useState<GeneratedTimetable | null>(null);
  const [lastConfig, setLastConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showAddClassDialog, setShowAddClassDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFilter, setExportFilter] = useState('all');
  const [detectedChanges, setDetectedChanges] = useState<string[]>([]);
  
  // Add class form
  const [newClass, setNewClass] = useState({
    subject: '',
    faculty: '',
    room: '',
    day: '',
    timeSlot: '',
    section: ''
  });

  const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00', '4:00-5:00'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const loadTimetable = async () => {
      setLoading(true);
      const data = await getTimetable(selectedDepartment, selectedSemester);
      if (data) {
        setTimetableData(data);
        setConflicts(data?.conflicts || 0);
        setLastConfig({
          department: selectedDepartment,
          semester: selectedSemester
        });
      }
      setLoading(false);
    };

    loadTimetable();

    const unsubscribe = subscribeToTimetableChanges(
      selectedDepartment,
      selectedSemester,
      (updatedTimetable) => {
        setTimetableData(updatedTimetable);
        setConflicts(updatedTimetable?.conflicts || 0);
        toast.info('Timetable updated');
      }
    );

    return () => {
      unsubscribe();
    };
  }, [selectedDepartment, selectedSemester]);

  // Detect configuration changes
  useEffect(() => {
    if (!lastConfig) return;

    const changes: string[] = [];
    if (lastConfig.department !== selectedDepartment) {
      changes.push(`Department: ${departmentData[lastConfig.department as keyof typeof departmentData].name} → ${departmentData[selectedDepartment as keyof typeof departmentData].name}`);
    }
    if (lastConfig.semester !== selectedSemester) {
      changes.push(`Semester: ${lastConfig.semester} → ${selectedSemester}`);
    }

    setDetectedChanges(changes);

    if (changes.length > 0 && timetableData) {
      toast.info(`${changes.length} configuration change(s) detected. Regenerate to get updated timetable.`, {
        duration: 5000
      });
    }
  }, [selectedDepartment, selectedSemester, lastConfig]);

  // ========== GET DEPARTMENT-SPECIFIC DATA ==========
  const getDepartmentData = (dept: string) => {
    return departmentData[dept as keyof typeof departmentData] || departmentData.cse;
  };

  // ========== AI ALGORITHM IMPLEMENTATION (Genetic Algorithm) ==========
  const generateWithGeneticAlgorithm = async (
    sections: string[],
    deptData: any,
    onProgress: (progress: number) => void
  ): Promise<{ classes: TimetableClass[]; conflicts: number; stats: any }> => {
    const populationSize = 50;
    const generations = 100;
    let population: any[] = [];

    for (let i = 0; i < populationSize; i++) {
      population.push(createRandomTimetable(sections, deptData));
    }

    let bestIndividual = null;
    let bestFitness = Infinity;
    const startTime = Date.now();

    for (let gen = 0; gen < generations; gen++) {
      population.forEach(individual => {
        individual.fitness = calculateFitness(individual);
      });

      population.sort((a, b) => a.fitness - b.fitness);

      if (population[0].fitness < bestFitness) {
        bestFitness = population[0].fitness;
        bestIndividual = { ...population[0] };
      }

      const progress = ((gen + 1) / generations) * 100;
      onProgress(progress);

      if (population[0].fitness === 0) {
        break;
      }

      const newPopulation: any[] = [];
      const eliteCount = Math.floor(populationSize * 0.1);

      for (let i = 0; i < eliteCount; i++) {
        newPopulation.push({ ...population[i] });
      }

      while (newPopulation.length < populationSize) {
        const parent1 = tournamentSelection(population);
        const parent2 = tournamentSelection(population);
        const child = crossover(parent1, parent2);
        mutate(child, deptData);
        newPopulation.push(child);
      }

      population = newPopulation;
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);

    return {
      classes: bestIndividual.classes,
      conflicts: Math.ceil(bestFitness / 100),
      stats: {
        generations: generations,
        fitness: bestFitness.toFixed(2),
        executionTime: parseFloat(executionTime)
      }
    };
  };

  // Helper functions
  const createRandomTimetable = (sections: string[], deptData: any) => {
    const classes: TimetableClass[] = [];
    sections.forEach(section => {
      deptData.subjects.forEach((subject: string) => {
        classes.push({
          id: `class_${Date.now()}_${Math.random()}`,
          subject: subject,
          section: section,
          faculty: deptData.faculties[Math.floor(Math.random() * deptData.faculties.length)],
          room: deptData.rooms[Math.floor(Math.random() * deptData.rooms.length)],
          day: days[Math.floor(Math.random() * days.length)],
          timeSlot: timeSlots[Math.floor(Math.random() * timeSlots.length)]
        });
      });
    });
    return { classes, fitness: 0 };
  };

  const calculateFitness = (individual: any): number => {
    let penalties = 0;
    const classes = individual.classes;

    const facultySchedule = new Map();
    classes.forEach((cls: TimetableClass) => {
      const key = `${cls.faculty}-${cls.day}-${cls.timeSlot}`;
      if (facultySchedule.has(key)) {
        penalties += 100;
      }
      facultySchedule.set(key, true);
    });

    const roomSchedule = new Map();
    classes.forEach((cls: TimetableClass) => {
      const key = `${cls.room}-${cls.day}-${cls.timeSlot}`;
      if (roomSchedule.has(key)) {
        penalties += 100;
      }
      roomSchedule.set(key, true);
    });

    const sectionSchedule = new Map();
    classes.forEach((cls: TimetableClass) => {
      const key = `${cls.section}-${cls.day}-${cls.timeSlot}`;
      if (sectionSchedule.has(key)) {
        penalties += 100;
      }
      sectionSchedule.set(key, true);
    });

    return penalties;
  };

  const tournamentSelection = (population: any[], size = 5) => {
    const tournament: any[] = [];
    for (let i = 0; i < size; i++) {
      tournament.push(population[Math.floor(Math.random() * population.length)]);
    }
    return tournament.reduce((best, current) =>
      current.fitness < best.fitness ? current : best
    );
  };

  const crossover = (parent1: any, parent2: any) => {
    const crossoverPoint = Math.floor(Math.random() * parent1.classes.length);
    return {
      classes: [
        ...parent1.classes.slice(0, crossoverPoint),
        ...parent2.classes.slice(crossoverPoint)
      ],
      fitness: 0
    };
  };

  const mutate = (individual: any, deptData: any) => {
    const mutationRate = 0.1;
    individual.classes.forEach((cls: TimetableClass, idx: number) => {
      if (Math.random() < mutationRate) {
        const mutationType = Math.floor(Math.random() * 3);
        switch (mutationType) {
          case 0:
            individual.classes[idx].faculty = deptData.faculties[Math.floor(Math.random() * deptData.faculties.length)];
            break;
          case 1:
            individual.classes[idx].room = deptData.rooms[Math.floor(Math.random() * deptData.rooms.length)];
            break;
          case 2:
            individual.classes[idx].day = days[Math.floor(Math.random() * days.length)];
            break;
        }
      }
    });
  };

  const isConsistent = (existingClasses: TimetableClass[], newClass: TimetableClass): boolean => {
    for (const cls of existingClasses) {
      if (cls.day === newClass.day && cls.timeSlot === newClass.timeSlot) {
        if (
          cls.faculty === newClass.faculty ||
          cls.room === newClass.room ||
          cls.section === newClass.section
        ) {
          return false;
        }
      }
    }
    return true;
  };

  // ========== MAIN GENERATION HANDLER ==========
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const deptData = getDepartmentData(selectedDepartment);
      
      toast.info(`Starting timetable generation for ${deptData.name} using Genetic Algorithm...`);

      const sections: string[] = [];
      const numSections = 2;
      for (let i = 0; i < numSections; i++) {
        sections.push(`${selectedDepartment.toUpperCase()} ${selectedSemester}${String.fromCharCode(65 + i)}`);
      }

      const result = await generateWithGeneticAlgorithm(sections, deptData, setGenerationProgress);

      const generatedTimetable: GeneratedTimetable = {
        department: selectedDepartment,
        semester: selectedSemester,
        generatedAt: new Date().toISOString(),
        generatedBy: user.id,
        conflicts: result.conflicts,
        data: {
          classes: result.classes
        },
        stats: result.stats
      };

      const saveResult = await saveTimetable(selectedDepartment, selectedSemester, generatedTimetable);

      if (saveResult.success) {
        setTimetableData(generatedTimetable);
        setConflicts(result.conflicts);
        setLastConfig({
          department: selectedDepartment,
          semester: selectedSemester
        });
        setDetectedChanges([]);
        
        toast.success(
          result.conflicts === 0
            ? `✅ Timetable generated successfully for ${deptData.name} with no conflicts!`
            : `⚠️ Timetable generated with ${result.conflicts} conflict(s). Consider regenerating.`
        );
      } else {
        toast.error('Failed to save generated timetable');
      }
    } catch (error: any) {
      console.error('Error generating timetable:', error);
      toast.error(error.message || 'An error occurred while generating timetable');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!timetableData) {
      toast.error('No existing timetable to regenerate');
      return;
    }

    toast.info('Regenerating timetable with updated configuration...');
    await handleGenerate();
  };

  const handleSaveTimetable = async () => {
    if (!timetableData) {
      toast.error('No timetable data to save');
      return;
    }

    setSaving(true);
    try {
      const result = await saveTimetable(selectedDepartment, selectedSemester, timetableData);
      
      if (result.success) {
        toast.success('Timetable saved successfully!');
      } else {
        toast.error('Failed to save timetable');
      }
    } catch (error) {
      console.error('Error saving timetable:', error);
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    if (!timetableData || !timetableData.data.classes) {
      toast.error('No timetable to export');
      return;
    }

    const deptData = getDepartmentData(selectedDepartment);
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Timetable Export', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Department: ${deptData.name}`, 14, 32);
    doc.text(`Semester: ${selectedSemester}`, 14, 38);
    doc.text(`Generated: ${new Date(timetableData.generatedAt).toLocaleDateString()}`, 14, 44);
    doc.text(`Conflicts: ${timetableData.conflicts}`, 14, 50);
    
    const tableData = timetableData.data.classes.map(cls => [
      cls.day,
      cls.timeSlot,
      cls.subject,
      cls.faculty,
      cls.room,
      cls.section
    ]);
    
    autoTable(doc, {
      startY: 56,
      head: [['Day', 'Time', 'Subject', 'Faculty', 'Room', 'Section']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] },
    });
    
    doc.save(`Timetable_${selectedDepartment}_Sem${selectedSemester}_${Date.now()}.pdf`);
    toast.success('Timetable exported as PDF');
    setShowExportDialog(false);
  };

  const handleAddClass = async () => {
    if (!newClass.subject || !newClass.faculty || !newClass.room || !newClass.day || !newClass.timeSlot) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!timetableData) {
      toast.error('Generate a timetable first');
      return;
    }

    const newClassData: TimetableClass = {
      id: `class_${Date.now()}`,
      ...newClass
    };

    const hasConflict = !isConsistent(timetableData.data.classes, newClassData);

    if (hasConflict) {
      toast.error('Conflict detected! This slot is already occupied.');
      return;
    }

    try {
      const updatedData: GeneratedTimetable = {
        ...timetableData,
        data: {
          ...timetableData.data,
          classes: [...timetableData.data.classes, newClassData]
        }
      };

      const result = await saveTimetable(selectedDepartment, selectedSemester, updatedData);

      if (result.success) {
        setTimetableData(updatedData);
        toast.success('Class added successfully');
        setNewClass({ subject: '', faculty: '', room: '', day: '', timeSlot: '', section: '' });
        setShowAddClassDialog(false);
      } else {
        toast.error('Failed to add class');
      }
    } catch (error) {
      console.error('Error adding class:', error);
      toast.error('An error occurred');
    }
  };

  // Get current department data for UI
  const currentDeptData = getDepartmentData(selectedDepartment);

  // Render timetable as a structured grid
  const renderTimetableGrid = () => {
    if (!timetableData || !timetableData.data.classes) {
      return (
        <div className="text-center text-gray-500 py-12">
          Generate a timetable to view the schedule
        </div>
      );
    }

    // Group classes by day and time slot
    const schedule: any = {};
    days.forEach(day => {
      schedule[day] = {};
      timeSlots.forEach(slot => {
        schedule[day][slot] = [];
      });
    });

    timetableData.data.classes.forEach(cls => {
      if (schedule[cls.day] && schedule[cls.day][cls.timeSlot]) {
        schedule[cls.day][cls.timeSlot].push(cls);
      }
    });

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Day / Time</th>
              {timeSlots.map(slot => (
                <th key={slot} className="border border-gray-300 px-4 py-2 text-center font-semibold text-sm">
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td className="border border-gray-300 px-4 py-2 font-medium bg-gray-50">
                  {day}
                </td>
                {timeSlots.map(slot => (
                  <td key={slot} className="border border-gray-300 px-2 py-2">
                    {schedule[day][slot].length > 0 ? (
                      <div className="space-y-1">
                        {schedule[day][slot].map((cls: TimetableClass, idx: number) => (
                          <div
                            key={idx}
                            className="bg-blue-50 border border-blue-200 rounded p-2 text-xs"
                          >
                            <div className="font-semibold text-blue-900">{cls.subject}</div>
                            <div className="text-blue-700">{cls.faculty}</div>
                            <div className="text-blue-600">{cls.room} • {cls.section}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 text-xs">-</div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Timetable</h1>
        <p className="text-gray-600">
          Create optimized timetables with AI-powered conflict resolution
        </p>
      </div>

      {/* Configuration Change Alert */}
      {detectedChanges.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-amber-900 mb-2">⚠️ Configuration Changes Detected</p>
                <ul className="space-y-1">
                  {detectedChanges.map((change, idx) => (
                    <li key={idx} className="text-sm text-amber-800">• {change}</li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  onClick={handleRegenerate}
                  className="mt-3 bg-amber-600 hover:bg-amber-700"
                  disabled={isGenerating}
                >
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Regenerate Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>Timetable Configuration</CardTitle>
          <CardDescription>
            Select parameters for AI-powered timetable generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Department</label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cse">Computer Science & Engineering</SelectItem>
                  <SelectItem value="ece">Electronics & Communication</SelectItem>
                  <SelectItem value="mech">Mechanical Engineering</SelectItem>
                  <SelectItem value="civil">Civil Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Semester</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Show current department info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-900 mb-2">📚 {currentDeptData.name}</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">{currentDeptData.subjects.length}</span>
                <span className="text-blue-600"> Subjects</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">{currentDeptData.faculties.length}</span>
                <span className="text-blue-600"> Faculty Members</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">{currentDeptData.rooms.length}</span>
                <span className="text-blue-600"> Rooms/Labs</span>
              </div>
            </div>
          </div>

          {isGenerating ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Generating timetable using Genetic Algorithm...
                </span>
                <span className="text-sm font-bold text-gray-900">{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
              <div className="text-sm text-gray-600">
                {generationProgress < 30 && '🔍 Analyzing constraints and resources...'}
                {generationProgress >= 30 && generationProgress < 60 && '⚙️ Running AI optimization algorithm...'}
                {generationProgress >= 60 && generationProgress < 90 && '🔧 Resolving detected conflicts...'}
                {generationProgress >= 90 && '✨ Finalizing optimal timetable...'}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleGenerate}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Timetable
              </Button>
              <Button 
                variant="outline"
                onClick={handleRegenerate}
                disabled={!timetableData}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
              
              <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={!timetableData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Timetable as PDF</DialogTitle>
                    <DialogDescription>
                      Export the generated timetable to PDF format
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="export-filter">Filter By</Label>
                      <Select value={exportFilter} onValueChange={setExportFilter}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sections</SelectItem>
                          <SelectItem value="department">By Department</SelectItem>
                          <SelectItem value="faculty">By Faculty</SelectItem>
                          <SelectItem value="section">By Section</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleExportPDF} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={showAddClassDialog} onOpenChange={setShowAddClassDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Class
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Class Dynamically</DialogTitle>
                    <DialogDescription>
                      Add a new class with automatic conflict detection
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Select value={newClass.subject} onValueChange={(value) => setNewClass({ ...newClass, subject: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentDeptData.subjects.map(subj => (
                            <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="faculty">Faculty *</Label>
                      <Select value={newClass.faculty} onValueChange={(value) => setNewClass({ ...newClass, faculty: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select faculty" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentDeptData.faculties.map(fac => (
                            <SelectItem key={fac} value={fac}>{fac}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="room">Room Number *</Label>
                      <Select value={newClass.room} onValueChange={(value) => setNewClass({ ...newClass, room: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentDeptData.rooms.map(room => (
                            <SelectItem key={room} value={room}>{room}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="day">Day *</Label>
                      <Select value={newClass.day} onValueChange={(value) => setNewClass({ ...newClass, day: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timeSlot">Time Slot *</Label>
                      <Select value={newClass.timeSlot} onValueChange={(value) => setNewClass({ ...newClass, timeSlot: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(slot => (
                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="section">Section *</Label>
                      <Input
                        id="section"
                        placeholder="e.g., CSE 5A"
                        value={newClass.section}
                        onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleAddClass} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Class to Timetable
                    </Button>
                    <p className="text-sm text-gray-500">
                      * AI validates for conflicts before adding
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Algorithm Stats Card */}
      {timetableData && timetableData.stats && (
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Algorithm Performance</CardTitle>
            <CardDescription>Generation statistics and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {timetableData.stats.generations}
                </div>
                <div className="text-xs text-gray-600 mt-1">Generations</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {timetableData.stats.fitness}
                </div>
                <div className="text-xs text-gray-600 mt-1">Fitness Score</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {timetableData.stats.executionTime}s
                </div>
                <div className="text-xs text-gray-600 mt-1">Execution Time</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  GA
                </div>
                <div className="text-xs text-gray-600 mt-1">Algorithm Used</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {conflicts === 0 ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">No conflicts detected</p>
                    <p className="text-sm text-gray-600">Timetable is optimized and ready for deployment</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                  <div>
                    <p className="font-medium text-gray-900">{conflicts} conflict(s) detected</p>
                    <p className="text-sm text-gray-600">Consider regenerating for better optimization</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <Badge variant={conflicts === 0 ? 'default' : 'secondary'} className={conflicts === 0 ? 'bg-green-600' : 'bg-amber-600'}>
                {conflicts === 0 ? 'Conflict-Free' : 'Needs Optimization'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Timetable Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Interactive Timetable Editor</CardTitle>
              <CardDescription>
                View and manage the AI-generated schedule
              </CardDescription>
            </div>
            <Button 
              variant="outline"
              onClick={handleSaveTimetable}
              disabled={saving || loading || !timetableData}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {renderTimetableGrid()}
        </CardContent>
      </Card>

      {/* Conflict List */}
      {conflicts > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detected Conflicts</CardTitle>
            <CardDescription>
              Issues identified by AI that need resolution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">
                      Resource Conflict Detected
                    </p>
                    <p className="text-sm text-gray-600">
                      Multiple classes assigned to same room/faculty at overlapping times
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleRegenerate}>
                    Auto-Resolve
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
