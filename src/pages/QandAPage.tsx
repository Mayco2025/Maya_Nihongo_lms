import React, { useState, useEffect } from 'react';
import { Question, User } from '../types';
import { getSecureApi } from '../services/secureApi';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db || !user) return;
    
    try {
      const secureApi = getSecureApi(db);
      secureApi.setUser(user);
      
      setLoading(true);
      const unsubscribe = secureApi.subscribeToQuestions((questionsList) => {
        setQuestions(questionsList);
        setLoading(false);
        setError(null);
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up secure Q&A: ", error);
      setError("Failed to load Q&A. Please try again.");
      setLoading(false);
    }
  }, [db, user]);

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim() === '' || !db || !user) return;
    
    try {
      const secureApi = getSecureApi(db);
      await secureApi.submitQuestion(newQuestion);
      setNewQuestion('');
      setError(null);
    } catch (error) {
      console.error('Failed to submit question:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit question');
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    const answerText = answerForms[questionId];
    if (!answerText || answerText.trim() === '' || !db) return;
    
    try {
      const secureApi = getSecureApi(db);
      await secureApi.answerQuestion(questionId, answerText);
      setAnswerForms(prev => ({ ...prev, [questionId]: '' }));
      setError(null);
    } catch (error) {
      console.error('Failed to submit answer:', error);
      setError(error instanceof Error ? error.message : 'Failed to submit answer');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Q&A Forum</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
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