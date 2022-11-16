import React from 'react';
import {useEffect, useState} from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

// Polyfill necessary xmtp-js libraries for React Native.
// import '../polyfills.js';

import {ethers, Signer} from 'ethers';
import {Client} from '@xmtp/xmtp-js';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  useWalletConnect,
  // withWalletConnect,
} from '@walletconnect/react-native-dapp';
// import {providers} from 'ethers';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import WalletConnectProvider from '@walletconnect/web3-provider';
// import Authenticating from './Authenticating';
import Error from './Error';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {INFURA_API_KEY} from '../App';

const Home = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [address, setAddress] = useState<string>('');
  const [signer, setSigner] = useState<Signer | undefined>(undefined);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  console.log('before');
  const connector = useWalletConnect();
  console.log('after');

  const connectWallet = React.useCallback(async () => {
    console.log('### enable');
    const provider = new WalletConnectProvider({
      infuraId: INFURA_API_KEY,
      connector: connector,
      qrcode: false,
    });
    console.log('### after provider');
    await provider.enable();
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const newSigner = ethersProvider.getSigner() as Signer;
    const newAddress = await newSigner.getAddress();
    setAddress(newAddress);
    setSigner(newSigner);
    await connector.connect();
  }, [connector]);

  const disconnectWallet = React.useCallback(async () => {
    await connector.killSession();
  }, [connector]);

  // const connectWallet = React.useCallback(async () => {
  //   await connector.connect();
  //   const walletConnectProvider = new WalletConnectProvider({
  //     infuraId: INFURA_API_KEY,
  //     chainId: 1,
  //     connector: connector,
  //     qrcode: false,
  //   });
  //   const provider = new providers.Web3Provider(walletConnectProvider);
  //   const newSigner = provider.getSigner() as Signer;
  //   const newAddress = await newSigner.getAddress();
  //   setAddress(newAddress);
  //   setSigner(newSigner);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const {connect} = useConnect({
  //   connector: new WalletConnectConnector({
  //     options: {
  //       qrcode: false,
  //       connector,
  //     },
  //   }),
  // });

  // useEffect(() => {
  //   if (connector?.accounts?.length) {
  //     connect();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [connector]);

  // const {data: signer, isLoading, error} = useSigner();

  // Initialize XMTP client
  useEffect(() => {
    const initXmtpClient = async () => {
      if (!signer) {
        return;
      }

      console.log('signer: ' + signer);
      if (!client) {
        /**
         * Tip: Ethers' random wallet generation is slow in Hermes https://github.com/facebook/hermes/issues/626.
         * If you would like to quickly create a random Wallet for testing, use:
         * import {utils} from @noble/secp256k1;
         * import {Wallet} from ethers;
         * await Client.create(new Wallet(utils.randomPrivateKey()));
         */
        const xmtp = await Client.create(signer);
        setClient(xmtp);
      }
    };
    initXmtpClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signer]);

  // console.log(
  //   'isLoading: ' + isLoading + ' error: ' + error + ' signer: ' + signer,
  // );

  // if (isLoading) {
  //   return <Authenticating />;
  // }

  // if (error) {
  //   return <Error message={error.message} />;
  // }

  // if (!signer) {
  //   return <Error message="Invalid signer" />;
  // }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text style={styles.sectionTitle}>Example Chat App</Text>
          <Text>{address ?? 'Sign in with XMTP'}</Text>
          {signer ? (
            <Button title="Send a gm" onPress={() => sendGm(signer)} />
          ) : (
            <Button title="Sign in" onPress={connectWallet} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

async function sendGm(account: Signer) {
  console.log('creating xmtp client');
  try {
    const xmtp = await Client.create(account);
    const conversation = await xmtp.conversations.newConversation(
      '0x08c0A8f0e49aa245b81b9Fde0be0cD222766DECA',
    );
    const message = await conversation.send(
      `gm! ${Platform.OS === 'ios' ? 'from iOS' : 'from Android'}`,
    );
    console.log('sent message: ' + message.content);
  } catch (error) {
    console.log(`error creating client: ${error}`);
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default Home;
// export default withWalletConnect(Home, {
//   redirectUrl: APP_SCHEME,
//   storageOptions: {
//     // @ts-expect-error: Internal
//     asyncStorage: AsyncStorage,
//   },
// });
