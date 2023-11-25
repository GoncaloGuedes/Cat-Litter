import EncryptedStorage from 'react-native-encrypted-storage';

async function set(key, object) {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(object));
  } catch (error) {
    console.log('secure.error: ', error);
  }
}

async function get(key) {
  try {
    const data = await EncryptedStorage.getItem(key);
    if (data !== undefined) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.log('secure.get: ', error);
  }
}

async function remove(key) {
  try {
    await EncryptedStorage.removetItem(key);
  } catch (error) {
    console.log('secure.remove: ', error);
  }
}

async function wipe(key) {
  try {
    await EncryptedStorage.clear();
  } catch (error) {
    console.log('secure.swipe: ', error);
  }
}

export default {set, get, remove, wipe};
