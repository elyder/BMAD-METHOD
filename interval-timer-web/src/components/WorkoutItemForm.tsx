'use client';

import { SubItem, WorkoutItem, WorkoutItemType } from '@/types';
import React from 'react';
import SubItemForm from './SubItemForm';
import ColorPalettePicker from './ColorPalettePicker';
import { COLOR_PALETTES } from '../colors';

const itemTypes: WorkoutItemType[] = ['Warm-up', 'Action', 'Cool-down'];

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let updatedItem = { ...item };

    let updatedValue;
    if (type === 'number') {
      updatedValue = parseFloat(value) || 0;
    } else {
      updatedValue = value;
    }
    
    updatedItem = { ...updatedItem, [name]: updatedValue };

    if (name === 'type') {
        const newType = updatedValue as WorkoutItemType;
        const newPalette = COLOR_PALETTES[newType] || [];
        updatedItem.color = newPalette[0] || '#FFFFFF';
    }

    onUpdate(updatedItem);
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

  const handleAddSubItem = () => {
    const newSubItem: SubItem = {
      id: `sub-${item.id}-${new Date().getTime()}`,
      description: 'New Sub-Item',
      speed: 0,
      incline: 0,
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

  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
        {/* Row 1: Main Item Actions */}
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                <select name="type" value={item.type} onChange={handleChange} className="p-2 bg-white text-gray-900 rounded">
                    {itemTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                <div>
                    <label className="text-sm mr-2">Sets:</label>
                    <input
                        type="number"
                        name="sets"
                        value={item.sets}
                        onChange={handleChange}
                        className="w-16 p-2 bg-white text-gray-900 rounded"
                        min="1"
                    />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => onMove('up')} className="p-2 hover:bg-gray-700 rounded" title="Move Up">⬆️</button>
                <button onClick={() => onMove('down')} className="p-2 hover:bg-gray-700 rounded" title="Move Down">⬇️</button>
                <button onClick={onDuplicate} className="p-2 hover:bg-gray-700 rounded" title="Duplicate">📋</button>
                <button onClick={onDelete} className="p-2 text-red-500 hover:bg-gray-700 rounded" title="Delete">❌</button>
            </div>
        </div>

        {/* Unified Table for Main and Sub-Items */}
        <div className="space-y-2">
            {/* Header Row */}
            <div className="grid grid-cols-[1fr,1fr,64px,64px,90px,80px,80px,50px] gap-2 px-2 text-xs text-gray-400 items-center">
                <span className="col-span-2">Description</span>
                <span className="text-center">Speed</span>
                <span className="text-center">Incline</span>
                <span className="text-center">Duration</span>
                <span className="text-center">Colour</span>
                <span className="text-center">Omit Last</span>
                <span className="text-right"></span>
            </div>

            {/* Row 2: Main Item Data Row */}
            <div className="grid grid-cols-[1fr,1fr,64px,64px,90px,80px,80px,50px] gap-2 items-center">
                <textarea name="description" value={item.description} onChange={handleChange} placeholder="Item description" rows={1} className="p-1 bg-white text-gray-900 rounded text-sm w-full col-span-2" />
                <input type="number" name="speed" value={item.speed} onChange={handleChange} placeholder="Speed" className="p-1 bg-white text-gray-900 rounded text-sm w-16 text-center" step="0.1" />
                <input type="number" name="incline" value={item.incline} onChange={handleChange} placeholder="Incline" className="p-1 bg-white text-gray-900 rounded text-sm w-16 text-center" />
                <div className="flex items-center">
                    <input type="text" value={formatTime(item.timer)} onChange={handleTimeChange} placeholder="mm:ss" className="p-1 bg-white text-gray-900 rounded-l text-sm w-16 text-center" />
                    <div className="flex flex-col">
                        <button onClick={() => handleDurationChange(30)} className="px-1 bg-gray-600 hover:bg-gray-500 rounded-tr text-xs">▲</button>
                        <button onClick={() => handleDurationChange(-30)} className="px-1 bg-gray-600 hover:bg-gray-500 rounded-br text-xs">▼</button>
                    </div>
                </div>
                <div className="flex justify-center">
                    <ColorPalettePicker 
                        itemType={item.type}
                        selectedValue={item.color}
                        onSelect={(color) => onUpdate({ ...item, color })}
                    />
                </div>
                <span></span>
                <span></span>
            </div>

            {/* Row 3: Sub-item Data Rows */}
            {item.subItems.map(subItem => (
                 <div key={subItem.id} className="grid grid-cols-[1fr,1fr,64px,64px,90px,80px,80px,50px] gap-2 items-center">
                    <SubItemForm 
                        item={subItem}
                        itemType={item.type}
                        onUpdate={handleUpdateSubItem}
                        onDelete={() => handleDeleteSubItem(subItem.id)}
                    />
                </div>
            ))}
        </div>

        {/* Row 4: Add Sub-item */}
        <div>
            <button
                onClick={handleAddSubItem}
                className="w-full py-2 px-4 text-sm border-2 border-dashed rounded-lg hover:bg-gray-700"
            >
                + Add Sub-Item
            </button>
        </div>
    </div>
  );
}
