// // app/(flow)/product-scan/analysis-complete.tsx
// import {
//   ImageBackground,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import PillowBadge from '@/components/buttons/PillowBadge';
// import { BookIcon } from '@/components/icons';
// import PrimaryVariantButton from '@/components/buttons/PrimaryVariantButton';
// import { CubeIcon } from '@/components/icons/CubeIcon';
// import AnalysingResultScoreCard from '@/components/scans/AnalysingResultScoreCard';
// import { DetectedConditionsList } from '@/components/scans/DetectedConditionsList';
// import { DetectedCondition } from '@/components/scans/DetectedConditionCard';
// import { AttentionPoint, ProductAttentionPoints } from '@/components/scans/ProductAttentionPoints';
// import { WhatToDoPoint, WhatToDoPoints } from '@/components/scans/WhatToDoPoints';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useScreenReady } from '@/hooks/useScreenReady';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import ErrorScreen from '@/components/errors/ErrorScreen';

// // ── Types mirroring the API response shape ────────────────────────────────────

// interface ScoreProfile {
//   compatibility: number;
//   safety: number;
//   redness: number;
//   effectiveness: number;
//   evenness: number;
// }

// interface AnalysisItem {
//   score: number;
//   intensity: 'low' | 'medium' | 'high';
//   why: string;
// }

// interface ScanResult {
//   _placeholder?: boolean;
//   scan_id: string;
//   product: {
//     name: string;
//     brand: string;
//     category: string;
//     id: string;
//     image_url: string;
//   };
//   detected_ingredients: string[];
//   ingredient_conflicts: string[];
//   ingredient_intelligence: {
//     irritation_load: number;
//     exfoliation_load: number;
//     barrier_stress: number;
//     active_intensity: number;
//   };
//   analysis: {
//     overall_score: number;
//     score_profile: ScoreProfile;
//     compatibility_analysis: {
//       ingredient_conflict: AnalysisItem;
//       allergy_risk: AnalysisItem;
//     };
//     product_benefits: {
//       high_compatibility: AnalysisItem;
//       ingredient_synergy: AnalysisItem;
//     };
//     what_to_stop: string[];
//     what_to_do: string[];
//     learn_more: string;
//   };
//   catalog_product: {
//     id: string;
//     name: string;
//     image_url: string;
//     category: string;
//     tags: string[];
//     concerns: string[];
//     priority: number;
//   } | null;
//   barcode?: { value: string; type: string };
// }

// // ── Fallback values ───────────────────────────────────────────────────────────

// const FALLBACK_ANALYSIS_ITEM: AnalysisItem = { score: 0, intensity: 'low', why: '' };

// // ── Colour helpers ────────────────────────────────────────────────────────────

// const intensityGradient = (
//   intensity: 'low' | 'medium' | 'high' | undefined,
//   positive = false
// ): [string, string] => {
//   if (positive) return ['#10B981', '#059669'];
//   switch (intensity) {
//     case 'high':
//       return ['#F87171', '#DC2626'];
//     case 'medium':
//       return ['#FBBF24', '#D97706'];
//     default:
//       return ['#10B981', '#059669'];
//   }
// };

// const intensityProgress = (score: number | undefined): number =>
//   Math.min(100, Math.max(0, score ?? 0));

// // ── Main component ────────────────────────────────────────────────────────────

// const AiAnalysisCompleteScreen = () => {
//   const router = useRouter();
//   const { scanResult, imageUri, scanType } = useLocalSearchParams<{
//     scanResult?: string;
//     imageUri?: string;
//     scanType?: string;
//   }>();

//   const [data, setData] = useState<ScanResult | null>(null);
//   const [parseError, setParseError] = useState<string | null>(null);

//   const productLearnMoreBgImage = require('@/assets/images/productLearnMoreBgImage.png');

//   const { isRendering, isContentReady, renderError } = useScreenReady({
//     dependencies: [data],
//     delay: 100,
//     initialReady: false,
//   });
//   // Parse the JSON string passed via router params once on mount
//   useEffect(() => {
//     if (!scanResult) {
//       setParseError('No scan result received.');
//       return;
//     }
//     try {
//       const parsed: ScanResult = JSON.parse(scanResult);
//       setData(parsed);
//     } catch (e) {
//       console.error('[analysis-complete] failed to parse scanResult:', e);
//       setParseError('Could not read scan result.');
//     }
//   }, [scanResult]);

