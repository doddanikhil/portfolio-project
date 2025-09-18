import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatReadingTime(minutes: number) {
  if (minutes < 1) return 'Less than 1 min read';
  return `${Math.ceil(minutes)} min read`;
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Mobile breakpoint utilities
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.md;
}

export function isTablet() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg;
}

export function isDesktop() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.lg;
}