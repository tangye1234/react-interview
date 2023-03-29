import { useCallback, useEffect, useState } from "react"

// a hook to save a value to local storage and get the value from local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    const item = window.localStorage.getItem(key)
    if (item) {
      setStoredValue(JSON.parse(item))
    }
  }, [key])

  const setValue = useCallback((value: ((prev: T) => T) | T) => {
    setStoredValue(v => {
      const newValue = value instanceof Function ? value(v) : value
      window.localStorage.setItem(key, JSON.stringify(newValue))
      return newValue
    })
  }, [key])

  return [storedValue, setValue] as const
}