import { useEffect, useState } from 'react';
import client from '../lib/client';

export default function useRegister(
  installationId: string | null,
  deviceToken: string | null,
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  useEffect(() => {
    const register = async () => {
      if (loading) {
        return;
      }
      if (!installationId || !deviceToken) {
        console.log(
          'Missing required values to register',
          installationId,
          deviceToken,
        );
        return;
      }
      try {
        setLoading(true);
        console.log('Starting registration');
        await client.registerInstallation(
          {
            installationId,
            deliveryMechanism: {
              deliveryMechanismType: {
                value: deviceToken,
                case: 'firebaseDeviceToken',
              },
            },
          },
          {},
        );
        console.log('Done registration');
        setIsRegistered(true);
      } catch (e) {
        console.error('Registration errors', e);
      } finally {
        setLoading(false);
      }
    };

    register();
  }, [installationId, deviceToken]);

  return {
    loading,
    isRegistered,
  };
}
