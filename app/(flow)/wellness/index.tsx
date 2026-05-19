// // app/(flow)/wellness/index.tsx
// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   LayoutChangeEvent,
//   Modal,
//   Animated,
// } from 'react-native';
// import React, { useState, useRef, useEffect } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import PrimaryButton from '@/components/buttons/PrimaryButton';
// import { LoveIcon, ThreeCurvedIcon, ZLikeIcon } from '@/components/icons';
// import { useAuth } from '@/hooks/useAuth';
// import { useToast } from '@/hooks/useToast';
// import { CircularIconButton } from '@/components/buttons/CircularIconButton';
// import { BreathingExercise } from '@/components/wellness/BreathingExercise';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import ErrorScreen from '@/components/errors/ErrorScreen';
// import { useScreenReady } from '@/hooks/useScreenReady';
// import { useRouter } from 'expo-router';

// const WellnessScreen = () => {
//   const router = useRouter();
//   const [stressLevel, setStressLevel] = useState(50);
//   const [barWidth, setBarWidth] = useState(0);
//   const [showBreathingModal, setShowBreathingModal] = useState(false);
//   const [isContentLoaded, setIsContentLoaded] = useState(false);
//   const barRef = useRef<View>(null);

//   // Animation values
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(30)).current;

//   // Screen ready state for smooth transitions
//   const { isRendering, isContentReady, renderError } = useScreenReady({
//     dependencies: [],
//     delay: 100,
//     initialReady: false,
//   });

//   const { logout } = useAuth();
//   const { showSuccess, showError } = useToast();

//   // Start animation when content is ready
//   useEffect(() => {
//     if (isContentReady && !isContentLoaded) {
//       setIsContentLoaded(true);
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 400,
//           useNativeDriver: true,
//         }),
//         Animated.timing(slideAnim, {
//           toValue: 0,
//           duration: 400,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     }
//   }, [isContentReady, isContentLoaded]);

//   const handleStressLog = () => {
//     let stressText = '';
//     if (stressLevel <= 20) stressText = 'Very Calm';
//     else if (stressLevel <= 40) stressText = 'Calm';
//     else if (stressLevel <= 60) stressText = 'Moderate';
//     else if (stressLevel <= 80) stressText = 'Stressed';
//     else stressText = 'Highly Stressed';

//     showSuccess(`Stress level logged: ${stressText} (${Math.round(stressLevel)}%)`);
//   };

//   const handleBarPress = (event: any) => {
//     if (!barWidth) return;

//     const { locationX } = event.nativeEvent;
//     const percentage = (locationX / barWidth) * 100;
//     const newValue = Math.min(100, Math.max(0, percentage));
//     setStressLevel(newValue);
//   };

//   const handleBarLayout = (event: LayoutChangeEvent) => {
//     const { width } = event.nativeEvent.layout;
//     setBarWidth(width);
//   };

//   const getStressText = () => {
//     if (stressLevel <= 20) return 'Very Calm';
//     if (stressLevel <= 40) return 'Calm';
//     if (stressLevel <= 60) return 'Moderate';
//     if (stressLevel <= 80) return 'Stressed';
//     return 'Highly Stressed';
//   };

//   const getStressColor = () => {
//     if (stressLevel <= 20) return '#10B981';
//     if (stressLevel <= 40) return '#84CC16';
//     if (stressLevel <= 60) return '#F59E0B';
//     if (stressLevel <= 80) return '#F97316';
//     return '#EF4444';
//   };

//   const handleRetry = () => {
//     router.replace('/(flow)/wellness');
//   };

//   // Show initial render loading (useScreenReady)
//   if (isRendering) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Creating your calm space..." />
//       </SafeAreaView>
//     );
//   }

//   // Show error if rendering failed
//   if (renderError) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Wellness" height={50} backButton={true} />
//         <ErrorScreen message={renderError} onRetry={handleRetry} />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader title="Wellness" height={50} backButton={true} />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           paddingTop: 10,
//           flexGrow: 1,
//         }}
//         className="flex-1">
//         <Animated.View
//           className="px-container"
//           style={{
//             opacity: fadeAnim,
//             transform: [{ translateY: slideAnim }],
//           }}>
//           {/* Daily Stress Check-in Card */}
//           <BorderlessShadowCard
//             style={{
//               paddingVertical: 16,
//               paddingHorizontal: 24,
//             }}>
//             <View className="flex-row gap-3">
//               <CircularIconButton size={32} icon={<ZLikeIcon size={20} color="#F59E0B" />} />
//               <View className="flex-1">
//                 <Text className="font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
//                   Daily Stress Check-in
//                 </Text>
//                 <Text className="mt-[6px] font-outfit text-[12px]" style={{ color: '#2A2118B2' }}>
//                   High stress increases cortisol, which can lead to breakouts. How are you feeling
//                   today?
//                 </Text>
//               </View>
//             </View>

