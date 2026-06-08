// app/(flow)/routines/ai-routine-generate/ai-routine.tsx
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { SunIcon, MoonIcon, CalendarIcon, TrashBinIcon } from '@/components/icons';
import { useToast } from '@/hooks/useToast';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { GradientProgressBar } from '@/components/GradientProgressBar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useGenerateProductRoutineMutation,
  useSaveRoutineMutation,
  RoutineStep,
  GenerateRoutineResponse,
} from '@/store/api/routineApi';

// ── Category → placeholder image map ─────────────────────────────────────────

const CATEGORY_IMAGES: Record<string, string> = {
  cleanser: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop',
  serum: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop',
  moisturizer: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=100&h=100&fit=crop',
  sunscreen: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&h=100&fit=crop',
  exfoliant: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=100&h=100&fit=crop',
  mask: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=100&h=100&fit=crop',
  'hair oil': 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=100&h=100&fit=crop',
  shampoo: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=100&h=100&fit=crop',
  conditioner: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=100&h=100&fit=crop',
  default: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop',
};

const getImageForCategory = (category: string): string => {
  const lower = category.toLowerCase();
  for (const key of Object.keys(CATEGORY_IMAGES)) {
    if (lower.includes(key)) return CATEGORY_IMAGES[key];
  }
  return CATEGORY_IMAGES.default;
};

// ── Phase types ───────────────────────────────────────────────────────────────

// ── Sub-components ────────────────────────────────────────────────────────────

const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const ReasonPointsGrid = ({ points }: { points: string[] }) => {
  if (!points || points.length === 0) return null;
  const rows = chunkArray(points, 2);
  return (
    <View className="gap-3">
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row justify-between gap-3">
          {row.map((title, idx) => (
            <View key={idx} className="flex-1 flex-row items-start">
              <View
                style={{
                  backgroundColor: '#361A0D',
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  borderWidth: 0.5,
                  borderBottomWidth: 1.3,
                  borderLeftColor: '#ffffff',
                  borderRightColor: '#ffffff',
                  borderBottomColor: '#FFFFFF',
                  marginRight: 12,
                  marginTop: 6,
                }}
              />
              <Text
                className="flex-1 font-outfitMedium text-[14px]"
                style={{
                  color: '#2E2117',
                  textShadowColor: '#FFFFFF',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}>
                {title}
              </Text>
            </View>
          ))}
          {row.length === 1 && <View className="flex-1" />}
        </View>
      ))}
    </View>
  );
};

