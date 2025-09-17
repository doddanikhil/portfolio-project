import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.substring(0, length).replace(/\s+\S*$/, '') + '...';
}

export function getProficiencyColor(level: number): string {
  const colors = {
    1: 'bg-red-500',
    2: 'bg-orange-500', 
    3: 'bg-yellow-500',
    4: 'bg-blue-500',
    5: 'bg-green-500'
  };
  return colors[level as keyof typeof colors] || 'bg-gray-500';
}

export function getProficiencyLabel(level: number): string {
  const labels = {
    1: 'Beginner',
    2: 'Intermediate',
    3: 'Advanced', 
    4: 'Expert',
    5: 'Master'
  };
  return labels[level as keyof typeof labels] || 'Unknown';
}
