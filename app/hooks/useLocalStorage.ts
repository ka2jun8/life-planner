import { useEffect, useState } from "react";

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  callback?: (data: T) => void
): [T, (v: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      const data = item ? JSON.parse(item) : initialValue;
      setStoredValue(data);
      callback && callback(data);
    } catch (e) {
      console.error(e);
    }
  }, []);
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  };
  return [storedValue, setValue];
};
