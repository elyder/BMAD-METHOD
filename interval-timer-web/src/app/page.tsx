'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import { Session, WorkoutItem, SubItem } from '../types';

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') { // Ensure localStorage is available
      const storedSessions = localStorage.getItem('intervalTimerSessions');
      if (storedSessions) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSessions(JSON.parse(storedSessions) as Session[]);
      }
    }
  }, []);

  const calculateTotalDuration = (items: WorkoutItem[]) => {
    let totalSeconds = 0;
    items.forEach((item) => {
      if (item.duration) {
        const [minutes, seconds] = item.duration.split(':').map(Number);
        totalSeconds += (minutes * 60 + seconds) * item.repetitions;
      }
    });

    const totalMinutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${totalMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-900 text-white">
      <div className="w-full max-w-4xl">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Interval Timer</h1>
          <Link href="/create-session">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Create New Session
            </button>
          </Link>
        </header>
        <section>
          <h2 className="text-2xl font-semibold mb-4">My Workout Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.length === 0 ? (
              <p className="text-gray-400 col-span-full">No sessions created yet. Click &quot;Create New Session&quot; to get started!</p>
            ) : (
              sessions.map((session) => (
                <div key={session.id} className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">{session.name}</h3>
                  <p className="text-gray-400">Total time: {calculateTotalDuration(session.items)}</p>
                  <div className="mt-4">
                    <Link href={`/edit-session/${session.id}`}>
                      <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                    >
                      Delete
                    </button>
                    <Link href={`/run-session/${session.id}`}>
                      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2">
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