//   // ── Safe accessors (guard against any remaining shape inconsistencies) ─────

//   const scoreProfile = data?.analysis?.score_profile;
//   const compatibilityAnalysis = data?.analysis?.compatibility_analysis;
//   const productBenefits = data?.analysis?.product_benefits;

//   const ingredientConflict = compatibilityAnalysis?.ingredient_conflict ?? FALLBACK_ANALYSIS_ITEM;
//   const allergyRisk = compatibilityAnalysis?.allergy_risk ?? FALLBACK_ANALYSIS_ITEM;
//   const highCompatibility = productBenefits?.high_compatibility ?? FALLBACK_ANALYSIS_ITEM;
//   const ingredientSynergy = productBenefits?.ingredient_synergy ?? FALLBACK_ANALYSIS_ITEM;

//   const whatToStop = data?.analysis?.what_to_stop ?? [];
//   const whatToDo = data?.analysis?.what_to_do ?? [];
//   const learnMore = data?.analysis?.learn_more ?? '';

//   // ── Derived display data ──────────────────────────────────────────────────

//   const productStats = scoreProfile
//     ? [
//         { label: 'Compatibility', value: String(scoreProfile.compatibility), color: '#60A5FA' },
//         { label: 'Safety', value: String(scoreProfile.safety), color: '#4ADE80' },
//         { label: 'Redness', value: String(scoreProfile.redness), color: '#FB7185' },
//         { label: 'Effectiveness', value: String(scoreProfile.effectiveness), color: '#FBBF24' },
//         { label: 'Evenness', value: String(scoreProfile.evenness), color: '#A78BFA' },
//       ]
//     : [];

//   console.log('analysis data: ', data);

//   const compatibilityConditions: DetectedCondition[] = data
//     ? [
//         {
//           id: 'ingredient_conflict',
//           title: 'Ingredient Conflict',
//           severity:
//             ingredientConflict.intensity === 'high'
//               ? 'High'
//               : ingredientConflict.intensity === 'medium'
//                 ? 'Medium'
//                 : 'Low',
//           description: ingredientConflict.why,
//           progressValue: intensityProgress(ingredientConflict.score),
//           progressColor: intensityGradient(ingredientConflict.intensity),
//           // imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
//           imageUri: data.product?.image_url
//             ? { uri: data.product.image_url }
//             : require('@/assets/images/product_analysis_sample_image.jpg'),
//         },
//         {
//           id: 'allergy_risk',
//           title: 'Allergy Risk',
//           severity:
//             allergyRisk.intensity === 'high'
//               ? 'High'
//               : allergyRisk.intensity === 'medium'
//                 ? 'Medium'
//                 : 'Low',
//           description: allergyRisk.why,
//           progressValue: intensityProgress(allergyRisk.score),
//           progressColor: intensityGradient(allergyRisk.intensity),
//           // imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
//           imageUri: data.product?.image_url
//             ? { uri: data.product.image_url }
//             : require('@/assets/images/product_analysis_sample_image.jpg'),
//         },
//       ]
//     : [];

//   const benefitConditions: DetectedCondition[] = data
//     ? [
//         {
//           id: 'high_compatibility',
//           title: 'High Compatibility',
//           severity: 'Low',
//           description: highCompatibility.why,
//           progressValue: intensityProgress(highCompatibility.score),
//           progressColor: intensityGradient(highCompatibility.intensity, true),
//           // imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
//           imageUri: data.product?.image_url
//             ? { uri: data.product.image_url }
//             : require('@/assets/images/product_analysis_sample_image.jpg'),
//         },
//         {
//           id: 'ingredient_synergy',
//           title: 'Ingredient Synergy',
//           severity: 'Low',
//           description: ingredientSynergy.why,
//           progressValue: intensityProgress(ingredientSynergy.score),
//           progressColor: intensityGradient(ingredientSynergy.intensity, true),
//           // imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
//           imageUri: data.product?.image_url
//             ? { uri: data.product.image_url }
//             : require('@/assets/images/product_analysis_sample_image.jpg'),
//         },
//       ]
//     : [];

//   const attentionPoints: AttentionPoint[] = whatToStop.map((title, i) => ({
//     id: String(i),
//     title,
//   }));

//   const whatToDoPoints: WhatToDoPoint[] = whatToDo.map((title, i) => ({
//     id: String(i),
//     title,
//   }));

