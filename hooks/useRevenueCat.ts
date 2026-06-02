// import { useEffect, useState, useCallback } from 'react';
// import { Platform } from 'react-native';
// import Purchases, {
//   LOG_LEVEL,
//   PurchasesPackage,
//   CustomerInfo,
//   PURCHASES_ERROR_CODE,
// } from 'react-native-purchases';
// import { useSyncSubscriptionMutation } from '@/store/api/subscriptionApi';

// const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
// const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';

// // Match these to your RevenueCat entitlement identifier
// export const ENTITLEMENT_ID = 'premium';

// export type PackageType = 'monthly' | 'yearly';

// export interface RevenueCatState {
//   isReady: boolean;
//   isPremium: boolean;
//   isTrial: boolean;
//   packages: PurchasesPackage[];
//   monthlyPackage: PurchasesPackage | null;
//   yearlyPackage: PurchasesPackage | null;
//   customerInfo: CustomerInfo | null;
//   isLoading: boolean;
//   error: string | null;
// }

// let isInitialized = false;

// export const useRevenueCat = (userId?: string) => {
//   const [state, setState] = useState<RevenueCatState>({
//     isReady: false,
//     isPremium: false,
//     isTrial: false,
//     packages: [],
//     monthlyPackage: null,
//     yearlyPackage: null,
//     customerInfo: null,
//     isLoading: true,
//     error: null,
//   });

//   const [syncSubscription] = useSyncSubscriptionMutation();

//   // ── Initialize RevenueCat ────────────────────────────────────────────────
//   useEffect(() => {
//     const init = async () => {
//       try {
//         if (!isInitialized) {
//           // Purchases.setLogLevel(LOG_LEVEL.DEBUG); // uncomment for debugging

//           const apiKey = Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY;
//           Purchases.configure({ apiKey });
//           isInitialized = true;
//         }

//         // Identify user so purchases are tied to their account
//         if (userId) {
//           await Purchases.logIn(userId);
//         }

//         // Load offerings and customer info in parallel
//         const [offerings, customerInfo] = await Promise.all([
//           Purchases.getOfferings(),
//           Purchases.getCustomerInfo(),
//         ]);

//         const current = offerings.current;
//         const packages = current?.availablePackages ?? [];

//         // Find monthly and yearly packages — adjust identifiers to match
//         // your RevenueCat offering package identifiers
//         const monthlyPackage =
//           packages.find(
//             (p) => p.packageType === 'MONTHLY' || p.identifier.toLowerCase().includes('monthly')
//           ) ?? null;

//         const yearlyPackage =
//           packages.find(
//             (p) =>
//               p.packageType === 'ANNUAL' ||
//               p.identifier.toLowerCase().includes('yearly') ||
//               p.identifier.toLowerCase().includes('annual')
//           ) ?? null;

//         const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

//         const isTrial = customerInfo.entitlements.active[ENTITLEMENT_ID]?.periodType === 'TRIAL';

//         setState({
//           isReady: true,
//           isPremium,
//           isTrial,
//           packages,
//           monthlyPackage,
//           yearlyPackage,
//           customerInfo,
//           isLoading: false,
//           error: null,
//         });
//       } catch (e: any) {
//         console.warn('[RevenueCat] Init error:', e);
//         setState((prev) => ({
//           ...prev,
//           isReady: true,
//           isLoading: false,
//           error: e?.message ?? 'Failed to load subscription info.',
//         }));
//       }
//     };

//     init();
//   }, [userId]);

//   // ── Purchase a package ───────────────────────────────────────────────────
//   const purchasePackage = useCallback(
//     async (pkg: PurchasesPackage, planType: PackageType): Promise<boolean> => {
//       setState((prev) => ({ ...prev, isLoading: true, error: null }));

//       try {
//         const { customerInfo } = await Purchases.purchasePackage(pkg);

//         const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

//         const isTrial = customerInfo.entitlements.active[ENTITLEMENT_ID]?.periodType === 'TRIAL';

//         setState((prev) => ({
//           ...prev,
//           isPremium,
//           isTrial,
//           customerInfo,
//           isLoading: false,
//         }));

//         // Sync to your backend after successful purchase
//         if (isPremium) {
//           const transaction = customerInfo.entitlements.active[ENTITLEMENT_ID]?.latestPurchaseDate;

