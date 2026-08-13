import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges CSS classes together using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a crypto-safe random token
 */
export function generateToken(length = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      token += chars[array[i] % chars.length];
    }
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return token;
}

/**
 * Formats a date nicely
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Truncates text with an ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Strips HTML tags from a string
 */
export function sanitizeHtml(str: string): string {
  return str.replace(/<[^>]*>?/gm, '');
}

/**
 * Converts a string to a URL-friendly slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Returns a relative time string (e.g., '2 hours ago')
 */
export function getRelativeTime(date: Date | string | number): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const time = new Date(date).getTime();
  const now = Date.now();
  const diffInSeconds = (time - now) / 1000;
  
  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(Math.round(diffInSeconds), 'second');
  }
  
  const diffInMinutes = diffInSeconds / 60;
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(Math.round(diffInMinutes), 'minute');
  }
  
  const diffInHours = diffInMinutes / 60;
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(Math.round(diffInHours), 'hour');
  }
  
  const diffInDays = diffInHours / 24;
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(Math.round(diffInDays), 'day');
  }
  
  const diffInMonths = diffInDays / 30;
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(Math.round(diffInMonths), 'month');
  }
  
  const diffInYears = diffInDays / 365;
  return rtf.format(Math.round(diffInYears), 'year');
}

/**
 * Supported reaction emojis with their labels
 */
export const REACTION_EMOJIS: Record<string, { emoji: string; label: string }> = {
  heart: { emoji: '❤️', label: 'Love' },
  celebrate: { emoji: '🎉', label: 'Celebrate' },
  smile: { emoji: '😊', label: 'Smile' },
  laugh: { emoji: '😂', label: 'Haha' },
  surprise: { emoji: '😮', label: 'Wow' },
  cry: { emoji: '😢', label: 'Sad' },
};