//             {/* Stress Level Indicator */}
//             <View className="mt-6">
//               <TouchableOpacity
//                 activeOpacity={0.8}
//                 onPress={handleBarPress}
//                 onLayout={handleBarLayout}
//                 style={{
//                   height: 40,
//                   justifyContent: 'center',
//                 }}>
//                 <View
//                   ref={barRef}
//                   style={{
//                     height: 10,
//                     backgroundColor: '#2E21173D',
//                     borderRadius: 8,
//                     overflow: 'hidden',
//                   }}>
//                   <View
//                     style={{
//                       width: `${stressLevel}%`,
//                       height: '100%',
//                       backgroundColor: getStressColor(),
//                       borderRadius: 8,
//                     }}
//                   />
//                 </View>

//                 <View
//                   style={{
//                     position: 'absolute',
//                     left: `${stressLevel}%`,
//                     marginLeft: -8,
//                     width: 16,
//                     height: 16,
//                     borderRadius: 8,
//                     backgroundColor: '#361A0D',
//                     borderWidth: 2,
//                     borderColor: '#FFFFFF',
//                     shadowColor: '#000',
//                     shadowOffset: { width: 0, height: 2 },
//                     shadowOpacity: 0.25,
//                     shadowRadius: 4,
//                     elevation: 4,
//                   }}
//                 />
//               </TouchableOpacity>

//               <View className="mb-2 flex-row justify-between">
//                 <Text className="font-outfit text-[12px]" style={{ color: '#361A0D' }}>
//                   Very Calm
//                 </Text>
//                 <Text className="font-outfit text-[12px]" style={{ color: '#361A0D' }}>
//                   Highly Stressed
//                 </Text>
//               </View>

//               <View className="mt-3 items-center">
//                 <Text className="font-outfitMedium text-[14px]" style={{ color: getStressColor() }}>
//                   Current: {getStressText()}
//                 </Text>
//               </View>
//             </View>

//             <PrimaryButton
//               title="Log Stress Level"
//               onPress={handleStressLog}
//               style={{ marginTop: 16 }}
//             />
//           </BorderlessShadowCard>

//           {/* Breathing Exercise Card */}
//           <BorderlessShadowCard
//             b_tl={0}
//             b_tr={0}
//             b_bl={0}
//             b_br={0}
//             style={{
//               marginTop: 12,
//               paddingVertical: 16,
//               paddingHorizontal: 24,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <CircularIconButton
//               style={{ backgroundColor: '#CAA78933' }}
//               size={76}
//               icon={<ThreeCurvedIcon width={26} height={24} />}
//             />
//             <Text className="mt-3 font-outfitMedium text-[20px]" style={{ color: '#2E2117' }}>
//               3-Min Breathing
//             </Text>
//             <Text
//               className="mt-[6px] text-center font-outfit text-[14px]"
//               style={{ color: '#2E211799' }}>
//               Lower your cortisol levels instantly with guided box breathing.
//             </Text>
//             <PrimaryButton
//               title="Start Exercise"
//               onPress={() => setShowBreathingModal(true)}
//               style={{ width: '100%', marginTop: 12 }}
//             />
//           </BorderlessShadowCard>

