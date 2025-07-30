import React, { useState } from 'react';
import { ClassGroup, ClassInfo } from '../../types';

interface ClassManagementProps {
  classGroups: ClassGroup[];
  onAddClassGroup: (classGroup: Omit<ClassGroup, 'id'>) => Promise<void>;
  onAddClass: (classInfo: Omit<ClassInfo, 'id'>) => Promise<void>;
  onClose: () => void;
}

const ClassManagement: React.FC<ClassManagementProps> = ({
  classGroups,
  onAddClassGroup,
  onAddClass,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'groups' | 'classes'>('groups');
  const [showAddForm, setShowAddForm] = useState(false);

  const [classGroupForm, setClassGroupForm] = useState({
    name: '',
    type: 'ethiopian' as ClassGroup['type'],
    level: 'N5' as ClassGroup['level'],
    teacherName: '',
    maxStudents: 20,
    schedule: '',
    description: '',
    language: 'amharic' as ClassGroup['language']
  });

  const [classForm, setClassForm] = useState({
    name: '',
    classGroup: '',
    dateTime: '',
    endTime: '',
    googleMeetLink: '',
    duration: 60,
    level: 'N5' as ClassInfo['level'],
    maxStudents: 20,
    recordingLink: '',
    recordingAccessLevel: 'teacher-only' as ClassInfo['recordingAccessLevel']
  });

  const handleClassGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAddClassGroup({
        ...classGroupForm,
        teacherId: 'current-teacher-id',
        students: [],
        startDate: new Date(),
        isActive: true
      });
      setShowAddForm(false);
      setClassGroupForm({
        name: '',
        type: 'ethiopian' as ClassGroup['type'],
        level: 'N5',
        teacherName: '',
        maxStudents: 20,
        schedule: '',
        description: '',
        language: 'amharic' as ClassGroup['language']
      });
    } catch (error) {
      console.error('Failed to add class group:', error);
    }
  };

  const handleClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAddClass({
        ...classForm,
        teacherId: 'current-teacher-id',
        teacher: 'Current Teacher',
        enrolledStudents: [],
        isActive: true
      });
      setShowAddForm(false);
      setClassForm({
        name: '',
        classGroup: '',
        dateTime: '',
        endTime: '',
        googleMeetLink: '',
        duration: 60,
        level: 'N5',
        maxStudents: 20,
        recordingLink: '',
        recordingAccessLevel: 'teacher-only'
      });
    } catch (error) {
      console.error('Failed to add class:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Class Management</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'groups'
                ? 'bg-rose-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Class Groups
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'classes'
                ? 'bg-rose-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Individual Classes
          </button>
        </div>

        {activeTab === 'groups' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Class Groups</h3>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
              >
                Add Class Group
              </button>
            </div>

            {showAddForm && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="font-semibold mb-3">Add New Class Group</h4>
                <form onSubmit={handleClassGroupSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Group Name"
                      value={classGroupForm.name}
                      onChange={(e) => setClassGroupForm(prev => ({ ...prev, name: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                    <select
                      value={classGroupForm.level}
                      onChange={(e) => setClassGroupForm(prev => ({ ...prev, level: e.target.value as ClassGroup['level'] }))}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="N5">N5</option>
                      <option value="N4">N4</option>
                      <option value="N3">N3</option>
                      <option value="N2">N2</option>
                      <option value="N1">N1</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Schedule (e.g., Monday 10:00 AM)"
                      value={classGroupForm.schedule}
                      onChange={(e) => setClassGroupForm(prev => ({ ...prev, schedule: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Max Students"
                      value={classGroupForm.maxStudents}
                      onChange={(e) => setClassGroupForm(prev => ({ ...prev, maxStudents: parseInt(e.target.value) }))}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      min="1"
                      required
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={classGroupForm.description}
                    onChange={(e) => setClassGroupForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={2}
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Create Group
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {classGroups.map(group => (
                <div key={group.id} className="bg-white border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{group.name}</h4>
                      <p className="text-sm text-gray-600">Level: {group.level}</p>
                      <p className="text-sm text-gray-600">Schedule: {group.schedule}</p>
                      <p className="text-sm text-gray-600">Students: {group.students.length}/{group.maxStudents}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      group.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {group.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Individual Classes</h3>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
              >
                Add Class
              </button>
            </div>

            {showAddForm && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="font-semibold mb-3">Add New Class</h4>
                <form onSubmit={handleClassSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Class Name"
                      value={classForm.name}
                      onChange={(e) => setClassForm(prev => ({ ...prev, name: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                    <select
                      value={classForm.classGroup}
                      onChange={(e) => setClassForm(prev => ({ ...prev, classGroup: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Class Group</option>
                      {classGroups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="datetime-local"
                      value={classForm.dateTime}
                      onChange={(e) => setClassForm(prev => ({ ...prev, dateTime: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="datetime-local"
                      value={classForm.endTime}
                      onChange={(e) => setClassForm(prev => ({ ...prev, endTime: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <input
                    type="url"
                    placeholder="Google Meet Link"
                    value={classForm.googleMeetLink}
                    onChange={(e) => setClassForm(prev => ({ ...prev, googleMeetLink: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Recording Link (Google Drive)"
                    value={classForm.recordingLink}
                    onChange={(e) => setClassForm(prev => ({ ...prev, recordingLink: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Create Class
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassManagement; 