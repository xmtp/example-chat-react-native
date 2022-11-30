import AsyncStorage from '@react-native-async-storage/async-storage';

const ENCODING = 'base64';

const CURRENT_WALLET_KEY_POINTER = 'xmtp:current-wallet';

const buildKey = (walletAddress: string, env: string): string =>
  `xmtp:keys:${walletAddress}:${env}`;

export const decodeKeys = (result: string | null): Uint8Array | null => {
  return result ? Buffer.from(result, ENCODING) : null;
};

export const loadKeys = async (
  walletAddress: string,
  env: string,
): Promise<Uint8Array | null> => {
  console.log('Loading keys for wallet', walletAddress, env);
  const result = await AsyncStorage.getItem(buildKey(walletAddress, env));
  return decodeKeys(result);
};

export const setKeys = async (
  walletAddress: string,
  env: string,
  keys: Uint8Array,
): Promise<void> => {
  const storageKey = buildKey(walletAddress, env);
  await AsyncStorage.setItem(storageKey, Buffer.from(keys).toString(ENCODING));
  await AsyncStorage.setItem(CURRENT_WALLET_KEY_POINTER, storageKey);
};

export const getKeyPointer = async () => {
  return AsyncStorage.getItem(CURRENT_WALLET_KEY_POINTER);
};
