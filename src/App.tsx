import React, { useState } from 'react';
import { useFirebase } from './hooks/useFirebase';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StudentDashboardPage from './pages/StudentDashboardPage';
import TeacherDashboardPage from './pages/TeacherDashboardPage';
import SchedulePage from './pages/SchedulePage';
import MaterialsPage from './pages/MaterialsPage';
import QandAPage from './pages/QandAPage';


const App: React.FC = () => {
  const { db, auth, user, isAuthReady } = useFirebase();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isTeacherMode, setIsTeacherMode] = useState(false);

  // Reset teacher mode if user is not a teacher
  React.useEffect(() => {
    if (user && user.role !== 'teacher' && user.role !== 'admin') {
      setIsTeacherMode(false);
    }
  }, [user]);

  if (!isAuthReady || !user) {
    return <LoginScreen />;
  }

  const renderPage = () => {
    if (isTeacherMode) {
      switch (currentPage) {
        case 'schedule': 
          return <SchedulePage db={db} isTeacherMode={isTeacherMode} />;
        case 'materials': 
          return <MaterialsPage db={db} isTeacherMode={isTeacherMode} />;
        case 'qanda': 
          return <QandAPage db={db} user={user!} isTeacherMode={isTeacherMode} />;
        case 'dashboard':
        default: 
          return <TeacherDashboardPage db={db} />;
      }
    } else {
      switch (currentPage) {
        case 'schedule': 
          return <SchedulePage db={db} />;
        case 'materials': 
          return <MaterialsPage db={db} />;
        case 'qanda': 
          return <QandAPage db={db} user={user!} />;
        case 'dashboard':
        default: 
          return <StudentDashboardPage setCurrentPage={setCurrentPage} />;
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar 
        setCurrentPage={setCurrentPage} 
        currentPage={currentPage} 
        isTeacherMode={isTeacherMode} 
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {user && (
            <Header 
              user={user} 
              isTeacherMode={isTeacherMode} 
              setIsTeacherMode={setIsTeacherMode} 
            />
          )}
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App; 