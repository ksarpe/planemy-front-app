// Wrapper dla localStorage, aby API było asynchroniczne, tak jak w AsyncStorage

export const persistentStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    localStorage.setItem(key, value);
  },

  getItem: async (key: string): Promise<string | null> => {
    return localStorage.getItem(key);
  },

  removeItem: async (key: string): Promise<void> => {
    localStorage.removeItem(key);
  },
};
