import React, {useCallback} from 'react';
import {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {ethers, Signer} from 'ethers';
import {Client, Conversation, DecodedMessage, Stream} from '@xmtp/xmtp-js';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';

export const INFURA_API_KEY = '2bf116f1cc724c5ab9eec605ca8440e1';

export const RECIPIENT_ADDRESS = '0x08c0A8f0e49aa245b81b9Fde0be0cD222766DECA';

const Home = () => {
  const [client, setClient] = useState<Client>();
  const [signer, setSigner] = useState<Signer>();
  const [address, setAddress] = useState<string>('');
  const [conversation, setConversation] = useState<Conversation>();
  const [stream, setStream] = useState<Stream<DecodedMessage>>();

  const connector = useWalletConnect();
  const provider = new WalletConnectProvider({
    infuraId: INFURA_API_KEY,
    connector: connector,
  });

  useEffect(() => {
    if (connector?.connected && !signer) {
      const requestSignatures = async () => {
        await provider.enable();
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        const newSigner = ethersProvider.getSigner();
        const newAddress = await newSigner.getAddress();
        setAddress(newAddress);
        setSigner(newSigner);
      };
      requestSignatures();
    } else {
      if (!connector?.connected) {
        return;
      }
      const disconnect = async () => {
        await connector?.killSession();
      };
      disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connector]);

  useEffect(() => {
    const initXmtpClient = async () => {
      if (!signer) {
        return;
      }

      const newAddress = await signer.getAddress();
      setAddress(newAddress);

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

  useEffect(() => {
    if (!client) {
      return;
    }
    const startConversation = async () => {
      console.log('start conversation');
      const newConversation = await client.conversations.newConversation(
        RECIPIENT_ADDRESS,
      );
      console.log('hi conversation: ' + newConversation);
      setConversation(newConversation);
    };
    startConversation();
  }, [client]);

  useEffect(() => {
    if (!conversation) {
      return;
    }
    const closeStream = async () => {
      if (!stream) {
        return;
      }
      await stream.return();
    };
    const streamMessages = async () => {
      closeStream();

      console.log('new convo');
      for await (const page of conversation.messagesPaginated({pageSize: 25})) {
        for (const msg of page) {
          console.log(msg.content);
        }
      }

      // const newStream = await conversation.streamMessages();
      // setStream(newStream);
      // console.log('starting stream');
      // for await (const message of newStream) {
      //   Alert.alert('Message received', message.content);
      // }
    };
    streamMessages();
    return () => {
      closeStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation]);

  const connectWallet = useCallback(async () => {
    await connector?.connect();
  }, [connector]);

  const sendGm = React.useCallback(async () => {
    if (!conversation) {
      return;
    }
    const message = await conversation.send(
      `gm! ${Platform.OS === 'ios' ? 'from iOS' : 'from Android'}`,
    );
    Alert.alert('Message sent', message.content);
  }, [conversation]);

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Example Chat App</Text>
          <Text style={styles.sectionDescription} selectable={true}>
            {client ? address : 'Sign in with XMTP'}
          </Text>
          {client ? (
            <Button title="Send a gm" onPress={sendGm} />
          ) : (
            <Button title="Sign in" onPress={connectWallet} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    marginBottom: 16,
    fontSize: 16,
    fontWeight: '400',
  },
});

export default Home;
