'use client';

import React, { useState, useEffect } from 'react';

interface NumberStepperProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  decimalPlaces?: number;
  className?: string;
}

export default function NumberStepper({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  decimalPlaces,
  className = '',
}: NumberStepperProps) {
  const formatValue = (num: number) => {
    return decimalPlaces !== undefined ? num.toFixed(decimalPlaces) : String(num);
  };

  const [localValue, setLocalValue] = useState(formatValue(value));
  const [isFocused, setIsFocused] = useState(false);

  // Sync local value when external value changes (but not while editing)
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(formatValue(value));
    }
  }, [value, isFocused, decimalPlaces]);

  const roundValue = (num: number) => {
    if (decimalPlaces !== undefined) {
      return parseFloat(num.toFixed(decimalPlaces));
    }
    return num;
  };

  const clampValue = (num: number) => {
    return Math.min(max, Math.max(min, num));
  };

  const handleIncrement = () => {
    onChange(roundValue(clampValue(value + step)));
  };

  const handleDecrement = () => {
    onChange(roundValue(clampValue(value - step)));
  };

  const commitValue = () => {
    const parsed = parseFloat(localValue);
    const newValue = isNaN(parsed) ? min : roundValue(clampValue(parsed));
    onChange(newValue);
    setLocalValue(formatValue(newValue));
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
        disabled={value <= min}
      >
        -
      </button>
      <input
        type="text"
        inputMode="decimal"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-20 p-2 text-center bg-white text-gray-900 rounded-lg text-lg font-semibold"
      />
      <button
        type="button"
        onClick={handleIncrement}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 font-bold text-lg"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
