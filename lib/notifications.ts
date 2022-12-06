import installations from '@react-native-firebase/installations';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Client, Conversation, DecodedMessage } from '@xmtp/xmtp-js';
import { decodeKeys, getKeyPointer } from './keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { XMTP_ENV } from '../constants';
import subscriptionClient from './client';
import notifee from '@notifee/react-native';
import {
  buildUserIntroTopic,
  buildUserInviteTopic,
  //@ts-ignore
} from '@xmtp/xmtp-js/dist/cjs/src/utils';

const conversationMap = new Map<string, Conversation>();
let client: Client;

export const cacheConversations = (convos: Conversation[]) => {
  for (const convo of convos) {
    conversationMap.set(convo.topic, convo);
  }
};

export const cacheClient = (newClient: Client) => {
  client = newClient;
};

const getClient = async (): Promise<Client> => {
  if (client) {
    return client;
  }
  const keyPointer = await getKeyPointer();
  if (!keyPointer) {
    throw new Error('No client found');
  }

  const keys = decodeKeys(await AsyncStorage.getItem(keyPointer));
  if (!keys) {
    throw new Error('No keys found for client');
  }

  client = await Client.create(null, {
    privateKeyOverride: keys,
    env: XMTP_ENV,
  });
  return client;
};

export const updateSubscriptions = async () => {
  const xmtp = await getClient();
  const conversations = await xmtp.conversations.list();
  cacheConversations(conversations);
  const installationId = await installations().getId();
  const convoTopics = conversations.map((convo) => convo.topic);
  const topics = [
    ...convoTopics,
    buildUserIntroTopic(xmtp.address),
    buildUserInviteTopic(xmtp.address),
  ];
  console.log('Subscribing to topics', topics, installationId);
  await subscriptionClient.subscribe(
    {
      installationId,
      topics,
    },
    {},
  );
};

const decryptMessage = async (
  topic: string,
  message: string,
): Promise<DecodedMessage | null> => {
  let convo = conversationMap.get(topic);
  if (!convo) {
    await updateSubscriptions();
    convo = conversationMap.get(topic);
    if (!convo) {
      throw new Error('No conversation found');
    }
  }
  return convo.decodeMessage({
    contentTopic: topic,
    message: message as unknown as any,
  });
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

const isIntroTopic = (topic: string) => topic.startsWith('/xmtp/0/intro-');

const isInviteTopic = (topic: string) => topic.startsWith('/xmtp/0/invite-');

const isConversationUpdate = (topic: string) =>
  !!topic && (isIntroTopic(topic) || isInviteTopic(topic));

const handleMessage = async (msg: FirebaseMessagingTypes.RemoteMessage) => {
  console.log('Got a message', msg);
  const data = msg.data;
  if (data?.topic && data?.encryptedMessage) {
    try {
      if (isConversationUpdate(data.topic)) {
        await updateSubscriptions();
        if (isInviteTopic(data.topic)) {
          return;
        }
      }
      const decoded = await decryptMessage(data.topic, data.encryptedMessage);
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
