/**
 * Example React Native App using XMTP.
 */
import React from 'react';

// Polyfill necessary xmtp-js libraries for React Native.
import './polyfills.js';

// import {
//   createStorage,
//   WagmiConfig,
//   createClient,
//   configureChains,
//   chain,
// } from 'wagmi';
// import {noopStorage} from '@wagmi/core';
// import {infuraProvider} from 'wagmi/providers/infura';
// import {createAsyncStoragePersister} from '@tanstack/query-async-storage-persister';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './components/Home';
import * as Linking from 'expo-linking';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';

const prefix = Linking.createURL('/');

export const INFURA_API_KEY = '2bf116f1cc724c5ab9eec605ca8440e1';

const App = () => {
  /**
   * Initialize the wagmi client for obtaining signatures.
   * https://wagmi.sh/docs/getting-started
   * https://github.com/wagmi-dev/wagmi/discussions/533
   */
  // const {provider, webSocketProvider} = configureChains(
  //   [chain.mainnet, chain.polygon],
  //   [infuraProvider({infuraId: INFURA_API_KEY})],
  // );
  // const asyncStoragePersistor = createAsyncStoragePersister({
  //   storage: AsyncStorage,
  // });
  // const wagmiClient = createClient({
  //   persister: asyncStoragePersistor,
  //   storage: createStorage({
  //     storage: noopStorage,
  //   }),
  //   provider,
  //   webSocketProvider,
  // });
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
