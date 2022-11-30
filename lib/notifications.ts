import { Notifications } from './../gen/service_connectweb';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Client, DecodedMessage } from '@xmtp/xmtp-js';
import { decodeKeys, getKeyPointer } from './keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { XMTP_ENV } from '../constants';
import notifee from '@notifee/react-native';

const getClient = async (): Promise<Client | null> => {
  const keyPointer = await getKeyPointer();
  if (!keyPointer) {
    return null;
  }
  const keys = decodeKeys(await AsyncStorage.getItem(keyPointer));
  if (!keys) {
    return null;
  }

  return Client.create(null, { privateKeyOverride: keys, env: XMTP_ENV });
};

const decryptMessage = async (
  xmtp: Client,
  topic: string,
  message: string,
): Promise<DecodedMessage | null> => {
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
};

const postLocalNotification = async (title: string, body: string) => {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  console.log('Displaying a notification', title, body);
  // Display a notification
  await notifee.displayNotification({
    title,
    body,
    android: {
      lightUpScreen: true,
      sound: 'default',
      channelId,
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
};

const handleMessage = async (msg: FirebaseMessagingTypes.RemoteMessage) => {
  const client = await getClient();
  if (!client) {
    console.log('Could not get client');
    return null;
  }
  console.log('Got a message', msg);
  const data = msg.data;
  if (data?.topic && data?.encryptedMessage) {
    try {
      const decoded = await decryptMessage(
        client,
        data.topic,
        data.encryptedMessage,
      );
      if (!decoded) {
        console.log('Could not decode message');
        return null;
      }
      await postLocalNotification(
        `New message from ${decoded.senderAddress}`,
        decoded.content,
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
};

export const setup = () => {
  notifee.onBackgroundEvent(async (ev) => {
    console.log('Background event fired', ev);
  });
  messaging().onMessage((ev) => {
    console.log('Got a message while in the foreground');
  });
  messaging().setBackgroundMessageHandler(handleMessage);
};
