// screens/home/index.tsx
import React, { useState, useMemo, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import HomeHeader from '@/components/header/HomeHeader';
import { QuickActionsRow } from '@/components/home/QuickActionsRow';
import { SkinProgressCard } from '@/components/home/SkinProgressCard';
import { LAYOUT } from '@/constants/constants';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import AnalysingResultScoreCard from '@/components/scans/AnalysingResultScoreCard';
import { useHomeScreen } from '@/components/home/hooks/useHomeScreen';
import { useGetHomeScansQuery } from '@/store/api/homeApi';
import { selectCurrentUser } from '@/store/slices/authSlice';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { useGetUnreadCountQuery } from '@/store/api/notificationApi';
import { RoutineSummaryCard } from '@/components/home/RoutineSummaryCard';
import { useFocusEffect } from 'expo-router';

type ScanTab = 'face' | 'hair';

const STAT_COLORS = ['#60A5FA', '#4ADE80', '#FB7185', '#FBBF24', '#A78BFA', '#34D399', '#F472B6'];

const checkedAreaToStats = (area: Record<string, number>) =>
  Object.entries(area).map(([key, value], i) => ({
    label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    value: String(value),
    color: STAT_COLORS[i % STAT_COLORS.length],
  }));

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<ScanTab>('face');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [isSwitchingTab, setIsSwitchingTab] = useState(false);

  const { data: unreadData, refetch: refetchUnread } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true, // ← refetches when app comes to foreground
    refetchOnMountOrArgChange: true, // ← refetches when screen gains focus
  });
  const notificationCount = unreadData?.unread_count ?? 0;

  const currentUser = useSelector(selectCurrentUser);
  const userName = currentUser?.full_name?.split(' ')[0] ?? 'there';

  const {
    data: homeData,
    isLoading,
    isError,
    refetch,
  } = useGetHomeScansQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useFocusEffect(
    useCallback(() => {
      setCompletedSteps({});
      refetch();
      refetchUnread(); //  — refreshes badge count when returning from notifications
    }, [refetch, refetchUnread])
  );

  const {
    // notificationCount,
    toggleStepCompletion,
    handleQuickAction,
    handleViewAllRoutines,
    handleSkinProgress,
    quickActions,
  } = useHomeScreen();

  const faceScan = homeData?.face_scan ?? null;
  const hairScan = homeData?.scalp_scan ?? null;

  const faceStats = useMemo(
    () => (faceScan ? checkedAreaToStats(faceScan.analysis.checked_area) : []),
    [faceScan]
  );
  const hairStats = useMemo(
    () => (hairScan ? checkedAreaToStats(hairScan.analysis.checked_area) : []),
    [hairScan]
  );

  const hasFaceScan = !!faceScan;
  const hasHairScan = !!hairScan;

  // Determine which tabs to show and which is active
  const availableTabs = useMemo(() => {
    const tabs: ScanTab[] = [];
    if (hasFaceScan) tabs.push('face');
    if (hasHairScan) tabs.push('hair');
    return tabs;
  }, [hasFaceScan, hasHairScan]);

  // Set default active tab to the first available scan
  useMemo(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  const activeScore =
    activeTab === 'face'
      ? (faceScan?.analysis.overall_score ?? 0)
      : (hairScan?.analysis.overall_score ?? 0);

  const activeStats = activeTab === 'face' ? faceStats : hairStats;

  const morningRoutineData = useMemo(() => {
    if (!homeData?.routine?.data) return { steps: [], completedCount: 0, progress: 0 };

    const steps = homeData.routine.data
      .filter((item) => item.time === 'morning')
      .map((item, index) => ({
        id: item.id || `morning_${index}`,
        name: item.product_name || item.product_category || 'Routine step',
        completed: completedSteps[item.id] ?? item.is_completed ?? false,
      }));

    const completedCount = steps.filter((s) => s.completed).length;
    const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

    return { steps, completedCount, progress };
  }, [homeData, completedSteps]);

  const nightRoutineData = useMemo(() => {
    if (!homeData?.routine?.data) return { steps: [], completedCount: 0, progress: 0 };

    const steps = homeData.routine.data
      .filter((item) => item.time === 'night')
      .map((item, index) => ({
        id: item.id || `night_${index}`,
        name: item.product_name || item.product_category || 'Routine step',
        completed: completedSteps[item.id] ?? item.is_completed ?? false,
      }));

    const completedCount = steps.filter((s) => s.completed).length;
    const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

    return { steps, completedCount, progress };
  }, [homeData, completedSteps]);

  const handleToggleStep = (stepId: string, currentCompleted: boolean) => {
    setCompletedSteps((prev) => ({ ...prev, [stepId]: !currentCompleted }));
    toggleStepCompletion(stepId, !currentCompleted);
  };

  const handleTabSwitch = (tab: ScanTab) => {
    if (tab === activeTab) return;

    setIsSwitchingTab(true);
    setActiveTab(tab);

    setTimeout(() => {
      setIsSwitchingTab(false);
    }, 300);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading your dashboard..." />
      </SafeAreaView>
    );
  }

  if (isError || !homeData) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <ErrorScreen message="Failed to load home data" onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <HomeHeader
        title={`Hello, ${userName}`}
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
        style={{ marginTop: LAYOUT.innerPage.marginTop }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#977857" />
        }>
        {/* Scan Toggle - Only show if at least one scan exists */}
        {availableTabs.length > 0 && (
          <View
            className="mb-3 flex-row self-center"
            style={{
              backgroundColor: '#EDE8E1',
              borderRadius: 20,
              padding: 3,
              width: '100%',
            }}>
            {availableTabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => handleTabSwitch(tab)}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    paddingHorizontal: 20,
                    paddingVertical: 7,
                    borderRadius: 18,
                    backgroundColor: isActive ? '#361A0D' : 'transparent',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: isActive ? 'Outfit-Medium' : 'Outfit',
                      fontSize: 13,
                      color: isActive ? '#fff' : '#977857',
                    }}>
                    {tab === 'face' ? 'Face Scan' : 'Hair & Scalp Scan'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Score Card with Loading Overlay */}
        <View style={{ position: 'relative' }}>
          {isSwitchingTab ? (
            <View
              className="mb-3 items-center justify-center rounded-3xl py-10"
              style={{
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '#E8DDD0',
                minHeight: 400,
              }}>
              <ActivityIndicator size="large" color="#977857" />
              <Text className="mt-3 font-outfit text-[13px]" style={{ color: '#977857' }}>
                Loading {activeTab === 'face' ? 'face' : 'hair'} scan data...
              </Text>
            </View>
          ) : activeStats.length > 0 ? (
            <AnalysingResultScoreCard
              stats={activeStats}
              title="Overall Profile Score"
              averageScore={activeScore}
            />
          ) : (
            <BorderlessShadowCard
              className="mb-[-6] items-center justify-center rounded-3xl py-6"
              style={{ backgroundColor: '#F5EFE8', borderWidth: 1, borderColor: '#E8DDD0' }}>
              <Text className="font-outfitMedium text-[15px]" style={{ color: '#977857' }}>
                No {activeTab === 'face' ? 'face' : 'hair'} scan yet
              </Text>
              <Text className="mt-1 font-outfit text-[13px]" style={{ color: '#2E211780' }}>
                Complete a scan to see your score
              </Text>
            </BorderlessShadowCard>
          )}
        </View>

        {/* Quick Actions Row - Navigation Buttons */}
        <QuickActionsRow actions={quickActions} onActionPress={handleQuickAction} />

        <View style={{ height: 20 }} />

        {/* Morning Routine — rounded top, flat bottom */}
        <RoutineSummaryCard
          title="Morning Routine"
          icon="sunny-outline"
          steps={morningRoutineData.steps}
          completedCount={morningRoutineData.completedCount}
          progress={morningRoutineData.progress}
          maxVisible={3}
          topRadius={24}
          bottomRadius={0}
          onViewAll={handleViewAllRoutines}
          onStepToggled={(stepId, newCompleted) => {
            setCompletedSteps((prev) => ({ ...prev, [stepId]: newCompleted }));
          }}
        />
        <View style={{ height: 4 }} />
        {/* Night Routine — flat top, rounded bottom */}
        <RoutineSummaryCard
          title="Night Routine"
          icon="moon-outline"
          steps={nightRoutineData.steps}
          completedCount={nightRoutineData.completedCount}
          progress={nightRoutineData.progress}
          maxVisible={3}
          topRadius={0}
          bottomRadius={24}
          onViewAll={handleViewAllRoutines}
          onStepToggled={(stepId, newCompleted) => {
            setCompletedSteps((prev) => ({ ...prev, [stepId]: newCompleted }));
          }}
        />

        {/* Skin Progress Card */}
        <SkinProgressCard onPress={handleSkinProgress} />
      </ScrollView>
    </SafeAreaView>
  );
}
