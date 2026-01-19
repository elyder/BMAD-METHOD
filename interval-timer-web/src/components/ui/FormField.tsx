'use client';

import React from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormField({ label, children, className = '' }: FormFieldProps) {
  return (
    <div className={`flex flex-col items-center justify-start gap-2 ${className}`}>
      <label className="text-sm text-gray-400 font-semibold h-4">{label}</label>
      {children}
    </div>
  );
}
