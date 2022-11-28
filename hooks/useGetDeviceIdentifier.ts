import installations from '@react-native-firebase/installations';
import messaging from '@react-native-firebase/messaging';
import { useEffect, useState } from 'react';

export default function useGetDeviceIdentifier() {
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [installationId, setInstallationId] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      setDeviceToken(token);
    };

    const getInstallation = async () => {
      const id = await installations().getId();
      setInstallationId(id);
    };

    getInstallation();
    getToken();
  });
  return { deviceToken, installationId };
}
