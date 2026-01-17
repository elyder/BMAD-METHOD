'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Session, WorkoutItem, SubItem } from '../../types';
import { colorPalette } from '../../colors';

export default function CreateSessionPage() {
  const router = useRouter();
  const [sessionName, setSessionName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [workoutItems, setWorkoutItems] = useState<WorkoutItem[]>([
    { id: '1', title: 'Warm-up', duration: '10:00', color: '#ef4444', repetitions: 1 },
    { id: '2', title: 'Actions', duration: '30:00', color: '#22c55e', repetitions: 1 },
    { id: '3', title: 'Cooldown', duration: '10:00', color: '#3b82f6', repetitions: 1 },
  ]);
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 2000); // Redirect after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [successMessage, router]);

  const handleItemChange = (id: string, field: keyof WorkoutItem, value: string | number) => {
    setWorkoutItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addSubItem = (itemId: string) => {
    setWorkoutItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              subItems: [
                ...(item.subItems || []),
                {
                  id: Date.now().toString(),
                  title: 'New Sub-item',
                  duration: '00:00',
                  disregardInLastRepetition: false,
                  color: item.color, // Default to parent color
                },
              ],
            }
          : item
      )
    );
  };

  const handleSubItemChange = (itemId: string, subItemId: string, field: keyof SubItem, value: string | boolean) => {
    setWorkoutItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              subItems: item.subItems?.map((subItem) =>
                subItem.id === subItemId ? { ...subItem, [field]: value } : subItem
              ),
            }
          : item
      )
    );
  };

  const deleteSubItem = (itemId: string, subItemId: string) => {
    setWorkoutItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              subItems: item.subItems?.filter((subItem) => subItem.id !== subItemId),
            }
          : item
      )
    );
  };

  const addItem = () => {
    setWorkoutItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now().toString(), // Simple unique ID
        title: 'New Item',
        duration: '00:00',
        color: '#78716c',
        repetitions: 1,
      },
    ]);
  };

  const deleteItem = (id: string) => {
    setWorkoutItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const calculateTotalDuration = () => {
    let totalSeconds = 0;
    workoutItems.forEach((item) => {
      for (let i = 1; i <= item.repetitions; i++) {
        let itemTotalSeconds = 0;
        if (item.duration) {
          const [minutes, seconds] = item.duration.split(':').map(Number);
          itemTotalSeconds += minutes * 60 + seconds;
        }
        if (item.subItems) {
          item.subItems.forEach((subItem) => {
            if (subItem.disregardInLastRepetition && i === item.repetitions) {
              return; // Skip this sub-item in the last repetition
            }
            if (subItem.duration) {
              const [minutes, seconds] = subItem.duration.split(':').map(Number);
              itemTotalSeconds += minutes * 60 + seconds;
            }
          });
        }
        totalSeconds += itemTotalSeconds;
      }
    });

    const totalMinutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${totalMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const saveSession = () => {
    const newSession: Session = {
      id: Date.now().toString(), // Unique ID for the session
      name: sessionName,
      items: workoutItems,
      createdAt: Date.now(),
    };

    const existingSessions = JSON.parse(localStorage.getItem('intervalTimerSessions') || '[]') as Session[];
    const updatedSessions = [...existingSessions, newSession];
    localStorage.setItem('intervalTimerSessions', JSON.stringify(updatedSessions));

    setSuccessMessage('Session saved successfully!');
  };

  const handleSave = () => {
    if (!sessionName.trim()) {
      alert('Please enter a session name.');
      return;
    }
    saveSession();
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-gray-900 text-white">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">New Session</h1>
        
        {successMessage && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-4">
            {successMessage}
          </div>
        )}

        <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
          <div className="text-xl font-bold mb-4">
            Total Time: {calculateTotalDuration()}
          </div>

          {showSaveForm && (
            <div className="mb-4">
              <label htmlFor="sessionName" className="block text-sm font-bold mb-2">
                Session Name
              </label>
              <input
                type="text"
                id="sessionName"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-white"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Session Name"
              />
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Save
              </button>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {workoutItems.map((item) => (
            <div key={item.id} className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600">
              <div className="flex flex-col md:flex-row md:items-end md:space-x-4 mb-6">
                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor={`itemRepetitions-${item.id}`} className="block text-sm font-bold mb-2">
                      Repetitions
                    </label>
                    <input
                      type="number"
                      id={`itemRepetitions-${item.id}`}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-white"
                      value={item.repetitions}
                      onChange={(e) => handleItemChange(item.id, 'repetitions', parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </div>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="mt-4 md:mt-0 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete Item
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 items-end">
                <div className="flex flex-col">
                  <label htmlFor={`itemTitle-${item.id}`} className="block text-sm font-bold mb-2 text-blue-300 text-left">
                    Title
                  </label>
                  <input
                    type="text"
                    id={`itemTitle-${item.id}`}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-white font-bold"
                    value={item.title}
                    onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                    placeholder="e.g., Warm-up"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor={`itemDuration-${item.id}`} className="block text-sm font-bold mb-2 text-blue-300 text-left">
                    Duration (mm:ss)
                  </label>
                  <input
                    type="text"
                    id={`itemDuration-${item.id}`}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-white"
                    value={item.duration}
                    onChange={(e) => handleItemChange(item.id, 'duration', e.target.value)}
                    placeholder="e.g., 05:00"
                  />
                </div>
                <div className="flex flex-col relative items-start">
                  <label className="block text-sm font-bold mb-2 text-blue-300">
                    Color
                  </label>
                  <div
                    className="w-10 h-10 rounded cursor-pointer border-2 border-white shadow-inner"
                    style={{ backgroundColor: item.color }}
                    onClick={() => setActiveColorPicker(activeColorPicker === item.id ? null : item.id)}
                  />
                  {activeColorPicker === item.id && (
                    <div className="absolute top-12 left-0 z-20 bg-gray-800 p-2 rounded shadow-xl grid grid-cols-8 gap-1 w-64 border border-gray-500">
                      {colorPalette.map((c) => (
                        <div
                          key={c}
                          className="w-6 h-6 rounded cursor-pointer border border-gray-500 hover:border-white"
                          style={{ backgroundColor: c }}
                          onClick={() => {
                            handleItemChange(item.id, 'color', c);
                            setActiveColorPicker(null);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sub-items Rows */}
              {item.subItems?.map((subItem, index) => (
                <div key={subItem.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 items-center">
                  <div className="flex flex-col">
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-white font-bold"
                      value={subItem.title}
                      onChange={(e) => handleSubItemChange(item.id, subItem.id, 'title', e.target.value)}
                      placeholder="Sub-item title"
                    />
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline bg-white"
                      value={subItem.duration}
                      onChange={(e) => handleSubItemChange(item.id, subItem.id, 'duration', e.target.value)}
                      placeholder="mm:ss"
                    />
                  </div>
                  <div className="flex flex-col relative">
                    <div className="flex items-center gap-2">
                        <div
                        className="w-10 h-10 rounded cursor-pointer border-2 border-white shadow-inner"
                        style={{ backgroundColor: subItem.color || item.color }}
                        onClick={() => setActiveColorPicker(activeColorPicker === subItem.id ? null : subItem.id)}
                        />
                        <button
                            onClick={() => deleteSubItem(item.id, subItem.id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-sm h-10"
                        >
                            X
                        </button>
                    </div>
                    {activeColorPicker === subItem.id && (
                      <div className="absolute top-12 left-0 z-20 bg-gray-900 p-2 rounded shadow-2xl grid grid-cols-8 gap-1 w-64 border border-gray-500">
                        {colorPalette.map((c) => (
                          <div
                            key={c}
                            className="w-6 h-6 rounded cursor-pointer border border-gray-500 hover:border-white"
                            style={{ backgroundColor: c }}
                            onClick={() => {
                              handleSubItemChange(item.id, subItem.id, 'color', c);
                              setActiveColorPicker(null);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Disregard Checkbox Row */}
                  {index === item.subItems!.length - 1 && item.repetitions > 1 && (
                      <div className="col-span-1 md:col-span-3 flex items-center mt-1">
                        <input
                          type="checkbox"
                          id={`disregard-${subItem.id}`}
                          checked={subItem.disregardInLastRepetition}
                          onChange={(e) =>
                            handleSubItemChange(item.id, subItem.id, 'disregardInLastRepetition', e.target.checked)
                          }
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor={`disregard-${subItem.id}`} className="text-sm text-gray-300">
                          Disregard in last repetition
                        </label>
                      </div>
                    )}
                </div>
              ))}

              <button
                onClick={() => addSubItem(item.id)}
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded text-sm mt-4 transition-colors w-full md:w-auto"
              >
                + Add Sub-item
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-12 border-t border-gray-700 pt-8">
          <button
            onClick={addItem}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition active:scale-95"
          >
            Add New Item
          </button>
          <div className="space-x-4">
            <Link href="/">
              <button className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                Cancel
              </button>
            </Link>
            <button
              onClick={() => setShowSaveForm(true)}
              className="bg-green-600 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition active:scale-95"
            >
              Save Session
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}