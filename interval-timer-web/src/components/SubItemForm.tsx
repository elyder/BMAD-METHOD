'use client';

import { SubItem, WorkoutItemType } from '@/types';
import React from 'react';
import ColorPalettePicker from './ColorPalettePicker';

interface SubItemFormProps {
  item: SubItem;
  itemType: WorkoutItemType;
  onUpdate: (item: SubItem) => void;
  onDelete: () => void;
}

export default function SubItemForm({ item, itemType, onUpdate, onDelete }: SubItemFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const updatedValue = isCheckbox ? (e.target as HTMLInputElement).checked : (type === 'number' ? parseFloat(value) || 0 : value);
    onUpdate({ ...item, [name]: updatedValue });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [minutes, seconds] = e.target.value.split(':').map(Number);
    const totalSeconds = (minutes * 60) + (seconds || 0);
    onUpdate({ ...item, timer: totalSeconds });
  };

  const handleDurationChange = (amount: number) => {
    const newTime = Math.max(0, item.timer + amount);
    onUpdate({ ...item, timer: newTime });
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <>
      <textarea
          name="description"
          value={item.description}
          onChange={handleChange}
          placeholder="Sub-item description"
          rows={1}
          className="p-1 bg-white text-gray-900 rounded text-sm w-full col-span-2"
      />
      <input
          type="number"
          name="speed"
          value={item.speed}
          onChange={handleChange}
          placeholder="Speed"
          className="p-1 bg-white text-gray-900 rounded text-sm w-16 text-center"
          step="0.1"
      />
      <input
          type="number"
          name="incline"
          value={item.incline}
          onChange={handleChange}
          placeholder="Incline"
          className="p-1 bg-white text-gray-900 rounded text-sm w-16 text-center"
      />
      <div className="flex items-center">
        <input
            type="text"
            value={formatTime(item.timer)}
            onChange={handleTimeChange}
            placeholder="mm:ss"
            className="p-1 bg-white text-gray-900 rounded-l text-sm w-16 text-center"
        />
        <div className="flex flex-col">
            <button onClick={() => handleDurationChange(30)} className="px-1 bg-gray-600 hover:bg-gray-500 rounded-tr text-xs">▲</button>
            <button onClick={() => handleDurationChange(-30)} className="px-1 bg-gray-600 hover:bg-gray-500 rounded-br text-xs">▼</button>
        </div>
      </div>
      <div className="flex justify-center">
        <ColorPalettePicker 
            itemType={itemType}
            selectedValue={item.color}
            onSelect={(color) => onUpdate({ ...item, color })}
        />
      </div>
      <div className="flex items-center justify-center">
          <input
              type="checkbox"
              name="omitForLastSet"
              checked={item.omitForLastSet}
              onChange={handleChange}
              className="h-4 w-4 rounded"
          />
      </div>
      <div className="text-right">
          <button onClick={onDelete} className="p-1 text-red-500">
              🗑️
          </button>
      </div>
    </>
  );
}
