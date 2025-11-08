import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UploadDataProps {
  user: any;
}

export function UploadData({ user }: UploadDataProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (type: string) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success(`${type} data uploaded successfully!`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const uploadTypes = [
    {
      title: 'Faculty Data',
      description: 'Upload faculty information, departments, and availability',
      fields: ['Faculty ID', 'Name', 'Department', 'Email', 'Maximum Teaching Hours'],
      sampleData: [
        ['F001', 'Dr. Rajesh Kumar', 'CSE', 'rajesh@vignan.edu', '20'],
        ['F002', 'Prof. Anita Sharma', 'ECE', 'anita@vignan.edu', '18'],
      ],
    },
    {
      title: 'Course Data',
      description: 'Upload course codes, names, credits, and semester details',
      fields: ['Course Code', 'Course Name', 'Credits', 'Semester', 'Department'],
      sampleData: [
        ['CSE401', 'Data Structures', '4', '5', 'CSE'],
        ['ECE301', 'Digital Electronics', '3', '3', 'ECE'],
      ],
    },
    {
      title: 'Classroom Data',
      description: 'Upload room numbers, capacities, and types',
      fields: ['Room Number', 'Capacity', 'Type', 'Building', 'Equipment'],
      sampleData: [
        ['301', '60', 'Lecture Hall', 'A Block', 'Projector, AC'],
        ['Lab-205', '30', 'Computer Lab', 'B Block', 'PCs, Projector'],
      ],
    },
    {
      title: 'Student Data',
      description: 'Upload student enrollment and section information',
      fields: ['Roll Number', 'Name', 'Department', 'Semester', 'Section'],
      sampleData: [
        ['20CS001', 'Ravi Sharma', 'CSE', '5', 'A'],
        ['20EC045', 'Priya Patel', 'ECE', '3', 'B'],
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Upload Data</h1>
        <p className="text-gray-600">
          Import faculty, courses, classrooms, and student data for timetable generation
        </p>
      </div>

      {/* Upload Tabs */}
      <Tabs defaultValue="faculty" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        {uploadTypes.map((type, index) => (
          <TabsContent key={index} value={type.title.toLowerCase().split(' ')[0]}>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upload Form */}
              <Card>
                <CardHeader>
                  <CardTitle>{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label>Upload CSV File</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-700 mb-2">
                        Drop your CSV file here or click to browse
                      </p>
                      <p className="text-gray-500">
                        Maximum file size: 10MB
                      </p>
                      <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        id={`file-upload-${index}`}
                        onChange={() => handleFileUpload(type.title)}
                      />
                      <label htmlFor={`file-upload-${index}`}>
                        <Button className="mt-4" variant="outline" asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Uploading...</span>
                        <span className="text-gray-900">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  {/* Options */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cse">Computer Science & Engineering</SelectItem>
                          <SelectItem value="ece">Electronics & Communication</SelectItem>
                          <SelectItem value="mech">Mechanical Engineering</SelectItem>
                          <SelectItem value="civil">Civil Engineering</SelectItem>
                          <SelectItem value="all">All Departments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Semester</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
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

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Template
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Data Preview & Format Info */}
              <div className="space-y-6">
                {/* Format Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>CSV Format</CardTitle>
                    <CardDescription>Required fields for {type.title.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {type.fields.map((field, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{field}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sample Data */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sample Data</CardTitle>
                    <CardDescription>Example CSV format</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                      <div className="text-gray-700 space-y-2">
                        <div className="text-indigo-600">{type.fields.join(', ')}</div>
                        {type.sampleData.map((row, idx) => (
                          <div key={idx} className="text-gray-600">
                            {row.join(', ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Validation Rules */}
                <Card>
                  <CardHeader>
                    <CardTitle>Validation Rules</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600">All fields are mandatory</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600">No duplicate IDs allowed</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600">Email format must be valid</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>History of uploaded data files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'faculty_data_2024.csv', type: 'Faculty Data', date: '2 hours ago', status: 'success' },
              { name: 'cse_courses_sem5.csv', type: 'Course Data', date: '5 hours ago', status: 'success' },
              { name: 'classroom_inventory.csv', type: 'Classroom Data', date: '1 day ago', status: 'success' },
              { name: 'student_enrollment.csv', type: 'Student Data', date: '2 days ago', status: 'warning' },
            ].map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-900">{file.name}</p>
                    <p className="text-gray-600">{file.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500">{file.date}</span>
                  {file.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
