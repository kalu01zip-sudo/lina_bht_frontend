// screens/home/hooks/useHomeScreen.ts
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useHomeData } from '@/hooks/useHomeData';
import { useRouter } from 'expo-router';

export const useHomeScreen = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const {
    homeData,
    isLoading,
    isError,
    refetch,
    updateRoutineStep,
    updateFaceScore, // Changed
    updateHairScore, // Added
    notificationCount,
    completedStepsCount,
    routineProgress,
  } = useHomeData();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  }, [logout]);

  const toggleStepCompletion = useCallback(
    (stepId: string, currentCompleted: boolean) => {
      updateRoutineStep(stepId, !currentCompleted);
    },
    [updateRoutineStep]
  );

  const handleQuickAction = useCallback(
    (actionTitle: string) => {
      console.log(`${actionTitle} pressed`);

      switch (actionTitle) {
        case 'Face Scan':
        case 'Scan Skin':
          router.push('/(flow)/face-scan/camera-scan');
          break;
        case 'Hair & Scalp Scan':
        case 'Scan Hair':
          router.push('/(flow)/hair-scan/camera-scan');
          break;
        case 'Product Scan':
        case 'Scan Product':
          router.push('/(flow)/product-scan/camera-scan');
          break;
        case 'Routine':
        case 'My Routine':
          router.push('/(main)/routines');
          break;
        case 'Lymphatic Massage':
        case 'Lymphatic':
          router.push('/(flow)/lymphatic-massage');
          break;
        case 'Articles':
          router.push('/(flow)/learn-article');
          break;
        default:
          console.log(`Unknown action: ${actionTitle}`);
      }
    },
    [router]
  );

  const handleViewAllRoutines = useCallback(() => {
    console.log('View all routines pressed');
    router.push('/(main)/routines');
  }, [router]);

  const handleInsightPress = useCallback(
    (insightId: string) => {
      console.log(`Insight ${insightId} pressed`);
      // TODO: Navigate to insight details
    },
    [router]
  );

  const handleSkinProgress = useCallback(() => {
    console.log('Skin Progress pressed');
    router.push('/(main)/progress');
  }, [router]);

  return {
    // Data
    homeData,
    isLoading,
    isError,
    notificationCount,
    completedStepsCount,
    routineProgress,

    // Actions
    handleLogout,
    toggleStepCompletion,
    handleQuickAction,
    handleViewAllRoutines,
    handleInsightPress,
    handleSkinProgress,
    refetch,
  };
};
