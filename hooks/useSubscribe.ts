import { Client } from '@xmtp/xmtp-js';
import { useEffect, useState } from 'react';
import client from '../lib/client';
import { updateSubscriptions } from '../lib/notifications';
import useGetDeviceIdentifier from './useGetDeviceIdentifier';

export default function useSubscribe(client: Client | undefined) {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    if (!client) {
      console.log('No topics');
      return;
    }

    const subscribe = async () => {
      if (loading) {
        return;
      }
      try {
        setLoading(true);
        await updateSubscriptions();
        setIsSubscribed(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    subscribe();
  }, [client]);

  return {
    loading,
    isSubscribed,
  };
}
