'use client';

import { use, useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getWorkoutSession, saveWorkoutSession } from '@/lib/storage';
import { WorkoutSession, WorkoutItem, SubItem } from '@/types';
import { calculatePace } from '@/lib/utils';
import { useLanguage } from '@/components/LanguageProvider';

type TimerStatus = 'idle' | 'countdown' | 'running' | 'paused' | 'finished';

interface WorkoutStep {
  item: WorkoutItem;
  subItem?: SubItem;
  set: number;
  itemName: string;
  description: string;
  speed: number;
  incline: number;
  duration: number;
  color: string;
}

export default function RunSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLanguage();
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

  useEffect(() => {
    endAudioRef.current = new Audio('/1.wav');
    preBeepAudioRef.current = new Audio('/2.wav');
    startBeepAudioRef.current = new Audio('/1.wav');
    beep1AudioRef.current = new Audio('/1.wav');
    beep2AudioRef.current = new Audio('/2.wav');
  }, []);

  useEffect(() => {
    if (!id) return;
    
    const loadedSession = getWorkoutSession(id);
    if (loadedSession) {
      loadedSession.lastUsedAt = new Date().toISOString();
      saveWorkoutSession(loadedSession);
      
      setSession(loadedSession);

      const plan: WorkoutStep[] = [];
      loadedSession.items.forEach(item => {
        for (let set = 1; set <= item.sets; set++) {
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
      alert(t('session_not_found'));
      router.push('/');
    }
  }, [id, router, t]);

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
  
  useEffect(() => {
    if (status !== 'running') return;

    const interval = setInterval(() => {
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
  
    useEffect(() => {
        if (status !== 'countdown') return;

        let countdownCancelled = false;
        const timeouts: NodeJS.Timeout[] = [];

        const runCountdown = async () => {
            setCountdownDisplay(3);
            if (beep1AudioRef.current) await beep1AudioRef.current.play().catch(e => {});
            if (countdownCancelled) return;
            await new Promise(res => timeouts.push(setTimeout(res, 1000)));

            setCountdownDisplay(2);
            if (beep1AudioRef.current) await beep1AudioRef.current.play().catch(e => {});
            if (countdownCancelled) return;
            await new Promise(res => timeouts.push(setTimeout(res, 1000)));

            setCountdownDisplay(1);
            if (beep1AudioRef.current) await beep1AudioRef.current.play().catch(e => {});
            if (countdownCancelled) return;
            await new Promise(res => timeouts.push(setTimeout(res, 1000)));

            setCountdownDisplay(null);
            if (beep2AudioRef.current) await beep2AudioRef.current.play().catch(e => {});
            setStatus('running');
        };

        runCountdown();

        return () => {
          countdownCancelled = true;
          timeouts.forEach(clearTimeout);
        };
    }, [status]);

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
    advance(timeRemaining);
  };
  
  const endSession = () => {
    if (window.confirm(t('end_session_confirm'))) {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        router.push('/');
    }
  }

  if (!session || workoutPlan.length === 0) {
    return <div>{t('loading_session')}</div>;
  }
  
  const currentStep = workoutPlan[currentStepIndex];
  const nextStep = workoutPlan[currentStepIndex + 1];
  const progressPercent = totalTime > 0 ? (timeElapsed / totalTime) * 100 : 0;
  
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const getContrastColor = (hexColor: string): string => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#111827' : '#ffffff';
  };

  const nameColor = status === 'running' ? getContrastColor(currentStep.color) : '#ffffff';

  return (
    <div ref={containerRef} className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4" style={{backgroundColor: status === 'running' ? currentStep.color : '#111827'}}>

        {/* Session name - centered at top, disconnected from progress bar */}
        <div className="w-full max-w-xl mb-4 text-center">
            <span className="text-5xl" style={{color: nameColor}}>{session.name}</span>
        </div>

        {/* Grey box */}
        <div className="relative flex flex-col bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-xl w-full" style={{height: '75vh'}}>
            {currentStep.item.sets > 1 && (
                <p className="absolute top-4 right-4 text-xl text-gray-300">{t('set_of', { current: currentStep.set, total: currentStep.item.sets })}</p>
            )}

            {/* Main Timer Display */}
            <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
                {currentStep.description && <p className="text-5xl text-white mt-2 mb-16">{currentStep.description}</p>}

                {/* Pace (left), Speed (center, larger), Incline (right) */}
                <div className="w-full text-2xl mt-4">
                    <div className="flex justify-between items-center">
                        <div className="w-1/3 text-left">
                            {(currentStep.speed > 0 && session.showPace) && <span>{calculatePace(currentStep.speed)}/km</span>}
                        </div>
                        <div className="w-1/3 text-center">
                            {currentStep.speed > 0 && <span className="text-5xl">{currentStep.speed} km/t</span>}
                        </div>
                        <div className="w-1/3 text-right">
                            <span>{currentStep.incline}%</span>
                        </div>
                    </div>
                </div>

                <div className="text-9xl font-mono my-8">
                    {formatTime(timeRemaining)}
                </div>
            </div>

            {/* Progress bar inside grey box with downcounter */}
            <div className="w-full mb-3">
                <div className="flex justify-end text-4xl mb-1">
                    <span>{formatTime(totalTime - timeElapsed)}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-5 overflow-hidden">
                    <div className="bg-blue-500 h-5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
            </div>

            {/* Next Up */}
            <div className="text-center text-white">
                <p className="text-2xl">{t('next_up')}:</p>
                {nextStep ? (
                    <>
                        <p className="text-5xl">{nextStep.description || nextStep.itemName}</p>
                        <p className="text-3xl">
                            {nextStep.speed > 0 && <span>{nextStep.speed} km/t</span>}
                            <span className="ml-2">{nextStep.incline}%</span>
                        </p>
                    </>
                ) : (
                    <p className="text-5xl">{t('finished')}</p>
                )}
            </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mt-8">
            {status === 'idle' && <button onClick={startTimer} className="px-8 py-3 bg-green-500 rounded-lg text-xl font-bold">{t('start')}</button>}
            {status === 'running' &&
                <>
                    <button onClick={pauseTimer} className="px-8 py-3 bg-yellow-500 rounded-lg text-xl">{t('pause')}</button>
                    <button onClick={skip} className="px-8 py-3 bg-gray-600 rounded-lg text-xl">{t('next')}</button>
                </>
            }
            {status === 'paused' &&
                <>
                    <button onClick={startTimer} className="px-8 py-3 bg-green-500 rounded-lg text-xl">{t('resume')}</button>
                    <button onClick={skip} className="px-8 py-3 bg-gray-600 rounded-lg text-xl">{t('next')}</button>
                    <button onClick={endSession} className="px-8 py-3 bg-red-600 rounded-lg text-xl">{t('end')}</button>
                </>
            }
        </div>
        
        {status === 'countdown' && countdownDisplay !== null && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <h2 className="text-5xl">{countdownDisplay}</h2>
            </div>
        )}

        {status === 'finished' && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center">
                <h2 className="text-5xl font-bold">{t('workout_complete')}</h2>
                <button onClick={() => router.push('/')} className="mt-8 px-8 py-4 bg-blue-500 rounded-lg text-2xl">{t('back_to_home')}</button>
            </div>
        )}
    </div>
  );
}
