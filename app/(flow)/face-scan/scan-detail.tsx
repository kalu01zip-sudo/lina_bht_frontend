import { ImageSourcePropType, ScrollView, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import { useScreenReady } from '@/hooks/useScreenReady';
import AnalysingResultScoreCard from '@/components/scans/AnalysingResultScoreCard';
import { DetectedConditionsList } from '@/components/scans/DetectedConditionsList';
import { DetectedCondition } from '@/components/scans/DetectedConditionCard';
import { LifestyleFactors, LifestyleFactor } from '@/components/scans/LifestyleFactors';
import { PrognosticTimeline, TimelineDay } from '@/components/scans/PrognosticTimeline';
import { SkinAnalysisCards } from '@/components/scans/faceScan/SkinAnalysisCards';
import { RecipesSection, RecommendedRecipe } from '@/components/scans/RecipesSection';
import {
  FoodRecommendationSection,
  RecommendedFood,
} from '@/components/scans/FoodRecommendationSection';
import { KeyNutrientsSection, Nutrient } from '@/components/scans/KeyNutrientsSection';
import { HydrationTargetCard } from '@/components/scans/HydrationTargetCard';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import { useGetFaceScanByIdQuery } from '@/store/api/progressApi';
import { normaliseNutrition, normaliseFood, normaliseRecipe } from '@/store/api/scanApi';

// ── Severity helpers ──────────────────────────────────────────────────────────
const normaliseSeverity = (raw: string): 'Low' | 'Medium' | 'High' => {
  switch (raw.toLowerCase()) {
    case 'severe':
    case 'high':
      return 'High';
    case 'moderate':
    case 'medium':
      return 'Medium';
    default:
      return 'Low';
  }
};

const severityGradient = (severity: string): [string, string] => {
  switch (severity.toLowerCase()) {
    case 'severe':
      return ['#F87171', '#DC2626'];
    case 'moderate':
    case 'medium':
      return ['#FBBF24', '#D97706'];
    default:
      return ['#60A5FA', '#2563EB'];
  }
};

const severityProgress = (severity: string): number => {
  switch (severity.toLowerCase()) {
    case 'severe':
      return 85;
    case 'moderate':
      return 55;
    default:
      return 30;
  }
};

const STAT_COLORS: Record<string, string> = {
  pigmentation: '#FB7185',
  dullness: '#A78BFA',
  skin_tone: '#4ADE80',
  pore_size: '#FBBF24',
  oil_balance: '#60A5FA',
  hydration: '#38BDF8',
  redness: '#F87171',
  texture: '#FBBF24',
  evenness: '#A78BFA',
  dark_circles: '#FB7185',
  fine_lines: '#A78BFA',
  radiance: '#4ADE80',
};

const FALLBACK_IMAGE = require('@/assets/images/hair_scalp_analysis_sample_image.jpg');

// ── Component ─────────────────────────────────────────────────────────────────
const FaceScanDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError } = useGetFaceScanByIdQuery(id!, { skip: !id });

  const { isContentReady } = useScreenReady({
    dependencies: [data],
    delay: 100,
    initialReady: false,
  });

  // ── Image: use first image from the scan's images array ───────────────────
  const faceImageSource: ImageSourcePropType = data?.images?.[0]
    ? { uri: data.images[0] }
    : FALLBACK_IMAGE;

  // ── Score card stats ──────────────────────────────────────────────────────
  const skinStats = data
    ? Object.entries(data.analysis.checked_area).map(([key, value]) => ({
        label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        value: String(value),
        color: STAT_COLORS[key] ?? '#977857',
      }))
    : [];

  // ── Detected conditions ───────────────────────────────────────────────────
  const detectedConditions: DetectedCondition[] = (data?.analysis.detected_condition ?? []).map(
    (c) => ({
      id: c.name,
      title: c.name.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase()),
      severity: normaliseSeverity(c.severity),
      description: c.note,
      progressValue: severityProgress(c.severity),
      progressColor: severityGradient(c.severity),
      ImageUri: faceImageSource,
    })
  );

  // ── Lifestyle factors ─────────────────────────────────────────────────────
  const lifestyleFactors: LifestyleFactor[] = data
    ? [
        {
          id: 'stress',
          label: 'Stress Score',
          value: data.analysis.lifestyle_factor.stress_score,
          gradientColors: ['#FBBF24', '#D97706'],
        },
        {
          id: 'water',
          label: 'Water Intake',
          value: data.analysis.lifestyle_factor.water_intake,
          gradientColors: ['#60A5FA', '#2563EB'],
        },
        {
          id: 'sleep',
          label: 'Sleep Quality',
          value: data.analysis.lifestyle_factor.sleep_quality,
          gradientColors: ['#7A8B6A', '#059669'],
        },
      ]
    : [];

  // ── Prognosis timeline ────────────────────────────────────────────────────
  const prognosticDays: TimelineDay[] = data
    ? [
        {
          id: 'today',
          title: 'Today',
          subtitle: '(Current Condition)',
          imageUri: faceImageSource as any,
          isFuture: false,
        },
        {
          id: 'day7',
          title: '+7 Days',
          subtitle: '(Prediction 1)',
          imageUri: faceImageSource as any,
          isFuture: true,
          improvementPercentage: 18,
          metrics: Object.entries(data.analysis.prognosis_timeline.seven_days).map(
            ([key, value]) => ({
              label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              value: `${value > 0 ? '+' : ''}${value}%`,
              color: value >= 0 ? '#10B981' : '#F87171',
            })
          ),
        },
        {
          id: 'day14',
          title: '+14 Days',
          subtitle: '(Prediction 2)',
          imageUri: faceImageSource as any,
          isFuture: true,
          improvementPercentage: 25,
          metrics: Object.entries(data.analysis.prognosis_timeline.fourteen_days).map(
            ([key, value]) => ({
              label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              value: `${value > 0 ? '+' : ''}${value}%`,
              color: value >= 0 ? '#10B981' : '#F87171',
            })
          ),
        },
      ]
    : [];

  // ── Nutrients ─────────────────────────────────────────────────────────────
  const nutrients: Nutrient[] = (data?.nutritions ?? []).map((n) => {
    const norm = normaliseNutrition(n);
    return {
      id: norm.id,
      name: norm.name,
      description: norm.description,
      imageUrl: { uri: norm.imageUrl },
    };
  });

  // ── Foods ─────────────────────────────────────────────────────────────────
  const recommendedFoods: RecommendedFood[] = (data?.foods ?? []).map((f) => {
    const norm = normaliseFood(f);
    return {
      id: norm.id,
      name: norm.name,
      description: norm.description,
      imageUrl: norm.imageUrl,
    };
  });

  // ── Recipes ───────────────────────────────────────────────────────────────
  const recommendedRecipes: RecommendedRecipe[] = (data?.recipes ?? []).map((r) => {
    const norm = normaliseRecipe(r);
    return {
      id: norm.id,
      title: norm.title,
      description: norm.description,
      imageUrl: norm.imageUrl,
      tags: norm.tags,
    };
  });

  // ── Guards ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading scan details..." />
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Face Analysis" height={50} backButton />
        <ErrorScreen message="Failed to load scan details." onRetry={() => router.back()} />
      </SafeAreaView>
    );
  }

  const hydrationTargetMl = data.analysis.hydration_target ?? 2400;
  const hydrationTargetLabel = `${(hydrationTargetMl / 1000).toFixed(1)}L of Water`;

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Face & Skin Analysis" height={50} backButton />

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
          {/* Score Card */}
          <AnalysingResultScoreCard
            stats={skinStats}
            title="Face & Skin Score Profile"
            overallScore={data.analysis.overall_score}
          />

          <View className="mt-6" />

          <SkinAnalysisCards
            imageUri={data.images?.[0]}
            hydrationLevel={data.analysis.hydration}
            rednessScore={data.analysis.checked_area['redness'] ?? data.analysis.visible_area.score}
            rednessProgress={data.analysis.visible_area.score}
            rednessLabel={
              data.analysis.visible_area.condition
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase()) +
              (data.analysis.visible_area.areas.length > 0
                ? ` (${data.analysis.visible_area.areas.slice(0, 2).join(', ')})`
                : '')
            }
          />

          {/* Detected Conditions */}
          {detectedConditions.length > 0 && (
            <DetectedConditionsList
              conditions={detectedConditions}
              title="Detected Conditions"
              showIcon={true}
              showFaceImages={true}
            />
          )}

          {/* Lifestyle Factors */}
          <LifestyleFactors factors={lifestyleFactors} title="Lifestyle Factors" showIcon={true} />

          {/* Prognostic Timeline */}
          <PrognosticTimeline
            days={prognosticDays}
            duration="14 Days"
            backgroundImage={require('@/assets/images/prognostic_timeline_bg_face.jpg')}
            title="Skin Prognostic Timeline"
            showIcon={true}
          />

          {/* Nutrients */}
          {nutrients.length > 0 && (
            <KeyNutrientsSection
              nutrients={nutrients}
              title="Key Nutrients for Your Skin"
              showIcon={true}
            />
          )}

          {/* Food Recommendations */}
          {recommendedFoods.length > 0 && (
            <FoodRecommendationSection
              recommendedFoods={recommendedFoods}
              title="Your Food Recommendations"
              showIcon={true}
            />
          )}

          {/* Recipes */}
          {recommendedRecipes.length > 0 && (
            <RecipesSection
              recommendedRecipes={recommendedRecipes}
              title="Recipes for Your Skin"
              showIcon={true}
            />
          )}

          {/* Hydration */}
          <HydrationTargetCard
            goal={hydrationTargetLabel}
            description="Drinking enough water helps flush inflammatory markers and keeps your skin plump and clear."
            title="Hydration Target"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FaceScanDetailScreen;
