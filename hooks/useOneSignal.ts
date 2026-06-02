// import { useEffect, useRef, useState } from 'react';
// import { OneSignal, LogLevel } from 'react-native-onesignal';
// import { Platform } from 'react-native';

// const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? '';

// let isInitialized = false;

// export const useOneSignal = () => {
//   const [onesignalId, setOnesignalId] = useState<string | null>(null);
//   const [permissionGranted, setPermissionGranted] = useState(false);

//   useEffect(() => {
//     if (isInitialized) {
//       // Already initialized — just fetch current subscription ID
//       OneSignal.User.pushSubscription.getIdAsync().then((id) => {
//         if (id) setOnesignalId(id);
//       });
//       return;
//     }

//     isInitialized = true;

//     // OneSignal.Debug.setLogLevel(LogLevel.Verbose); // uncomment for debugging

//     OneSignal.initialize(ONESIGNAL_APP_ID);

//     // Request permission (iOS shows native prompt, Android 13+ also needs this)
//     OneSignal.Notifications.requestPermission(true).then((granted) => {
//       setPermissionGranted(granted);
//     });

//     // Get subscription ID once available
//     const fetchId = async () => {
//       try {
//         const id = await OneSignal.User.pushSubscription.getIdAsync();
//         if (id) {
//           setOnesignalId(id);
//         } else {
//           // Retry after a short delay — ID may not be ready immediately
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

//     // Listen for subscription changes (e.g. user grants permission later)
//     const listener = OneSignal.User.pushSubscription.addEventListener('change', (subscription) => {
//       if (subscription.current?.id) {
//         setOnesignalId(subscription.current.id);
//       }
//     });

//     return () => {
//       OneSignal.User.pushSubscription.removeEventListener('change', listener);
//     };
//   }, []);

//   return { onesignalId, permissionGranted };
// };

import { useEffect, useState } from 'react';
import { OneSignal } from 'react-native-onesignal';
import type { PushSubscriptionChangedState } from 'react-native-onesignal';

const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? '';

let isInitialized = false;

export const useOneSignal = () => {
  const [onesignalId, setOnesignalId] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      OneSignal.User.pushSubscription.getIdAsync().then((id) => {
        if (id) setOnesignalId(id);
      });
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
          setOnesignalId(id);
        } else {
          setTimeout(async () => {
            const retryId = await OneSignal.User.pushSubscription.getIdAsync();
            if (retryId) setOnesignalId(retryId);
          }, 2000);
        }
      } catch (e) {
        console.warn('[OneSignal] Failed to get subscription ID:', e);
      }
    };

    fetchId();

    // ── Store the handler itself, not the return value of addEventListener ──
    const handleSubscriptionChange = (state: PushSubscriptionChangedState) => {
      if (state.current?.id) {
        setOnesignalId(state.current.id);
      }
    };

    OneSignal.User.pushSubscription.addEventListener('change', handleSubscriptionChange);

    return () => {
      OneSignal.User.pushSubscription.removeEventListener('change', handleSubscriptionChange);
    };
  }, []);

  return { onesignalId, permissionGranted };
};
