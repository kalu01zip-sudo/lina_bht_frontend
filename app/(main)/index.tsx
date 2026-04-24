// // screens/home/index.tsx
// import React from 'react';
// import { ScrollView, ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import HomeHeader from '@/components/header/HomeHeader';

// import { useHomeScreen } from '@/components/home/hooks/useHomeScreen';
// import { SkinHealthCard } from '@/components/home/SkinHealthCard';
// import { QuickActionsRow } from '@/components/home/QuickActionsRow';
// // import { InsightsSection } from '@/components/home/InsightsSection';
// import { SkinProgressCard } from '@/components/home/SkinProgressCard';
// import { MorningRoutineCard } from '@/components/home/MorningRoutineCard';
// import { LAYOUT } from '@/constants/constants';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import ErrorScreen from '@/components/errors/ErrorScreen';

// export default function HomeScreen() {
//   const {
//     homeData,
//     isLoading,
//     isError,
//     notificationCount,
//     completedStepsCount,
//     routineProgress,
//     handleLogout,
//     toggleStepCompletion,
//     handleQuickAction,
//     handleViewAllRoutines,
//     handleInsightPress,
//     handleSkinProgress,
//     refetch,
//   } = useHomeScreen();

//   // Loading state from API
//   if (isLoading) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Loading your dashboard..." />
//       </SafeAreaView>
//     );
//   }

//   // Error state from API
//   if (isError || !homeData) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <ErrorScreen message="Failed to load home data" onRetry={refetch} />
//       </SafeAreaView>
//     );
//   }

//   const { user, metrics, morningRoutine, insights, quickActions } = homeData;

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <HomeHeader
//         title={`Hello, ${user.name}`}
//         subtitle="Your skin is looking radiant today."
//         backButton={false}
//         height={65}
//         notificationCount={notificationCount}
//       />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         className="flex-1 px-container"
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           paddingTop: LAYOUT.screen.scrollViewPaddingTop,
//         }}
//         style={{
//           marginTop: LAYOUT.innerPage.marginTop,
//         }}>

//         <SkinHealthCard
//           faceScore={homeData.faceScore}
//           hairScore={homeData.hairScore}
//           metrics={metrics}
//         />

//         <QuickActionsRow actions={quickActions} onActionPress={handleQuickAction} />

//         <MorningRoutineCard
//           routine={morningRoutine}
//           completedStepsCount={completedStepsCount}
//           routineProgress={routineProgress}
//           onToggleStep={toggleStepCompletion}
//           onViewAll={handleViewAllRoutines}
//         />

//         {/* <InsightsSection insights={insights} onInsightPress={handleInsightPress} /> */}

//         <SkinProgressCard onPress={handleSkinProgress} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// screens/home/index.tsx
import React from 'react';
import { ScrollView, ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '@/components/header/HomeHeader';

import { useHomeScreen } from '@/components/home/hooks/useHomeScreen';
import { QuickActionsRow } from '@/components/home/QuickActionsRow';
import { SkinProgressCard } from '@/components/home/SkinProgressCard';
import { MorningRoutineCard } from '@/components/home/MorningRoutineCard';
import { LAYOUT } from '@/constants/constants';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import AnalysingResultScoreCard from '@/components/scans/AnalysingResultScoreCard';

export default function HomeScreen() {
  const {
    homeData,
    isLoading,
    isError,
    notificationCount,
    completedStepsCount,
    routineProgress,
    handleLogout,
    toggleStepCompletion,
    handleQuickAction,
    handleViewAllRoutines,
    handleInsightPress,
    handleSkinProgress,
    refetch,
  } = useHomeScreen();

  // Loading state from API
  if (isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading your dashboard..." />
      </SafeAreaView>
    );
  }

  // Error state from API
  if (isError || !homeData) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <ErrorScreen message="Failed to load home data" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const { user, metrics, morningRoutine, insights, quickActions, faceScore, hairScore } = homeData;

  // Prepare stats for the score card
  const SKIN_STATS = [
    { label: 'Hydration', value: '85', color: '#60A5FA' },
    { label: 'Sebum', value: '40', color: '#4ADE80' },
    { label: 'Redness', value: '38', color: '#FB7185' },
    { label: 'Texture', value: '98', color: '#FBBF24' },
    { label: 'Evenness', value: '52', color: '#A78BFA' },
  ];

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <HomeHeader
        title={`Hello, ${user.name}`}
        subtitle="Your skin is looking radiant today."
        backButton={false}
        height={65}
        notificationCount={notificationCount}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-container"
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: LAYOUT.screen.scrollViewPaddingTop,
        }}
        style={{
          marginTop: LAYOUT.innerPage.marginTop,
        }}>
        {/* Face Scan Score Profile Card */}
        <AnalysingResultScoreCard
          stats={SKIN_STATS}
          // title="Face Scan Score Profile"
          title="Overall Profile Score"
          averageScore={faceScore}
        />

        <QuickActionsRow actions={quickActions} onActionPress={handleQuickAction} />

        <MorningRoutineCard
          routine={morningRoutine}
          completedStepsCount={completedStepsCount}
          routineProgress={routineProgress}
          onToggleStep={toggleStepCompletion}
          onViewAll={handleViewAllRoutines}
        />

        {/* <InsightsSection insights={insights} onInsightPress={handleInsightPress} /> */}

        <SkinProgressCard onPress={handleSkinProgress} />
      </ScrollView>
    </SafeAreaView>
  );
}
