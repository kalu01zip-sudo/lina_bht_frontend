// // hooks/useNavigationLogic.ts
// import { useEffect } from 'react';
// import { useRouter, useSegments } from 'expo-router';

// interface NavigationLogicProps {
//   isAppReady: boolean;
//   hasSeenOnboarding: boolean | null;
//   isAuthenticated: boolean;
// }

// export const useNavigationLogic = ({
//   isAppReady,
//   hasSeenOnboarding,
//   isAuthenticated,
// }: NavigationLogicProps) => {
//   const segments = useSegments();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isAppReady) return;

//     const inOnboardingGroup = segments[0] === '(onboarding)';
//     const inAuthGroup = segments[0] === '(auth)';
//     const inQuestionnaireGroup = segments[0] === '(questionnaire)';
//     const inMainGroup = segments[0] === '(main)';
//     const inFlowGroup = segments[0] === '(flow)';

//     // Fix: Properly define these variables
//     const inFaceScanGroup = segments[1] === 'face-scan';
//     const inHairScanGroup = segments[1] === 'hair-scan';
//     const inProductScanGroup = segments[1] === 'product-scan';

//     const FORCE_ONBOARDING = false;

//     if (FORCE_ONBOARDING) {
//       if (!inOnboardingGroup) {
//         router.replace('/(onboarding)');
//       }
//       return;
//     }

//     // ✅ Allow navigation in all scan groups
//     if (inFaceScanGroup || inHairScanGroup || inProductScanGroup) {
//       return;
//     }

//     // ✅ Allow navigation in flow group (camera, loading screens)
//     if (inFlowGroup) {
//       return;
//     }

//     // ✅ Allow navigation in questionnaire group
//     if (inQuestionnaireGroup) {
//       return;
//     }

//     // Navigation rules for main app flow
//     if (!hasSeenOnboarding && !inOnboardingGroup) {
//       router.replace('/(onboarding)');
//     } else if (hasSeenOnboarding && !isAuthenticated && !inAuthGroup) {
//       router.replace('/(auth)/login');
//     } else if (hasSeenOnboarding && isAuthenticated && !inMainGroup) {
//       router.replace('/(main)');
//     } else if (hasSeenOnboarding && isAuthenticated && inAuthGroup) {
//       router.replace('/(main)');
//     } else if (hasSeenOnboarding && !isAuthenticated && inMainGroup) {
//       router.replace('/(auth)/login');
//     }
//   }, [isAppReady, hasSeenOnboarding, isAuthenticated, segments, router]);
// };

// hooks/useNavigationLogic.ts
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NavigationLogicProps {
  isAppReady: boolean;
  hasSeenOnboarding: boolean | null;
  isAuthenticated: boolean;
}

export const useNavigationLogic = ({
  isAppReady,
  hasSeenOnboarding,
  isAuthenticated,
}: NavigationLogicProps) => {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isAppReady) return;

    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inAuthGroup = segments[0] === '(auth)';
    const inQuestionnaireGroup = segments[0] === '(questionnaire)';
    const inMainGroup = segments[0] === '(main)';
    const inFlowGroup = segments[0] === '(flow)';

    const inFaceScanGroup = segments[1] === 'face-scan';
    const inHairScanGroup = segments[1] === 'hair-scan';
    const inProductScanGroup = segments[1] === 'product-scan';

    // Allow navigation in all scan groups
    if (inFaceScanGroup || inHairScanGroup || inProductScanGroup) {
      return;
    }

    // Allow navigation in flow group (camera, loading screens)
    if (inFlowGroup) {
      return;
    }

    // Allow navigation in questionnaire group
    if (inQuestionnaireGroup) {
      return;
    }

    // Check for force onboarding flag (set by DevMenu)
    const checkForceOnboarding = async () => {
      const forceOnboarding = await AsyncStorage.getItem('forceOnboarding');
      if (forceOnboarding === 'true') {
        if (!inOnboardingGroup) {
          // Clear the force flag
          await AsyncStorage.removeItem('forceOnboarding');
          router.replace('/(onboarding)');
        }
        return true;
      }
      return false;
    };

    // Execute force onboarding check synchronously to avoid race conditions
    checkForceOnboarding().then((isForced) => {
      if (isForced) return;

      // Navigation rules for main app flow
      if (!hasSeenOnboarding && !inOnboardingGroup) {
        router.replace('/(onboarding)');
      } else if (hasSeenOnboarding && !isAuthenticated && !inAuthGroup) {
        router.replace('/(auth)/login');
      } else if (hasSeenOnboarding && isAuthenticated && !inMainGroup) {
        router.replace('/(main)');
      } else if (hasSeenOnboarding && isAuthenticated && inAuthGroup) {
        router.replace('/(main)');
      } else if (hasSeenOnboarding && !isAuthenticated && inMainGroup) {
        router.replace('/(auth)/login');
      }
    });
  }, [isAppReady, hasSeenOnboarding, isAuthenticated, segments, router]);
};