//   const isNonSkincare = data?.product?.id === 'not_a_skincare_product';
//   const isPlaceholder = data?._placeholder === true;

//   // ── Loading / error guards ────────────────────────────────────────────────

//   if (isRendering && !data) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Preparing analysis results..." />
//       </SafeAreaView>
//     );
//   }

//   if (renderError || parseError) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Product Analysis" height={50} backButton />
//         <ErrorScreen
//           message={renderError ?? parseError ?? 'Unknown error'}
//           onRetry={() => router.back()}
//         />
//       </SafeAreaView>
//     );
//   }

//   if (!data) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Loading..." />
//       </SafeAreaView>
//     );
//   }

//   // ── Non-skincare / placeholder notice ─────────────────────────────────────

//   if (isNonSkincare || isPlaceholder) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Product Analysis" height={50} backButton />
//         <View className="flex-1 items-center justify-center px-8">
//           <CubeIcon size={56} color="#977857" />
//           <Text
//             className="mt-6 text-center font-outfitMedium text-[20px]"
//             style={{ color: '#2E2117' }}>
//             {isPlaceholder ? 'Barcode Lookup Coming Soon' : 'Not a Skincare Product'}
//           </Text>
//           <Text className="mt-3 text-center font-outfit text-[14px]" style={{ color: '#2E2117AA' }}>
//             {isPlaceholder
//               ? `Barcode detected: ${data.barcode?.value ?? '—'}\nOur team is working on the barcode lookup endpoint. Please use the Manual Capture option for now.`
//               : learnMore}
//           </Text>
//           <TouchableOpacity
//             onPress={() => router.back()}
//             activeOpacity={0.7}
//             className="mt-8 rounded-full bg-[#361A0D] px-8 py-4">
//             <Text className="font-outfitMedium text-[16px] text-white">Try Another Product</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ── Main result view ──────────────────────────────────────────────────────

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader title="Product Analysis" height={50} backButton />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           paddingTop: 10,
//           flexGrow: 1,
//         }}
//         className="flex-1">
//         <View
//           className="px-container"
//           style={{
//             opacity: isContentReady ? 1 : 0,
//             transform: [{ translateY: isContentReady ? 0 : 10 }],
//           }}>
//           {/* ── Product Header ──────────────────────────────────────────────── */}
//           <View
//             className="mb-4 flex-row items-center justify-between gap-3 bg-transparent p-3"
//             style={{
//               borderWidth: 1,
//               borderColor: '#FFFFFF99',
//               borderRadius: 24,
//               borderTopWidth: 2,
//               borderBottomWidth: 2,
//             }}>
//             <View
//               className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#e8e4e1]"
//               style={{ borderWidth: 1, borderColor: '#FFFFFF' }}>
//               <CubeIcon size={28} color="#977857" />
//             </View>
//             <View className="flex-1">
//               <View className="flex-1 flex-row items-center justify-between">
//                 <Text
//                   className="font-outfitMedium text-[14px]"
//                   style={{
//                     color: '#2E2117',
//                     textShadowColor: '#FFFFFF',
//                     textShadowOffset: { width: 1, height: 1 },
//                     textShadowRadius: 2,
//                     flexShrink: 1,
//                     marginRight: 8,
//                   }}
//                   numberOfLines={2}>
//                   {data.product?.name ?? '—'}
//                 </Text>
//                 <PillowBadge
//                   title={data.product?.category || 'Product'}
//                   textStyle={{ color: '#2E2117B2', fontSize: 10 }}
//                   style={{
//                     backgroundColor: '#FFFFFF',
//                     paddingVertical: 1,
//                     paddingHorizontal: 8,
//                   }}
//                 />
//               </View>
//               {data.product?.brand ? (
//                 <Text
//                   className="mt-3 font-outfit text-[12px]"
//                   style={{
//                     color: '#2E211799',
//                     textShadowColor: '#FFFFFF',
//                     textShadowOffset: { width: 1, height: 1 },
//                     textShadowRadius: 2,
//                   }}>
//                   {data.product.brand}
//                 </Text>
//               ) : null}
//             </View>
//           </View>

//           {/* ── Score Card ──────────────────────────────────────────────────── */}
//           {productStats.length > 0 && (
//             <AnalysingResultScoreCard
//               stats={productStats}
//               title="Product Score Profile"
//               overallScore={data.analysis.overall_score}
//             />
//           )}

