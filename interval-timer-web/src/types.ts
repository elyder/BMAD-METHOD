// interval-timer-web/src/types.ts

/**
 * Represents a single sub-item within a workout item, like a specific exercise or rest period.
 */
export interface SubItem {
  id: string;
  description: string;
  speed: number;
  incline: number;
  timer: number; // Duration in seconds
  color: string; // Background color for the timer display
  omitForLastSet: boolean; // If true, this sub-item is skipped during the last set of the parent item
}

export type WorkoutItemType = 'Warm-up' | 'Action' | 'Cool-down';

/**
 * Represents a major component of a workout session, like a warm-up, a series of exercises, or a cool-down.
 */
export interface WorkoutItem {
  id: string;
  type: WorkoutItemType;
  description: string;
  speed: number;
  incline: number;
  timer: number; // Duration in seconds. Note: this might be redundant if sub-items are always present.
  sets: number; // Number of times to repeat the sub-items
  color: string; // Background color for the timer display
  subItems: SubItem[];
}

/**
 * Represents a complete workout session, composed of multiple workout items.
 */
export interface WorkoutSession {
  id: string; // Unique identifier
  name: string;
  description?: string; // Optional user-provided description
  showPace: boolean; // Whether to show pace during the run
  items: WorkoutItem[];
  createdAt: string; // ISO 8601 date string
  lastUsedAt?: string; // ISO 8601 date string
  totalTime: number; // Total duration of the session in seconds
}

/**
 * Represents a log entry for a completed workout session.
 */
export interface LogEntry {
  id: string;
  date: string; // ISO 8601 date string
  sessionId: string;
  sessionName: string;
  reflections?: string; // Optional user notes
}
