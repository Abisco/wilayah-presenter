import { useCallback } from "react";

/**
 * Generic hook for localStorage operations with SSR safety
 */
export const useLocalStorage = <T>(key: string) => {
  const getItem = useCallback((): T | null => {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  }, [key]);

  const setItem = useCallback(
    (value: T): void => {
      if (typeof window === "undefined") {
        return;
      }

      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  const removeItem = useCallback((): void => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  const getItemWithDefault = useCallback(
    (defaultValue: T): T => {
      const item = getItem();
      return item !== null ? item : defaultValue;
    },
    [getItem]
  );

  return {
    getItem,
    setItem,
    removeItem,
    getItemWithDefault,
  };
};
