// // app/(main)/routines/index.tsx
// import { ScrollView, StyleSheet, Text, View } from 'react-native';
// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import { MoonIcon, PlusIcon, RoutineIcon, SunIcon } from '@/components/icons';
// import { CircularIconButton } from '@/components/buttons/CircularIconButton';
// import { GradientProgressBar } from '@/components/GradientProgressBar';
// import { RoutineStepCard } from '@/components/routines/RoutineStepCard';
// import { RoutineTabBar } from '@/components/routines/RoutineTabButton';
// import { AddRoutineBottomSheet } from '@/components/routines/AddRoutineBottomSheet';
// import { useToast } from '@/hooks/useToast';
// import { useScreenReady } from '@/hooks/useScreenReady';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import ErrorScreen from '@/components/errors/ErrorScreen';
// import { useGetAllRoutinesQuery, useDeleteRoutineStepMutation } from '@/store/api/routineApi';
// import { mapStepToUI, UIRoutineStep } from '@/utils/routineMapper';

// type RoutineType = 'morning' | 'night' | 'weekly';

// // Helper function to extract error message
// const getErrorMessage = (error: any): string => {
//   if (!error) return 'An error occurred';

//   if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
//     return error.data.message as string;
//   }

//   if ('message' in error && typeof error.message === 'string') {
//     return error.message;
//   }

//   if (typeof error === 'string') {
//     return error;
//   }

//   return 'An error occurred';
// };

// const Routines = () => {
//   const [activeRoutine, setActiveRoutine] = useState<RoutineType>('morning');
//   const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
//   const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
//   const { showSuccess, showError } = useToast();