const RoutineStepCard = ({
  step,
  index,
  isFirst,
  isLast,
  onDelete,
}: {
  step: RoutineStep;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onDelete: (stepId: string) => void;
}) => {
  const imageSource = step.product_url || getImageForCategory(step.product_category);

  return (
    <BorderlessShadowCard
      style={{
        padding: 12,
        marginTop: index === 0 ? 12 : 0,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#FFFFFF99',
        borderRadius: 24,
      }}
      b_tl={isFirst ? 24 : 0}
      b_tr={isFirst ? 24 : 0}
      b_bl={isLast ? 24 : 0}
      b_br={isLast ? 24 : 0}>
      <View className="flex-row items-start gap-3">
        {/* Product Image */}
        <View
          style={{
            width: 64,
            height: 72,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: '#FFFFFF99',
            borderLeftWidth: 0.6,
            borderRightWidth: 0.6,
            borderLeftColor: '#97908b33',
            borderRightColor: '#97908b33',
            backgroundColor: '#F0E6D8',
            overflow: 'hidden',
          }}>
          <Image
            source={{ uri: imageSource }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              style={{
                color: '#977857',
                fontFamily: 'Outfit-Medium',
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                flexShrink: 1,
                marginRight: 8,
              }}
              numberOfLines={1}>
              {step.product_category}
            </Text>
            <TouchableOpacity
              onPress={() => onDelete(step.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <TrashBinIcon size={12} color="#DC2626CC" />
            </TouchableOpacity>
          </View>

          <Text
            className="mt-1 font-outfitMedium text-[16px]"
            style={{
              color: '#2E2117',
              textShadowColor: '#FFFFFF',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
            {step.product_name || step.product_category}
          </Text>

          <Text
            className="mt-1 font-outfit text-[12px] leading-5"
            style={{
              color: '#2E211799',
              textShadowColor: '#FFFFFF',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
            {step.usage_reason}
          </Text>
        </View>
      </View>
    </BorderlessShadowCard>
  );
};

const RoutineSection = ({
  title,
  icon,
  steps,
  onDeleteStep,
}: {
  title: string;
  icon: React.ReactNode;
  steps: RoutineStep[];
  onDeleteStep: (stepId: string) => void;
}) => {
  if (!steps || steps.length === 0) return null;
  return (
    <View className="mt-6">
      <View className="mb-1 flex-row items-center gap-3">
        {icon}
        <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
          {title}
        </Text>
      </View>
      {steps.map((step, index) => (
        <RoutineStepCard
          key={step.id}
          step={step}
          index={index}
          isFirst={index === 0}
          isLast={index === steps.length - 1}
          onDelete={onDeleteStep}
        />
      ))}
    </View>
  );
};

// ── Main screen ───────────────────────────────────────────────────────────────

const AiRoutineScreen = () => {
  const router = useRouter();
  const { showError, showSuccess } = useToast();

  const { scan_id, scan_type = 'product' } = useLocalSearchParams<{
    scan_id?: string;
    scan_type?: string;
  }>();

  // ── API hooks — only generate + save needed here ──────────────────────────
  // DELETE /routine/step/:id is only called AFTER save, from the saved routines
  // management screen. During generation, removal is purely local state.
  const [generateRoutine, { isLoading: isGenerating }] = useGenerateProductRoutineMutation();
  const [saveRoutine, { isLoading: isSaving }] = useSaveRoutineMutation();

  // ── Local state ─────────────────────────────────────────────────────────────
  const [routineResponse, setRoutineResponse] = useState<GenerateRoutineResponse | null>(null);
  // `steps` is the working copy the user edits (remove steps before saving).
  // It starts as the full list from the API and shrinks as the user taps trash.
  const [steps, setSteps] = useState<RoutineStep[]>([]);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  // ── Generate on mount ───────────────────────────────────────────────────────

  const runGenerate = useCallback(async () => {
    if (!scan_id) {
      setGenerateError('No scan ID provided. Please go back and try again.');
      return;
    }
    setGenerateError(null);
    setSteps([]);

    try {
      const result = await generateRoutine({ product_scan_id: scan_id }).unwrap();

      // ── Handle duplicate: product already in a saved routine ──────────────
      if (result.duplicate) {
        setGenerateError(result.message ?? 'This product is already part of your saved routine.');
        return;
      }

      // ── Guard: routine payload must exist ─────────────────────────────────
      if (!result.routine?.routine?.steps) {
        setGenerateError('The routine could not be generated. Please try again.');
        return;
      }

      setRoutineResponse(result);
      setSteps(result.routine.routine.steps);
    } catch (err: any) {
      console.error('[AiRoutineScreen] generate error:', err);
      setGenerateError(
        err?.data?.message ?? err?.message ?? 'Failed to generate routine. Please try again.'
      );
    }
  }, [scan_id, generateRoutine]);

  useEffect(() => {
    runGenerate();
  }, []);

  useEffect(() => {
    if (isContentReady && isInitialLoad) setIsInitialLoad(false);
  }, [isContentReady]);

  // ── Local-only delete (no API call) ────────────────────────────────────────
  // The routine hasn't been saved yet, so there's nothing to delete on the
  // backend. We simply remove the step from local state. The save call will
  // only include the IDs of whatever steps remain.

  const handleDeleteStep = useCallback((stepId: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== stepId));
  }, []);

  // ── Save — sends only the remaining step IDs ────────────────────────────────

  const handleSaveRoutine = useCallback(async () => {
    const remainingIds = steps.map((s) => s.id);
    if (remainingIds.length === 0) {
      showError('Add at least one step before saving.');
      return;
    }
    try {
      await saveRoutine({ routine_step_id: remainingIds }).unwrap();
      showSuccess('Routine saved to your profile!');
      router.replace('/(main)/routines');
    } catch (err: any) {
      console.error('[AiRoutineScreen] save error:', err);
      showError(err?.data?.message ?? 'Failed to save routine. Please try again.');
    }
  }, [steps, saveRoutine, showSuccess, showError, router]);

  // ── Derived helpers ─────────────────────────────────────────────────────────

  const timeLabel = routineResponse?.routine?.routine?.time ?? 'weekly';

  const getSectionIcon = (time: string) => {
    const t = time.toLowerCase();
    if (t.includes('morning') || t.includes('am')) return <SunIcon size={24} color="#F59E0B" />;
    if (t.includes('night') || t.includes('pm') || t.includes('evening'))
      return <MoonIcon size={24} color="#6366F1" />;
    return <CalendarIcon size={24} color="#A855F7" />;
  };

  const getSectionTitle = (time: string) => {
    const t = time.toLowerCase();
    if (t.includes('morning')) return 'Morning Routine';
    if (t.includes('night') || t.includes('evening')) return 'Night Routine';
    if (t.includes('weekly')) return 'Weekly Care';
    if (t.includes('daily')) return 'Daily Routine';
    return `${time.charAt(0).toUpperCase()}${time.slice(1)} Routine`;
  };

  const whyPoints: string[] = routineResponse?.routine?.why ?? [];

  // ── Guards ──────────────────────────────────────────────────────────────────

  if (isRendering && isInitialLoad) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Preparing AI routine..." />
      </SafeAreaView>
    );
  }

  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="AI Routine Generator" height={50} backButton />
        <ErrorScreen message={renderError} onRetry={runGenerate} />
      </SafeAreaView>
    );
  }

  if (isGenerating) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="AI Routine Generator" height={50} backButton />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#95B287" />
          <Text className="mt-3 font-outfit text-[14px]" style={{ color: '#2E211799' }}>
            Analyzing your scan...
          </Text>
          <Text className="mt-1 font-outfit text-[12px]" style={{ color: '#2E211799' }}>
            Creating personalized routine
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (generateError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="AI Routine Generator" height={50} backButton />
        <ErrorScreen message={generateError} onRetry={runGenerate} />
      </SafeAreaView>
    );
  }

  if (!routineResponse) return null;

  console.log(`Step :`, steps);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader
        title="AI Routine Generator"
        subtitle="Personalized based on your latest scan."
        backButton
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 20,
          flexGrow: 1,
        }}
        className="flex-1">
        <View
          className="px-container"
          style={{
            opacity: isContentReady ? 1 : 0,
            transform: [{ translateY: isContentReady ? 0 : 10 }],
          }}>
          {/* ── Why this Routine? ─────────────────────────────────────────── */}
          {whyPoints.length > 0 && (
            <View
              className="mb-4 gap-3 bg-transparent p-4"
              style={{
                borderWidth: 1,
                borderColor: '#FFFFFF99',
                borderRadius: 24,
                borderTopWidth: 2,
                borderBottomWidth: 2,
              }}>
              <Text
                className="font-outfitMedium text-[20px]"
                style={{
                  color: '#2E2117',
                  textShadowColor: '#FFFFFF',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}>
                Why this Routine?
              </Text>
              <ReasonPointsGrid points={whyPoints} />
            </View>
          )}

          {/* ── Routine steps ─────────────────────────────────────────────── */}
          {steps.length > 0 ? (
            <RoutineSection
              title={getSectionTitle(timeLabel)}
              icon={getSectionIcon(timeLabel)}
              steps={steps}
              onDeleteStep={handleDeleteStep}
            />
          ) : (
            // All steps removed — offer regeneration instead of a broken save
            <View className="mt-12 items-center px-6">
              <Text
                className="text-center font-outfitMedium text-[16px]"
                style={{ color: '#2E2117' }}>
                No steps remaining
              </Text>
              <Text
                className="mt-2 text-center font-outfit text-[13px]"
                style={{ color: '#2E211799' }}>
                You&apos;ve removed all steps. Regenerate to get a fresh routine.
              </Text>
              <TouchableOpacity
                onPress={runGenerate}
                className="mt-6 rounded-full bg-[#361A0D] px-8 py-4">
                <Text className="font-outfitMedium text-[15px] text-white">Regenerate Routine</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Actions ───────────────────────────────────────────────────── */}
          {steps.length > 0 && (
            <View className="mt-8 gap-3">
              <PrimaryButton
                title="Save & Apply Routine"
                onPress={handleSaveRoutine}
                disabled={isSaving}
                isLoading={isSaving}
                loaderColor="#361A0D"
                style={{ marginBottom: 8 }}
              />
              <TouchableOpacity
                onPress={runGenerate}
                disabled={isGenerating}
                activeOpacity={0.6}
                className="py-4">
                <Text
                  className="text-center font-outfitMedium text-[16px]"
                  style={{ color: '#361A0D' }}>
                  Regenerate Routine
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AiRoutineScreen;

const styles = StyleSheet.create({});
