// app/(flow)/hair-scan/analysis-complete.tsx
import { ImageSourcePropType, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useScreenReady } from '@/hooks/useScreenReady';
import AnalysingResultScoreCard from '@/components/scans/AnalysingResultScoreCard';
import { DetectedConditionsList } from '@/components/scans/DetectedConditionsList';
import { DetectedCondition } from '@/components/scans/DetectedConditionCard';
import { LifestyleFactors, LifestyleFactor } from '@/components/scans/LifestyleFactors';
import { PrognosticTimeline, TimelineDay } from '@/components/scans/PrognosticTimeline';
import { HairAnalysisCards } from '@/components/scans/faceScan/HairAnalysisCards';
import { RecipesSection, RecommendedRecipe } from '@/components/scans/RecipesSection';
import {
  FoodRecommendationSection,
  RecommendedFood,
} from '@/components/scans/FoodRecommendationSection';
import { KeyNutrientsSection, Nutrient } from '@/components/scans/KeyNutrientsSection';
import { HydrationTargetCard } from '@/components/scans/HydrationTargetCard';
import { RecommendedArticles } from '@/components/scans/RecommendedArticles';
// import { SAMPLE_ARTICLES } from '@/constants/sampleArticles';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import {
  HairScanResponse,
  normaliseNutrition,
  normaliseFood,
  normaliseRecipe,
} from '@/store/api/scanApi';
import { AnalysisActionButtons } from '@/components/routines/AnalysisActionButtons';

// ── Severity normaliser ───────────────────────────────────────────────────────
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
  dandruff: '#FB7185',
  fungal_activity: '#A78BFA',
  microbiome_balance: '#4ADE80',
  sebum_level: '#FBBF24',
  oiliness: '#60A5FA',
  thinning: '#FB7185',
  hair_density: '#4ADE80',
  follicles_health: '#60A5FA',
  scalp_elasticity: '#A78BFA',
};

const FALLBACK_HAIR_IMAGE = require('@/assets/images/hair_scalp_analysis_sample_image.jpg');

// ── Component ─────────────────────────────────────────────────────────────────
const HairAnalysisCompleteScreen = () => {
  const router = useRouter();
  const { scanResult, imageUri } = useLocalSearchParams<{
    scanResult?: string;
    imageUri?: string;
  }>();

  const [data, setData] = useState<HairScanResponse | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [data],
    delay: 100,
    initialReady: false,
  });

  useEffect(() => {
    if (!scanResult) {
      setParseError('No scan result received.');
      return;
    }
    try {
      setData(JSON.parse(scanResult));
    } catch {
      setParseError('Could not read scan result.');
    }
  }, [scanResult]);

  // ── Captured image source ─────────────────────────────────────────────────
  const capturedImageSource: ImageSourcePropType = imageUri
    ? { uri: imageUri }
    : FALLBACK_HAIR_IMAGE;

  // ── Score card stats ──────────────────────────────────────────────────────
  const hairStats = data
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
      ImageUri: capturedImageSource,
    })
  );

  // ── Lifestyle factors ─────────────────────────────────────────────────────
  const lifestyleFactors: LifestyleFactor[] = data
    ? [
        {
          id: 'stress',
          label: 'Stress Impact',
          value: data.analysis.lifestyle_factor.stress_impact,
          gradientColors: ['#FBBF24', '#D97706'],
        },
        {
          id: 'hygiene',
          label: 'Hygiene Score',
          value: data.analysis.lifestyle_factor.hygiene_score,
          gradientColors: ['#60A5FA', '#2563EB'],
        },
        {
          id: 'dietary',
          label: 'Dietary Factor',
          value: data.analysis.lifestyle_factor.dietary_factor,
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
          imageUri: capturedImageSource as any,
          isFuture: false,
        },
        {
          id: 'day7',
          title: '+7 Days',
          subtitle: '(Prediction 1)',
          imageUri: capturedImageSource as any,
          isFuture: true,
          improvementPercentage: 15,
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
          imageUri: capturedImageSource as any,
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
  if (isRendering && !data) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Preparing your hair analysis..." />
      </SafeAreaView>
    );
  }

  if (renderError || parseError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Hair Analysis" height={50} backButton />
        <ErrorScreen
          message={renderError ?? parseError ?? 'Unknown error'}
          onRetry={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading..." />
      </SafeAreaView>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Hair & Scalp Analysis" height={50} backButton />

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
            stats={hairStats}
            title="Hair & Scalp Score Profile"
            overallScore={data.analysis.overall_score}
          />

          <View className="mt-6" />

          {/* Hair Analysis Summary Card */}
          <HairAnalysisCards
            hairImageUri={capturedImageSource}
            scalpHealth={data.analysis.scalp_health}
            flakinessScore={data.analysis.visible_area.score}
            flakinessProgress={data.analysis.visible_area.score}
            flakinessLabel={
              data.analysis.visible_area.condition
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase()) + ' Pattern'
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
            backgroundImage={require('@/assets/images/prognostic_timeline_bg_hair.jpg')}
            title="Hair Prognostic Timeline"
            showIcon={true}
          />

          {/* Nutrients */}
          {nutrients.length > 0 && (
            <KeyNutrientsSection
              nutrients={nutrients}
              title="Key Nutrients for Hair Health"
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
              title="Recipes for Hair Health"
              showIcon={true}
            />
          )}

          {/* Hydration */}
          <HydrationTargetCard
            goal="2.4L of Water"
            description="Proper hydration supports scalp moisture balance and reduces flakiness."
            title="Hydration Target"
          />

          <AnalysisActionButtons style={{ marginTop: 32 }} />

          {/* CTA */}
          <PrimaryButton
            title="Generate Your Routine"
            onPress={() =>
              router.push({
                pathname: '/(flow)/routines/ai-routine-generate/hair-routine',
                params: { scan_id: data.scan_id },
              })
            }
            style={{ marginTop: 32 }}
          />

          <TouchableOpacity
            onPress={() => router.push('/(main)')}
            activeOpacity={0.6}
            className="mt-4 py-5">
            <Text className="text-center font-outfitMedium text-[20px] text-[#361A0D]">
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HairAnalysisCompleteScreen;
