/**
 * Example React Native App using XMTP.
 */
import React from 'react';

// Polyfill necessary xmtp-js libraries for React Native.
import './polyfills.js';

import Home from './components/Home';
import * as Linking from 'expo-linking';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setup } from './lib/notifications.js';

const prefix = Linking.createURL('/');

export const INFURA_API_KEY = '2bf116f1cc724c5ab9eec605ca8440e1';

const App = () => {
  const linking = {
    prefixes: [prefix],
  };

  const APP_SCHEME = 'examplexmtp://';

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <WalletConnectProvider
        redirectUrl={APP_SCHEME}
        storageOptions={{
          // @ts-expect-error: Internal
          asyncStorage: AsyncStorage,
        }}>
        <Home />
      </WalletConnectProvider>
    </NavigationContainer>
  );
};

export default App;
