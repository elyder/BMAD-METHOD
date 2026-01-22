'use client';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/components/LanguageProvider';
import WorkoutSessionList from '@/components/WorkoutSessionList';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-end items-center mb-4">
        <LanguageSwitcher />
      </div>
      <WorkoutSessionList />
    </main>
  );
}
