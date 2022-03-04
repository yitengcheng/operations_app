import AsyncStorage from '@react-native-async-storage/async-storage';
import { isJsonString } from '.';

export const saveStorage = async (name: string, value: any) => {
  let res;
  res = typeof value === 'string' ? value : JSON.stringify(value);
  try {
    await AsyncStorage.setItem(name, res);
  } catch (error) {
    console.log(`-----save ${name} fail-----`, error);
  }
};

export const loadStorage = async (name: string) => {
  let res;
  try {
    let value = await AsyncStorage.getItem(name);
    res = value ? (isJsonString(value) ? JSON.parse(value) : value) : '';
    return res;
  } catch (error) {
    console.log(`-----load ${name} fail-----`, error);
  }
};
