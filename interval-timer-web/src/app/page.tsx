import WorkoutSessionList from '@/components/WorkoutSessionList';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <div className="w-full">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center">
          Workout Interval Timer
        </h1>
        <WorkoutSessionList />
      </div>
    </main>
  );
}
