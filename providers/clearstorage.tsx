import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Function to clear all session storage
export async function clearStorage() {
  if (Platform.OS === 'web') {
    try {
      sessionStorage.clear(); // Clears all items in sessionStorage on the web
    } catch (e) {
      console.error('Session storage is unavailable:', e);
    }
  } else {
    try {
      // SecureStore doesn't have a `clear` method, so we need to delete each item individually.
      const allKeys = await SecureStore.deleteItemAsync('session'); // Get all keys in SecureStore
      console.log("Done")  
      //   for (const key of allKeys) {
    //     await SecureStore.deleteItemAsync(key); // Delete each item from SecureStore
    //   }
    } catch (e) {
      console.error('SecureStore is unavailable:', e);
    }
  }
}
