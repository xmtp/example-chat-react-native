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
import {
  WagmiConfig,
  createClient,
  configureChains,
  chain,
  createStorage,
} from 'wagmi';
import {publicProvider} from 'wagmi/providers/public';
import {noopStorage} from '@wagmi/core';
import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';

const APP_SCHEME = 'examplexmtp';

const prefix = Linking.createURL('/', {scheme: APP_SCHEME});

const App = () => {
  const linking = {
    prefixes: [prefix],
  };

  /**
   * Initialize the wagmi client for obtaining signatures.
   * https://wagmi.sh/docs/getting-started
   * https://github.com/wagmi-dev/wagmi/discussions/533
   */
  const {provider, webSocketProvider} = configureChains(
    [chain.mainnet, chain.polygon],
    [publicProvider()],
  );
  const asyncStoragePersistor = createAsyncStoragePersister({
    storage: AsyncStorage,
  });
  const wagmiClient = createClient({
    persister: asyncStoragePersistor,
    storage: createStorage({
      storage: noopStorage,
    }),
    provider,
    webSocketProvider,
  });

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <WagmiConfig client={wagmiClient}>
        <WalletConnectProvider
          redirectUrl={`${APP_SCHEME}://`}
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
      </WagmiConfig>
    </NavigationContainer>
  );
};

export default App;
