'use client';

import React from 'react';

interface NumberStepperProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  decimalPlaces?: number; // New prop for decimal places
  className?: string;
}

export default function NumberStepper({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  decimalPlaces, // Destructure new prop
  className = '',
}: NumberStepperProps) {
  const roundValue = (num: number) => {
    if (decimalPlaces !== undefined) {
      return parseFloat(num.toFixed(decimalPlaces));
    }
    return num;
  };

  const handleIncrement = () => {
    onChange(roundValue(Math.min(max, value + step)));
  };

  const handleDecrement = () => {
    onChange(roundValue(Math.max(min, value - step)));
  };

  const displayedValue = decimalPlaces !== undefined ? value.toFixed(decimalPlaces) : value;

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
        value={displayedValue} // Use displayedValue for formatting
        onChange={(e) => {
          const parsedValue = parseFloat(e.target.value);
          if (!isNaN(parsedValue)) {
            onChange(roundValue(parsedValue));
          } else {
            onChange(0); // Default to 0 or handle as per design
          }
        }}
        className="w-20 p-2 text-center bg-white text-gray-900 rounded-lg text-lg font-semibold"
        min={min}
        max={max}
        step={step} // Ensure step is passed to input for browser controls if any
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