//           await syncSubscription({
//             platform: Platform.OS === 'ios' ? 'ios' : 'android',
//             product_id: pkg.product.identifier,
//             transaction_id:
//               customerInfo.entitlements.active[ENTITLEMENT_ID]?.originalPurchaseDate ??
//               Date.now().toString(),
//             plan_type: planType,
//           }).unwrap();
//         }

//         return isPremium;
//       } catch (e: any) {
//         // User cancelled — not an error
//         if (e?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
//           setState((prev) => ({ ...prev, isLoading: false }));
//           return false;
//         }

//         console.warn('[RevenueCat] Purchase error:', e);
//         setState((prev) => ({
//           ...prev,
//           isLoading: false,
//           error: e?.message ?? 'Purchase failed. Please try again.',
//         }));
//         return false;
//       }
//     },
//     [syncSubscription]
//   );

//   // ── Restore purchases ────────────────────────────────────────────────────
//   const restorePurchases = useCallback(async (): Promise<boolean> => {
//     setState((prev) => ({ ...prev, isLoading: true, error: null }));

//     try {
//       const customerInfo = await Purchases.restorePurchases();
//       const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

//       setState((prev) => ({
//         ...prev,
//         isPremium,
//         customerInfo,
//         isLoading: false,
//       }));

//       return isPremium;
//     } catch (e: any) {
//       console.warn('[RevenueCat] Restore error:', e);
//       setState((prev) => ({
//         ...prev,
//         isLoading: false,
//         error: e?.message ?? 'Restore failed. Please try again.',
//       }));
//       return false;
//     }
//   }, []);

//   return {
//     ...state,
//     purchasePackage,
//     restorePurchases,
//   };
// };
import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  PURCHASES_ERROR_CODE,
} from 'react-native-purchases';
import { store } from '@/store/store';
import { subscriptionApi } from '@/store/api/subscriptionApi';

const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? '';
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? '';

// ── Match EXACTLY to your RevenueCat dashboard entitlement identifier ─────────
// Dashboard → Entitlements → copy the identifier string exactly
export const ENTITLEMENT_ID = 'gixy Pro';

export type PackageType = 'monthly' | 'yearly';

let isInitialized = false;

