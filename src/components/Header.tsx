import React from 'react';
import { User } from '../types';
import { MayaLogo } from './icons';

interface HeaderProps {
  user: User;
  isTeacherMode: boolean;
  setIsTeacherMode: (mode: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ user, isTeacherMode, setIsTeacherMode }) => (
  <div className="pb-6 mb-6 border-b border-slate-200 flex justify-between items-center">
    <div className="flex items-center">
      <MayaLogo size={50} className="mr-4" />
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          {isTeacherMode ? "Teacher Admin" : "Welcome back!"}
        </h1>
        <p className="text-slate-500 mt-1">
          Your User ID: <span className="font-mono bg-slate-100 p-1 rounded text-xs">{user.uid}</span>
        </p>
      </div>
    </div>
    <div className="flex items-center">
      <span className="mr-3 font-medium text-sm text-slate-600">
        {isTeacherMode ? 'Viewing as Teacher' : 'Viewing as Student'}
      </span>
      {(user.role === 'teacher' || user.role === 'admin') && (
        <label htmlFor="teacher-toggle" className="flex items-center cursor-pointer">
          <div className="relative">
            <input 
              type="checkbox" 
              id="teacher-toggle" 
              className="sr-only" 
              checked={isTeacherMode} 
              onChange={() => setIsTeacherMode(!isTeacherMode)} 
            />
            <div className="block bg-slate-200 w-14 h-8 rounded-full"></div>
            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform"></div>
          </div>
        </label>
      )}
      <style>{`
        input:checked ~ .dot {
          transform: translateX(100%);
          background-color: #E11D48;
        }
      `}</style>
    </div>
  </div>
);

export default Header; 