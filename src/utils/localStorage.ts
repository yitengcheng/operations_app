import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveStorage = async (name: string, value: any) => {
  let res;
  res = typeof value === 'string' ? value : JSON.stringify(value);
  try {
    await AsyncStorage.setItem(name, res);
    console.log('-----save success-----');
  } catch (error) {
    console.log('-----save fail-----');
  }
};

export const loadStorage = async (name: string) => {
  let res;
  let value = await AsyncStorage.getItem(name);
  try {
    res = value ? JSON.parse(value) : '';
    console.log('-----load success-----');
    return res;
  } catch (error) {
    console.log('-----load fail-----');
  }
};
