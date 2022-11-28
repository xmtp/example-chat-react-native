import { useEffect, useState } from 'react';
import client from '../client';
import useGetDeviceIdentifier from './useGetDeviceIdentifier';

export default function useSubscribe(topics: string[]) {
  const { installationId } = useGetDeviceIdentifier();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    if (!topics || !topics.length || !installationId) {
      return;
    }

    const subscribe = async () => {
      setLoading(true);
      try {
        await client.subscribe(
          {
            installationId,
            topics,
          },
          {},
        );
        setIsSubscribed(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    subscribe();
  }, [topics, installationId]);

  return {
    loading,
    isSubscribed,
  };
}
