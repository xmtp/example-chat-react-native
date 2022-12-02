/**
 * Example React Native App using XMTP.
 */
import React, {memo} from 'react';

// Polyfill necessary xmtp-js libraries for React Native.
import './polyfills.js';

import Home from './components/Home';
import * as Linking from 'expo-linking';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import WalletConnectProvider, {
  QrcodeModal,
  RenderQrcodeModalProps,
} from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_SCHEME = 'examplexmtp';

const prefix = Linking.createURL('/', {scheme: APP_SCHEME});

const App = () => {
  const linking = {
    prefixes: [prefix],
  };

  const QRCodeComponent = (props: RenderQrcodeModalProps) => {
    if (!props.visible) {
      return null;
    }
    return <QrcodeModal division={4} {...props} />;
  };
  const QRCodeModal = memo(QRCodeComponent);

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <WalletConnectProvider
        redirectUrl={`${APP_SCHEME}://`}
        bridge="https://bridge.walletconnect.org"
        renderQrcodeModal={props => <QRCodeModal {...props} />}
        clientMeta={{
          description: 'Sign in with XMTP',
          url: 'https://xmtp.org',
          icons: ['https://avatars.githubusercontent.com/u/82580170'],
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
