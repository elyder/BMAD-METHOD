'use client';

import React from 'react';

interface NumberStepperProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export default function NumberStepper({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  className = '',
}: NumberStepperProps) {
  const handleIncrement = () => {
    onChange(Math.min(max, value + step));
  };

  const handleDecrement = () => {
    onChange(Math.max(min, value - step));
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
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-20 p-2 text-center bg-white text-gray-900 rounded-lg text-lg font-semibold"
        min={min}
        max={max}
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
