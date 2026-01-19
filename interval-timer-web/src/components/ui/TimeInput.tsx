'use client';

import React from 'react';

interface TimeInputProps {
  value: number; // Total seconds
  onChange: (newValue: number) => void;
  step?: number;
  className?: string;
}

export default function TimeInput({
  value,
  onChange,
  step = 15,
  className = '',
}: TimeInputProps) {
  const handleIncrement = () => {
    onChange(value + step);
  };

  const handleDecrement = () => {
    onChange(Math.max(0, value - step));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [minutes, seconds] = e.target.value.split(':').map(str => parseInt(str, 10) || 0);
    onChange((minutes * 60) + seconds);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 font-bold text-lg"
      >
        -
      </button>
      <input
        type="text"
        value={formatTime(value)}
        onChange={handleTimeChange}
        className="w-24 p-2 text-center bg-white text-gray-900 rounded-lg text-lg font-semibold tabular-nums"
        placeholder="mm:ss"
      />
      <button
        type="button"
        onClick={handleIncrement}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 font-bold text-lg"
      >
        +
      </button>
    </div>
  );
}
