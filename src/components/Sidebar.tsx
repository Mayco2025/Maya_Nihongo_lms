import React from 'react';
import { Home, CalendarDays, BookOpen, HelpCircle, LogOut } from './icons';

interface SidebarProps {
  setCurrentPage: (page: string) => void;
  currentPage: string;
  isTeacherMode: boolean;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  pageName: string;
  onClick: () => void;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick, isActive }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
      isActive 
        ? 'bg-rose-500 text-white shadow-lg' 
        : 'text-slate-600 hover:bg-rose-100 hover:text-rose-700'
    }`}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ setCurrentPage, currentPage, isTeacherMode }) => {
  return (
    <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-slate-200/80 flex-col justify-between hidden md:flex">
      <div>
        <div className="flex items-center justify-center h-20 border-b border-slate-200/80">
          <h1 className="text-2xl font-bold text-rose-600 tracking-wider">Maya Nihongo</h1>
        </div>
        <nav className="p-4 space-y-2">
          <NavItem 
            icon={<Home className="w-6 h-6" />} 
            label={isTeacherMode ? "Admin Home" : "Dashboard"} 
            pageName="dashboard"
            onClick={() => setCurrentPage("dashboard")}
            isActive={currentPage === "dashboard"}
          />
          <NavItem 
            icon={<CalendarDays className="w-6 h-6" />} 
            label="Schedule" 
            pageName="schedule"
            onClick={() => setCurrentPage("schedule")}
            isActive={currentPage === "schedule"}
          />
          <NavItem 
            icon={<BookOpen className="w-6 h-6" />} 
            label="Materials" 
            pageName="materials"
            onClick={() => setCurrentPage("materials")}
            isActive={currentPage === "materials"}
          />
          <NavItem 
            icon={<HelpCircle className="w-6 h-6" />} 
            label="Q&A Forum" 
            pageName="qanda"
            onClick={() => setCurrentPage("qanda")}
            isActive={currentPage === "qanda"}
          />
        </nav>
      </div>
      <div className="p-4 border-t border-slate-200/80">
        <button className="flex items-center w-full px-4 py-3 text-left text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-lg transition-colors duration-200">
          <LogOut className="w-6 h-6" />
          <span className="ml-4 font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 