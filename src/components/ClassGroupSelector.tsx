import React, { useState } from 'react';
import { ClassGroup } from '../types';

interface ClassGroupSelectorProps {
  classGroups: ClassGroup[];
  userClassGroups: string[];
  onSelectClassGroup: (classGroupId: string) => void;
  selectedClassGroup?: string;
}

const ClassGroupSelector: React.FC<ClassGroupSelectorProps> = ({
  classGroups,
  userClassGroups,
  onSelectClassGroup,
  selectedClassGroup
}) => {
  const [filterType, setFilterType] = useState<'all' | 'ethiopian' | 'japanese' | 'private'>('all');

  const filteredClassGroups = classGroups.filter(group => {
    if (filterType === 'all') return true;
    return group.type === filterType;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ethiopian': return 'Ethiopian Students';
      case 'japanese': return 'Japanese Students';
      case 'private': return 'Private Lessons';
      default: return type;
    }
  };

  const getLanguageLabel = (language: string) => {
    switch (language) {
      case 'amharic': return 'Amharic';
      case 'japanese': return 'Japanese';
      case 'english': return 'English';
      default: return language;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ethiopian': return 'bg-green-100 text-green-800 border-green-200';
      case 'japanese': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'private': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterType === 'all'
              ? 'bg-rose-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Classes
        </button>
        <button
          onClick={() => setFilterType('ethiopian')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterType === 'ethiopian'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Ethiopian Students
        </button>
        <button
          onClick={() => setFilterType('japanese')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterType === 'japanese'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Japanese Students
        </button>
        <button
          onClick={() => setFilterType('private')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filterType === 'private'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Private Lessons
        </button>
      </div>

      {/* Class Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClassGroups.map((group) => (
          <div
            key={group.id}
            onClick={() => onSelectClassGroup(group.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
              selectedClassGroup === group.id
                ? 'border-rose-500 bg-rose-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{group.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(group.type)}`}>
                {getTypeLabel(group.type)}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Level:</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">{group.level}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium">Language:</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-xs">{getLanguageLabel(group.language)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium">Teacher:</span>
                <span>{group.teacherName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium">Schedule:</span>
                <span>{group.schedule}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-medium">Students:</span>
                <span>{group.students.length}/{group.maxStudents}</span>
              </div>
            </div>

            {group.description && (
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{group.description}</p>
            )}

            {userClassGroups.includes(group.id) && (
              <div className="mt-3 pt-2 border-t border-gray-200">
                <span className="text-xs font-medium text-green-600">✓ Enrolled</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredClassGroups.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No class groups found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default ClassGroupSelector; 