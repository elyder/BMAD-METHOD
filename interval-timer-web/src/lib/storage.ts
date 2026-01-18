// interval-timer-web/src/lib/storage.ts

import { WorkoutSession } from '../types';

const SESSIONS_KEY = 'workout-sessions';

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
    return [];
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
