import { useState, useEffect } from 'react'

// Custom hook to manage local storage
function useLocalStorage<T> (key: string, initialValue: T) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : JSON.stringify(initialValue)
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  const updateValue = (newValue:T) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  const removeValue = () => {
    setValue(initialValue); localStorage.removeItem(key)
  }

  return [value, updateValue, removeValue]
}

export default useLocalStorage