//           {/* ── Compatibility Analysis ──────────────────────────────────────── */}
//           {compatibilityConditions.length > 0 && (
//             <DetectedConditionsList
//               conditions={compatibilityConditions}
//               title="Compatibility Analysis"
//               showIcon={true}
//               showFaceImages={true}
//             />
//           )}

//           {/* ── Product Benefits ────────────────────────────────────────────── */}
//           {benefitConditions.length > 0 && (
//             <DetectedConditionsList
//               conditions={benefitConditions}
//               title="Product Benefits"
//               showIcon={true}
//               showFaceImages={true}
//             />
//           )}

//           {/* ── What to Stop ────────────────────────────────────────────────── */}
//           {attentionPoints.length > 0 && (
//             <ProductAttentionPoints
//               title="Points of Attention — What to Stop"
//               points={attentionPoints}
//               showIcon={true}
//             />
//           )}

//           {/* ── What to Do ──────────────────────────────────────────────────── */}
//           {whatToDoPoints.length > 0 && (
//             <WhatToDoPoints title="What to Do?" points={whatToDoPoints} showIcon={true} />
//           )}

//           {/* ── Learn More ──────────────────────────────────────────────────── */}
//           {learnMore ? (
//             <View className="mt-6">
//               <View className="flex-row items-center gap-3">
//                 <BookIcon size={24} color="#977857" />
//                 <Text className="flex-1 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
//                   Learn More
//                 </Text>
//               </View>

//               <ImageBackground
//                 source={productLearnMoreBgImage}
//                 className="mt-3 p-3"
//                 style={{
//                   borderRadius: 24,
//                   borderWidth: 0.3,
//                   borderColor: '#FFFFFF77',
//                   borderTopWidth: 2,
//                   borderBottomWidth: 2,
//                   borderTopColor: '#dfd2c5',
//                   borderBottomColor: '#f9f7f4',
//                   overflow: 'hidden',
//                   minHeight: 134,
//                 }}>
//                 <LinearGradient
//                   colors={[
//                     '#F6E7D5',
//                     'rgba(242, 221, 197, 0.94)',
//                     'rgba(239, 222, 202, 0.6)',
//                     'rgba(255, 234, 208, 0.44)',
//                     'rgba(232, 221, 208, 0)',
//                   ]}
//                   locations={[0, 0.52, 0.67, 0.82, 1]}
//                   start={{ x: 0, y: 0.5 }}
//                   end={{ x: 1, y: 0.5 }}
//                   style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
//                 />
//                 <Text className="font-outfit text-[14px]" style={{ color: '#2E2117CC' }}>
//                   {learnMore}
//                 </Text>
//               </ImageBackground>
//             </View>
//           ) : null}

//           {/* ── Actions ─────────────────────────────────────────────────────── */}
//           <PrimaryVariantButton
//             title="Generate AI Routine"
//             onPress={() => router.push('/(flow)/routines/ai-routine-generate/ai-routine')}
//             style={{ marginBottom: 4, marginTop: 32 }}
//           />
//           <TouchableOpacity
//             onPress={() => router.push('/(main)')}
//             activeOpacity={0.6}
//             className="mt-4 py-5">
//             <Text className="text-center font-outfitMedium text-[20px] text-[#361A0D]">
//               Skip this product
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default AiAnalysisCompleteScreen;

// const styles = StyleSheet.create({});

// app/(flow)/product-scan/analysis-complete.tsx
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import PillowBadge from '@/components/buttons/PillowBadge';
import { BookIcon } from '@/components/icons';
import PrimaryVariantButton from '@/components/buttons/PrimaryVariantButton';
import { CubeIcon } from '@/components/icons/CubeIcon';
import AnalysingResultScoreCard from '@/components/scans/AnalysingResultScoreCard';
import { DetectedConditionsList } from '@/components/scans/DetectedConditionsList';
import { DetectedCondition } from '@/components/scans/DetectedConditionCard';
import { AttentionPoint, ProductAttentionPoints } from '@/components/scans/ProductAttentionPoints';
import { WhatToDoPoint, WhatToDoPoints } from '@/components/scans/WhatToDoPoints';
import { LinearGradient } from 'expo-linear-gradient';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';

// ── Types mirroring the API response shape ────────────────────────────────────

