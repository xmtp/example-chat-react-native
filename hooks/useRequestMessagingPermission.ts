import messaging from '@react-native-firebase/messaging';
import { useEffect, useState } from 'react';

export default function useRequestMessagingPermission(): boolean {
  const [enabled, setEnabled] = useState<boolean>(false);
  useEffect(() => {
    const getEnabledStatus = async () => {
      const authStatus = await messaging().requestPermission();
      setEnabled(
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL,
      );
    };

    getEnabledStatus();
  }, []);

  return enabled;
}
