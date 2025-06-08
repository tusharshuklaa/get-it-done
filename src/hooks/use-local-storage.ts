import { useCallback } from "react";

export const useLocalStorage = <T>(key: string) => {
  const saveToStorage = useCallback((data: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [key]);

  const loadFromStorage = useCallback((): T | null => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }, [key]);

  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, [key]);

  return { saveToStorage, loadFromStorage, clearStorage };
};
