import { Notifications } from './gen/service_connectweb';
import {
  createConnectTransport,
  createPromiseClient,
} from '@bufbuild/connect-web';

const transport = createConnectTransport({
  baseUrl: process.env.API_URL || 'https://notifications.dev.xmtp.network/',
});

// Here we make the client itself, combining the service
// definition with the transport.
const client = createPromiseClient(Notifications, transport);

export default client;
