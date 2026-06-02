// // components/RevenueCatInitializer.tsx
// import { useEffect } from 'react';
// import { Platform } from 'react-native';
// import Purchases from 'react-native-purchases';
// import { useSelector } from 'react-redux';
// import { selectCurrentUser } from '@/store/slices/authSlice';

// const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
// const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';

// export const RevenueCatInitializer = () => {
//   const currentUser = useSelector(selectCurrentUser);

//   useEffect(() => {
//     const initializeRevenueCat = async () => {
//       try {
//         const apiKey = Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY;

//         if (!apiKey) {
//           console.warn('[RevenueCat] Missing API key for platform:', Platform.OS);
//           return;
//         }

//         await Purchases.configure({ apiKey });
//         console.log('[RevenueCat] Configured successfully');
//       } catch (error) {
//         console.error('[RevenueCat] Configuration error:', error);
//       }
//     };

//     initializeRevenueCat();
//   }, []);

//   useEffect(() => {
//     const loginUser = async () => {
//       if (currentUser?.id) {
//         try {
//           await Purchases.logIn(currentUser.id);
//           console.log('[RevenueCat] User logged in:', currentUser.id);
//         } catch (error) {
//           console.warn('[RevenueCat] Login error:', error);
//         }
//       }
//     };

//     loginUser();
//   }, [currentUser?.id]);

//   return null;
// };

import { useEffect } from 'react';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slices/authSlice';

const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';

let configured = false;

export const RevenueCatInitializer = () => {
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (!configured) {
      const apiKey = Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY;
      if (apiKey) {
        Purchases.configure({ apiKey });
        configured = true;
        console.log('[RevenueCat] ✅ Initialized at app root for', Platform.OS);
      } else {
        console.error(
          '[RevenueCat] ❌ Missing API key — check EXPO_PUBLIC_REVENUECAT_IOS/ANDROID_KEY'
        );
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser?.id && configured) {
      Purchases.logIn(currentUser.id)
        .then(() => console.log('[RevenueCat] 👤 User identified:', currentUser.id))
        .catch((e) => console.warn('[RevenueCat] logIn error:', e));
    }
  }, [currentUser?.id]);

  return null; // renders nothing
};
