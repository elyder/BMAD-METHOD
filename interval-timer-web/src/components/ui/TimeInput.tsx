'use client';

import React, { useState, useEffect } from 'react';

interface TimeInputProps {
  value: number; // Total seconds
  onChange: (newValue: number) => void;
  step?: number;
  className?: string;
}

export default function TimeInput({
  value,
  onChange,
  step = 5,
  className = '',
}: TimeInputProps) {
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const [localValue, setLocalValue] = useState(formatTime(value));
  const [isFocused, setIsFocused] = useState(false);

  // Sync local value when external value changes (but not while editing)
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(formatTime(value));
    }
  }, [value, isFocused]);

  const handleIncrement = () => {
    onChange(value + step);
  };

  const handleDecrement = () => {
    onChange(Math.max(0, value - step));
  };

  const parseTimeString = (timeStr: string): number => {
    // Handle various formats: "1:30", "01:30", "90", "5"
    const trimmed = timeStr.trim();

    if (trimmed.includes(':')) {
      const [minutes, seconds] = trimmed.split(':').map(str => parseInt(str, 10) || 0);
      return (minutes * 60) + seconds;
    }

    // If no colon, interpret based on length:
    // 1-2 digits: treat as minutes (e.g., "5" = 5 min, "30" = 30 min)
    // 3+ digits: treat as seconds (e.g., "90" = 90 sec, "120" = 120 sec)
    const num = parseInt(trimmed, 10);
    if (isNaN(num)) return 0;

    return trimmed.length <= 2 ? num * 60 : num;
  };

  const commitValue = () => {
    const newValue = parseTimeString(localValue);
    onChange(Math.max(0, newValue));
    setLocalValue(formatTime(Math.max(0, newValue)));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    e.target.select();
  };

  const handleBlur = () => {
    setIsFocused(false);
    commitValue();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
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
        inputMode="numeric"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
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
