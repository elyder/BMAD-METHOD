// interval-timer-web/src/lib/storage.ts

import { WorkoutSession } from '../types';

const SESSIONS_KEY = 'workout-sessions';

const DEFAULT_SESSION: WorkoutSession = {
  id: 'default-interval-run',
  name: 'Default 4x4 interval',
  showPace: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  totalTime: 2220,
  items: [
    {
      id: 'default-warmup',
      type: 'Warm-up',
      description: 'Walk',
      speed: 6,
      incline: 1,
      timer: 600,
      sets: 1,
      color: '#f97316',
      subItems: [],
    },
    {
      id: 'default-workout',
      type: 'Work-out',
      description: '',
      speed: 0,
      incline: 0,
      timer: 0,
      sets: 4,
      color: '#ef4444',
      subItems: [
        {
          id: 'default-run',
          description: 'Run',
          speed: 12,
          incline: 1,
          timer: 240,
          color: '#ef4444',
          omitForLastSet: false,
        },
        {
          id: 'default-walk',
          description: 'Walk',
          speed: 6,
          incline: 1,
          timer: 120,
          color: '#3b82f6',
          omitForLastSet: true,
        },
      ],
    },
    {
      id: 'default-cooldown',
      type: 'Cool-down',
      description: 'Jog',
      speed: 7.5,
      incline: 1,
      timer: 300,
      sets: 1,
      color: '#8b5cf6',
      subItems: [],
    },
  ],
};

// Helper function to check for localStorage availability
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

export const getWorkoutSessions = (): WorkoutSession[] => {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  const sessionsJson = localStorage.getItem(SESSIONS_KEY);
  if (!sessionsJson) {
    const defaults = [DEFAULT_SESSION];
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(defaults));
    return defaults;
  }

  try {
    return JSON.parse(sessionsJson) as WorkoutSession[];
  } catch (e) {
    console.error("Failed to parse workout sessions from localStorage", e);
    return [];
  }
};

export const saveWorkoutSessions = (sessions: WorkoutSession[]): void => {
  if (!isLocalStorageAvailable()) {
    return;
  }

  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const getWorkoutSession = (id: string): WorkoutSession | undefined => {
  const sessions = getWorkoutSessions();
  return sessions.find(session => session.id === id);
};

export const saveWorkoutSession = (session: WorkoutSession): void => {
  const sessions = getWorkoutSessions();
  const existingIndex = sessions.findIndex(s => s.id === session.id);

  if (existingIndex > -1) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }

  saveWorkoutSessions(sessions);
};

export const deleteWorkoutSession = (id: string): void => {
  const sessions = getWorkoutSessions();
  const updatedSessions = sessions.filter(session => session.id !== id);
  saveWorkoutSessions(updatedSessions);
};
