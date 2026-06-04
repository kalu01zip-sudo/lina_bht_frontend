// import { useEffect, useState } from 'react';
// import { OneSignal } from 'react-native-onesignal';
// import type { PushSubscriptionChangedState } from 'react-native-onesignal';

// const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? '';

// let isInitialized = false;

// export const useOneSignal = () => {
//   const [onesignalId, setOnesignalId] = useState<string | null>(null);
//   const [permissionGranted, setPermissionGranted] = useState(false);

//   useEffect(() => {
//     if (isInitialized) {
//       OneSignal.User.pushSubscription.getIdAsync().then((id) => {
//         if (id) setOnesignalId(id);
//       });
//       return;
//     }

//     isInitialized = true;

//     OneSignal.initialize(ONESIGNAL_APP_ID);

//     OneSignal.Notifications.requestPermission(true).then((granted) => {
//       setPermissionGranted(granted);
//     });

//     const fetchId = async () => {
//       try {
//         const id = await OneSignal.User.pushSubscription.getIdAsync();
//         if (id) {
//           setOnesignalId(id);
//         } else {
//           setTimeout(async () => {
//             const retryId = await OneSignal.User.pushSubscription.getIdAsync();
//             if (retryId) setOnesignalId(retryId);
//           }, 2000);
//         }
//       } catch (e) {
//         console.warn('[OneSignal] Failed to get subscription ID:', e);
//       }
//     };

//     fetchId();

//     // ── Store the handler itself, not the return value of addEventListener ──
//     const handleSubscriptionChange = (state: PushSubscriptionChangedState) => {
//       if (state.current?.id) {
//         setOnesignalId(state.current.id);
//       }
//     };

//     OneSignal.User.pushSubscription.addEventListener('change', handleSubscriptionChange);

//     return () => {
//       OneSignal.User.pushSubscription.removeEventListener('change', handleSubscriptionChange);
//     };
//   }, []);

//   return { onesignalId, permissionGranted };
// };

import { useEffect, useState } from 'react';
import { OneSignal } from 'react-native-onesignal';
import type { PushSubscriptionChangedState } from 'react-native-onesignal';

const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? '';

let isInitialized = false;

// Module-level cache — survives re-renders, shared across all hooks
let _cachedId: string | null = null;
const _listeners = new Set<(id: string) => void>();

export const getOneSignalId = (): string | null => _cachedId;

const setOneSignalId = (id: string) => {
  _cachedId = id;
  _listeners.forEach((fn) => fn(id));
};

export const useOneSignal = () => {
  const [onesignalId, setLocalId] = useState<string | null>(_cachedId);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // If already initialized, just read the cached ID
    if (isInitialized) {
      if (_cachedId) {
        setLocalId(_cachedId);
      } else {
        // Still waiting for ID — subscribe to when it resolves
        const unsub = (id: string) => setLocalId(id);
        _listeners.add(unsub);
        return () => {
          _listeners.delete(unsub);
        };
      }
      return;
    }

    isInitialized = true;
    OneSignal.initialize(ONESIGNAL_APP_ID);

    OneSignal.Notifications.requestPermission(true).then((granted) => {
      setPermissionGranted(granted);
    });

    const fetchId = async () => {
      try {
        const id = await OneSignal.User.pushSubscription.getIdAsync();
        if (id) {
          setOneSignalId(id);
          setLocalId(id);
        } else {
          // Retry once after 2s — covers slow first-registration
          setTimeout(async () => {
            try {
              const retryId = await OneSignal.User.pushSubscription.getIdAsync();
              if (retryId) {
                setOneSignalId(retryId);
                setLocalId(retryId);
              }
            } catch {}
          }, 2000);
        }
      } catch (e) {
        console.warn('[OneSignal] Failed to get subscription ID:', e);
      }
    };

    fetchId();

    const handleSubscriptionChange = (state: PushSubscriptionChangedState) => {
      if (state.current?.id) {
        setOneSignalId(state.current.id);
        setLocalId(state.current.id);
      }
    };
    // ---
    OneSignal.Notifications.requestPermission(true).then((granted) => {
      console.log('[OneSignal] Permission granted:', granted);
      setPermissionGranted(granted);
    });

    // Also check current permission state
    OneSignal.Notifications.getPermissionAsync().then((permission) => {
      console.log('[OneSignal] Current permission state:', permission);
    });
    // --------

    OneSignal.User.pushSubscription.addEventListener('change', handleSubscriptionChange);
    return () => {
      OneSignal.User.pushSubscription.removeEventListener('change', handleSubscriptionChange);
    };
  }, []);

  return { onesignalId, permissionGranted };
};
