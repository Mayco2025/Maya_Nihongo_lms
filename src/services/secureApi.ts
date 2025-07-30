import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { 
  generateAuthToken, 
  validateAuthToken, 
  checkRateLimit, 
  sanitizeInput, 
  checkPermission,
  secureSession,
  getSecureHeaders
} from '../utils/security';
import { User, Question, Material, ClassInfo, StudentProfile } from '../types';
import { getAppId } from '../utils/firebase';

export class SecureApiService {
  private db: any;
  private currentUser: User | null = null;

  constructor(db: any) {
    this.db = db;
  }

  // Set current user and generate token
  setUser(user: User): void {
    this.currentUser = user;
    const token = generateAuthToken(user);
    secureSession.setToken(token);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Validate user session
  private validateSession(): boolean {
    if (!this.currentUser) {
      console.error('No authenticated user');
      return false;
    }

    const token = secureSession.getToken();
    if (!token) {
      console.error('No valid session token');
      return false;
    }

    if (!checkRateLimit(this.currentUser.uid)) {
      console.error('Rate limit exceeded');
      return false;
    }

    return true;
  }

  // Secure Q&A operations
  async submitQuestion(questionText: string, classGroup?: string): Promise<string> {
    if (!this.validateSession()) {
      throw new Error('Authentication required');
    }

    if (!checkPermission(this.currentUser!, 'student')) {
      throw new Error('Insufficient permissions');
    }

    const sanitizedQuestion = sanitizeInput(questionText);
    if (!sanitizedQuestion || sanitizedQuestion.length < 10) {
      throw new Error('Question must be at least 10 characters long');
    }

    const appId = getAppId();
    const qandaRef = collection(this.db, `artifacts/${appId}/public/data/qanda`);
    
    const questionData = {
      question: sanitizedQuestion,
      studentId: this.currentUser!.uid,
      studentName: this.currentUser!.displayName || `${this.currentUser!.firstName || 'Student'} ${this.currentUser!.lastName || ''}`.trim(),
      classGroup: classGroup || null,
      timestamp: new Date(),
      answer: null,
      status: 'pending' as const,
      priority: 'medium' as const,
      tags: [],
      isEncrypted: true,
    };

    const docRef = await addDoc(qandaRef, questionData);
    return docRef.id;
  }

  async answerQuestion(questionId: string, answerText: string): Promise<void> {
    if (!this.validateSession()) {
      throw new Error('Authentication required');
    }

    if (!checkPermission(this.currentUser!, 'teacher')) {
      throw new Error('Insufficient permissions');
    }

    const sanitizedAnswer = sanitizeInput(answerText);
    if (!sanitizedAnswer || sanitizedAnswer.length < 5) {
      throw new Error('Answer must be at least 5 characters long');
    }

    const appId = getAppId();
    const questionDocRef = doc(this.db, `artifacts/${appId}/public/data/qanda`, questionId);
    
    await updateDoc(questionDocRef, {
      answer: sanitizedAnswer,
      answeredBy: this.currentUser!.displayName || 'Teacher',
      answeredAt: new Date(),
      status: 'answered' as const,
    });
  }

  // Secure material operations
  async uploadMaterial(materialData: Partial<Material>): Promise<string> {
    if (!this.validateSession()) {
      throw new Error('Authentication required');
    }

    if (!checkPermission(this.currentUser!, 'teacher')) {
      throw new Error('Insufficient permissions');
    }

    const appId = getAppId();
    const materialsRef = collection(this.db, `artifacts/${appId}/public/data/materials`);
    
    const secureMaterialData = {
      ...materialData,
      lessonName: sanitizeInput(materialData.lessonName || ''),
      description: sanitizeInput(materialData.description || ''),
      uploadedBy: this.currentUser!.uid,
      uploadedAt: new Date(),
      isActive: true,
      isEncrypted: true,
    };

    const docRef = await addDoc(materialsRef, secureMaterialData);
    return docRef.id;
  }

  // Secure class operations
  async createClass(classData: Partial<ClassInfo>): Promise<string> {
    if (!this.validateSession()) {
      throw new Error('Authentication required');
    }

    if (!checkPermission(this.currentUser!, 'teacher')) {
      throw new Error('Insufficient permissions');
    }

    const appId = getAppId();
    const classesRef = collection(this.db, `artifacts/${appId}/public/data/classes`);
    
    const secureClassData = {
      ...classData,
      name: sanitizeInput(classData.name || ''),
      teacher: this.currentUser!.displayName || 'Teacher',
      teacherId: this.currentUser!.uid,
      isActive: true,
      isEncrypted: true,
    };

    const docRef = await addDoc(classesRef, secureClassData);
    return docRef.id;
  }

  // Secure student profile operations
  async updateStudentProfile(profileData: Partial<StudentProfile>): Promise<void> {
    if (!this.validateSession()) {
      throw new Error('Authentication required');
    }

    // Students can only update their own profile
    if (!checkPermission(this.currentUser!, 'student', this.currentUser!.uid)) {
      throw new Error('Insufficient permissions');
    }

    const appId = getAppId();
    const profileRef = doc(this.db, `artifacts/${appId}/users/students/${this.currentUser!.uid}`);
    
    const secureProfileData = {
      ...profileData,
      firstName: sanitizeInput(profileData.firstName || ''),
      lastName: sanitizeInput(profileData.lastName || ''),
      email: profileData.email || this.currentUser!.email,
      phone: profileData.phone ? sanitizeInput(profileData.phone) : undefined,
      updatedAt: new Date(),
      isEncrypted: true,
    };

    await updateDoc(profileRef, secureProfileData);
  }

  // Secure data retrieval with access control
  async getQuestions(classGroup?: string): Promise<Question[]> {
    if (!this.validateSession()) {
      throw new Error('Authentication required');
    }

    const appId = getAppId();
    const qandaRef = collection(this.db, `artifacts/${appId}/public/data/qanda`);
    
    let q = query(qandaRef, orderBy('timestamp', 'desc'));
    
    // Students can only see questions from their class group
    if (this.currentUser!.role === 'student' && classGroup) {
      q = query(q, where('classGroup', '==', classGroup));
    }

    const querySnapshot = await getDocs(q);
    const questions: Question[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Only show student names to teachers and admins
      if (this.currentUser!.role === 'student' && data.studentId !== this.currentUser!.uid) {
        data.studentName = 'Anonymous Student';
      }
      questions.push({ id: doc.id, ...data } as Question);
    });

    return questions;
  }

