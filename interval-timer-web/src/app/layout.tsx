'use client';

import './globals.css';
import { LanguageProvider, useLanguage } from '../components/LanguageProvider';

function App({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  return (
    <html lang={language}>
      <body>{children}</body>
    </html>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <App>{children}</App>
    </LanguageProvider>
  );
}
