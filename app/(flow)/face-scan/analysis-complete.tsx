// app/(flow)/scans/face-scan/ai-analysis-complete.tsx
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { AngleCapture } from '@/components/scans/MultiAngleCameraScan';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import AnalysingResultScoreCard from '@/components/scans/AnalysingResultScoreCard';
import { SkinAnalysisCards } from '@/components/scans/faceScan/SkinAnalysisCards';
import { DetectedConditionsList } from '@/components/scans/DetectedConditionsList';
import { DetectedCondition } from '@/components/scans/DetectedConditionCard';
import { LifestyleFactors, LifestyleFactor } from '@/components/scans/LifestyleFactors';
import { PrognosticTimeline, TimelineDay } from '@/components/scans/PrognosticTimeline';

const SKIN_STATS = [
  { label: 'Hydration', value: '85', color: '#60A5FA' },
  { label: 'Sebum', value: '60', color: '#4ADE80' },
  { label: 'Redness', value: '38', color: '#FB7185' },
  { label: 'Texture', value: '98', color: '#FBBF24' },
  { label: 'Evenness', value: '52', color: '#A78BFA' },
];

// Static lifestyle factors data
const LIFESTYLE_FACTORS: LifestyleFactor[] = [
  {
    id: 'stress',
    label: 'Stress Score',
    value: 62,
    gradientColors: ['#FBBF24', '#D97706'],
  },
  {
    id: 'water',
    label: 'Water Intake',
    value: 74,
    gradientColors: ['#60A5FA', '#2563EB'],
  },
  {
    id: 'sleep',
    label: 'Sleep Quality',
    value: 68,
    gradientColors: ['#7A8B6A', '#059669'],
  },
];

