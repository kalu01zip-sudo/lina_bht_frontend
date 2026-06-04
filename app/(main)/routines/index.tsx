import { ScrollView, Text, View, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import { useDeleteRoutineStepMutation, usePatchRoutineStepMutation } from '@/store/api/routineApi';
import { mapStepToUI, UIRoutineStep } from '@/utils/routineMapper';
import { useRoutines } from '@/hooks/useRoutines';
import { useFocusEffect } from 'expo-router';

type RoutineType = 'morning' | 'night' | 'weekly';

const getErrorMessage = (error: any): string => {
  if (!error) return 'An error occurred';
  if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
    return error.data.message as string;
  }
  if ('message' in error && typeof error.message === 'string') return error.message;
  if (typeof error === 'string') return error;
  return 'Could not load routines. Pull down to refresh.';
};

const Routines = () => {
  const [activeRoutine, setActiveRoutine] = useState<RoutineType>('morning');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [pendingSteps, setPendingSteps] = useState<Set<string>>(new Set());
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { showSuccess, showError } = useToast();

  const {
    allSteps,
    hasMore,
    isLoading,
    isFetching,
    isError,
    error,
    handleLoadMore,
    handleRefresh: routineRefresh,
    resetAndRefetch,
  } = useRoutines();

  useFocusEffect(
    useCallback(() => {
      setCompletedSteps({});
      resetAndRefetch();
    }, [resetAndRefetch])
  );

  const [deleteStep] = useDeleteRoutineStepMutation();
  const [patchStep] = usePatchRoutineStepMutation();

  // Seed completedSteps only for steps we haven't seen yet
  useEffect(() => {
    if (!allSteps.length) return;
    setCompletedSteps((prev) => {
      const next = { ...prev };
      allSteps.forEach((step) => {
        if (!(step.id in next)) {
          next[step.id] = step.is_completed ?? false;
        }
      });
      return next;
    });
  }, [allSteps]);

  // Client-side filter + sort for the active tab
  const currentSteps: UIRoutineStep[] = useMemo(() => {
    if (!allSteps.length) return [];

    const phaseOrder: Record<string, number> = {
      maintenance: 1,
      balance: 1,
      repair: 2,
      treatment: 3,
    };

    return allSteps
      .filter((step) => (step.time?.toLowerCase() || '') === activeRoutine.toLowerCase())
      .sort((a, b) => {
        const orderA = phaseOrder[a.phase] ?? 99;
        const orderB = phaseOrder[b.phase] ?? 99;
        if (orderA !== orderB) return orderA - orderB;
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB;
      })
      .map((step, index) => mapStepToUI(step, index));
  }, [allSteps, activeRoutine]);

  const completedCount = currentSteps.filter((s) => completedSteps[s.id] === true).length;
  const progress = currentSteps.length > 0 ? (completedCount / currentSteps.length) * 100 : 0;

  const handleToggleStep = useCallback(
    async (stepId: string, isCompleted: boolean) => {
      if (pendingSteps.has(stepId)) return;
      setCompletedSteps((prev) => ({ ...prev, [stepId]: isCompleted }));
      setPendingSteps((prev) => new Set(prev).add(stepId));
      try {
        await patchStep({ step_id: stepId, is_completed: isCompleted }).unwrap();
      } catch (err: any) {
        setCompletedSteps((prev) => ({ ...prev, [stepId]: !isCompleted }));
        const detail = err?.data?.detail;
        showError(typeof detail === 'string' ? detail : getErrorMessage(err));
      } finally {
        setPendingSteps((prev) => {
          const next = new Set(prev);
          next.delete(stepId);
          return next;
        });
      }
    },
    [pendingSteps, patchStep, showError]
  );

  const handleDeleteStep = async (stepId: string) => {
    try {
      await deleteStep({ step_id: stepId }).unwrap();
      showSuccess('Step removed from your routine');
      setCompletedSteps({});
      await resetAndRefetch();
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  const handleAddCustomStep = useCallback(
    async (data: {
      productName: string;
      instructions: string;
      routineType: string;
      routineStepId: string;
    }) => {
      showSuccess(`"${data.productName}" added to your ${data.routineType} routine`);
      setBottomSheetVisible(false);
      setCompletedSteps({});
      await resetAndRefetch();
    },
    [resetAndRefetch, showSuccess]
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setCompletedSteps({});
    await routineRefresh();
    setIsRefreshing(false);
  };

  const isScrolledToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 80;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const tabs = [
    { id: 'morning' as const, label: 'Morning', icon: <SunIcon size={16} color="#8F8377" /> },
    { id: 'night' as const, label: 'Night', icon: <MoonIcon size={16} color="#8F8377" /> },
    { id: 'weekly' as const, label: 'Weekly', icon: <RoutineIcon size={16} color="#8F8377" /> },
  ];

  if (isLoading && !allSteps.length) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading your routine..." />
      </SafeAreaView>
    );
  }

  if (isError && !allSteps.length) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-backgroundColor">
        <CustomHeader
          title="Your Routine"
          subtitle="Personalized based on your latest scan."
          height={80}
          backButton
        />
        <ErrorScreen message={getErrorMessage(error)} onRetry={routineRefresh} />
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
        onScroll={({ nativeEvent }) => {
          if (isScrolledToBottom(nativeEvent)) handleLoadMore();
        }}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#977857" />
        }>
        <View className="px-container">
          <BorderlessShadowCard
            style={{ paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center' }}>
            <RoutineTabBar tabs={tabs} activeTab={activeRoutine} onTabPress={setActiveRoutine} />
          </BorderlessShadowCard>

          <View className="mt-3">
            <View className="flex-row items-center justify-between">
              <Text
                className="flex-1 text-start font-outfitMedium text-[16px]"
                style={{ color: '#361A0D' }}>
                {activeRoutine.charAt(0).toUpperCase() + activeRoutine.slice(1)} Progress
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

            {currentSteps.map((step, index) => (
              <RoutineStepCard
                key={step.id}
                style={{ marginTop: index === 0 ? 20 : 4 }}
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.description}
                isCompleted={completedSteps[step.id] === true}
                onToggle={(isCompleted) => handleToggleStep(step.id, isCompleted)}
                isFirst={index === 0}
                isLast={index === currentSteps.length - 1}
                routineType={activeRoutine}
                stepId={step.id}
                onDelete={handleDeleteStep}
                productCategory={step.productCategory}
                disabled={pendingSteps.has(step.id)}
              />
            ))}

            {isFetching && !isLoading && (
              <View className="items-center py-6">
                <ActivityIndicator size="small" color="#977857" />
              </View>
            )}

            {!hasMore && currentSteps.length > 0 && !isFetching && (
              <View className="items-center py-4">
                <Text className="font-outfit text-[12px]" style={{ color: '#2E211744' }}>
                  All steps loaded
                </Text>
              </View>
            )}

            {currentSteps.length === 0 && !isLoading && !isFetching && (
              <View className="mt-8 items-center justify-center py-12">
                <Text
                  className="text-center font-outfit text-[14px]"
                  style={{ color: '#2E211799' }}>
                  No steps in your {activeRoutine} routine yet.{'\n'}Tap + to add one.
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
