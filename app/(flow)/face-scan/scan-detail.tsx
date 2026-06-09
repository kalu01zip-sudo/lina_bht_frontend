// app/(flow)/face-scan/scan-detail.tsx  (complete corrected file)
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
    case 'high':
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
    case 'high':
      return 85;
    case 'moderate':
    case 'medium':
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
  blackheads: '#A78BFA',
};

const FALLBACK_IMAGE = require('@/assets/images/hair_scalp_analysis_sample_image.jpg');

// ── Image resolution helper (mirrors analysis-complete.tsx) ──────────────────
//
// Priority:
//   1. Per-condition S3 overlay (c.image_url)  — shows exactly where on the
//      face the condition was detected with colour highlighting.
//   2. visible_area overlay image              — primary condition highlight.
//   3. First image in scan's images[]          — raw user capture.
//   4. Static fallback asset.
//
const resolveConditionImage = (
  conditionImageUrl: string | undefined,
  visibleAreaImageUrl: string | undefined,
  frontCaptureUri: string | undefined
): ImageSourcePropType => {
  if (conditionImageUrl) return { uri: conditionImageUrl };
  if (visibleAreaImageUrl) return { uri: visibleAreaImageUrl };
  if (frontCaptureUri) return { uri: frontCaptureUri };
  return FALLBACK_IMAGE;
};

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

  // ── Image sources ─────────────────────────────────────────────────────────
  // Front capture: first image in the scan's images array
  const frontCaptureUri: string | undefined = data?.images?.[0];

  // visible_area overlay (primary condition highlight from the API)
  const visibleAreaImageUrl: string | undefined = data?.analysis.visible_area.image_url;

  // Primary image: prefer visible_area overlay, then raw capture, then fallback
  const primaryImageSource: ImageSourcePropType = visibleAreaImageUrl
    ? { uri: visibleAreaImageUrl }
    : frontCaptureUri
      ? { uri: frontCaptureUri }
      : FALLBACK_IMAGE;

  // SkinAnalysisCards: show the visible_area overlay (highlighted face) if
  // available, otherwise fall back to the raw front capture
  const skinCardImageUri: string | undefined = visibleAreaImageUrl ?? frontCaptureUri;

  // ── Score card stats ──────────────────────────────────────────────────────
  const skinStats = data
    ? Object.entries(data.analysis.checked_area).map(([key, value]) => ({
        label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        value: String(value),
        color: STAT_COLORS[key] ?? '#977857',
      }))
    : [];

  // ── Detected conditions ───────────────────────────────────────────────────
  // Each condition gets its own per-condition overlay image (c.image_url) so
  // the card shows the highlighted area for that specific condition.
  const detectedConditions: DetectedCondition[] = (data?.analysis.detected_condition ?? []).map(
    (c) => ({
      id: c.name,
      title: c.name.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase()),
      severity: normaliseSeverity(c.severity),
      description: c.note,
      progressValue: severityProgress(c.severity),
      progressColor: severityGradient(c.severity),
      ImageUri: resolveConditionImage(c.image_url, visibleAreaImageUrl, frontCaptureUri),
      phase: c.phase,
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
          // Today card: prefer front capture (real photo), fall back to overlay
          imageUri: (frontCaptureUri ? { uri: frontCaptureUri } : primaryImageSource) as any,
          isFuture: false,
        },
        {
          id: 'day7',
          title: '+7 Days',
          subtitle: '(Prediction 1)',
          imageUri: primaryImageSource as any,
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
          imageUri: primaryImageSource as any,
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

  // ── Derived values ────────────────────────────────────────────────────────
  const hydrationTargetMl = data.analysis.hydration_target ?? 2400;
  const hydrationTargetLabel = `${(hydrationTargetMl / 1000).toFixed(1)}L of Water`;

  const visibleAreaCondition = data.analysis.visible_area;
  const rednessLabel =
    visibleAreaCondition.condition.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) +
    (visibleAreaCondition.areas.length > 0
      ? ` (${visibleAreaCondition.areas.slice(0, 2).join(', ').replace(/_/g, ' ')})`
      : '');

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

          {/* Skin Analysis Summary Cards
              imageUri: visible_area overlay (shows highlighted skin), not raw capture */}
          <SkinAnalysisCards
            imageUri={skinCardImageUri}
            hydrationLevel={data.analysis.hydration}
            rednessScore={
              data.analysis.checked_area[visibleAreaCondition.condition] ??
              visibleAreaCondition.score
            }
            rednessProgress={visibleAreaCondition.score}
            rednessLabel={rednessLabel}
          />

          {/* Detected Conditions
              Each card gets its own per-condition overlay image */}
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
