'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WorkoutSession } from '../types';
import { getWorkoutSessions, saveWorkoutSession, deleteWorkoutSession } from '../lib/storage';
import { formatTotalTime } from '../lib/utils';
import { useLanguage } from './LanguageProvider';

type SortKey = 'createdAt' | 'lastUsedAt' | 'totalTime';

export default function WorkoutSessionList() {
  const { t } = useLanguage();
  const router = useRouter();
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
      name: '', // Set name to empty as requested
      createdAt: new Date().toISOString(),
    };

    saveWorkoutSession(newSession);
    // Navigate to the edit page for the new session
    router.push(`/session/edit/${newSession.id}?duplicated=true`);
  };

  const handleDelete = (sessionId: string) => {
    if (window.confirm(t('delete_confirm'))) {
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
    <div className="w-full">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{t('your_sessions')}</h2>
        <Link href="/session/edit/new" className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xl font-semibold">
          {t('create_new')}
        </Link>
      </header>

      <div className="mb-6 flex justify-between items-center bg-gray-800 p-3 rounded-xl">
        <div className="flex items-center gap-2">
            <span className="text-lg mr-2">{t('sort_by')}</span>
            <button onClick={() => setSortBy('lastUsedAt')} className={`text-lg px-4 py-2 rounded-lg ${sortBy === 'lastUsedAt' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{t('last_used')}</button>
            <button onClick={() => setSortBy('createdAt')} className={`text-lg px-4 py-2 rounded-lg ${sortBy === 'createdAt' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{t('created')}</button>
            <button onClick={() => setSortBy('totalTime')} className={`text-lg px-4 py-2 rounded-lg ${sortBy === 'totalTime' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{t('duration')}</button>
        </div>
        <div>
             <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="text-lg px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
                {sortOrder === 'desc' ? t('desc') : t('asc')}
             </button>
        </div>
      </div>

      {sortedSessions.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed rounded-xl">
          <p className="text-xl">{t('no_sessions')}</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {sortedSessions.map((session) => (
            <li key={session.id} className="p-6 bg-gray-800 rounded-xl shadow-lg space-y-4">
              <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-semibold">{session.name}</h3>
                    {session.description && <p className="text-gray-300 mt-2 text-base">{session.description}</p>}
                  </div>
                  <Link href={`/run/${session.id}`} className="px-10 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold text-2xl flex-shrink-0 ml-6">
                    {t('run')}
                  </Link>
              </div>
              <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
                <div className="flex flex-col gap-4">
                    <p className="text-xl text-gray-300 font-semibold">{t('total')} {formatTotalTime(session.totalTime)}</p>
                    <label className="flex items-center gap-3 text-lg text-gray-300 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={!!session.showPace}
                            onChange={() => handleTogglePace(session.id)}
                            className="h-7 w-7 rounded-md"
                        />
                        {t('show_pace')}
                    </label>
                </div>
                 <div className="flex items-center gap-4">
                    <button onClick={() => router.push(`/session/edit/${session.id}`)} className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-bold text-xl">
                        {t('edit')}
                    </button>
                    <button onClick={() => handleDuplicate(session.id)} className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-bold text-xl">{t('duplicate')}</button>
                    <button onClick={() => handleDelete(session.id)} className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-xl">{t('delete')}</button>
                 </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
