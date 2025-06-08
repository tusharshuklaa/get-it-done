export const TASK_STATUSES = ['all', 'pending', 'completed'] as const;
export const DEFAULT_TASK_STATUS = 'pending';
export const DEFAULT_PROJECT = 'all';
export const DEFAULT_PRIORITY = 'medium';
export const PRIORITIES = {
  low: 0,
  medium: 1,
  high: 2,
} as const;
export const SORT_OPTIONS = [
  'date',
  'priority',
  'ascending',
  'descending'
] as const;
export const WEATHER_CACHE_KEY = 'weather_data';
export const WEATHER_DEFAULT_UPDATE_INTERVAL = 60; // minutes
export const WEATHER_CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
