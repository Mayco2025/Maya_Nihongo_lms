import React, { useState, useEffect } from 'react';
import { HelpCircle, CalendarDays, Users, PlusCircle, UserCheck } from '../components/icons';
import { Stats, User } from '../types';
import { collection, onSnapshot } from 'firebase/firestore';
import { getAppId } from '../utils/firebase';
import UserManagement from '../components/teacher/UserManagement';

interface TeacherDashboardPageProps {
  db: any;
  currentUser?: User;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-200/80">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-rose-100 text-rose-600">{icon}</div>
      <div className="ml-4">
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        <p className="text-slate-500">{label}</p>
      </div>
    </div>
  </div>
);

const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = ({ db, currentUser }) => {
  const [stats, setStats] = useState<Stats>({ unansweredQuestions: 0, totalClasses: 0 });
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');

  useEffect(() => {
    if (!db) return;
    
    const appId = getAppId();
    const qandaRef = collection(db, `artifacts/${appId}/public/data/qanda`);
    const scheduleRef = collection(db, `artifacts/${appId}/public/data/schedule`);

    const unsubQanda = onSnapshot(qandaRef, (snapshot) => {
      const unanswered = snapshot.docs.filter(doc => doc.data().answer === null).length;
      setStats(prev => ({ ...prev, unansweredQuestions: unanswered }));
    });

    const unsubSchedule = onSnapshot(scheduleRef, (snapshot) => {
      setStats(prev => ({ ...prev, totalClasses: snapshot.size }));
    });

    return () => {
      unsubQanda();
      unsubSchedule();
    };
  }, [db]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-rose-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-rose-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            User Management
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              icon={<HelpCircle className="w-8 h-8" />} 
              value={stats.unansweredQuestions} 
              label="Unanswered Questions" 
            />
            <StatCard 
              icon={<CalendarDays className="w-8 h-8" />} 
              value={stats.totalClasses} 
              label="Total Classes Scheduled" 
            />
            <StatCard 
              icon={<UserCheck className="w-8 h-8" />} 
              value={1} 
              label="Active Students (Demo)" 
            />
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="flex space-x-4">
              <button className="flex items-center bg-rose-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-rose-600 transition-colors">
                <PlusCircle className="w-5 h-5 mr-2" />
                Add New Class
              </button>
              <button className="flex items-center bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors">
                <PlusCircle className="w-5 h-5 mr-2" />
                Add New Material
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && currentUser && (
        <UserManagement db={db} currentUser={currentUser} />
      )}
    </div>
  );
};

export default TeacherDashboardPage; 