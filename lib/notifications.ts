import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { Client, DecodedMessage } from '@xmtp/xmtp-js';
let xmtp: Client;

export function setClient(client: Client) {
  xmtp = client;
}

async function decryptMessage(
  topic: string,
  message: string,
): Promise<DecodedMessage | null> {
  if (!xmtp) {
    console.log('No XMTP!');
    return null;
  }

  const conversations = await xmtp.conversations.list();
  //   const messageBytes = Uint8Array.from(Buffer.from(message, 'base64'));

  for (const conversation of conversations) {
    if (conversation.topic === topic) {
      return conversation.decodeMessage({
        contentTopic: topic,
        message: message as unknown as any,
      });
    }
  }
  return null;
}

export function setup() {
  const doSetup = async () => {
    messaging().onMessage(async (msg) => {
      console.log('Got a message', msg);
      const data = msg.data;
      if (data?.topic && data?.encryptedMessage) {
        try {
          const decoded = await decryptMessage(
            data.topic,
            data.encryptedMessage,
          );
          if (!decoded) {
            console.log('Could not decode message');
            return null;
          }
          Alert.alert(
            `New message from ${decoded.senderAddress}`,
            decoded?.content,
          );
        } catch (e) {
          console.error(e);
          throw e;
        }
      }
    });
  };

  doSetup();
}
