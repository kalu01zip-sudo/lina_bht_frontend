// import { useState, useEffect } from 'react';
// import { OneSignal } from 'react-native-onesignal';

// export const useOneSignalId = () => {
//   const [onesignalId, setOnesignalId] = useState<string | null>(null);

//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const id = await OneSignal.User.pushSubscription.getIdAsync();
//         if (id) setOnesignalId(id);
//       } catch {
//         // Not critical — backend handles null gracefully
//       }
//     };
//     fetch();
//   }, []);

//   return onesignalId;
// };

import { useState, useEffect } from 'react';
import { getOneSignalId } from './useOneSignal';
import { OneSignal } from 'react-native-onesignal';
import type { PushSubscriptionChangedState } from 'react-native-onesignal';

export const useOneSignalId = (): string | null => {
  // Initialize from cache synchronously — if useOneSignal already resolved,
  // this returns the ID immediately on first render (no null flash)
  const [onesignalId, setOnesignalId] = useState<string | null>(getOneSignalId);

  useEffect(() => {
    // If already cached, nothing to do
    if (onesignalId) return;

    // Not cached yet — listen for the subscription change event
    // This fires when OneSignal registers the device for the first time
    const handler = (state: PushSubscriptionChangedState) => {
      if (state.current?.id) setOnesignalId(state.current.id);
    };
    OneSignal.User.pushSubscription.addEventListener('change', handler);
    return () => {
      OneSignal.User.pushSubscription.removeEventListener('change', handler);
    };
  }, [onesignalId]);

  return onesignalId;
};
