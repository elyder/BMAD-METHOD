import { WorkoutItemType } from "./types";

export const WARMUP_COLORS = [
    '#FBBF24', // amber-400
    '#F59E0B', // amber-500
    '#D97706', // amber-600
    '#FB923C', // orange-400
    '#F97316', // orange-500
    '#EA580C', // orange-600
];

export const ACTION_COLORS = [
    '#74A257', 
    '#36903D', 
    '#007C28', 
    '#00681A', 
    '#00550E', 
    '#004200',
    '#C45151', 
    '#B52F2F', 
    '#A00000', 
    '#8B0000', 
    '#760000', 
    '#610000',
];

export const COOLDOWN_COLORS = [
    '#60A5FA', // blue-400
    '#3B82F6', // blue-500
    '#2563EB', // blue-600
];

export const COLOR_PALETTES: Record<WorkoutItemType, string[]> = {
    'Warm-up': WARMUP_COLORS,
    'Work-out': ACTION_COLORS,
    'Cool-down': COOLDOWN_COLORS,
};
