// // app/(main)/routines/index.tsx
// import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
// import React, { useState, useEffect } from 'react';
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
// import { routineSteps, getInitialCompletedSteps } from '@/constants/routineData';
// import { useToast } from '@/hooks/useToast';
// import { useScreenReady } from '@/hooks/useScreenReady';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import ErrorScreen from '@/components/errors/ErrorScreen';

// type RoutineType = 'morning' | 'night' | 'weekly';

// const Routines = () => {
//   const [activeRoutine, setActiveRoutine] = useState<RoutineType>('morning');
//   const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
//   const [isDataLoading, setIsDataLoading] = useState(true);
//   const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
//   const [customSteps, setCustomSteps] = useState<Record<string, any[]>>({});
//   const [isPremium, setIsPremium] = useState(true); // Fetch from user data
//   const { showSuccess, showError, showWarning, showInfo } = useToast();

//   // Screen ready state for smooth transitions (only for initial render)
//   const { isRendering, isContentReady, renderError } = useScreenReady({
//     dependencies: [],
//     delay: 100,
//     initialReady: false,
//   });

//   // Load saved progress and custom steps
//   useEffect(() => {
//     loadProgress();
//     loadCustomSteps();
//   }, []);

//   // Save progress whenever it changes (but not on initial load)
//   useEffect(() => {
//     if (!isDataLoading) {
//       saveProgress();
//     }
//   }, [completedSteps]);

//   // Save custom steps (but not on initial load)
//   useEffect(() => {
//     if (!isDataLoading) {
//       saveCustomSteps();
//     }
//   }, [customSteps]);

//   const loadProgress = async () => {
//     try {
//       const saved = await AsyncStorage.getItem('routineProgress');
//       if (saved) {
//         setCompletedSteps(JSON.parse(saved));
//       } else {
//         const initialSteps = getInitialCompletedSteps();
//         setCompletedSteps(initialSteps);
//       }
//     } catch (error) {
//       console.error('Error loading progress:', error);
//       const initialSteps = getInitialCompletedSteps();
//       setCompletedSteps(initialSteps);
//     }
//   };

//   const saveProgress = async () => {
//     try {
//       await AsyncStorage.setItem('routineProgress', JSON.stringify(completedSteps));
//     } catch (error) {
//       console.error('Error saving progress:', error);
//     }
//   };

//   const loadCustomSteps = async () => {
//     try {
//       const saved = await AsyncStorage.getItem('customRoutineSteps');
//       if (saved) {
//         setCustomSteps(JSON.parse(saved));
//       } else {
//         setCustomSteps({ morning: [], night: [], weekly: [] });
//       }
//     } catch (error) {
//       console.error('Error loading custom steps:', error);
//       setCustomSteps({ morning: [], night: [], weekly: [] });
//     } finally {
//       setIsDataLoading(false);
//     }
//   };

//   const saveCustomSteps = async () => {
//     try {
//       await AsyncStorage.setItem('customRoutineSteps', JSON.stringify(customSteps));
//     } catch (error) {
//       console.error('Error saving custom steps:', error);
//     }
//   };

//   const handleToggleStep = (stepIndex: number, isCompleted: boolean, isCustom: boolean = false) => {
//     const prefix = isCustom ? `${activeRoutine}_custom_` : `${activeRoutine}_`;
//     const key = `${prefix}${stepIndex}`;
//     setCompletedSteps((prev) => ({ ...prev, [key]: isCompleted }));
//   };

//   const handleAddCustomStep = (data: {
//     productName: string;
//     instructions: string;
//     routineType: string;
//   }) => {
//     const newStep = {
//       stepNumber:
//         (routineSteps[data.routineType as RoutineType]?.length || 0) +
//         (customSteps[data.routineType]?.length || 0) +
//         1,
//       title: data.productName,
//       description: data.instructions || 'No instructions provided',
//       isCustom: true,
//     };

//     setCustomSteps((prev) => ({
//       ...prev,
//       [data.routineType]: [...(prev[data.routineType] || []), newStep],
//     }));

//     showSuccess(
//       `"${data.productName}" has been added to your ${data.routineType} routine.`,
//       'Success!'
//     );
//   };

