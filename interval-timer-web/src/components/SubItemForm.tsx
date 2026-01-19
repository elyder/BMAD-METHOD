'use client';

import { SubItem, WorkoutItemType } from '@/types';
import React from 'react';
import ColorPalettePicker from './ColorPalettePicker';
import NumberStepper from './ui/NumberStepper';
import TimeInput from './ui/TimeInput';
import FormField from './ui/FormField';

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

  return (
    <div className="w-full space-y-3 p-3 border border-gray-600 rounded-lg bg-gray-800">
        {/* Row 1: Description */}
        <FormField label="Description">
            <textarea
                name="description"
                value={item.description}
                onChange={handleChange}
                placeholder="Sub-item description"
                rows={2}
                className="p-2 bg-white text-gray-900 rounded text-lg w-full"
            />
        </FormField>
        {/* Row 2: Other fields */}
        <div className="grid grid-cols-[1fr,1fr,1.5fr,1fr,1fr,1fr] gap-3 items-start">
            <FormField label="Speed">
                <NumberStepper
                    value={item.speed}
                    onChange={(speed) => onUpdate({ ...item, speed })}
                    step={0.1}
                    min={0}
                />
            </FormField>
            <FormField label="Incline">
                <NumberStepper
                    value={item.incline}
                    onChange={(incline) => onUpdate({ ...item, incline })}
                    min={0}
                />
            </FormField>
            <FormField label="Duration">
                <TimeInput
                    value={item.timer}
                    onChange={(timer) => onUpdate({ ...item, timer })}
                />
            </FormField>
            <FormField label="Colour">
                <ColorPalettePicker 
                    itemType={itemType}
                    selectedValue={item.color}
                    onSelect={(color) => onUpdate({ ...item, color })}
                />
            </FormField>
            <FormField label="Omit Last">
                <div className="flex items-center justify-center h-12">
                    <input
                        type="checkbox"
                        name="omitForLastSet"
                        checked={item.omitForLastSet}
                        onChange={handleChange}
                        className="h-8 w-8 rounded"
                    />
                </div>
            </FormField>
            <FormField label="Actions">
                <div className="flex items-center justify-center h-12">
                    <button onClick={onDelete} className="p-3 text-red-500 hover:bg-gray-700 rounded-lg text-2xl">
                        🗑️
                    </button>
                </div>
            </FormField>
        </div>
    </div>
  );
}
