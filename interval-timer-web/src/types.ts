export interface Task {
  id: string;
  title: string;
  duration: string; // mm:ss format
  color?: string;
  repetitions: number;
  repetition?: number; // The current repetition number
  totalRepetitions?: number; // The total number of repetitions for the parent item
}

export type SubItem = Omit<Task, 'repetitions' | 'repetition' | 'color' | 'totalRepetitions'>;

export interface WorkoutItem extends Task {
  subItems?: SubItem[];
}

export interface Session {
  id: string;
  name: string;
  items: WorkoutItem[];
}
