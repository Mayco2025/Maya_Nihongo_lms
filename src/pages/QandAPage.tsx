import React, { useState, useEffect } from 'react';
import { Question, User } from '../types';
import { collection, query, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore';
import { getAppId } from '../utils/firebase';

interface QandAPageProps {
  db: any;
  user: User;
  isTeacherMode?: boolean;
}

const QandAPage: React.FC<QandAPageProps> = ({ db, user, isTeacherMode = false }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [answerForms, setAnswerForms] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!db) return;
    
    setLoading(true);
    const appId = getAppId();
    const qandaRef = collection(db, `artifacts/${appId}/public/data/qanda`);
    const q = query(qandaRef);
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const qList: Question[] = [];
      querySnapshot.forEach((doc) => {
        qList.push({ id: doc.id, ...doc.data() } as Question);
      });
      qList.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
      setQuestions(qList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching Q&A: ", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [db]);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim() === '' || !db || !user) return;
    
    const appId = getAppId();
    const qandaRef = collection(db, `artifacts/${appId}/public/data/qanda`);
    await addDoc(qandaRef, {
      question: newQuestion,
      studentId: user.uid,
      studentName: "Student",
      timestamp: new Date(),
      answer: null,
    });
    setNewQuestion('');
  };

  const handleAnswerSubmit = async (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    const answerText = answerForms[questionId];
    if (!answerText || answerText.trim() === '' || !db) return;
    
    const appId = getAppId();
    const questionDocRef = doc(db, `artifacts/${appId}/public/data/qanda`, questionId);
    await updateDoc(questionDocRef, {
      answer: answerText,
      answeredBy: "Teacher", // In real app, use teacher's name
      answeredAt: new Date(),
    });
    setAnswerForms(prev => ({ ...prev, [questionId]: '' }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Q&A Forum</h2>
      {!isTeacherMode && (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md border mb-8">
          <form onSubmit={handleQuestionSubmit}>
            <label htmlFor="question" className="block text-lg font-semibold text-slate-700 mb-2">
              Ask a new question
            </label>
            <textarea 
              id="question" 
              value={newQuestion} 
              onChange={(e) => setNewQuestion(e.target.value)} 
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition" 
              rows={4} 
              placeholder="Type your question about a lesson, grammar point, or vocabulary here..."
            />
            <button 
              type="submit" 
              className="mt-4 bg-rose-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-rose-600 transition-colors"
            >
              Submit Question
            </button>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <p className="text-slate-500">Loading questions...</p>
        ) : (
          questions.map(q => (
            <div key={q.id} className="bg-white/80 backdrop-blur-sm p-5 rounded-lg shadow-sm border border-slate-200/80">
              <p className="text-slate-800 font-semibold">{q.question}</p>
              <p className="text-xs text-slate-400 mt-2">
                Asked by: {q.studentName} on {q.timestamp ? new Date(q.timestamp.seconds * 1000).toLocaleDateString() : 'a while ago'}
              </p>
              {q.answer ? (
                <div className="mt-4 pt-4 border-t border-slate-200 bg-rose-50/50 p-4 rounded-md">
                  <p className="font-semibold text-rose-800">Answer from Instructor:</p>
                  <p className="text-slate-700 mt-1 whitespace-pre-wrap">{q.answer}</p>
                </div>
              ) : isTeacherMode ? (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <form onSubmit={(e) => handleAnswerSubmit(e, q.id)}>
                    <textarea 
                      value={answerForms[q.id] || ''} 
                      onChange={(e) => setAnswerForms(prev => ({ ...prev, [q.id]: e.target.value }))} 
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500" 
                      rows={3} 
                      placeholder="Type your answer here..."
                    />
                    <button 
                      type="submit" 
                      className="mt-2 bg-green-500 text-white font-bold py-1 px-4 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Post Answer
                    </button>
                  </form>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-amber-600 font-semibold">
                    Awaiting an answer from an instructor.
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QandAPage; 