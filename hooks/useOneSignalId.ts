import { useState, useEffect } from 'react';
import { OneSignal } from 'react-native-onesignal';

export const useOneSignalId = () => {
  const [onesignalId, setOnesignalId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const id = await OneSignal.User.pushSubscription.getIdAsync();
        if (id) setOnesignalId(id);
      } catch {
        // Not critical — backend handles null gracefully
      }
    };
    fetch();
  }, []);

  return onesignalId;
};
