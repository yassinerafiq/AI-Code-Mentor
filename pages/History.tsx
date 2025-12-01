import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { fetchHistory } from '../services/store';
import { HistoryItem } from '../types';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

interface HistoryProps {
  user: User | null;
}

export const History: React.FC<HistoryProps> = ({ user }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchHistory(user.uid)
        .then(data => setHistory(data))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-32 text-center px-6">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Please sign in</h2>
        <p className="text-neutral-500 mb-8">You need to be logged in to view your analysis history.</p>
        <Link to="/" className="inline-block px-6 py-2.5 bg-black text-white rounded-full font-medium text-sm">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-24 pb-12 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Your History</h1>
        <span className="text-sm text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
          {history.length} Analysis{history.length !== 1 ? 'es' : ''}
        </span>
      </div>

      <div className="space-y-6">
        {history.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 border-dashed">
            <p className="text-neutral-400">No history found. Start analyzing some code!</p>
            <Link to="/" className="mt-4 inline-block text-sm font-semibold text-black hover:underline">Start New Analysis &rarr;</Link>
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div 
                onClick={() => toggleExpand(item.id)}
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg
                    ${item.mode === 'Explain Code' ? 'bg-blue-100 text-blue-600' : ''}
                    ${item.mode === 'Find Bugs' ? 'bg-red-100 text-red-600' : ''}
                    ${item.mode === 'Improve Code' ? 'bg-emerald-100 text-emerald-600' : ''}
                  `}>
                    {item.mode === 'Explain Code' && '💡'}
                    {item.mode === 'Find Bugs' && '🐛'}
                    {item.mode === 'Improve Code' && '⚡'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{item.mode}</h3>
                    <p className="text-xs text-neutral-500">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className={`transform transition-transform duration-200 ${expandedId === item.id ? 'rotate-180' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>

              {expandedId === item.id && (
                <div className="border-t border-neutral-100 p-6 bg-neutral-50/50">
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">Input Code</h4>
                    <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-xl text-xs overflow-x-auto font-mono">
                      <code>{item.code}</code>
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">AI Response</h4>
                    <div className="prose prose-sm prose-neutral max-w-none bg-white p-6 rounded-xl border border-neutral-200">
                      <ReactMarkdown>{item.response}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
