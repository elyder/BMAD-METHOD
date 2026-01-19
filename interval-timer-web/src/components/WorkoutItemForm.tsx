'use client';

import { SubItem, WorkoutItem, WorkoutItemType } from '@/types';
import React from 'react';
import SubItemForm from './SubItemForm';
import ColorPalettePicker from './ColorPalettePicker';
import { COLOR_PALETTES } from '../colors';
import SegmentedControl from './ui/SegmentedControl';
import NumberStepper from './ui/NumberStepper';
import TimeInput from './ui/TimeInput';
import FormField from './ui/FormField';

const itemTypes: readonly WorkoutItemType[] = ['Warm-up', 'Work-out', 'Cool-down'];

interface WorkoutItemFormProps {
  item: WorkoutItem;
  onUpdate: (item: WorkoutItem) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
  onDuplicate: () => void;
}

export default function WorkoutItemForm({
  item,
  onUpdate,
  onDelete,
  onMove,
  onDuplicate,
}: WorkoutItemFormProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...item, [name]: value });
  };
  
  const handleTypeChange = (newType: WorkoutItemType) => {
    const newPalette = COLOR_PALETTES[newType] || [];
    onUpdate({ ...item, type: newType, color: newPalette[0] || '#FFFFFF' });
  };

  const handleAddSubItem = () => {
    const newSubItem: SubItem = {
      id: `sub-${item.id}-${new Date().getTime()}`,
      description: 'New Sub-Item',
      speed: item.speed,
      incline: item.incline,
      timer: 30,
      color: COLOR_PALETTES[item.type]?.[1] || COLOR_PALETTES[item.type]?.[0] || '#888888',
      omitForLastSet: false,
    };
    const subItems = [...item.subItems, newSubItem];
    onUpdate({ ...item, subItems });
  };

  const handleUpdateSubItem = (updatedSubItem: SubItem) => {
    const subItems = item.subItems.map(si => 
      si.id === updatedSubItem.id ? updatedSubItem : si
    );
    onUpdate({ ...item, subItems });
  };

  const handleDeleteSubItem = (subItemId: string) => {
    const subItems = item.subItems.filter(si => si.id !== subItemId);
    onUpdate({ ...item, subItems });
  };

  const gridLayout = "grid grid-cols-[1fr,1fr,1.5fr,1fr,1fr,1fr] gap-3 items-start";

  return (
    <div className="p-4 bg-gray-800 rounded-lg border-2 border-gray-700 space-y-4">
        {/* Row 1: Main Item Actions */}
        <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-6">
                <SegmentedControl
                    options={itemTypes}
                    value={item.type}
                    onChange={handleTypeChange}
                />
                <div className="flex items-center gap-2">
                    <label className="text-lg font-medium">Sets:</label>
                    <NumberStepper
                        value={item.sets}
                        onChange={(sets) => onUpdate({ ...item, sets })}
                        min={1}
                    />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => onMove('up')} className="p-3 hover:bg-gray-700 rounded-lg text-2xl" title="Move Up">⬆️</button>
                <button onClick={() => onMove('down')} className="p-3 hover:bg-gray-700 rounded-lg text-2xl" title="Move Down">⬇️</button>
                <button onClick={onDuplicate} className="p-3 hover:bg-gray-700 rounded-lg text-2xl" title="Duplicate">📋</button>
                <button onClick={onDelete} className="p-3 text-red-500 hover:bg-gray-700 rounded-lg text-2xl" title="Delete">❌</button>
            </div>
        </div>

        {/* Unified Table for Main and Sub-Items */}
        <div className="space-y-4">
            {/* Main Item Data */}
            <div className="space-y-3 p-3 border border-gray-600 rounded-lg bg-gray-900">
                <FormField label="Description">
                    <textarea name="description" value={item.description} onChange={handleChange} placeholder="Item description" rows={2} className="p-2 bg-white text-gray-900 rounded text-lg w-full" />
                </FormField>
                
                <div className={`${gridLayout}`}>
                    <FormField label="Speed">
                        <NumberStepper value={item.speed} onChange={(speed) => onUpdate({ ...item, speed })} step={0.1} min={0} />
                    </FormField>
                    <FormField label="Incline">
                        <NumberStepper value={item.incline} onChange={(incline) => onUpdate({ ...item, incline })} min={0} />
                    </FormField>
                    <FormField label="Duration">
                        <TimeInput value={item.timer} onChange={(timer) => onUpdate({ ...item, timer })} />
                    </FormField>
                    <FormField label="Colour">
                        <ColorPalettePicker 
                            itemType={item.type}
                            selectedValue={item.color}
                            onSelect={(color) => onUpdate({ ...item, color })}
                        />
                    </FormField>
                    {/* Placeholders for grid alignment */}
                    <FormField label="Omit Last"><span></span></FormField>
                    <FormField label="Actions"><span></span></FormField>
                </div>
            </div>

            {/* Sub-item Data Rows */}
            <div className="space-y-4">
                {item.subItems.map(subItem => (
                    <div key={subItem.id} className="w-full">
                        <SubItemForm 
                            item={subItem}
                            itemType={item.type}
                            onUpdate={handleUpdateSubItem}
                            onDelete={() => handleDeleteSubItem(subItem.id)}
                        />
                    </div>
                ))}
            </div>
        </div>

        {/* Add Sub-item Button */}
        <div>
            <button
                onClick={handleAddSubItem}
                className="w-full py-3 px-4 text-lg border-2 border-dashed rounded-lg hover:bg-gray-700"
            >
                + Add Sub-Item
            </button>
        </div>
    </div>
  );
}