//           {/* Cycle Syncing Card */}
//           <BorderlessShadowCard
//             b_tl={0}
//             b_tr={0}
//             b_bl={24}
//             b_br={24}
//             style={{
//               marginTop: 12,
//               paddingVertical: 16,
//               paddingHorizontal: 24,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <View className="flex-row gap-3">
//               <CircularIconButton size={32} icon={<LoveIcon size={20} color="#EC4899" />} />
//               <View className="flex-1">
//                 <Text className="font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
//                   Cycle Syncing
//                 </Text>
//                 <Text className="mt-[6px] font-outfit text-[12px]" style={{ color: '#2A2118B2' }}>
//                   You are in your <Text className="font-OutfitBold text-[12px]">Luteal Phase</Text>{' '}
//                   Progesterone is rising, which may increase sebum production.
//                 </Text>
//               </View>
//             </View>
//             <View
//               style={{
//                 height: 1,
//                 width: '100%',
//                 backgroundColor: '#2E211733',
//                 marginVertical: 12,
//               }}
//             />
//             <Text
//               className="w-full text-start font-outfitMedium text-[16px]"
//               style={{ color: '#2A2118' }}>
//               AI Routine Adjustment
//             </Text>
//             <Text className="font-outfit text-[12px]" style={{ color: '#2A2118B2' }}>
//               We&apos;ve added a gentle BHA exfoliant to your night routine to prevent clogged pores
//             </Text>
//           </BorderlessShadowCard>
//         </Animated.View>
//       </ScrollView>

//       {/* Breathing Exercise Modal */}
//       <Modal
//         visible={showBreathingModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowBreathingModal(false)}>
//         <BreathingExercise onClose={() => setShowBreathingModal(false)} />
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default WellnessScreen;

// const styles = StyleSheet.create({});

// app/(flow)/wellness/index.tsx
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  LayoutChangeEvent,
  Modal,
  Animated,
  Platform,
  TextInput,
} from 'react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { LoveIcon, ThreeCurvedIcon, ZLikeIcon, CalendarIcon } from '@/components/icons';
import { useToast } from '@/hooks/useToast';
import { CircularIconButton } from '@/components/buttons/CircularIconButton';
import { BreathingExercise } from '@/components/wellness/BreathingExercise';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import { useScreenReady } from '@/hooks/useScreenReady';
import { useRouter } from 'expo-router';
import {
  useGetStressQuery,
  useUpdateStressMutation,
  useGetCyclePhaseQuery,
  useUpdateCycleStartDateMutation,
} from '@/store/api/profileApi';

// ─── Stress helpers ───────────────────────────────────────────────────────────

// The API accepts / returns stress as a string label. We store a 0-100 slider
// value locally and convert only when sending/receiving.
const STRESS_LABELS = ['very calm', 'calm', 'moderate', 'stressed', 'highly stressed'] as const;
type StressLabel = (typeof STRESS_LABELS)[number];

const sliderToLabel = (value: number): StressLabel => {
  if (value <= 20) return 'very calm';
  if (value <= 40) return 'calm';
  if (value <= 60) return 'moderate';
  if (value <= 80) return 'stressed';
  return 'highly stressed';
};

const labelToSlider = (label: string | null): number => {
  if (!label) return 50;
  switch (label.toLowerCase()) {
    case 'very calm':
      return 10;
    case 'calm':
      return 30;
    case 'moderate':
      return 50;
    case 'stressed':
      return 70;
    case 'highly stressed':
      return 90;
    default:
      return 50;
  }
};

const getStressDisplayText = (value: number): string => {
  if (value <= 20) return 'Very Calm';
  if (value <= 40) return 'Calm';
  if (value <= 60) return 'Moderate';
  if (value <= 80) return 'Stressed';
  return 'Highly Stressed';
};

