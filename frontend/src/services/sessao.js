import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SESSION_KEY = 'betoneira.session.token';

function webStorage() {
  return typeof globalThis.localStorage === 'undefined' ? null : globalThis.localStorage;
}

export async function readSessionToken() {
  return Platform.OS === 'web'
    ? webStorage()?.getItem(SESSION_KEY) ?? null
    : SecureStore.getItemAsync(SESSION_KEY);
}

export async function saveSessionToken(token) {
  if (Platform.OS === 'web') {
    webStorage()?.setItem(SESSION_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(SESSION_KEY, token);
}

export async function deleteSessionToken() {
  if (Platform.OS === 'web') {
    webStorage()?.removeItem(SESSION_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(SESSION_KEY);
}
