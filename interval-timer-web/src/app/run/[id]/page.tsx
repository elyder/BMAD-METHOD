'use client';

import { use, useEffect, useState, useRef, useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { getWorkoutSession, saveWorkoutSession } from '@/lib/storage';

import { WorkoutSession, WorkoutItem, SubItem } from '@/types';
import { calculatePace } from '@/lib/utils';



type TimerStatus = 'idle' | 'countdown' | 'running' | 'paused' | 'finished';



// A flattened list of all steps in the workout
interface WorkoutStep {
  item: WorkoutItem;
  subItem?: SubItem;
  set: number;
  itemName: string; // From item.title
  description: string; // From item.description or subItem.description
  speed: number;
  incline: number;
  duration: number;
  color: string;
}

export default function RunSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [countdownDisplay, setCountdownDisplay] = useState<number | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const endAudioRef = useRef<HTMLAudioElement | null>(null);
  const preBeepAudioRef = useRef<HTMLAudioElement | null>(null);
  const startBeepAudioRef = useRef<HTMLAudioElement | null>(null);
  const beep1AudioRef = useRef<HTMLAudioElement | null>(null);
  const beep2AudioRef = useRef<HTMLAudioElement | null>(null);

  // Effect to initialize audio objects
  useEffect(() => {
    endAudioRef.current = new Audio('/1.wav');
    preBeepAudioRef.current = new Audio('/2.wav');
    startBeepAudioRef.current = new Audio('/1.wav');
    beep1AudioRef.current = new Audio('/1.wav');
    beep2AudioRef.current = new Audio('/2.wav');
  }, []);

  // Load Session and build the workout plan
  useEffect(() => {
    if (!id) return;
    
    const loadedSession = getWorkoutSession(id);
    if (loadedSession) {
      // Update last used date and save
      loadedSession.lastUsedAt = new Date().toISOString();
      saveWorkoutSession(loadedSession);
      
      setSession(loadedSession);

      // --- Build the workout plan ---
      const plan: WorkoutStep[] = [];
      loadedSession.items.forEach(item => {
        for (let set = 1; set <= item.sets; set++) {
          // Add the parent item itself if its timer is set
          if (item.timer > 0) {
            plan.push({
                item,
                set,
                itemName: item.type,
                description: item.description,
                speed: item.speed,
                incline: item.incline,
                duration: item.timer,
                color: item.color
            });
          }
          
          // Add the sub-items
          if (item.subItems && item.subItems.length > 0) {
            item.subItems.forEach(subItem => {
              if (subItem.omitForLastSet && set === item.sets) {
                return;
              }
              plan.push({
                  item,
                  subItem,
                  set,
                  itemName: item.type,
                  description: subItem.description,
                  speed: subItem.speed,
                  incline: subItem.incline,
                  duration: subItem.timer,
                  color: subItem.color
              });
            });
          }
        }
      });
      
      const calculatedTotalTime = plan.reduce((acc, step) => acc + step.duration, 0);

      setWorkoutPlan(plan);
      setTotalTime(calculatedTotalTime);
      if (plan.length > 0) {
        setTimeRemaining(plan[0].duration);
      }
    } else {
      alert('Session not found!');
      router.push('/');
    }
  }, [id, router]);

  const advance = useCallback((timeSkipped: number = 0) => {
    setTimeElapsed(prev => prev + timeSkipped);

    if (currentStepIndex >= workoutPlan.length - 1) {
      setStatus('finished');
      if (endAudioRef.current) endAudioRef.current.play();
    } else {
      const nextStepIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextStepIndex);
      setTimeRemaining(workoutPlan[nextStepIndex].duration);
      if (beep2AudioRef.current) beep2AudioRef.current.play();
    }
  }, [currentStepIndex, workoutPlan]);
  
  // Main Timer Tick Logic
  useEffect(() => {
    if (status !== 'running') return;

    const interval = setInterval(() => {
      // Play pre-beeps on 4, 3, 2 seconds remaining, to sound *before* the number changes
      if ([4, 3, 2].includes(timeRemaining)) {
        if (beep1AudioRef.current) {
            beep1AudioRef.current.play();
        }
      }

      if (timeRemaining > 1) {
        setTimeRemaining(prev => prev - 1);
        setTimeElapsed(prev => prev + 1);
      } else {
        setTimeElapsed(prev => prev + 1);
        advance();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status, timeRemaining, advance]);
  
    // Countdown effect
    useEffect(() => {
        if (status !== 'countdown') return;

        let countdownCancelled = false;
        const timeouts: NodeJS.Timeout[] = [];

        const runCountdown = async () => {
            // 3
            setCountdownDisplay(3);
            if (beep1AudioRef.current) await beep1AudioRef.current.play().catch(e => {});
            if (countdownCancelled) return;
            await new Promise(res => timeouts.push(setTimeout(res, 1000)));

            // 2
            setCountdownDisplay(2);
            if (beep1AudioRef.current) await beep1AudioRef.current.play().catch(e => {});
            if (countdownCancelled) return;
            await new Promise(res => timeouts.push(setTimeout(res, 1000)));

            // 1
            setCountdownDisplay(1);
            if (beep1AudioRef.current) await beep1AudioRef.current.play().catch(e => {});
            if (countdownCancelled) return;
            await new Promise(res => timeouts.push(setTimeout(res, 1000)));

            // 0
            setCountdownDisplay(null);
            if (beep2AudioRef.current) await beep2AudioRef.current.play().catch(e => {});
            setStatus('running');
        };

        runCountdown();

        return () => {
          countdownCancelled = true;
          timeouts.forEach(clearTimeout);
        };
    }, [status]); // Only runs when status changes to 'countdown'

  const startTimer = () => {
    if (startBeepAudioRef.current?.paused) {
        startBeepAudioRef.current.play();
        startBeepAudioRef.current.pause();
    }

    if (containerRef.current && document.fullscreenElement !== containerRef.current) {
        containerRef.current.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    }
    setStatus('countdown');
  };

  const pauseTimer = () => setStatus('paused');

  const skip = () => {
    // When skipping, advance the elapsed time by the amount of time remaining
    advance(timeRemaining);
  };
  
  const endSession = () => {
    if (window.confirm('Are you sure you want to end this session?')) {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        router.push('/');
    }
  }

  if (!session || workoutPlan.length === 0) {
    return <div>Loading Session...</div>;
  }
  
  const currentStep = workoutPlan[currentStepIndex];
  const nextStep = workoutPlan[currentStepIndex + 1];
  const progressPercent = totalTime > 0 ? (timeElapsed / totalTime) * 100 : 0;
  
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div ref={containerRef} className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4" style={{backgroundColor: status === 'running' ? currentStep.color : '#111827'}}>
        
        <div className="w-full max-w-xl mb-4">
            <div className="flex justify-between text-2xl">
                <span>{session.name}</span>
                <span>{formatTime(timeElapsed)} / {formatTime(totalTime)}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-5 overflow-hidden">
                <div className="bg-blue-500 h-5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
        </div>

        {/* New Container for Text Content */}
        <div className="flex flex-col items-center justify-center bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-xl w-full" style={{height: '60vh'}}>
            {/* Main Timer Display */}
            <div className="text-center">
                {currentStep.description && <p className="text-3xl text-white mt-2">{currentStep.description}</p>}
                {currentStep.item.sets > 1 && (
                    <p className="text-xl text-gray-300">Set {currentStep.set} of {currentStep.item.sets}</p>
                )}
                                        {(currentStep.speed > 0 || currentStep.incline > 0) && (
                                            <div className="text-2xl text-gray-300 mt-4">
                                                {currentStep.speed > 0 && (
                                                    <p>
                                                        {currentStep.speed} km/t
                                                        {session.showPace && ` (${calculatePace(currentStep.speed)}/km)`}
                                                    </p>
                                                )}
                                                {currentStep.incline > 0 && <p>{currentStep.incline}% incline</p>}
                                            </div>
                                        )}                <div className="text-9xl font-mono my-8">
                    {formatTime(timeRemaining)}
                </div>
            </div>

            {/* Next Up */}
            <div className="mt-8 text-center">
                <p className="text-gray-400">Next up:</p>
                <p className="text-2xl">{nextStep ? (nextStep.description || nextStep.itemName) : 'Finished!'}</p>
            </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mt-8">
            {status === 'idle' && <button onClick={startTimer} className="px-8 py-3 bg-green-500 rounded-lg text-xl font-bold">START</button>}
            {status === 'running' && <button onClick={pauseTimer} className="px-8 py-3 bg-yellow-500 rounded-lg text-xl">Pause</button>}
            {status === 'paused' && <button onClick={startTimer} className="px-8 py-3 bg-green-500 rounded-lg text-xl">Resume</button>}
            
            <button onClick={skip} disabled={status !== 'running' && status !== 'paused'} className="px-8 py-3 bg-gray-600 rounded-lg text-xl disabled:opacity-50">Next</button>
            <button onClick={endSession} className="px-8 py-3 bg-red-600 rounded-lg text-xl">End</button>
        </div>
        
        {status === 'countdown' && countdownDisplay !== null && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <h2 className="text-9xl font-bold">{countdownDisplay}</h2>
            </div>
        )}

        {status === 'finished' && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center">
                <h2 className="text-5xl font-bold">Workout Complete!</h2>
                <button onClick={() => router.push('/')} className="mt-8 px-8 py-4 bg-blue-500 rounded-lg text-2xl">Back to Home</button>
            </div>
        )}
    </div>
  );
}
