import React, { useState, useEffect } from 'react';
import { HelpCircle, CalendarDays, Users, PlusCircle } from '../components/icons';
import { Stats } from '../types';
import { collection, onSnapshot } from 'firebase/firestore';
import { getAppId } from '../utils/firebase';

interface TeacherDashboardPageProps {
  db: any;
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

const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = ({ db }) => {
  const [stats, setStats] = useState<Stats>({ unansweredQuestions: 0, totalClasses: 0 });

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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Teacher Overview</h2>
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
          icon={<Users className="w-8 h-8" />} 
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
    </div>
  );
};

export default TeacherDashboardPage; 