'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutSession } from '@/types';
import { getWorkoutSession, saveWorkoutSession } from '@/lib/storage';
import SessionForm from '@/components/SessionForm';
import { WARMUP_COLORS, ACTION_COLORS, COOLDOWN_COLORS } from '@/colors';

// The params object is a Promise in client components
export default function SessionEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<Partial<WorkoutSession> | null>(null);

  useEffect(() => {
    if (!id) return;

    const isNew = id === 'new';

    if (isNew) {
      // Handle the creation of a new session
      const newSessionId = `session-${new Date().getTime()}`;
      setSession({
        id: newSessionId,
        name: 'New Workout Session',
        items: [
          {
            id: `item-${newSessionId}-1`,
            type: 'Warm-up',
            description: '',
            speed: 0,
            incline: 0,
            timer: 600,
            sets: 1,
            color: WARMUP_COLORS[0],
            subItems: [],
          },
          {
            id: `item-${newSessionId}-2`,
            type: 'Action',
            description: '',
            speed: 0,
            incline: 0,
            timer: 1800,
            sets: 1,
            color: ACTION_COLORS[0],
            subItems: [],
          },
          {
            id: `item-${newSessionId}-3`,
            type: 'Cool-down',
            description: '',
            speed: 0,
            incline: 0,
            timer: 600,
            sets: 1,
            color: COOLDOWN_COLORS[0],
            subItems: [],
          },
        ],
        createdAt: new Date().toISOString(),
        totalTime: 3000,
      });
    } else {
      // Handle loading an existing session
      const existingSession = getWorkoutSession(id);
      if (existingSession) {
        setSession(existingSession);
      } else {
        alert('Session not found!');
        router.push('/');
      }
    }
  }, [id, router]);

  const handleSave = () => {
    if (session) {
      saveWorkoutSession(session as WorkoutSession);
      alert('Session saved!');
      router.push('/');
    }
  };

  if (!session) {
    return <div>Loading...</div>;
  }

  const isNew = id === 'new';

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-12 md:p-24">
      <div className="w-full max-w-4xl">
        <header className="mb-8">
            <h1 className="text-4xl font-bold">
            {isNew ? 'Create New Workout Session' : `Edit: ${session.name}`}
            </h1>
        </header>

        <SessionForm session={session} setSession={setSession} />

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save Session
          </button>
        </div>
      </div>
    </main>
  );
}
