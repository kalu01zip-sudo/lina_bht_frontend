// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StoredCapture {
  angle: string;
  uri: string; // Use uri instead of localPath
  timestamp: number;
}

export const saveFaceScanCaptures = async (sessionId: string, captures: StoredCapture[]) => {
  try {
    await AsyncStorage.setItem(`face_scan_${sessionId}`, JSON.stringify(captures));
    console.log('✅ Captures metadata saved to AsyncStorage');
    return true;
  } catch (error) {
    console.error('Error saving captures to AsyncStorage:', error);
    return false;
  }
};

export const getFaceScanCaptures = async (sessionId: string): Promise<StoredCapture[] | null> => {
  try {
    const data = await AsyncStorage.getItem(`face_scan_${sessionId}`);
    if (data) {
      console.log('✅ Captures metadata retrieved from AsyncStorage');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error getting captures from AsyncStorage:', error);
    return null;
  }
};

export const deleteFaceScanCaptures = async (sessionId: string) => {
  try {
    await AsyncStorage.removeItem(`face_scan_${sessionId}`);
    console.log('✅ Captures metadata deleted from AsyncStorage');
    return true;
  } catch (error) {
    console.error('Error deleting captures from AsyncStorage:', error);
    return false;
  }
};