interface ScoreProfile {
  compatibility: number;
  safety: number;
  redness: number;
  effectiveness: number;
  evenness: number;
}

interface AnalysisItem {
  score: number;
  intensity: 'low' | 'medium' | 'high';
  why: string;
}

interface ScanResult {
  _placeholder?: boolean;
  scan_id: string;
  product: {
    name: string;
    brand: string;
    category: string;
    id: string;
    image_url: string;
  };
  detected_ingredients: string[];
  ingredient_conflicts: string[];
  ingredient_intelligence: {
    irritation_load: number;
    exfoliation_load: number;
    barrier_stress: number;
    active_intensity: number;
  };
  analysis: {
    overall_score: number;
    score_profile: ScoreProfile;
    compatibility_analysis: {
      ingredient_conflict: AnalysisItem;
      allergy_risk: AnalysisItem;
    };
    product_benefits: {
      high_compatibility: AnalysisItem;
      ingredient_synergy: AnalysisItem;
    };
    what_to_stop: string[];
    what_to_do: string[];
    learn_more: string;
  };
  catalog_product: {
    id: string;
    name: string;
    image_url: string;
    category: string;
    tags: string[];
    concerns: string[];
    priority: number;
  } | null;
  barcode?: { value: string; type: string };
}

// ── Fallback values ───────────────────────────────────────────────────────────

const FALLBACK_ANALYSIS_ITEM: AnalysisItem = { score: 0, intensity: 'low', why: '' };

// ── Colour helpers ────────────────────────────────────────────────────────────

const intensityGradient = (
  intensity: 'low' | 'medium' | 'high' | undefined,
  positive = false
): [string, string] => {
  if (positive) return ['#10B981', '#059669'];
  switch (intensity) {
    case 'high':
      return ['#F87171', '#DC2626'];
    case 'medium':
      return ['#FBBF24', '#D97706'];
    default:
      return ['#10B981', '#059669'];
  }
};

const intensityProgress = (score: number | undefined): number =>
  Math.min(100, Math.max(0, score ?? 0));

// ── Main component ────────────────────────────────────────────────────────────

