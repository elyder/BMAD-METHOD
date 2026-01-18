// interval-timer-web/src/lib/utils.ts

import { WorkoutItem } from '../types';

/**
 * Calculates the total time for a list of workout items, considering sets and sub-items.
 * @param items - An array of WorkoutItem objects.
 * @returns The total time in seconds.
 */
export const calculateTotalTime = (items: WorkoutItem[]): number => {
  return items.reduce((total, item) => {
    // Time for the parent item itself, multiplied by sets
    const parentTime = item.timer * item.sets;

    // Time for the sub-items
    let subItemsTime = 0;
    if (item.subItems && item.subItems.length > 0) {
      const subItemsTotalPerSet = item.subItems.reduce((subTotal, sub) => subTotal + sub.timer, 0);
      
      if (item.sets > 0) {
          const lastSetOmittedSubItemsTotal = item.subItems
              .filter(sub => sub.omitForLastSet)
              .reduce((subTotal, sub) => subTotal + sub.timer, 0);
          
          subItemsTime = (subItemsTotalPerSet * item.sets) - lastSetOmittedSubItemsTotal;
      }
    }

    return total + parentTime + subItemsTime;
  }, 0);
};

/**
 * Formats a total number of seconds into a string like "15m 30s".
 * @param totalSeconds - The total time in seconds.
 * @returns A formatted string.
 */
export const formatTotalTime = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return '0m 0s';
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
};

/**
 * Calculates pace (mm:ss/km) from speed (km/h).
 * @param speedKph - The speed in kilometers per hour.
 * @returns The formatted pace string "mm:ss/km".
 */
export const calculatePace = (speedKph: number): string => {
    if (speedKph <= 0) {
        return '--:--';
    }
    const minutesPerKm = 60 / speedKph;
    const paceMinutes = Math.floor(minutesPerKm);
    const paceSeconds = Math.round((minutesPerKm - paceMinutes) * 60);

    return `${paceMinutes.toString().padStart(2, '0')}:${paceSeconds.toString().padStart(2, '0')}`;
};
