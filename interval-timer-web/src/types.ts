export interface SubItem {
  id: string;
  title: string;
  duration: string; // mm:ss format
}

export interface WorkoutItem {
  id: string;
  title: string;
  duration: string; // mm:ss format
  color: string;
  repetitions: number;
  subItems?: SubItem[];
}

export interface Session {
  id: string;
  name: string;
  items: WorkoutItem[];
}
