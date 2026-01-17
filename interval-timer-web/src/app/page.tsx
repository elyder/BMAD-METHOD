'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import { Session, WorkoutItem, SubItem } from '../types';

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sortBy, setSortBy] = useState<'created' | 'run' | 'length'>('created');

  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure localStorage is available
      const storedSessions = localStorage.getItem('intervalTimerSessions');
      if (storedSessions) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSessions(JSON.parse(storedSessions) as Session[]);
      }
    }
  }, []);

  const getSessionDurationSeconds = (items: WorkoutItem[]) => {
    let totalSeconds = 0;
    items.forEach((item) => {
      let itemTotalSeconds = 0;
      if (item.duration) {
        const [minutes, seconds] = item.duration.split(':').map(Number);
        itemTotalSeconds += (minutes * 60 + seconds);
      }
      
      // Add sub-items duration if any
      if (item.subItems) {
         item.subItems.forEach(subItem => {
             // Logic for sub-items duration if needed, 
             // but simpler approximation: just parent item duration * repetitions
             // Actually, the previous logic was:
             // totalSeconds += (minutes * 60 + seconds) * item.repetitions;
             // But now we have sub-items.
             // Let's stick to the previous simple logic for now or improve it?
             // Previous logic:
             /*
              if (item.duration) {
                const [minutes, seconds] = item.duration.split(':').map(Number);
                totalSeconds += (minutes * 60 + seconds) * item.repetitions;
              }
             */
             // Wait, `calculateTotalDuration` in previous file was:
             /*
                items.forEach((item) => {
                  if (item.duration) {
                    const [minutes, seconds] = item.duration.split(':').map(Number);
                    totalSeconds += (minutes * 60 + seconds) * item.repetitions;
                  }
                });
             */
             // This ignored sub-items duration if they added extra time.
             // But in `run-session`, we flatten everything. 
             // Let's iterate properly to be accurate.
         });
      }
      
      // Let's use a robust calculation that matches `run-session` logic if possible, 
      // or at least the `calculateTotalDuration` from `edit-session`.
      // In `edit-session`:
      /*
        workoutItems.forEach((item) => {
          for (let i = 1; i <= item.repetitions; i++) {
            let itemTotalSeconds = 0;
            if (item.duration) ...
            if (item.subItems) ...
            totalSeconds += itemTotalSeconds;
          }
        });
      */
      // I should replicate this for accuracy.
      
      for (let i = 1; i <= item.repetitions; i++) {
        let itemCycleSeconds = 0;
        if (item.duration) {
            const [minutes, seconds] = item.duration.split(':').map(Number);
            itemCycleSeconds += minutes * 60 + seconds;
        }
        if (item.subItems) {
            item.subItems.forEach((subItem) => {
                if (subItem.disregardInLastRepetition && i === item.repetitions) {
                    return;
                }
                if (subItem.duration) {
                    const [minutes, seconds] = subItem.duration.split(':').map(Number);
                    itemCycleSeconds += minutes * 60 + seconds;
                }
            });
        }
        totalSeconds += itemCycleSeconds;
      }
    });
    return totalSeconds;
  };

  const calculateTotalDuration = (items: WorkoutItem[]) => {
    const totalSeconds = getSessionDurationSeconds(items);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${totalMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    if (sortBy === 'created') {
      return (b.createdAt || 0) - (a.createdAt || 0);
    } else if (sortBy === 'run') {
      return (b.lastRunAt || 0) - (a.lastRunAt || 0);
    } else if (sortBy === 'length') {
        return getSessionDurationSeconds(b.items) - getSessionDurationSeconds(a.items);
    }
    return 0;
  });

  const deleteSession = (sessionId: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      let updatedSessions = JSON.parse(localStorage.getItem('intervalTimerSessions') || '[]') as Session[];
      updatedSessions = updatedSessions.filter(session => session.id !== sessionId);
      localStorage.setItem('intervalTimerSessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions); // Update state to re-render
      alert('Session deleted successfully!');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gray-900 text-white">
      <div className="w-full max-w-4xl">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold">Interval Timer</h1>
          <div className="flex items-center gap-4">
            <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'created' | 'run' | 'length')}
                className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            >
                <option value="created">Recently Created</option>
                <option value="run">Recently Run</option>
                <option value="length">Session Length</option>
            </select>
            <Link href="/create-session">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded whitespace-nowrap">
                Create New Session
                </button>
            </Link>
          </div>
        </header>
        <section>
          <h2 className="text-2xl font-semibold mb-4">My Workout Sessions</h2>
          <div className="flex flex-col space-y-4">
            {sortedSessions.length === 0 ? (
              <p className="text-gray-400">No sessions created yet. Click &quot;Create New Session&quot; to get started!</p>
            ) : (
              sortedSessions.map((session) => (
                <div key={session.id} className="bg-gray-800 p-6 rounded-lg flex flex-col md:flex-row justify-between items-center shadow-md hover:bg-gray-750 transition-colors">
                  <div className="mb-4 md:mb-0 text-left w-full md:w-auto">
                    <h3 className="text-2xl font-bold text-blue-400">{session.name}</h3>
                    {session.details && <p className="text-sm text-gray-300 mt-1 mb-2 max-w-lg">{session.details}</p>}
                    <p className="text-gray-400">Total time: <span className="font-mono text-white">{calculateTotalDuration(session.items)}</span></p>
                    {session.lastRunAt && <p className="text-xs text-gray-500 mt-1">Last run: {new Date(session.lastRunAt).toLocaleDateString()}</p>}
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/edit-session/${session.id}`}>
                      <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-colors">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Delete
                    </button>
                    <Link href={`/run-session/${session.id}`}>
                      <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors ml-2 shadow-lg">
                        Run
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
