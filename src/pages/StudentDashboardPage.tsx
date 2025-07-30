import React from 'react';
import { CalendarDays, BookOpen, HelpCircle } from '../components/icons';

interface StudentDashboardPageProps {
  setCurrentPage: (page: string) => void;
}

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  pageName: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ icon, title, description, buttonText, onClick }) => (
  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-200/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
    <div className="flex items-center text-rose-500 mb-4">
      {icon}
      <h3 className="ml-3 text-xl font-semibold text-slate-800">{title}</h3>
    </div>
    <p className="text-slate-600 flex-grow mb-6">{description}</p>
    <button 
      onClick={onClick} 
      className="mt-auto w-full bg-rose-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-200 group-hover:shadow-lg"
    >
      {buttonText}
    </button>
  </div>
);

const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ setCurrentPage }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card 
        icon={<CalendarDays className="w-8 h-8"/>} 
        title="Class Schedule" 
        description="View your upcoming live classes, check times, and get ready to learn." 
        buttonText="View Schedule" 
        pageName="schedule"
        onClick={() => setCurrentPage("schedule")}
      />
      <Card 
        icon={<BookOpen className="w-8 h-8"/>} 
        title="Course Materials" 
        description="Access presentation slides and notes from your completed classes." 
        buttonText="Go to Materials" 
        pageName="materials"
        onClick={() => setCurrentPage("materials")}
      />
      <Card 
        icon={<HelpCircle className="w-8 h-8"/>} 
        title="Q&A Forum" 
        description="Have a question about a lesson? Ask it here and get answers from instructors." 
        buttonText="Ask a Question" 
        pageName="qanda"
        onClick={() => setCurrentPage("qanda")}
      />
    </div>
  );
};

export default StudentDashboardPage; 