'use client';

import React from 'react';

interface SegmentedControlProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div className={`flex items-center p-1 bg-gray-700 rounded-lg ${className}`}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex-1 px-3 py-2 text-center rounded-md text-base font-semibold transition-colors
            ${value === option ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-300 hover:bg-gray-600'
            }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