const getStressColor = (value: number): string => {
  if (value <= 20) return '#10B981';
  if (value <= 40) return '#84CC16';
  if (value <= 60) return '#F59E0B';
  if (value <= 80) return '#F97316';
  return '#EF4444';
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

/** Returns "YYYY-MM-DD" from a JS Date */
const toISODate = (d: Date): string => d.toISOString().split('T')[0];

/** Formats "YYYY-MM-DD" → "12 Jan 2025" for display */
const formatDisplayDate = (iso: string | null): string => {
  if (!iso) return 'Not set';
  const [year, month, day] = iso.split('-');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`;
};

/** Validates "YYYY-MM-DD" format */
const isValidDate = (s: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s));

// ─── CycleDateModal ───────────────────────────────────────────────────────────

interface CycleDateModalProps {
  visible: boolean;
  currentDate: string | null; // "YYYY-MM-DD" or null
  onSave: (isoDate: string) => void;
  onClose: () => void;
  isSaving: boolean;
}

function CycleDateModal({ visible, currentDate, onSave, onClose, isSaving }: CycleDateModalProps) {
  const [input, setInput] = useState(currentDate ?? '');
  const [error, setError] = useState('');

  // Reset input each time the modal opens
  useEffect(() => {
    if (visible) {
      setInput(currentDate ?? '');
      setError('');
    }
  }, [visible, currentDate]);

  // Auto-insert dashes as user types (YYYY-MM-DD)
  const handleChange = (text: string) => {
    // Strip all non-digits
    const digits = text.replace(/\D/g, '');
    let formatted = digits;
    if (digits.length > 4) formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
    if (digits.length > 6)
      formatted = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
    setInput(formatted.slice(0, 10));
    setError('');
  };

  const handleSave = () => {
    if (!isValidDate(input)) {
      setError('Please enter a valid date (YYYY-MM-DD)');
      return;
    }
    // Don't allow future dates
    if (new Date(input) > new Date()) {
      setError('Period start date cannot be in the future');
      return;
    }
    onSave(input);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: '#00000066',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}} // prevent close on inner tap
          style={{
            width: '100%',
            backgroundColor: '#FDF8F4',
            borderRadius: 24,
            padding: 24,
          }}>
          {/* Title */}
          <Text
            style={{
              fontFamily: 'Outfit-SemiBold',
              fontSize: 18,
              color: '#2E2117',
              marginBottom: 4,
            }}>
            Period Start Date
          </Text>
          <Text
            style={{
              fontFamily: 'Outfit-Regular',
              fontSize: 13,
              color: '#2E211799',
              marginBottom: 20,
            }}>
            When did your last period begin? This helps us personalise your skincare routine.
          </Text>

          {/* Date input */}
          <View
            style={{
              borderWidth: 1.5,
              borderColor: error ? '#EF4444' : '#CAA78966',
              borderRadius: 100,
              paddingHorizontal: 20,
              paddingVertical: 14,
              backgroundColor: '#FFFFFF',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CalendarIcon width={18} height={18} color="#759A52" style={{ marginRight: 10 }} />
            <TextInput
              value={input}
              onChangeText={handleChange}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#2E211766"
              keyboardType="numeric"
              maxLength={10}
              style={{
                flex: 1,
                fontFamily: 'Outfit-Regular',
                fontSize: 15,
                color: '#2E2117',
                padding: 0,
              }}
            />
          </View>

          {error ? (
            <Text
              style={{
                fontFamily: 'Outfit-Regular',
                fontSize: 12,
                color: '#EF4444',
                marginTop: 6,
                marginLeft: 8,
              }}>
              {error}
            </Text>
          ) : null}

          <Text
            style={{
              fontFamily: 'Outfit-Regular',
              fontSize: 12,
              color: '#2E211766',
              marginTop: 8,
              marginLeft: 8,
            }}>
            Format: YYYY-MM-DD (e.g. {toISODate(new Date())})
          </Text>

          {/* Actions */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 100,
                borderWidth: 1.5,
                borderColor: '#CAA78966',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 14, color: '#2E2117' }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 100,
                backgroundColor: '#679838',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isSaving ? 0.6 : 1,
              }}>
              <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 14, color: '#FFFFFF' }}>
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

const WellnessScreen = () => {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  // ── Stress state ───────────────────────────────────────────────────────────
  const [stressLevel, setStressLevel] = useState(50);
  const [barWidth, setBarWidth] = useState(0);
  const [isSavingStress, setIsSavingStress] = useState(false);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [showCycleDateModal, setShowCycleDateModal] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // ── API ────────────────────────────────────────────────────────────────────
  const { data: stressData, isLoading: isLoadingStress } = useGetStressQuery();

  const [updateStress] = useUpdateStressMutation();

  const {
    data: cycleData,
    isLoading: isLoadingCycle,
    isError: isCycleError,
    refetch: refetchCycle,
  } = useGetCyclePhaseQuery();

  const [updateCycleStartDate, { isLoading: isSavingCycle }] = useUpdateCycleStartDateMutation();

  // ── Screen ready ───────────────────────────────────────────────────────────
  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [isLoadingStress, isLoadingCycle],
    delay: 100,
    initialReady: false,
  });

  // Pre-fill stress slider from API
  useEffect(() => {
    if (stressData?.stress_level !== undefined) {
      setStressLevel(labelToSlider(stressData.stress_level));
    }
  }, [stressData]);

  // Animate in
  useEffect(() => {
    if (isContentReady && !isContentLoaded) {
      setIsContentLoaded(true);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }
  }, [isContentReady, isContentLoaded]);

  // ── Stress handlers ────────────────────────────────────────────────────────

  const handleBarPress = (event: any) => {
    if (!barWidth) return;
    const { locationX } = event.nativeEvent;
    const percentage = Math.min(100, Math.max(0, (locationX / barWidth) * 100));
    setStressLevel(percentage);
  };

  const handleBarLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  const handleLogStress = async () => {
    const label = sliderToLabel(stressLevel);
    setIsSavingStress(true);
    try {
      await updateStress({ stress_level: label }).unwrap();
      showSuccess(`Stress level logged: ${getStressDisplayText(stressLevel)}`);
    } catch (error: any) {
      const detail = error?.data?.detail || error?.data?.message;
      showError(detail || 'Failed to log stress. Please try again.');
    } finally {
      setIsSavingStress(false);
    }
  };

  // ── Cycle handlers ─────────────────────────────────────────────────────────

  const handleSaveCycleDate = async (isoDate: string) => {
    try {
      await updateCycleStartDate({ period_start_date: isoDate }).unwrap();
      showSuccess('Period start date updated');
      setShowCycleDateModal(false);
    } catch (error: any) {
      const detail = error?.data?.detail || error?.data?.message;
      showError(detail || 'Invalid date. Please try again.');
    }
  };

  // ── Cycle display helpers ──────────────────────────────────────────────────

  const cyclePhaseLabel = (() => {
    const phase = cycleData?.current_phase;
    if (!phase) return null;
    // Capitalise first letter of each word
    return phase.replace(/\b\w/g, (c) => c.toUpperCase());
  })();

  const cyclePhaseDescription = cycleData?.phase_description ?? null;
  const cycleStartDate = cycleData?.period_start_date ?? null;
  const hasCycleData = !!cyclePhaseLabel;

  // ── Render guards ──────────────────────────────────────────────────────────

  if (isRendering) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Creating your calm space..." />
      </SafeAreaView>
    );
  }

  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Wellness" height={50} backButton={true} />
        <ErrorScreen message={renderError} onRetry={() => router.replace('/(flow)/wellness')} />
      </SafeAreaView>
    );
  }

  // ── UI ─────────────────────────────────────────────────────────────────────

  const stressColor = getStressColor(stressLevel);

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Wellness" height={50} backButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 10,
          flexGrow: 1,
        }}
        className="flex-1">
        <Animated.View
          className="px-container"
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* ── Daily Stress Check-in ────────────────────────────────────── */}
          <BorderlessShadowCard style={{ paddingVertical: 16, paddingHorizontal: 24 }}>
            <View className="flex-row gap-3">
              <CircularIconButton size={32} icon={<ZLikeIcon size={20} color="#F59E0B" />} />
              <View className="flex-1">
                <Text className="font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
                  Daily Stress Check-in
                </Text>
                <Text className="mt-[6px] font-outfit text-[12px]" style={{ color: '#2A2118B2' }}>
                  High stress increases cortisol, which can lead to breakouts. How are you feeling
                  today?
                </Text>
              </View>
            </View>

            {/* Slider */}
            <View className="mt-6">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleBarPress}
                onLayout={handleBarLayout}
                style={{ height: 40, justifyContent: 'center' }}>
                <View
                  style={{
                    height: 10,
                    backgroundColor: '#2E21173D',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}>
                  <View
                    style={{
                      width: `${stressLevel}%`,
                      height: '100%',
                      backgroundColor: stressColor,
                      borderRadius: 8,
                    }}
                  />
                </View>
                <View
                  style={{
                    position: 'absolute',
                    left: `${stressLevel}%`,
                    marginLeft: -8,
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: '#361A0D',
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                />
              </TouchableOpacity>

              <View className="mb-2 flex-row justify-between">
                <Text className="font-outfit text-[12px]" style={{ color: '#361A0D' }}>
                  Very Calm
                </Text>
                <Text className="font-outfit text-[12px]" style={{ color: '#361A0D' }}>
                  Highly Stressed
                </Text>
              </View>

              <View className="mt-3 items-center">
                <Text className="font-outfitMedium text-[14px]" style={{ color: stressColor }}>
                  Current: {getStressDisplayText(stressLevel)}
                </Text>
              </View>
            </View>

            <PrimaryButton
              title={isSavingStress ? 'Saving...' : 'Log Stress Level'}
              onPress={handleLogStress}
              disabled={isSavingStress}
              isLoading={isSavingStress}
              style={{ marginTop: 16 }}
            />
          </BorderlessShadowCard>

          {/* ── 3-Min Breathing ──────────────────────────────────────────── */}
          <BorderlessShadowCard
            b_tl={0}
            b_tr={0}
            b_bl={0}
            b_br={0}
            style={{
              marginTop: 12,
              paddingVertical: 16,
              paddingHorizontal: 24,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CircularIconButton
              style={{ backgroundColor: '#CAA78933' }}
              size={76}
              icon={<ThreeCurvedIcon width={26} height={24} />}
            />
            <Text className="mt-3 font-outfitMedium text-[20px]" style={{ color: '#2E2117' }}>
              3-Min Breathing
            </Text>
            <Text
              className="mt-[6px] text-center font-outfit text-[14px]"
              style={{ color: '#2E211799' }}>
              Lower your cortisol levels instantly with guided box breathing.
            </Text>
            <PrimaryButton
              title="Start Exercise"
              onPress={() => setShowBreathingModal(true)}
              style={{ width: '100%', marginTop: 12 }}
            />
          </BorderlessShadowCard>

          {/* ── Cycle Syncing ─────────────────────────────────────────────── */}
          <BorderlessShadowCard
            b_tl={0}
            b_tr={0}
            b_bl={24}
            b_br={24}
            style={{
              marginTop: 12,
              paddingVertical: 16,
              paddingHorizontal: 24,
            }}>
            {/* Header row */}
            <View className="flex-row gap-3">
              <CircularIconButton size={32} icon={<LoveIcon size={20} color="#EC4899" />} />
              <View className="flex-1">
                <Text className="font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
                  Cycle Syncing
                </Text>
                {hasCycleData ? (
                  <Text className="mt-[6px] font-outfit text-[12px]" style={{ color: '#2A2118B2' }}>
                    You are in your{' '}
                    <Text className="font-OutfitBold text-[12px]">{cyclePhaseLabel}</Text>
                    {cyclePhaseDescription ? `. ${cyclePhaseDescription}` : ''}
                  </Text>
                ) : (
                  <Text className="mt-[6px] font-outfit text-[12px]" style={{ color: '#2A2118B2' }}>
                    Set your period start date to get personalised skincare recommendations.
                  </Text>
                )}
              </View>
            </View>

            {/* Current start date row */}
            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: '#2E211733',
                marginVertical: 12,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}>
              <View>
                <Text className="font-outfitMedium text-[13px]" style={{ color: '#2A211899' }}>
                  Period Start Date
                </Text>
                <Text className="font-outfitMedium text-[15px]" style={{ color: '#2A2118' }}>
                  {formatDisplayDate(cycleStartDate)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCycleDateModal(true)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 100,
                  borderWidth: 1.5,
                  borderColor: '#679838',
                }}>
                <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 13, color: '#679838' }}>
                  {cycleStartDate ? 'Update' : 'Set Date'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* AI routine adjustment — only show when phase is known */}
            {hasCycleData && (
              <>
                <View
                  style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: '#2E211733',
                    marginBottom: 12,
                  }}
                />
                <Text
                  className="w-full text-start font-outfitMedium text-[16px]"
                  style={{ color: '#2A2118' }}>
                  AI Routine Adjustment
                </Text>
                <Text className="font-outfit text-[12px]" style={{ color: '#2A2118B2' }}>
                  We&apos;ve tailored your skincare routine based on your current cycle phase.
                </Text>
              </>
            )}
          </BorderlessShadowCard>
        </Animated.View>
      </ScrollView>

      {/* Breathing modal */}
      <Modal
        visible={showBreathingModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBreathingModal(false)}>
        <BreathingExercise onClose={() => setShowBreathingModal(false)} />
      </Modal>

      {/* Cycle date picker modal */}
      <CycleDateModal
        visible={showCycleDateModal}
        currentDate={cycleStartDate}
        onSave={handleSaveCycleDate}
        onClose={() => setShowCycleDateModal(false)}
        isSaving={isSavingCycle}
      />
    </SafeAreaView>
  );
};

export default WellnessScreen;