  async getMaterials(classGroup?: string): Promise<Material[]> {
    if (!this.validateSession()) {
      throw new Error('Authentication required');
    }

    const appId = getAppId();
    const materialsRef = collection(this.db, `artifacts/${appId}/public/data/materials`);
    
    let q = query(materialsRef, where('isActive', '==', true), orderBy('uploadedAt', 'desc'));
    
    // Filter by class group if specified
    if (classGroup) {
      q = query(q, where('classGroup', '==', classGroup));
    }

    const querySnapshot = await getDocs(q);
    const materials: Material[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Check access level
      if (data.accessLevel === 'teacher-only' && this.currentUser!.role === 'student') {
        return; // Skip teacher-only materials for students
      }
      materials.push({ id: doc.id, ...data } as Material);
    });

    return materials;
  }

  // Real-time listeners with security
  subscribeToQuestions(callback: (questions: Question[]) => void, classGroup?: string) {
    if (!this.validateSession()) {
      throw new Error('Authentication required');
    }

    const appId = getAppId();
    const qandaRef = collection(this.db, `artifacts/${appId}/public/data/qanda`);
    
    let q = query(qandaRef, orderBy('timestamp', 'desc'));
    
    if (this.currentUser!.role === 'student' && classGroup) {
      q = query(q, where('classGroup', '==', classGroup));
    }

    return onSnapshot(q, (querySnapshot) => {
      const questions: Question[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Anonymize student names for students
        if (this.currentUser!.role === 'student' && data.studentId !== this.currentUser!.uid) {
          data.studentName = 'Anonymous Student';
        }
        questions.push({ id: doc.id, ...data } as Question);
      });
      callback(questions);
    });
  }

  // Logout and clear session
  logout(): void {
    this.currentUser = null;
    secureSession.clearToken();
  }

  // Get user's class groups
  async getUserClassGroups(): Promise<string[]> {
    if (!this.validateSession()) {
      return [];
    }

    const appId = getAppId();
    const userRef = doc(this.db, `artifacts/${appId}/users/${this.currentUser!.uid}`);
    
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.classGroups || [];
      }
    } catch (error) {
      console.error('Error fetching user class groups:', error);
    }

    return [];
  }
}

// Export singleton instance
let secureApiInstance: SecureApiService | null = null;

export const getSecureApi = (db?: any): SecureApiService => {
  if (!secureApiInstance && db) {
    secureApiInstance = new SecureApiService(db);
  }
  if (!secureApiInstance) {
    throw new Error('SecureApiService not initialized. Call with database instance first.');
  }
  return secureApiInstance;
}; 