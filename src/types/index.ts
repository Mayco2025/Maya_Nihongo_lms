export interface User {
  uid: string;
  email?: string;
  displayName?: string;
  role: 'student' | 'teacher' | 'admin';
  studentId?: string;
  classGroups?: string[];
  createdAt: Date;
  lastLoginAt: Date;
}

export interface StudentProfile {
  uid: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  classGroups: string[];
  enrollmentDate: Date;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  isActive: boolean;
}

export interface ClassInfo {
  id: string;
  name: string;
  teacher: string;
  teacherId: string;
  dateTime: string;
  endTime: string;
  googleMeetLink: string;
  duration: number;
  classGroup: string;
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  maxStudents: number;
  enrolledStudents: string[];
  isActive: boolean;
  recordingLink?: string;
  recordingAccessLevel: 'public' | 'teacher-only' | 'students-only';
}

export interface Material {
  id: string;
  lessonName: string;
  classGroup: string;
  fileUrl: string;
  fileType: 'pdf' | 'ppt' | 'doc' | 'video' | 'audio' | 'image';
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  accessLevel: 'public' | 'teacher-only' | 'students-only' | 'class-specific';
  allowedClasses?: string[];
  description?: string;
  tags: string[];
  isActive: boolean;
}

export interface Question {
  id: string;
  question: string;
  studentId: string;
  studentName: string;
  classGroup?: string;
  timestamp: any; // Firestore timestamp
  answer: string | null;
  answeredBy?: string;
  answeredAt?: any; // Firestore timestamp
  status: 'pending' | 'answered' | 'closed';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface Stats {
  unansweredQuestions: number;
  totalClasses: number;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  type: 'ethiopian' | 'japanese' | 'private';
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  teacherId: string;
  teacherName: string;
  students: string[];
  maxStudents: number;
  schedule: string; // e.g., "Monday 10:00 AM"
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  description?: string;
  language: 'amharic' | 'japanese' | 'english';
}

export interface AppState {
  db: any;
  auth: any;
  user: User | null;
  isAuthReady: boolean;
  currentPage: string;
  isTeacherMode: boolean;
}

export interface AuthFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  studentId?: string;
  role?: 'student' | 'teacher';
} 