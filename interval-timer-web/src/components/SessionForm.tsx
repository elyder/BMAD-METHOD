'use client';

import { WorkoutItem, WorkoutSession } from '@/types';
import React, { useEffect } from 'react';
import WorkoutItemForm from './WorkoutItemForm';
import { calculateTotalTime, formatTotalTime } from '../lib/utils';
import { ACTION_COLORS } from '../colors';

interface SessionFormProps {
  session: Partial<WorkoutSession>;
  setSession: React.Dispatch<React.SetStateAction<Partial<WorkoutSession> | null>>;
}

export default function SessionForm({ session, setSession }: SessionFormProps) {
  // Recalculate total time whenever items change
  useEffect(() => {
    if (session?.items) {
      const totalTime = calculateTotalTime(session.items);
      setSession(prevSession => ({ ...prevSession, totalTime }));
    }
  }, [session?.items, setSession]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSession({ ...session, name: e.target.value });
  };

  const handleItemUpdate = (updatedItem: WorkoutItem) => {
    const items = session?.items?.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    ) || [];
    setSession({ ...session, items });
  };

  const handleItemDelete = (itemId: string) => {
    const items = session?.items?.filter(item => item.id !== itemId) || [];
    setSession({ ...session, items });
  };

  const handleAddItem = () => {
    const newItem: WorkoutItem = {
      id: `item-${session?.id}-${new Date().getTime()}`,
      type: 'Work-out', // Default type
      description: 'New Item',
      speed: 0,
      incline: 0,
      timer: 60,
      sets: 1,
      color: ACTION_COLORS[0], // Default to first color from the Action palette
      subItems: [],
    };
    const items = [...(session?.items || []), newItem];
    setSession({ ...session, items });
  };

  const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
    const items = session?.items ? [...session.items] : [];
    const index = items.findIndex(item => item.id === itemId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    [items[index], items[newIndex]] = [items[newIndex], items[index]]; // Swap
    setSession({ ...session, items });
  };

  const handleItemDuplicate = (itemToDuplicate: WorkoutItem) => {
    const newId = `item-${session?.id}-${new Date().getTime()}`;
    const newItem: WorkoutItem = {
      ...itemToDuplicate,
      id: newId,
      // Ensure sub-items also get new unique IDs
      subItems: itemToDuplicate.subItems.map(sub => ({...sub, id: `sub-${newId}-${Math.random()}`}))
    };
    
    const index = session?.items?.findIndex(item => item.id === itemToDuplicate.id) ?? -1;
    const newItems = session?.items ? [...session.items] : [];
    if (index !== -1) {
      newItems.splice(index + 1, 0, newItem);
    } else {
      newItems.push(newItem); // Fallback
    }

    setSession({ ...session, items: newItems });
  };

  return (
    <div className="space-y-8">
      <div className="p-6 bg-gray-800 rounded-xl space-y-6">
        <div>
          <label htmlFor="session-name" className="block text-2xl font-medium mb-3">
            Session Name
          </label>
          <input
            id="session-name"
            type="text"
            value={session?.name || ''}
            onChange={handleNameChange}
            className="w-full p-4 bg-white text-gray-900 rounded-lg text-2xl"
            placeholder="e.g., Morning Cardio"
          />
        </div>
        <div>
            <label htmlFor="session-description" className="block text-xl font-medium mb-2">
                Description (Optional)
            </label>
            <textarea
                id="session-description"
                name="description"
                rows={4}
                value={session?.description || ''}
                onChange={(e) => setSession({ ...session, description: e.target.value })}
                className="w-full p-3 bg-white text-gray-900 rounded-lg text-lg"
                placeholder="Enter any details about this workout..."
            />
        </div>
        <div className="text-right text-2xl font-bold">
            Total Time: {formatTotalTime(session?.totalTime || 0)}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Workout Items</h3>
        {session?.items?.map(item => (
          <WorkoutItemForm
            key={item.id}
            item={item}
            onUpdate={handleItemUpdate}
            onDelete={() => handleItemDelete(item.id)}
            onMove={(direction) => handleMoveItem(item.id, direction)}
            onDuplicate={() => handleItemDuplicate(item)}
          />
        ))}
        <button
            onClick={handleAddItem}
            className="w-full py-4 px-4 border-2 border-dashed rounded-xl hover:bg-gray-700 text-2xl"
        >
            + Add Workout Item
        </button>
      </div>
    </div>
  );
}