const AiAnalysisCompleteScreen = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { captures: capturesParam } = useLocalSearchParams();
  const [captures, setCaptures] = useState<AngleCapture[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [captures],
    delay: 100,
    initialReady: false,
  });

  useEffect(() => {
    loadCaptures();
  }, [capturesParam]);

  const loadCaptures = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('📊 ANALYSIS SCREEN - Received params:', {
        hasCaptures: !!capturesParam,
        capturesParam,
      });

      if (capturesParam) {
        const parsed = JSON.parse(capturesParam as string);
        setCaptures(parsed);
        console.log('✅ Parsed captures successfully:', parsed.length);
      } else {
        console.log('No captures found in params');
      }
    } catch (err) {
      console.error('Error parsing captures:', err);
      setError('Failed to load analysis data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    loadCaptures();
  };

  // Mark initial load as complete after first render
  useEffect(() => {
    if (isContentReady && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isContentReady]);

  // Show initial render loading (useScreenReady) - ONLY on first load
  if (isRendering && isInitialLoad) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Preparing analysis results..." />
      </SafeAreaView>
    );
  }

  // Show error if rendering failed
  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Analysis Complete" height={50} backButton />
        <ErrorScreen message={renderError} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  // Show loading while data is being processed
  if (isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Analysis Complete" height={50} backButton />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#95B287" />
          <Text className="mt-3 font-outfit text-[14px]" style={{ color: '#2E211799' }}>
            Loading analysis results...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error if data loading failed
  if (error) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Analysis Complete" height={50} backButton />
        <ErrorScreen message={error} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  // Get the first captured image for face preview
  const faceImageUri = captures.length > 0 ? captures[0].uri : undefined;

  // Define your detected conditions data
  const detectedConditions: DetectedCondition[] = [
    {
      id: 'redness',
      title: 'Mild Redness',
      severity: 'Medium',
      description: 'Your skin barrier is slightly compromised, likely due to over-exfoliation.',
      progressValue: 45,
      progressColor: ['#FBBF24', '#D97706'],
      ImageUri: faceImageUri,
      faceArea: { x: 100, y: 150, width: 80, height: 80 },
    },
    {
      id: 'dehydration',
      title: 'Dehydration',
      severity: 'Low',
      description: 'Requires attention and targeted care.',
      progressValue: 25,
      progressColor: ['#60A5FA', '#2563EB'],
      ImageUri: faceImageUri,
    },
    {
      id: 'pores',
      title: 'Pores',
      severity: 'Low',
      description: 'Normal appearance, slight congestion on nose.',
      progressValue: 25,
      progressColor: ['#A78BFA', '#8B5CF6'],
      ImageUri: faceImageUri,
    },
  ];

  // In your main screen, define the prognostic days with future flags
  const prognosticDays: TimelineDay[] = [
    {
      id: 'today',
      title: 'Today',
      subtitle: '(Fragile Barrier)',
      imageUri: faceImageUri,
      isFuture: false,
    },
    {
      id: 'day7',
      title: '+7 Days',
      subtitle: '(Prediction 1)',
      metrics: [
        { label: 'Hydration', value: '+18%', color: '#10B981' },
        { label: 'Redness', value: '-12%', color: '#10B981' },
      ],
      imageUri: faceImageUri,
      isFuture: true,
      improvementPercentage: 18,
    },
    {
      id: 'day14',
      title: '+14 Days',
      subtitle: '(Prediction 2)',
      metrics: [
        { label: 'Barrier', value: '92%', color: '#10B981' },
        { label: 'Evenness', value: '+25%', color: '#10B981' },
      ],
      imageUri: faceImageUri,
      isFuture: true,
      improvementPercentage: 25,
    },
  ];

  // Inside your component, after faceImageUri is defined:
  // const prognosticDays = PROGNOSTIC_DAYS.map((day) => ({
  //   ...day,
  //   imageUri: faceImageUri,
  // }));

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Analysis Complete" height={50} backButton />

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
          {/* NEW COMPONENT CALL */}
          <AnalysingResultScoreCard stats={SKIN_STATS} title="Face Scan Score Profile" />

          {/* Captured Angles Preview */}
          {captures.length > 0 && (
            <View className="">
              <Text className="mb-2 mt-6 text-start font-outfitMedium text-[16px] text-[#2E2117]">
                Captured Angles
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                <View className="flex-row gap-2 p-2">
                  {captures.map((capture, idx) => (
                    <BorderlessShadowCard
                      key={idx}
                      b_tl={12}
                      b_tr={12}
                      b_bl={12}
                      b_br={12}
                      style={{
                        padding: 8,
                        width: 80,
                        alignItems: 'center',
                      }}>
                      <Image
                        source={{ uri: capture.uri }}
                        style={{ width: 60, height: 60, borderRadius: 30 }}
                      />
                      <Text className="mt-1 font-outfit text-[10px] capitalize text-[#2A2118]">
                        {capture.angle}
                      </Text>
                    </BorderlessShadowCard>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Skin Analysis Cards - Face Image & Hydration Chart */}
          <SkinAnalysisCards
            imageUri={faceImageUri}
            hydrationLevel={72}
            rednessScore={24}
            rednessProgress={38}
            rednessLabel="Visible Redness (Cheeks)"
          />

          {/* Detected Conditions Section */}
          <DetectedConditionsList
            conditions={detectedConditions}
            title="Detected Conditions"
            showIcon={true}
            showFaceImages={true}
          />

          {/* Lifestyle Factors Section */}
          <LifestyleFactors factors={LIFESTYLE_FACTORS} title="Lifestyle Factors" showIcon={true} />

          {/* Header */}
          <PrognosticTimeline
            days={prognosticDays}
            duration="14 Days"
            backgroundImage={require('@/assets/images/prognostic_timeline_bg_face.jpg')}
            title="Prognostic Timeline"
            showIcon={true}
            onDayPress={(day) => {
              console.log('Day pressed:', day.title);
              // Navigate to day details
            }}
          />
          {/* Button */}
          <PrimaryButton
            title="Generate Your Routine"
            onPress={() => {
              router.push('/(main)/routines');
            }}
            style={{ marginBottom: 20, marginTop: 32 }}
          />

          <TouchableOpacity
            onPress={() => {
              router.push('/(main)');
            }}
            activeOpacity={0.6}
            className="mt-4 py-5">
            <Text className="text-center font-outfitMedium text-[20px] text-[#361A0D]">
              Skip this product
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AiAnalysisCompleteScreen;

const styles = StyleSheet.create({});
