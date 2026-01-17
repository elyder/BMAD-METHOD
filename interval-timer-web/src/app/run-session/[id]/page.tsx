'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formatTime, parseTimeToSeconds } from '@/lib/time-utils';
import { Session, WorkoutItem } from '../../types';

export default function RunSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentWorkoutItemIndex, setCurrentWorkoutItemIndex] = useState(0);
  const [currentRepetition, setCurrentRepetition] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0); // Time left for the current item
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [totalSessionTimeLeft, setTotalSessionTimeLeft] = useState(0);
  const [totalSessionDuration, setTotalSessionDuration] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Callback to end the session
  const endSession = useCallback((completed: boolean = false) => {
    clearInterval(Number(intervalRef.current));
    setIsRunning(false);
    setSessionStarted(false);
    // TODO: Implement logging functionality here
    if (completed) {
      alert('Session completed!');
    } else {
      alert('Session ended!');
    }
    router.push('/');
  }, [router]);

  // Load session data and initial setup
  useEffect(() => {
    if (sessionId && typeof window !== 'undefined') {
      const storedSessions = JSON.parse(localStorage.getItem('intervalTimerSessions') || '[]') as Session[];
      const sessionToRun = storedSessions.find(session => session.id === sessionId);

      if (sessionToRun) {
        setCurrentSession(sessionToRun);

        // Calculate total session duration
        let totalDuration = 0;
        sessionToRun.items.forEach(item => {
          totalDuration += parseTimeToSeconds(item.duration) * item.repetitions;
        });
        setTotalSessionDuration(totalDuration);
        setTotalSessionTimeLeft(totalDuration);

        // Set initial time for the first item
        if (sessionToRun.items.length > 0) {
          setTimeLeft(parseTimeToSeconds(sessionToRun.items[0].duration));
        }
      } else {
        alert('Session not found!');
        router.push('/');
      }
      setLoading(false);
    }
  }, [sessionId, router]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        setTotalSessionTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && currentSession && sessionStarted) {
      // Move to next repetition or next item
      clearInterval(Number(intervalRef.current));

      const currentItem = currentSession.items[currentWorkoutItemIndex];

      if (currentRepetition < currentItem.repetitions) {
        // Next repetition of the current item
        setCurrentRepetition(prev => prev + 1);
        setTimeLeft(parseTimeToSeconds(currentItem.duration));
      } else if (currentWorkoutItemIndex < currentSession.items.length - 1) {
        // Next item
        setCurrentWorkoutItemIndex(prev => prev + 1);
        setCurrentRepetition(1); // Reset repetition for new item
        setTimeLeft(parseTimeToSeconds(currentSession.items[currentWorkoutItemIndex + 1].duration));
      } else {
        // Session complete
        endSession(true);
      }
    } else if (!isRunning && intervalRef.current) {
      clearInterval(Number(intervalRef.current));
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(Number(intervalRef.current));
      }
    };
  }, [isRunning, timeLeft, currentWorkoutItemIndex, currentRepetition, currentSession, sessionStarted, endSession]);

  const startTimer = () => {
    setIsRunning(true);
    setSessionStarted(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const skipItem = () => {
    if (!currentSession) return;
    clearInterval(Number(intervalRef.current));

    const currentItem = currentSession.items[currentWorkoutItemIndex];

    if (currentRepetition < currentItem.repetitions) {
      // Skip to next repetition of the current item
      setCurrentRepetition(prev => prev + 1);
      setTimeLeft(parseTimeToSeconds(currentItem.duration));
      setTotalSessionTimeLeft(prev => prev - timeLeft); // Subtract remaining time from total
    } else if (currentWorkoutItemIndex < currentSession.items.length - 1) {
      // Skip to next item
      setTotalSessionTimeLeft(prev => prev - timeLeft); // Subtract remaining time from total
      setCurrentWorkoutItemIndex(prev => prev + 1);
      setCurrentRepetition(1);
      setTimeLeft(parseTimeToSeconds(currentSession.items[currentWorkoutItemIndex + 1].duration));
    } else {
      // Already at the last item and last repetition, end session
      endSession(true);
    }
  };

  const currentItem = currentSession?.items[currentWorkoutItemIndex];
  const upcomingItem = currentSession?.items[currentWorkoutItemIndex + 1];

  const progressPercentage = totalSessionDuration > 0 ? ((totalSessionDuration - totalSessionTimeLeft) / totalSessionDuration) * 100 : 0;

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Loading Session...</h1>
      </main>
    );
  }

  if (!currentSession) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Session not found.</h1>
      </main>
    );
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 text-white transition-colors duration-500"
      style={{ backgroundColor: currentItem?.color || '#1a202c' }} // Default background if color is not set
    >
      {/* Progress Bar at the top */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-700">
        <div
          className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="w-full max-w-4xl text-center">
        <h1 className="text-5xl font-bold mb-8">{currentSession.name}</h1>
        
        {currentItem && (
          <div className="mb-8">
            <h2 className="text-3xl font-semibold">
              Current Task: <span className="text-blue-400">{currentItem.title}</span>
            </h2>
            {currentItem.repetitions > 1 && (
              <p className="text-xl mt-2">Repetition: {currentRepetition} of {currentItem.repetitions}</p>
            )}
            <p className="text-8xl font-extrabold mt-4">{formatTime(timeLeft)}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center space-x-4 mt-8">
          {!sessionStarted && (
            <button
              onClick={startTimer}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full text-lg"
            >
              Start Session
            </button>
          )}
          {sessionStarted && isRunning && (
            <button
              onClick={pauseTimer}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg"
            >
              Pause
            </button>
          )}
          {sessionStarted && !isRunning && (
            <button
              onClick={startTimer}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg"
            >
              Resume
            </button>
          )}
          <button
            onClick={skipItem}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-full text-lg"
          >
            Skip
          </button>
          {(sessionStarted && !isRunning) && ( // Show End Session only when paused
            <button
              onClick={() => endSession(false)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full text-lg"
            >
              End Session
            </button>
          )}
        </div>

        {/* Upcoming Task */}
        <div className="mt-12 text-xl text-gray-400">
          {upcomingItem ? (
            <p>Next: <span className="font-semibold">{upcomingItem.title}</span></p>
          ) : (
            <p>Last item</p>
          )}
        </div>
      </div>
    </main>
  );
}