const AiAnalysisCompleteScreen = () => {
  const router = useRouter();
  const { scanResult, imageUri, scanType } = useLocalSearchParams<{
    scanResult?: string;
    imageUri?: string;
    scanType?: string;
  }>();

  const [data, setData] = useState<ScanResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const productLearnMoreBgImage = require('@/assets/images/productLearnMoreBgImage.png');

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [data],
    delay: 100,
    initialReady: false,
  });

  // Parse the JSON string passed via router params once on mount
  useEffect(() => {
    if (!scanResult) {
      setParseError('No scan result received.');
      return;
    }
    try {
      const parsed: ScanResult = JSON.parse(scanResult);
      setData(parsed);
    } catch (e) {
      console.error('[analysis-complete] failed to parse scanResult:', e);
      setParseError('Could not read scan result.');
    }
  }, [scanResult]);

  // ── Safe accessors (guard against any remaining shape inconsistencies) ─────

  const scoreProfile = data?.analysis?.score_profile;
  const compatibilityAnalysis = data?.analysis?.compatibility_analysis;
  const productBenefits = data?.analysis?.product_benefits;

  const ingredientConflict = compatibilityAnalysis?.ingredient_conflict ?? FALLBACK_ANALYSIS_ITEM;
  const allergyRisk = compatibilityAnalysis?.allergy_risk ?? FALLBACK_ANALYSIS_ITEM;
  const highCompatibility = productBenefits?.high_compatibility ?? FALLBACK_ANALYSIS_ITEM;
  const ingredientSynergy = productBenefits?.ingredient_synergy ?? FALLBACK_ANALYSIS_ITEM;

  const whatToStop = data?.analysis?.what_to_stop ?? [];
  const whatToDo = data?.analysis?.what_to_do ?? [];
  const learnMore = data?.analysis?.learn_more ?? '';

  // ── Derived display data ──────────────────────────────────────────────────

  const productStats = scoreProfile
    ? [
        { label: 'Compatibility', value: String(scoreProfile.compatibility), color: '#60A5FA' },
        { label: 'Safety', value: String(scoreProfile.safety), color: '#4ADE80' },
        { label: 'Redness', value: String(scoreProfile.redness), color: '#FB7185' },
        { label: 'Effectiveness', value: String(scoreProfile.effectiveness), color: '#FBBF24' },
        { label: 'Evenness', value: String(scoreProfile.evenness), color: '#A78BFA' },
      ]
    : [];

  const compatibilityConditions: DetectedCondition[] = data
    ? [
        {
          id: 'ingredient_conflict',
          title: 'Ingredient Conflict',
          severity:
            ingredientConflict.intensity === 'high'
              ? 'High'
              : ingredientConflict.intensity === 'medium'
                ? 'Medium'
                : 'Low',
          description: ingredientConflict.why,
          progressValue: intensityProgress(ingredientConflict.score),
          progressColor: intensityGradient(ingredientConflict.intensity),
          // imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
          imageUri: data.product?.image_url
            ? { uri: data.product.image_url }
            : require('@/assets/images/product_analysis_sample_image.jpg'),
        },
        {
          id: 'allergy_risk',
          title: 'Allergy Risk',
          severity:
            allergyRisk.intensity === 'high'
              ? 'High'
              : allergyRisk.intensity === 'medium'
                ? 'Medium'
                : 'Low',
          description: allergyRisk.why,
          progressValue: intensityProgress(allergyRisk.score),
          progressColor: intensityGradient(allergyRisk.intensity),
          // imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
          imageUri: data.product?.image_url
            ? { uri: data.product.image_url }
            : require('@/assets/images/product_analysis_sample_image.jpg'),
        },
      ]
    : [];

  const benefitConditions: DetectedCondition[] = data
    ? [
        {
          id: 'high_compatibility',
          title: 'High Compatibility',
          severity: 'Low',
          description: highCompatibility.why,
          progressValue: intensityProgress(highCompatibility.score),
          progressColor: intensityGradient(highCompatibility.intensity, true),
          // imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
          imageUri: data.product?.image_url
            ? { uri: data.product.image_url }
            : require('@/assets/images/product_analysis_sample_image.jpg'),
        },
        {
          id: 'ingredient_synergy',
          title: 'Ingredient Synergy',
          severity: 'Low',
          description: ingredientSynergy.why,
          progressValue: intensityProgress(ingredientSynergy.score),
          progressColor: intensityGradient(ingredientSynergy.intensity, true),
          // imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
          imageUri: data.product?.image_url
            ? { uri: data.product.image_url }
            : require('@/assets/images/product_analysis_sample_image.jpg'),
        },
      ]
    : [];

  const attentionPoints: AttentionPoint[] = whatToStop.map((title, i) => ({
    id: String(i),
    title,
  }));

  const whatToDoPoints: WhatToDoPoint[] = whatToDo.map((title, i) => ({
    id: String(i),
    title,
  }));

  const isNonSkincare = data?.product?.id === 'not_a_skincare_product';
  const isPlaceholder = data?._placeholder === true;

  // ── Loading / error guards ────────────────────────────────────────────────

  if (isRendering && !data) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Preparing analysis results..." />
      </SafeAreaView>
    );
  }

  if (renderError || parseError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Product Analysis" height={50} backButton />
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

  // ── Non-skincare / placeholder notice ─────────────────────────────────────

  if (isNonSkincare || isPlaceholder) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Product Analysis" height={50} backButton />
        <View className="flex-1 items-center justify-center px-8">
          <CubeIcon size={56} color="#977857" />
          <Text
            className="mt-6 text-center font-outfitMedium text-[20px]"
            style={{ color: '#2E2117' }}>
            {isPlaceholder ? 'Barcode Lookup Coming Soon' : 'Not a Skincare Product'}
          </Text>
          <Text className="mt-3 text-center font-outfit text-[14px]" style={{ color: '#2E2117AA' }}>
            {isPlaceholder
              ? `Barcode detected: ${data.barcode?.value ?? '—'}\nOur team is working on the barcode lookup endpoint. Please use the Manual Capture option for now.`
              : learnMore}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="mt-8 rounded-full bg-[#361A0D] px-8 py-4">
            <Text className="font-outfitMedium text-[16px] text-white">Try Another Product</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main result view ──────────────────────────────────────────────────────

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Product Analysis" height={50} backButton />

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
          {/* ── Product Header ──────────────────────────────────────────────── */}
          <View
            className="mb-4 flex-row items-center justify-between gap-3 bg-transparent p-3"
            style={{
              borderWidth: 1,
              borderColor: '#FFFFFF99',
              borderRadius: 24,
              borderTopWidth: 2,
              borderBottomWidth: 2,
            }}>
            <View
              className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#e8e4e1]"
              style={{ borderWidth: 1, borderColor: '#FFFFFF' }}>
              <CubeIcon size={28} color="#977857" />
            </View>
            <View className="flex-1">
              <View className="flex-1 flex-row items-center justify-between">
                <Text
                  className="font-outfitMedium text-[14px]"
                  style={{
                    color: '#2E2117',
                    textShadowColor: '#FFFFFF',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                    flexShrink: 1,
                    marginRight: 8,
                  }}
                  numberOfLines={2}>
                  {data.product?.name ?? '—'}
                </Text>
                <PillowBadge
                  title={data.product?.category || 'Product'}
                  textStyle={{ color: '#2E2117B2', fontSize: 10 }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    paddingVertical: 1,
                    paddingHorizontal: 8,
                  }}
                />
              </View>
              {data.product?.brand ? (
                <Text
                  className="mt-3 font-outfit text-[12px]"
                  style={{
                    color: '#2E211799',
                    textShadowColor: '#FFFFFF',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}>
                  {data.product.brand}
                </Text>
              ) : null}
            </View>
          </View>

          {/* ── Score Card ──────────────────────────────────────────────────── */}
          {productStats.length > 0 && (
            <AnalysingResultScoreCard stats={productStats} title="Product Score Profile" />
          )}

          {/* ── Compatibility Analysis ──────────────────────────────────────── */}
          {compatibilityConditions.length > 0 && (
            <DetectedConditionsList
              conditions={compatibilityConditions}
              title="Compatibility Analysis"
              showIcon={true}
              showFaceImages={true}
            />
          )}

          {/* ── Product Benefits ────────────────────────────────────────────── */}
          {benefitConditions.length > 0 && (
            <DetectedConditionsList
              conditions={benefitConditions}
              title="Product Benefits"
              showIcon={true}
              showFaceImages={true}
            />
          )}

          {/* ── What to Stop ────────────────────────────────────────────────── */}
          {attentionPoints.length > 0 && (
            <ProductAttentionPoints
              title="Points of Attention — What to Stop"
              points={attentionPoints}
              showIcon={true}
            />
          )}

          {/* ── What to Do ──────────────────────────────────────────────────── */}
          {whatToDoPoints.length > 0 && (
            <WhatToDoPoints title="What to Do?" points={whatToDoPoints} showIcon={true} />
          )}

          {/* ── Learn More ──────────────────────────────────────────────────── */}
          {learnMore ? (
            <View className="mt-6">
              <View className="flex-row items-center gap-3">
                <BookIcon size={24} color="#977857" />
                <Text className="flex-1 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
                  Learn More
                </Text>
              </View>

              <ImageBackground
                source={productLearnMoreBgImage}
                className="mt-3 p-3"
                style={{
                  borderRadius: 24,
                  borderWidth: 0.3,
                  borderColor: '#FFFFFF77',
                  borderTopWidth: 2,
                  borderBottomWidth: 2,
                  borderTopColor: '#dfd2c5',
                  borderBottomColor: '#f9f7f4',
                  overflow: 'hidden',
                  minHeight: 134,
                }}>
                <LinearGradient
                  colors={[
                    '#F6E7D5',
                    'rgba(242, 221, 197, 0.94)',
                    'rgba(239, 222, 202, 0.6)',
                    'rgba(255, 234, 208, 0.44)',
                    'rgba(232, 221, 208, 0)',
                  ]}
                  locations={[0, 0.52, 0.67, 0.82, 1]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                />
                <Text className="font-outfit text-[14px]" style={{ color: '#2E2117CC' }}>
                  {learnMore}
                </Text>
              </ImageBackground>
            </View>
          ) : null}

          {/* ── Actions ─────────────────────────────────────────────────────── */}
          <PrimaryVariantButton
            title="Get Recommendations"
            onPress={() =>
              router.push({
                pathname: '/(flow)/routines/ai-routine-generate/ai-routine',
                params: {
                  scan_id: data.scan_id,
                  scan_type: 'product',
                },
              })
            }
            style={{ marginBottom: 4, marginTop: 32 }}
          />
          <TouchableOpacity
            onPress={() => router.push('/(main)')}
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