export const useRevenueCat = (userId?: string) => {
  const [state, setState] = useState({
    isReady: false,
    isPremium: false,
    isTrial: false,
    packages: [] as PurchasesPackage[],
    monthlyPackage: null as PurchasesPackage | null,
    yearlyPackage: null as PurchasesPackage | null,
    customerInfo: null as CustomerInfo | null,
    isLoading: true,
    error: null as string | null,
  });

  // ── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        if (!isInitialized) {
          const apiKey = Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY;

          if (!apiKey) {
            console.error('[RevenueCat] ❌ API key is missing! Check your .env file.');
            setState((prev) => ({
              ...prev,
              isReady: true,
              isLoading: false,
              error: 'RevenueCat not configured.',
            }));
            return;
          }

          Purchases.configure({ apiKey });
          console.log('[RevenueCat] ✅ Configured for', Platform.OS);
          isInitialized = true;
        }

        if (userId) {
          const loginResult = await Purchases.logIn(userId);
          console.log('[RevenueCat] 👤 Logged in user:', userId);
          console.log('[RevenueCat] Is new user:', loginResult.created);
        }

        const [offerings, customerInfo] = await Promise.all([
          Purchases.getOfferings(),
          Purchases.getCustomerInfo(),
        ]);

        // ── Debug offerings ────────────────────────────────────────────────
        console.log('[RevenueCat] 📦 Current offering:', offerings.current?.identifier);
        console.log(
          '[RevenueCat] 📦 Available packages:',
          offerings.current?.availablePackages.map((p) => ({
            id: p.identifier,
            type: p.packageType,
            product: p.product.identifier,
            price: p.product.priceString,
          }))
        );

        // ── Debug customer info ────────────────────────────────────────────
        console.log(
          '[RevenueCat] 🔑 Active entitlements:',
          Object.keys(customerInfo.entitlements.active)
        );
        console.log('[RevenueCat] 🔑 Looking for entitlement:', `"${ENTITLEMENT_ID}"`);

        const packages = offerings.current?.availablePackages ?? [];

        const monthlyPackage =
          packages.find(
            (p) => p.packageType === 'MONTHLY' || p.identifier.toLowerCase().includes('monthly')
          ) ?? null;

        const yearlyPackage =
          packages.find(
            (p) =>
              p.packageType === 'ANNUAL' ||
              p.identifier.toLowerCase().includes('yearly') ||
              p.identifier.toLowerCase().includes('annual')
          ) ?? null;

        console.log('[RevenueCat] 📅 Monthly package:', monthlyPackage?.identifier ?? 'NOT FOUND');
        console.log('[RevenueCat] 📅 Yearly package:', yearlyPackage?.identifier ?? 'NOT FOUND');

        const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
        const isTrial = customerInfo.entitlements.active[ENTITLEMENT_ID]?.periodType === 'TRIAL';

        console.log('[RevenueCat] 💎 isPremium:', isPremium, '| isTrial:', isTrial);

        setState({
          isReady: true,
          isPremium,
          isTrial,
          packages,
          monthlyPackage,
          yearlyPackage,
          customerInfo,
          isLoading: false,
          error: null,
        });
      } catch (e: any) {
        console.error('[RevenueCat] ❌ Init error:', e?.message ?? e);
        console.error('[RevenueCat] ❌ Error code:', e?.code);
        setState((prev) => ({
          ...prev,
          isReady: true,
          isLoading: false,
          error: e?.message ?? 'Failed to load subscription info.',
        }));
      }
    };

    init();
  }, [userId]);

  // ── Purchase ───────────────────────────────────────────────────────────────
  const purchasePackage = useCallback(
    async (pkg: PurchasesPackage, planType: PackageType): Promise<boolean> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        console.log('[RevenueCat] 🛒 Purchasing package:', pkg.identifier);
        const { customerInfo } = await Purchases.purchasePackage(pkg);

        const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
        const isTrial = customerInfo.entitlements.active[ENTITLEMENT_ID]?.periodType === 'TRIAL';

        console.log('[RevenueCat] ✅ Purchase complete. isPremium:', isPremium);
        console.log(
          '[RevenueCat] 🔑 Active entitlements after purchase:',
          Object.keys(customerInfo.entitlements.active)
        );

        setState((prev) => ({
          ...prev,
          isPremium,
          isTrial,
          customerInfo,
          isLoading: false,
        }));

        if (isPremium) {
          // ── Invalidate subscription status so the app refetches from backend ──
          // RevenueCat's webhook will update your backend; we just need to
          // refetch the status to reflect the new state in the UI.
          // Add a small delay to give RevenueCat time to fire the webhook first.
          setTimeout(() => {
            store.dispatch(
              subscriptionApi.util.invalidateTags([{ type: 'Subscription', id: 'STATUS' }])
            );
            console.log('[RevenueCat] 🔄 Invalidated subscription status cache');
          }, 3000);
        }

        return isPremium;
      } catch (e: any) {
        if (e?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
          console.log('[RevenueCat] 🚫 Purchase cancelled by user');
          setState((prev) => ({ ...prev, isLoading: false }));
          return false;
        }

        console.error('[RevenueCat] ❌ Purchase error:', e?.message ?? e);
        console.error('[RevenueCat] ❌ Error code:', e?.code);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: e?.message ?? 'Purchase failed. Please try again.',
        }));
        return false;
      }
    },
    []
  );

  // ── Restore ────────────────────────────────────────────────────────────────
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('[RevenueCat] 🔄 Restoring purchases...');
      const customerInfo = await Purchases.restorePurchases();

      const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

      console.log('[RevenueCat] ✅ Restore complete. isPremium:', isPremium);
      console.log(
        '[RevenueCat] 🔑 Active entitlements after restore:',
        Object.keys(customerInfo.entitlements.active)
      );

      setState((prev) => ({
        ...prev,
        isPremium,
        customerInfo,
        isLoading: false,
      }));

      if (isPremium) {
        setTimeout(() => {
          store.dispatch(
            subscriptionApi.util.invalidateTags([{ type: 'Subscription', id: 'STATUS' }])
          );
        }, 3000);
      }

      return isPremium;
    } catch (e: any) {
      console.error('[RevenueCat] ❌ Restore error:', e?.message ?? e);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: e?.message ?? 'Restore failed. Please try again.',
      }));
      return false;
    }
  }, []);

  return {
    ...state,
    purchasePackage,
    restorePurchases,
  };
};
