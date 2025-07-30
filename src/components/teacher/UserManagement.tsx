import React, { useState, useEffect } from 'react';
import { User, StudentProfile, ClassGroup } from '../../types';
import { getSecureApi } from '../../services/secureApi';

interface UserManagementProps {
  db: any;
  currentUser: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ db, currentUser }) => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db || !currentUser) return;
    
    try {
      const secureApi = getSecureApi(db);
      secureApi.setUser(currentUser);
      
      // Load initial data
      loadUsers();
      loadClassGroups();
    } catch (error) {
      console.error('Error initializing user management:', error);
      setError('Failed to load user management. Please try again.');
    }
  }, [db, currentUser]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // This would be implemented in the secure API service
      // For now, we'll use mock data
      const mockStudents: StudentProfile[] = [
        {
          uid: 'student1',
          studentId: 'STU001',
          firstName: 'Abebe',
          lastName: 'Kebede',
          email: 'abebe@example.com',
          classGroups: ['class1'],
          enrollmentDate: new Date('2024-01-15'),
          level: 'N5',
          isActive: true,
        },
        {
          uid: 'student2',
          studentId: 'STU002',
          firstName: 'Fatima',
          lastName: 'Ahmed',
          email: 'fatima@example.com',
          classGroups: ['class1', 'class2'],
          enrollmentDate: new Date('2024-01-20'),
          level: 'N4',
          isActive: true,
        },
      ];
      
      setStudents(mockStudents);
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
      setLoading(false);
    }
  };

  const loadClassGroups = async () => {
    try {
      // Mock class groups data
      const mockClassGroups: ClassGroup[] = [
        {
          id: 'class1',
          name: 'N5 Beginners - Morning',
          type: 'ethiopian',
          level: 'N5',
          teacherId: currentUser.uid,
          teacherName: currentUser.displayName || 'Teacher',
          students: ['student1', 'student2'],
          maxStudents: 15,
          schedule: 'Monday 10:00 AM',
          startDate: new Date('2024-01-15'),
          isActive: true,
          language: 'amharic',
        },
        {
          id: 'class2',
          name: 'N4 Intermediate - Evening',
          type: 'japanese',
          level: 'N4',
          teacherId: currentUser.uid,
          teacherName: currentUser.displayName || 'Teacher',
          students: ['student2'],
          maxStudents: 12,
          schedule: 'Wednesday 6:00 PM',
          startDate: new Date('2024-02-01'),
          isActive: true,
          language: 'japanese',
        },
      ];
      
      setClassGroups(mockClassGroups);
    } catch (error) {
      console.error('Error loading class groups:', error);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = !selectedClass || student.classGroups.includes(selectedClass);
    
    return matchesSearch && matchesClass;
  });

  const handleEnrollStudent = async (studentId: string, classId: string) => {
    try {
      // This would be implemented in the secure API service
      console.log(`Enrolling student ${studentId} in class ${classId}`);
      // Update local state
      setStudents(prev => prev.map(student => 
        student.studentId === studentId 
          ? { ...student, classGroups: [...student.classGroups, classId] }
          : student
      ));
    } catch (error) {
      console.error('Error enrolling student:', error);
      setError('Failed to enroll student');
    }
  };

  const handleRemoveStudent = async (studentId: string, classId: string) => {
    try {
      // This would be implemented in the secure API service
      console.log(`Removing student ${studentId} from class ${classId}`);
      // Update local state
      setStudents(prev => prev.map(student => 
        student.studentId === studentId 
          ? { ...student, classGroups: student.classGroups.filter(cg => cg !== classId) }
          : student
      ));
    } catch (error) {
      console.error('Error removing student:', error);
      setError('Failed to remove student');
    }
  };

  const handleToggleStudentStatus = async (studentId: string) => {
    try {
      // This would be implemented in the secure API service
      console.log(`Toggling status for student ${studentId}`);
      // Update local state
      setStudents(prev => prev.map(student => 
        student.studentId === studentId 
          ? { ...student, isActive: !student.isActive }
          : student
      ));
    } catch (error) {
      console.error('Error toggling student status:', error);
      setError('Failed to update student status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-slate-600">Loading user management...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          >
            <option value="">All Classes</option>
            {classGroups.map(classGroup => (
              <option key={classGroup.id} value={classGroup.id}>
                {classGroup.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Classes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredStudents.map((student) => (
                <tr key={student.uid} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                          <span className="text-rose-600 font-semibold">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-slate-500">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {student.studentId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.level === 'N5' ? 'bg-green-100 text-green-800' :
                      student.level === 'N4' ? 'bg-blue-100 text-blue-800' :
                      student.level === 'N3' ? 'bg-yellow-100 text-yellow-800' :
                      student.level === 'N2' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    <div className="space-y-1">
                      {student.classGroups.map(classId => {
                        const classGroup = classGroups.find(cg => cg.id === classId);
                        return classGroup ? (
                          <div key={classId} className="text-xs bg-slate-100 px-2 py-1 rounded">
                            {classGroup.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleToggleStudentStatus(student.studentId)}
                      className={`text-xs px-3 py-1 rounded-full ${
                        student.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {student.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => {/* Open edit modal */}}
                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-500 text-lg">No students found</div>
          <div className="text-slate-400 text-sm mt-2">
            Try adjusting your search or filter criteria
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 