import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names safely, resolving conflicting utility
 * classes (e.g. "p-2" vs "p-4") in favor of the last one applied.
 * Used by every component in the design system.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
