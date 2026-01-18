'use client';

import { useState, useRef, useEffect } from 'react';
import { COLOR_PALETTES } from "../colors";
import { WorkoutItemType } from "../types";

interface ColorPalettePickerProps {
  itemType: WorkoutItemType;
  selectedValue: string;
  onSelect: (color: string) => void;
}

export default function ColorPalettePicker({ itemType, selectedValue, onSelect }: ColorPalettePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const palette = COLOR_PALETTES[itemType] || [];
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close popup on clicks outside the component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickerRef]);

  const handleSelect = (color: string) => {
    onSelect(color);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={pickerRef}>
      {/* The main color swatch button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-8 rounded border-2 border-gray-500"
        style={{ backgroundColor: selectedValue }}
        title="Change color"
      />

      {/* The Popup Palette */}
      {isOpen && (
        <div className="absolute z-10 top-10 p-3 bg-gray-600 rounded-lg shadow-xl border border-gray-500">
            <div className="flex flex-wrap gap-2 w-28">
            {palette.map(color => (
                <button
                key={color}
                type="button"
                onClick={() => handleSelect(color)}
                className={`w-8 h-8 rounded-full border-2 transition-transform duration-150 ${selectedValue === color ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: color }}
                title={color}
                />
            ))}
            </div>
        </div>
      )}
    </div>
  );
}
