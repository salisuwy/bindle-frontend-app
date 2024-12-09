export function useLocalStorage() {
  const setStorage = (key, data) => {
    localStorage.setItem(key, data);
  };

  const getStorage = (key, defaultVal) => {
    return JSON.parse(localStorage.getItem(key)) ?? defaultVal;
  };

  const clearStorage = (key) => {
    localStorage.removeItem(key);
  };
  const clearAllStorage = (key, newState) => {
    localStorage.clear();
  };

  return {
    setStorage,
    getStorage,
    clearStorage,
    clearAllStorage,
  };
}
