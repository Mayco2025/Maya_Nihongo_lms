import React, { useState, useEffect } from 'react';
import { PlusCircle } from '../components/icons';
import { ClassInfo } from '../types';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { getAppId } from '../utils/firebase';

interface SchedulePageProps {
  db: any;
  isTeacherMode?: boolean;
}

interface ClassCardProps {
  classInfo: ClassInfo;
  isPast: boolean;
}

const ClassCard: React.FC<ClassCardProps> = ({ classInfo, isPast }) => {
  const classDate = new Date(classInfo.dateTime);
  
  return (
    <div className={`bg-white/80 backdrop-blur-sm p-5 rounded-lg shadow-sm border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all duration-300 ${
      isPast ? 'opacity-70' : 'hover:shadow-lg'
    }`}>
      <div className="mb-4 sm:mb-0">
        <p className="font-bold text-lg text-slate-800">{classInfo.name}</p>
        <p className="text-slate-600">Instructor: {classInfo.teacher}</p>
        <p className="text-sm text-rose-600 font-semibold mt-1">
          {classDate.toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
        </p>
      </div>
      {!isPast && (
        <a 
          href={classInfo.googleMeetLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full sm:w-auto bg-green-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-green-600 text-center transition-colors shadow-sm hover:shadow-md"
        >
          Join Google Meet
        </a>
      )}
    </div>
  );
};

const SchedulePage: React.FC<SchedulePageProps> = ({ db, isTeacherMode = false }) => {
  const [schedule, setSchedule] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    
    setLoading(true);
    const appId = getAppId();
    const scheduleRef = collection(db, `artifacts/${appId}/public/data/schedule`);
    const q = query(scheduleRef);
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const classes: ClassInfo[] = [];
      querySnapshot.forEach((doc) => {
        classes.push({ id: doc.id, ...doc.data() } as ClassInfo);
      });
      classes.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
      setSchedule(classes);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching schedule: ", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [db]);

  const now = new Date();
  const upcomingClasses = schedule.filter(c => new Date(c.dateTime) >= now);
  const pastClasses = schedule.filter(c => new Date(c.dateTime) < now);

  if (loading) {
    return <div className="text-center p-8 text-slate-500">Loading schedule...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Upcoming Classes</h2>
        {isTeacherMode && (
          <button className="flex items-center bg-rose-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-rose-600 transition-colors">
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Class
          </button>
        )}
      </div>
      <div className="space-y-4">
        {upcomingClasses.length > 0 ? (
          upcomingClasses.map(c => (
            <ClassCard key={c.id} classInfo={c} isPast={false} />
          ))
        ) : (
          <p className="text-slate-500 bg-white/80 p-4 rounded-lg">
            No upcoming classes. Check back soon!
          </p>
        )}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-6">Past Classes</h2>
      <div className="space-y-4">
        {pastClasses.length > 0 ? (
          pastClasses.map(c => (
            <ClassCard key={c.id} classInfo={c} isPast={true} />
          ))
        ) : (
          <p className="text-slate-500 bg-white/80 p-4 rounded-lg">
            No past classes yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default SchedulePage; 