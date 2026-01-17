'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Session, WorkoutItem, SubItem } from '../types';

export default function CreateSessionPage() {
  const router = useRouter();
  const [sessionName, setSessionName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [workoutItems, setWorkoutItems] = useState<WorkoutItem[]>([
    { id: '1', title: 'Warm-up', duration: '10:00', color: '#ffcc00', repetitions: 1 },
    { id: '2', title: 'Actions', duration: '30:00', color: '#66cc33', repetitions: 1 },
    { id: '3', title: 'Cooldown', duration: '10:00', color: '#3399ff', repetitions: 1 },
  ]);

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
        color: '#cccccc',
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
      let itemTotalSeconds = 0;
      if (item.duration) {
        const [minutes, seconds] = item.duration.split(':').map(Number);
        itemTotalSeconds += minutes * 60 + seconds;
      }
      if (item.subItems) {
        item.subItems.forEach((subItem) => {
          if (subItem.duration) {
            const [minutes, seconds] = subItem.duration.split(':').map(Number);
            itemTotalSeconds += minutes * 60 + seconds;
          }
        });
      }
      totalSeconds += itemTotalSeconds * item.repetitions;
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
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-900 text-white">
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

        <div className="space-y-4">
          {workoutItems.map((item) => (
            <div key={item.id} className="bg-gray-700 p-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row md:items-end md:space-x-4">
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
                  Delete
                </button>
              </div>
              <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <div className="text-gray-400">{item.duration}</div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor={`itemDuration-${item.id}`} className="block text-sm font-bold mb-2">
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
                <div className="flex flex-col">
                  <label htmlFor={`itemColor-${item.id}`} className="block text-sm font-bold mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    id={`itemColor-${item.id}`}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white h-10"
                    value={item.color}
                    onChange={(e) => handleItemChange(item.id, 'color', e.target.value)}
                  />
                </div>
              </div>

              {/* Sub-items */}
              <div className="mt-4 space-y-2">
                {item.subItems?.map((subItem, index) => (
                  <div key={subItem.id}>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-1 px-2 text-black leading-tight focus:outline-none focus:shadow-outline bg-white"
                        value={subItem.title}
                        onChange={(e) => handleSubItemChange(item.id, subItem.id, 'title', e.target.value)}
                        placeholder="Sub-item title"
                      />
                      <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-1 px-2 text-black leading-tight focus:outline-none focus:shadow-outline bg-white"
                        value={subItem.duration}
                        onChange={(e) => handleSubItemChange(item.id, subItem.id, 'duration', e.target.value)}
                        placeholder="mm:ss"
                      />
                      <input
                        type="color"
                        className="shadow appearance-none border rounded w-full py-1 px-2 leading-tight focus:outline-none focus:shadow-outline bg-white h-8"
                        value={subItem.color || item.color}
                        onChange={(e) => handleSubItemChange(item.id, subItem.id, 'color', e.target.value)}
                      />
                      <button
                        onClick={() => deleteSubItem(item.id, subItem.id)}
                        className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-2 rounded"
                      >
                        X
                      </button>
                    </div>
                    {index === item.subItems!.length - 1 && item.repetitions > 1 && (
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id={`disregard-${subItem.id}`}
                          checked={subItem.disregardInLastRepetition}
                          onChange={(e) =>
                            handleSubItemChange(item.id, subItem.id, 'disregardInLastRepetition', e.target.checked)
                          }
                          className="mr-2"
                        />
                        <label htmlFor={`disregard-${subItem.id}`} className="text-sm">
                          Disregard in last repetition
                        </label>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addSubItem(item.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mt-2"
                >
                  Add Sub-item
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={addItem}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Item
          </button>
          <button
            onClick={() => setShowSaveForm(true)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Session
          </button>
        </div>
      </div>
    </main>
  );
}