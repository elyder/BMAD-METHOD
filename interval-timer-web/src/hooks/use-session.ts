import { useState, useEffect } from 'react';
import { Session } from '../types';

export function useSession(sessionId: string) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!sessionId) {
        setLoading(false);
        return;
      }
      
      try {
        const storedSessions = JSON.parse(localStorage.getItem('intervalTimerSessions') || '[]') as Session[];
        const foundSession = storedSessions.find(s => s.id === sessionId);

        if (foundSession) {
          setSession(foundSession);
        } else {
          setError('Session not found.');
        }
      } catch (err) {
        setError('Failed to load session data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }, [sessionId]);

  return { session, loading, error };
}

// Exporting the interfaces to be used in other components
export type { Session, WorkoutItem } from '../types';