//   // Fetch routines from API
//   const {
//     data: routinesData,
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useGetAllRoutinesQuery(undefined, {
//     refetchOnMountOrArgChange: true,
//   });

//   const [deleteStep] = useDeleteRoutineStepMutation();

//   // Load/save completed state from AsyncStorage (UI-only state)
//   useEffect(() => {
//     loadProgress();
//   }, []);

//   useEffect(() => {
//     saveProgress();
//   }, [completedSteps]);

//   const loadProgress = async () => {
//     try {
//       const saved = await AsyncStorage.getItem('routineProgress');
//       if (saved) {
//         setCompletedSteps(JSON.parse(saved));
//       }
//     } catch (error) {
//       console.error('Error loading progress:', error);
//     }
//   };

//   // Add this after fetching routinesData
//   console.log('Routines Data:', JSON.stringify(routinesData, null, 2));

//   const saveProgress = async () => {
//     try {
//       await AsyncStorage.setItem('routineProgress', JSON.stringify(completedSteps));
//     } catch (error) {
//       console.error('Error saving progress:', error);
//     }
//   };

//   // Screen ready state
//   const { isRendering, isContentReady, renderError } = useScreenReady({
//     dependencies: [routinesData],
//     delay: 100,
//     initialReady: false,
//   });

//   // Filter steps for active tab and sort by phase or creation date
//   const currentSteps: UIRoutineStep[] = useMemo(() => {
//     if (!routinesData?.data) return [];

//     console.log(
//       'All steps:',
//       routinesData.data.map((s) => ({ id: s.id, time: s.time, title: s.product_category }))
//     );

//     const filtered = routinesData.data.filter((step) => {
//       // Make sure time comparison is case-insensitive and handles null/undefined
//       const stepTime = step.time?.toLowerCase() || '';
//       const active = activeRoutine.toLowerCase();
//       const matches = stepTime === active;
//       console.log(`Step time: "${stepTime}", Active: "${active}", Matches: ${matches}`);
//       return matches;
//     });

//     console.log(`Filtered ${filtered.length} steps for ${activeRoutine}`);

//     const phaseOrder = { maintenance: 1, repair: 2, treatment: 3 };
//     const sorted = [...filtered].sort((a, b) => {
//       const orderA = phaseOrder[a.phase as keyof typeof phaseOrder] || 99;
//       const orderB = phaseOrder[b.phase as keyof typeof phaseOrder] || 99;
//       if (orderA !== orderB) return orderA - orderB;

//       const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
//       const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
//       return dateA - dateB;
//     });

//     return sorted.map((step, index) => mapStepToUI(step, index));
//   }, [routinesData, activeRoutine]);

//   // Add this debug log right after the memo
//   useEffect(() => {
//     console.log('Current steps for', activeRoutine, ':', currentSteps.length);
//     console.log('Step details:', currentSteps);
//   }, [currentSteps, activeRoutine]);

//   // Progress calculation
//   const completedCount = currentSteps.filter((step) => completedSteps[step.id] === true).length;
//   const progress = currentSteps.length > 0 ? (completedCount / currentSteps.length) * 100 : 0;

//   const handleToggleStep = async (stepId: string, isCompleted: boolean) => {
//     setCompletedSteps((prev) => ({ ...prev, [stepId]: isCompleted }));
//   };

//   const handleDeleteStep = async (stepId: string) => {
//     try {
//       await deleteStep({ step_id: stepId }).unwrap();
//       showSuccess('Step removed from your routine');
//       refetch();
//     } catch (err) {
//       const errorMessage = getErrorMessage(err);
//       showError(errorMessage);
//     }
//   };

//   // app/(main)/routines/index.tsx - Update handleAddCustomStep
//   const handleAddCustomStep = useCallback(
//     async (data: {
//       productName: string;
//       instructions: string;
//       routineType: string;
//       routineStepId: string;
//     }) => {
//       console.log('Received from bottom sheet:', data);

//       try {
//         // The step is already saved on the backend by the manual routine endpoint
//         // Just refetch to show the new step
//         showSuccess(`"${data.productName}" added to your ${data.routineType} routine`);
//         await refetch();
//         setBottomSheetVisible(false);
//       } catch (err) {
//         console.error('Error refetching routines:', err);
//         showError('Failed to refresh routine list');
//       }
//     },
//     [refetch, showSuccess]
//   );

//   const tabs = [
//     { id: 'morning' as const, label: 'Morning', icon: <SunIcon size={16} color="#8F8377" /> },
//     { id: 'night' as const, label: 'Night', icon: <MoonIcon size={16} color="#8F8377" /> },
//     { id: 'weekly' as const, label: 'Weekly', icon: <RoutineIcon size={16} color="#8F8377" /> },
//   ];

//   // Loading states
//   if (isLoading) {
//     return (
//       <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Loading your routine..." />
//       </SafeAreaView>
//     );
//   }

//   if (isError) {
//     return (
//       <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
//         <CustomHeader
//           title="Your Routine"
//           subtitle="Personalized based on your latest scan."
//           height={80}
//           backButton
//         />
//         <ErrorScreen message={getErrorMessage(error)} onRetry={refetch} />
//       </SafeAreaView>
//     );
//   }

//   if (isRendering) {
//     return (
//       <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Preparing your routine..." />
//       </SafeAreaView>
//     );
//   }

//   if (renderError) {
//     return (
//       <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
//         <CustomHeader
//           title="Your Routine"
//           subtitle="Personalized based on your latest scan."
//           height={80}
//           backButton
//         />
//         <ErrorScreen message={renderError} onRetry={refetch} />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader
//         title="Your Routine"
//         subtitle="Personalized based on your latest scan."
//         height={80}
//         backButton
//         rightIcon={
//           <CircularIconButton
//             size={40}
//             icon={<PlusIcon size={20} color="#361A0D" />}
//             onPress={() => setBottomSheetVisible(true)}
//           />
//         }
//       />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           paddingTop: 10,
//           flexGrow: 1,
//         }}
//         className="flex-1">
//         <View
//           className="px-container"
//           style={{
//             opacity: isContentReady ? 1 : 0,
//             transform: [{ translateY: isContentReady ? 0 : 10 }],
//           }}>
//           <BorderlessShadowCard
//             style={{
//               paddingVertical: 12,
//               paddingHorizontal: 24,
//               alignItems: 'center',
//             }}>
//             <RoutineTabBar tabs={tabs} activeTab={activeRoutine} onTabPress={setActiveRoutine} />
//           </BorderlessShadowCard>

//           <View className="mt-3">
//             <View className="flex-row items-center justify-between">
//               <Text
//                 className="flex-1 text-start font-outfitMedium text-[16px]"
//                 style={{ color: '#361A0D' }}>
//                 {activeRoutine === 'morning'
//                   ? 'Morning'
//                   : activeRoutine === 'night'
//                     ? 'Night'
//                     : 'Weekly'}{' '}
//                 Progress
//               </Text>
//               <Text className="font-outfit text-[14px]" style={{ color: '#2E211799' }}>
//                 {completedCount} of {currentSteps.length} steps
//               </Text>
//             </View>
//             <GradientProgressBar
//               style={{ marginTop: 12 }}
//               progress={progress}
//               gradientStart={{ x: 0, y: 0 }}
//               gradientEnd={{ x: 1, y: 1 }}
//               gradientColors={['#977857', '#B89474', '#7A5D3E']}
//               gradientLocations={[0.25, 0.6036, 0.9571]}
//             />

//             {currentSteps.map((step, index) => {
//               const isStepCompleted = completedSteps[step.id] === true;

//               return (
//                 <RoutineStepCard
//                   style={{ marginTop: index === 0 ? 16 : 12 }}
//                   key={step.id}
//                   stepNumber={step.stepNumber}
//                   title={step.title}
//                   description={step.description}
//                   isCompleted={isStepCompleted}
//                   onToggle={(isCompleted) => handleToggleStep(step.id, isCompleted)}
//                   isFirst={index === 0}
//                   isLast={index === currentSteps.length - 1}
//                   // isCustom={step.isCustom}
//                   routineType={activeRoutine}
//                   stepId={step.id}
//                   onDelete={handleDeleteStep}
//                   productCategory={step.productCategory}
//                 />
//               );
//             })}

//             {currentSteps.length === 0 && (
//               <View className="mt-8 items-center justify-center py-12">
//                 <Text
//                   className="text-center font-outfit text-[14px]"
//                   style={{ color: '#2E211799' }}>
//                   No steps in your {activeRoutine} routine yet.
//                   {'\n'}Tap the + button to add one.
//                 </Text>
//               </View>
//             )}
//           </View>
//         </View>
//       </ScrollView>

//       <AddRoutineBottomSheet
//         visible={bottomSheetVisible}
//         onClose={() => setBottomSheetVisible(false)}
//         onAdd={handleAddCustomStep}
//         initialRoutineType={activeRoutine}
//         isPremium={true}
//       />
//     </SafeAreaView>
//   );
// };

// export default Routines;

// app/(main)/routines/index.tsx
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { MoonIcon, PlusIcon, RoutineIcon, SunIcon } from '@/components/icons';
import { CircularIconButton } from '@/components/buttons/CircularIconButton';
import { GradientProgressBar } from '@/components/GradientProgressBar';
import { RoutineStepCard } from '@/components/routines/RoutineStepCard';
import { RoutineTabBar } from '@/components/routines/RoutineTabButton';
import { AddRoutineBottomSheet } from '@/components/routines/AddRoutineBottomSheet';
import { useToast } from '@/hooks/useToast';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import { useGetAllRoutinesQuery, useDeleteRoutineStepMutation } from '@/store/api/routineApi';
import { mapStepToUI, UIRoutineStep } from '@/utils/routineMapper';
import { RefreshControl } from 'react-native-gesture-handler';

type RoutineType = 'morning' | 'night' | 'weekly';

// Helper function to extract error message
const getErrorMessage = (error: any): string => {
  if (!error) return 'An error occurred';

  if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return error.data.message as string;
  }

  if ('message' in error && typeof error.message === 'string') {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Could not load routines. Pull down to refresh.';
};

const Routines = () => {
  const [activeRoutine, setActiveRoutine] = useState<RoutineType>('morning');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const { showSuccess, showError } = useToast();

  // Fetch routines from API
  const {
    data: routinesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllRoutinesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 0,
  });

  const [deleteStep] = useDeleteRoutineStepMutation();

  // Load/save completed state from AsyncStorage (UI-only state)
  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    saveProgress();
  }, [completedSteps]);

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem('routineProgress');
      if (saved) {
        setCompletedSteps(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async () => {
    try {
      await AsyncStorage.setItem('routineProgress', JSON.stringify(completedSteps));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Screen ready state
  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [routinesData],
    delay: 100,
    initialReady: false,
  });

  // Filter steps for active tab and sort by phase or creation date
  const currentSteps: UIRoutineStep[] = useMemo(() => {
    if (!routinesData?.data || !Array.isArray(routinesData.data)) return [];

    const filtered = routinesData.data.filter((step) => {
      const stepTime = step.time?.toLowerCase() || '';
      const active = activeRoutine.toLowerCase();
      return stepTime === active;
    });

    const phaseOrder = { maintenance: 1, repair: 2, treatment: 3, balance: 1 };
    const sorted = [...filtered].sort((a, b) => {
      const orderA = phaseOrder[a.phase as keyof typeof phaseOrder] || 99;
      const orderB = phaseOrder[b.phase as keyof typeof phaseOrder] || 99;
      if (orderA !== orderB) return orderA - orderB;

      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateA - dateB;
    });

    return sorted.map((step, index) => mapStepToUI(step, index));
  }, [routinesData, activeRoutine]);

  // Progress calculation
  const completedCount = currentSteps.filter((step) => completedSteps[step.id] === true).length;
  const progress = currentSteps.length > 0 ? (completedCount / currentSteps.length) * 100 : 0;

  const handleToggleStep = async (stepId: string, isCompleted: boolean) => {
    setCompletedSteps((prev) => ({ ...prev, [stepId]: isCompleted }));
  };

  const handleDeleteStep = async (stepId: string) => {
    try {
      await deleteStep({ step_id: stepId }).unwrap();
      showSuccess('Step removed from your routine');
      refetch();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showError(errorMessage);
    }
  };

  const handleAddCustomStep = useCallback(
    async (data: {
      productName: string;
      instructions: string;
      routineType: string;
      routineStepId: string;
    }) => {
      console.log('Received from bottom sheet:', data);
      showSuccess(`"${data.productName}" added to your ${data.routineType} routine`);
      await refetch();
      setBottomSheetVisible(false);
    },
    [refetch, showSuccess]
  );

  const tabs = [
    { id: 'morning' as const, label: 'Morning', icon: <SunIcon size={16} color="#8F8377" /> },
    { id: 'night' as const, label: 'Night', icon: <MoonIcon size={16} color="#8F8377" /> },
    { id: 'weekly' as const, label: 'Weekly', icon: <RoutineIcon size={16} color="#8F8377" /> },
  ];

  // Loading states - show loading screen while fetching
  if (isLoading && !routinesData) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading your routine..." />
      </SafeAreaView>
    );
  }

  // Error states - only show error if we have no data and there's an error
  if (isError && !routinesData?.data) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
        <CustomHeader
          title="Your Routine"
          subtitle="Personalized based on your latest scan."
          height={80}
          backButton
        />
        <ErrorScreen message={getErrorMessage(error)} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  if (isRendering) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Preparing your routine..." />
      </SafeAreaView>
    );
  }

  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
        <CustomHeader
          title="Your Routine"
          subtitle="Personalized based on your latest scan."
          height={80}
          backButton
        />
        <ErrorScreen message={renderError} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader
        title="Your Routine"
        subtitle="Personalized based on your latest scan."
        height={80}
        backButton
        rightIcon={
          <CircularIconButton
            size={40}
            icon={<PlusIcon size={20} color="#361A0D" />}
            onPress={() => setBottomSheetVisible(true)}
          />
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 10,
          flexGrow: 1,
        }}
        className="flex-1"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
        <View
          className="px-container"
          style={{
            opacity: isContentReady ? 1 : 0,
            transform: [{ translateY: isContentReady ? 0 : 10 }],
          }}>
          <BorderlessShadowCard
            style={{
              paddingVertical: 12,
              paddingHorizontal: 24,
              alignItems: 'center',
            }}>
            <RoutineTabBar tabs={tabs} activeTab={activeRoutine} onTabPress={setActiveRoutine} />
          </BorderlessShadowCard>

          <View className="mt-3">
            <View className="flex-row items-center justify-between">
              <Text
                className="flex-1 text-start font-outfitMedium text-[16px]"
                style={{ color: '#361A0D' }}>
                {activeRoutine === 'morning'
                  ? 'Morning'
                  : activeRoutine === 'night'
                    ? 'Night'
                    : 'Weekly'}{' '}
                Progress
              </Text>
              <Text className="font-outfit text-[14px]" style={{ color: '#2E211799' }}>
                {completedCount} of {currentSteps.length} steps
              </Text>
            </View>
            <GradientProgressBar
              style={{ marginTop: 12 }}
              progress={progress}
              gradientStart={{ x: 0, y: 0 }}
              gradientEnd={{ x: 1, y: 1 }}
              gradientColors={['#977857', '#B89474', '#7A5D3E']}
              gradientLocations={[0.25, 0.6036, 0.9571]}
            />

            {currentSteps.map((step, index) => {
              const isStepCompleted = completedSteps[step.id] === true;

              return (
                <RoutineStepCard
                  style={{ marginTop: index === 0 ? 16 : 12 }}
                  key={step.id}
                  stepNumber={step.stepNumber}
                  title={step.title}
                  description={step.description}
                  isCompleted={isStepCompleted}
                  onToggle={(isCompleted) => handleToggleStep(step.id, isCompleted)}
                  isFirst={index === 0}
                  isLast={index === currentSteps.length - 1}
                  routineType={activeRoutine}
                  stepId={step.id}
                  onDelete={handleDeleteStep}
                  productCategory={step.productCategory}
                />
              );
            })}

            {currentSteps.length === 0 && (
              <View className="mt-8 items-center justify-center py-12">
                <Text
                  className="text-center font-outfit text-[14px]"
                  style={{ color: '#2E211799' }}>
                  No steps in your {activeRoutine} routine yet.
                  {'\n'}Tap the + button to add one.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <AddRoutineBottomSheet
        visible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        onAdd={handleAddCustomStep}
        initialRoutineType={activeRoutine}
        isPremium={true}
      />
    </SafeAreaView>
  );
};

export default Routines;
