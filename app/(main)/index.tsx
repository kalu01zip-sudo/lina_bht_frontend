// screens/home/index.tsx
import React from 'react';
import { ScrollView, ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '@/components/header/HomeHeader';

import { useHomeScreen } from '@/components/home/hooks/useHomeScreen';
import { SkinHealthCard } from '@/components/home/SkinHealthCard';
import { QuickActionsRow } from '@/components/home/QuickActionsRow';
// import { InsightsSection } from '@/components/home/InsightsSection';
import { SkinProgressCard } from '@/components/home/SkinProgressCard';
import { MorningRoutineCard } from '@/components/home/MorningRoutineCard';
import { LAYOUT } from '@/constants/constants';

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

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView
        edges={['top', 'right']}
        className="flex-1 items-center justify-center bg-[#E8DDD0]">
        <ActivityIndicator size="large" color="#759A52" />
      </SafeAreaView>
    );
  }

  // Error state
  if (isError || !homeData) {
    return (
      <SafeAreaView
        edges={['top', 'right']}
        className="flex-1 items-center justify-center bg-backgroundColor">
        <View className="items-center px-6">
          <Text className="mb-4 text-center font-outfit text-[16px] text-red-500">
            Failed to load home data
          </Text>
          <TouchableOpacity onPress={refetch} className="rounded-full bg-[#95B287] px-6 py-3">
            <Text className="font-outfit text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { user, skinHealth, metrics, morningRoutine, insights, quickActions } = homeData;

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
        <SkinHealthCard
          score={skinHealth.score}
          description={skinHealth.description}
          metrics={metrics}
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