//   const currentSteps = [
//     ...(routineSteps[activeRoutine] || []),
//     ...(customSteps[activeRoutine] || []),
//   ];

//   // Calculate completed count including custom steps
//   const completedCount = currentSteps.filter((_, index) => {
//     const isCustom = (customSteps[activeRoutine] || []).some(
//       (_, customIndex) => customIndex === index - (routineSteps[activeRoutine]?.length || 0)
//     );
//     const prefix = isCustom ? `${activeRoutine}_custom_` : `${activeRoutine}_`;
//     const key = `${prefix}${isCustom ? index - (routineSteps[activeRoutine]?.length || 0) : index}`;
//     return completedSteps[key] === true;
//   }).length;

//   const progress = currentSteps.length > 0 ? (completedCount / currentSteps.length) * 100 : 0;

//   const tabs = [
//     {
//       id: 'morning' as const,
//       label: 'Morning',
//       icon: <SunIcon size={16} color={activeRoutine === 'morning' ? '#7A8B6A' : '#8F8377'} />,
//     },
//     {
//       id: 'night' as const,
//       label: 'Night',
//       icon: <MoonIcon size={16} color={activeRoutine === 'night' ? '#7A8B6A' : '#8F8377'} />,
//     },
//     {
//       id: 'weekly' as const,
//       label: 'Weekly',
//       icon: <RoutineIcon size={16} color={activeRoutine === 'weekly' ? '#7A8B6A' : '#8F8377'} />,
//     },
//   ];

//   const handleRetry = () => {
//     setIsDataLoading(true);
//     loadProgress();
//     loadCustomSteps();
//   };

//   // Show initial render loading (useScreenReady) - wrapped in SafeAreaView
//   if (isRendering) {
//     return (
//       <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Preparing your routine..." />
//       </SafeAreaView>
//     );
//   }

//   // Show error if rendering failed
//   if (renderError) {
//     return (
//       <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
//         <CustomHeader
//           title="Your Routine"
//           subtitle="Personalized based on your latest scan."
//           height={80}
//           backButton
//         />
//         <ErrorScreen message={renderError} onRetry={handleRetry} />
//       </SafeAreaView>
//     );
//   }

//   // Show data loading state (from AsyncStorage) - wrapped in SafeAreaView
//   if (isDataLoading) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Loading your routine data..." />
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
//           {/* Tab Buttons Card */}
//           <BorderlessShadowCard
//             style={{
//               paddingVertical: 12,
//               paddingHorizontal: 24,
//               alignItems: 'center',
//             }}>
//             <RoutineTabBar tabs={tabs} activeTab={activeRoutine} onTabPress={setActiveRoutine} />
//           </BorderlessShadowCard>

//           {/* Daily Progress Section */}
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

//             {/* Routine Steps */}
//             {currentSteps.map((step, index) => {
//               const isCustom = (customSteps[activeRoutine] || []).some(
//                 (_, customIndex) =>
//                   customIndex === index - (routineSteps[activeRoutine]?.length || 0)
//               );
//               const prefix = isCustom ? `${activeRoutine}_custom_` : `${activeRoutine}_`;
//               const stepIndex = isCustom
//                 ? index - (routineSteps[activeRoutine]?.length || 0)
//                 : index;
//               const key = `${prefix}${stepIndex}`;
//               const isStepCompleted = completedSteps[key] === true;

//               return (
//                 <RoutineStepCard
//                   style={{ marginTop: index === 0 ? 16 : 12 }}
//                   key={`${activeRoutine}_${index}`}
//                   stepNumber={step.stepNumber}
//                   title={step.title}
//                   description={step.description}
//                   isCompleted={isStepCompleted}
//                   onToggle={(isCompleted) => handleToggleStep(stepIndex, isCompleted, isCustom)}
//                   isFirst={index === 0}
//                   isLast={index === currentSteps.length - 1}
//                   isCustom={isCustom}
//                 />
//               );
//             })}
//           </View>
//         </View>
//       </ScrollView>

