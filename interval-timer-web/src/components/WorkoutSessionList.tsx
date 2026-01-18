'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { WorkoutSession } from '../types';
import { getWorkoutSessions, saveWorkoutSession, deleteWorkoutSession } from '../lib/storage';
import { formatTotalTime } from '../lib/utils'; // Import formatTotalTime

type SortKey = 'createdAt' | 'lastUsedAt' | 'totalTime';

export default function WorkoutSessionList() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>('lastUsedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    setSessions(getWorkoutSessions());
  }, []);

  const handleDuplicate = (sessionId: string) => {
    const sessionToDuplicate = sessions.find(s => s.id === sessionId);
    if (!sessionToDuplicate) return;

    const newSession: WorkoutSession = {
      ...sessionToDuplicate,
      id: `session-${new Date().getTime()}`,
      name: `${sessionToDuplicate.name} (Copy)`,
      createdAt: new Date().toISOString(),
    };

    saveWorkoutSession(newSession);
    setSessions(getWorkoutSessions());
    alert(`'${sessionToDuplicate.name}' was duplicated.`);
  };

  const handleDelete = (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      deleteWorkoutSession(sessionId);
      setSessions(getWorkoutSessions());
    }
  };

  const handleTogglePace = (sessionId: string) => {
    const sessionToUpdate = sessions.find(s => s.id === sessionId);
    if (!sessionToUpdate) return;

    const updatedSession = {
      ...sessionToUpdate,
      showPace: !sessionToUpdate.showPace,
    };

    saveWorkoutSession(updatedSession);
    setSessions(prevSessions => 
      prevSessions.map(s => s.id === sessionId ? updatedSession : s)
    );
  };

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Handle undefined lastUsedAt
      if (sortBy === 'lastUsedAt') {
          valA = valA || '1970-01-01T00:00:00.000Z';
          valB = valB || '1970-01-01T00:00:00.000Z';
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sessions, sortBy, sortOrder]);

  return (
    <div className="w-full max-w-4xl">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Workout Sessions</h2>
        <Link href="/session/edit/new" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          + Create New Session
        </Link>
      </header>

      <div className="mb-4 flex justify-between items-center bg-gray-800 p-2 rounded-lg">
        <div>
            <span className="text-sm mr-2">Sort by:</span>
            <button onClick={() => setSortBy('lastUsedAt')} className={`text-sm p-1 ${sortBy === 'lastUsedAt' ? 'text-white' : 'text-gray-400'}`}>Last Used</button>
            <button onClick={() => setSortBy('createdAt')} className={`text-sm p-1 ${sortBy === 'createdAt' ? 'text-white' : 'text-gray-400'}`}>Created</button>
            <button onClick={() => setSortBy('totalTime')} className={`text-sm p-1 ${sortBy === 'totalTime' ? 'text-white' : 'text-gray-400'}`}>Duration</button>
        </div>
        <div>
             <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="text-sm p-1 text-gray-400">
                {sortOrder === 'desc' ? 'Desc 🔽' : 'Asc 🔼'}
             </button>
        </div>
      </div>

      {sortedSessions.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <p>No workout sessions found.</p>
          {/* Mock data button can be removed or kept for testing */}
        </div>
      ) : (
        <ul className="space-y-4">
          {sortedSessions.map((session) => (
            <li key={session.id} className="p-4 bg-gray-800 rounded-lg shadow">
              <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{session.name}</h3>
                    {session.description && <p className="text-gray-400 mt-2 text-sm">{session.description}</p>}
                    <p className="text-sm text-gray-500">Total: {formatTotalTime(session.totalTime)}</p>
                  </div>
                  <Link href={`/run/${session.id}`} className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold flex-shrink-0 ml-4">
                    RUN
                  </Link>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end items-center gap-2">
                 <button onClick={() => handleDuplicate(session.id)} className="text-sm text-gray-400 hover:text-white">Duplicate</button>
                 <span className="text-gray-600">|</span>
                 <Link href={`/session/edit/${session.id}`} className="text-sm text-gray-400 hover:text-white">
                    Edit
                 </Link>
                 <span className="text-gray-600">|</span>
                 <button onClick={() => handleDelete(session.id)} className="text-sm text-red-500 hover:text-red-400">Delete</button>
              </div>
              <div className="mt-4 pt-2 border-t border-gray-700">
                <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                    <input 
                        type="checkbox"
                        checked={!!session.showPace}
                        onChange={() => handleTogglePace(session.id)}
                        className="rounded"
                    />
                    Show pace during workout
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
