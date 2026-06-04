// hooks/useHomeData.ts
import { useState, useEffect, useCallback } from 'react';
import { MOCK_HOME_DATA } from '@/mock/home';
import { HomeData } from '@/types/home';

interface UseHomeDataReturn {
  homeData: HomeData | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
  updateRoutineStep: (stepId: string, completed: boolean) => void;
  updateFaceScore: (score: number) => void; // Changed from updateSkinScore
  updateHairScore: (score: number) => void; // Added
  updateMetric: (metricId: string, value: string | number) => void;
  notificationCount: number;
  completedStepsCount: number;
  routineProgress: number;
}

export const useHomeData = (): UseHomeDataReturn => {
  const [data, setData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Calculate routine progress
  const routineProgress = data?.morningRoutine
    ? (data.morningRoutine.completedSteps / data.morningRoutine.totalSteps) * 100
    : 0;

  const completedStepsCount = data?.morningRoutine?.completedSteps || 0;

  const notificationCount = data?.notificationCount || 0;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // console.log('MOCK_QUICK_ACTIONS:', MOCK_HOME_DATA.quickActions);
      setData(MOCK_HOME_DATA);
    } catch (error) {
      console.error('Error loading home data:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update routine step completion
  const updateRoutineStep = useCallback((stepId: string, completed: boolean) => {
    setData((prevData) => {
      if (!prevData) return prevData;

      const updatedSteps = prevData.morningRoutine.steps.map((step) =>
        step.id === stepId ? { ...step, completed } : step
      );

      const completedSteps = updatedSteps.filter((step) => step.completed).length;

      return {
        ...prevData,
        morningRoutine: {
          ...prevData.morningRoutine,
          steps: updatedSteps,
          completedSteps,
        },
      };
    });
  }, []);

  // Update face score
  const updateFaceScore = useCallback((score: number) => {
    setData((prevData) => {
      if (!prevData) return prevData;
      return {
        ...prevData,
        faceScore: score,
      };
    });
  }, []);

  // Update hair score
  const updateHairScore = useCallback((score: number) => {
    setData((prevData) => {
      if (!prevData) return prevData;
      return {
        ...prevData,
        hairScore: score,
      };
    });
  }, []);

  // Update individual metric
  const updateMetric = useCallback((metricId: string, value: string | number) => {
    setData((prevData) => {
      if (!prevData) return prevData;
      return {
        ...prevData,
        metrics: prevData.metrics.map((metric) =>
          metric.id === metricId ? { ...metric, value } : metric
        ),
      };
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    homeData: data,
    isLoading,
    isError,
    refetch: fetchData,
    updateRoutineStep,
    updateFaceScore, // Changed
    updateHairScore, // Added
    updateMetric,
    notificationCount,
    completedStepsCount,
    routineProgress,
  };
};