//       {/* Add Routine Bottom Sheet */}
//       <AddRoutineBottomSheet
//         visible={bottomSheetVisible}
//         onClose={() => setBottomSheetVisible(false)}
//         onAdd={handleAddCustomStep}
//         initialRoutineType={activeRoutine}
//         isPremium={isPremium}
//       />
//     </SafeAreaView>
//   );
// };

// export default Routines;

// const styles = StyleSheet.create({});

// app/(main)/routines/index.tsx
import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
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
import { routineSteps, getInitialCompletedSteps } from '@/constants/routineData';
import { useToast } from '@/hooks/useToast';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';

type RoutineType = 'morning' | 'night' | 'weekly';

const Routines = () => {
  const [activeRoutine, setActiveRoutine] = useState<RoutineType>('morning');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [customSteps, setCustomSteps] = useState<Record<string, any[]>>({});
  const [isPremium, setIsPremium] = useState(true); // Fetch from user data
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  // Screen ready state for smooth transitions (only for initial render)
  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  // Load saved progress and custom steps
  useEffect(() => {
    loadProgress();
    loadCustomSteps();
  }, []);

  // Save progress whenever it changes (but not on initial load)
  useEffect(() => {
    if (!isDataLoading) {
      saveProgress();
    }
  }, [completedSteps]);

  // Save custom steps (but not on initial load)
  useEffect(() => {
    if (!isDataLoading) {
      saveCustomSteps();
    }
  }, [customSteps]);

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem('routineProgress');
      if (saved) {
        setCompletedSteps(JSON.parse(saved));
      } else {
        const initialSteps = getInitialCompletedSteps();
        setCompletedSteps(initialSteps);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      const initialSteps = getInitialCompletedSteps();
      setCompletedSteps(initialSteps);
    }
  };

  const saveProgress = async () => {
    try {
      await AsyncStorage.setItem('routineProgress', JSON.stringify(completedSteps));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const loadCustomSteps = async () => {
    try {
      const saved = await AsyncStorage.getItem('customRoutineSteps');
      if (saved) {
        setCustomSteps(JSON.parse(saved));
      } else {
        setCustomSteps({ morning: [], night: [], weekly: [] });
      }
    } catch (error) {
      console.error('Error loading custom steps:', error);
      setCustomSteps({ morning: [], night: [], weekly: [] });
    } finally {
      setIsDataLoading(false);
    }
  };

  const saveCustomSteps = async () => {
    try {
      await AsyncStorage.setItem('customRoutineSteps', JSON.stringify(customSteps));
    } catch (error) {
      console.error('Error saving custom steps:', error);
    }
  };

  const handleToggleStep = (stepIndex: number, isCompleted: boolean, isCustom: boolean = false) => {
    const prefix = isCustom ? `${activeRoutine}_custom_` : `${activeRoutine}_`;
    const key = `${prefix}${stepIndex}`;
    setCompletedSteps((prev) => ({ ...prev, [key]: isCompleted }));
  };

  const handleAddCustomStep = (data: {
    productName: string;
    instructions: string;
    routineType: string;
  }) => {
    const newStep = {
      stepNumber:
        (routineSteps[data.routineType as RoutineType]?.length || 0) +
        (customSteps[data.routineType]?.length || 0) +
        1,
      title: data.productName,
      description: data.instructions || 'No instructions provided',
      isCustom: true,
    };

    setCustomSteps((prev) => ({
      ...prev,
      [data.routineType]: [...(prev[data.routineType] || []), newStep],
    }));

    showSuccess(
      `"${data.productName}" has been added to your ${data.routineType} routine.`,
      'Success!'
    );
  };

  const currentSteps = [
    ...(routineSteps[activeRoutine] || []),
    ...(customSteps[activeRoutine] || []),
  ];

  // Calculate completed count including custom steps
  const completedCount = currentSteps.filter((_, index) => {
    const isCustom = (customSteps[activeRoutine] || []).some(
      (_, customIndex) => customIndex === index - (routineSteps[activeRoutine]?.length || 0)
    );
    const prefix = isCustom ? `${activeRoutine}_custom_` : `${activeRoutine}_`;
    const key = `${prefix}${isCustom ? index - (routineSteps[activeRoutine]?.length || 0) : index}`;
    return completedSteps[key] === true;
  }).length;

  const progress = currentSteps.length > 0 ? (completedCount / currentSteps.length) * 100 : 0;

  const tabs = [
    {
      id: 'morning' as const,
      label: 'Morning',
      icon: <SunIcon size={16} color={activeRoutine === 'morning' ? '#7A8B6A' : '#8F8377'} />,
    },
    {
      id: 'night' as const,
      label: 'Night',
      icon: <MoonIcon size={16} color={activeRoutine === 'night' ? '#7A8B6A' : '#8F8377'} />,
    },
    {
      id: 'weekly' as const,
      label: 'Weekly',
      icon: <RoutineIcon size={16} color={activeRoutine === 'weekly' ? '#7A8B6A' : '#8F8377'} />,
    },
  ];

  const handleRetry = () => {
    setIsDataLoading(true);
    loadProgress();
    loadCustomSteps();
  };

  // Show initial render loading (useScreenReady) - wrapped in SafeAreaView
  if (isRendering) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Preparing your routine..." />
      </SafeAreaView>
    );
  }

  // Show error if rendering failed
  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
        <CustomHeader
          title="Your Routine"
          subtitle="Personalized based on your latest scan."
          height={80}
          backButton
        />
        <ErrorScreen message={renderError} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  // Show data loading state (from AsyncStorage) - wrapped in SafeAreaView
  if (isDataLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading your routine data..." />
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
        className="flex-1">
        <View
          className="px-container"
          style={{
            opacity: isContentReady ? 1 : 0,
            transform: [{ translateY: isContentReady ? 0 : 10 }],
          }}>
          {/* Tab Buttons Card */}
          <BorderlessShadowCard
            style={{
              paddingVertical: 12,
              paddingHorizontal: 24,
              alignItems: 'center',
            }}>
            <RoutineTabBar tabs={tabs} activeTab={activeRoutine} onTabPress={setActiveRoutine} />
          </BorderlessShadowCard>

          {/* Daily Progress Section */}
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

            {/* Routine Steps */}
            {currentSteps.map((step, index) => {
              const isCustom = (customSteps[activeRoutine] || []).some(
                (_, customIndex) =>
                  customIndex === index - (routineSteps[activeRoutine]?.length || 0)
              );
              const prefix = isCustom ? `${activeRoutine}_custom_` : `${activeRoutine}_`;
              const stepIndex = isCustom
                ? index - (routineSteps[activeRoutine]?.length || 0)
                : index;
              const key = `${prefix}${stepIndex}`;
              const isStepCompleted = completedSteps[key] === true;

              return (
                // <RoutineStepCard
                //   style={{ marginTop: index === 0 ? 16 : 12 }}
                //   key={`${activeRoutine}_${index}`}
                //   stepNumber={step.stepNumber}
                //   title={step.title}
                //   description={step.description}
                //   isCompleted={isStepCompleted}
                //   onToggle={(isCompleted) => handleToggleStep(stepIndex, isCompleted, isCustom)}
                //   isFirst={index === 0}
                //   isLast={index === currentSteps.length - 1}
                //   isCustom={isCustom}
                // />

                <RoutineStepCard
                  style={{ marginTop: index === 0 ? 16 : 12 }}
                  key={`${activeRoutine}_${index}`}
                  stepNumber={step.stepNumber}
                  title={step.title}
                  description={step.description}
                  isCompleted={isStepCompleted}
                  onToggle={(isCompleted) => handleToggleStep(stepIndex, isCompleted, isCustom)}
                  isFirst={index === 0}
                  isLast={index === currentSteps.length - 1}
                  isCustom={isCustom}
                  routineType={activeRoutine}
                  stepId={step.id || `${activeRoutine}_${index}`}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Add Routine Bottom Sheet */}
      <AddRoutineBottomSheet
        visible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        onAdd={handleAddCustomStep}
        initialRoutineType={activeRoutine}
        isPremium={isPremium}
      />
    </SafeAreaView>
  );
};

export default Routines;

const styles = StyleSheet.create({});
