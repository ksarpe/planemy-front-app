import AsyncStorage from '@react-native-async-storage/async-storage';

export const persistentStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
  },

  getItem: async (key: string): Promise<string | null> => {
    return await AsyncStorage.getItem(key);
  },

  removeItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },
};