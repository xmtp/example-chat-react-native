/**
 * Example React Native App using XMTP.
 */
import React from 'react';

// Polyfill necessary xmtp-js libraries for React Native.
import './polyfills.js';

import Home from './components/Home';
import * as Linking from 'expo-linking';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';

const prefix = Linking.createURL('/');

const APP_SCHEME = 'examplexmtp://';

const App = () => {
  const linking = {
    prefixes: [prefix],
  };

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <WalletConnectProvider
        redirectUrl={APP_SCHEME}
        bridge="https://bridge.walletconnect.org"
        clientMeta={{
          description: 'Sign in with XMTP',
          url: 'https://walletconnect.org',
          icons: ['https://walletconnect.org/walletconnect-logo.png'],
          name: 'XMTP',
        }}
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
