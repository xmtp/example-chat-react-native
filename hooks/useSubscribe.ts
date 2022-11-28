import { useEffect, useState } from 'react';
import client from '../client';
import useGetDeviceIdentifier from './useGetDeviceIdentifier';

export default function useSubscribe(topics: string[] | null) {
  const { installationId } = useGetDeviceIdentifier();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  useEffect(() => {
    if (!topics || !topics.length || !installationId) {
      console.log('No topics');
      return;
    }

    const subscribe = async () => {
      if (loading) {
        return;
      }
      try {
        setLoading(true);
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
