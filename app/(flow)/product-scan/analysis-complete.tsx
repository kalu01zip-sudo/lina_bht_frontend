// // app/(flow)/product-scan/analysis-complete.tsx
// import {
//   ImageBackground,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
// } from 'react-native';
// import React from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import PillowBadge from '@/components/buttons/PillowBadge';
// import { BookIcon } from '@/components/icons';
// import PrimaryVariantButton from '@/components/buttons/PrimaryVariantButton';
// import { useRouter } from 'expo-router';
// import { CubeIcon } from '@/components/icons/CubeIcon';
// import AnalysingResultScoreCard from '@/components/scans/AnalysingResultScoreCard';
// import { DetectedConditionsList } from '@/components/scans/DetectedConditionsList';
// import { DetectedCondition } from '@/components/scans/DetectedConditionCard';
// import { AttentionPoint, ProductAttentionPoints } from '@/components/scans/ProductAttentionPoints';
// import { WhatToDoPoint, WhatToDoPoints } from '@/components/scans/WhatToDoPoints';
// import { LinearGradient } from 'expo-linear-gradient';

// const PRODUCT_STATS = [
//   { label: 'Compatibility', value: '85', color: '#60A5FA' },
//   { label: 'Safety', value: '60', color: '#4ADE80' },
//   { label: 'Redness', value: '58', color: '#FB7185' },
//   { label: 'Effectiveness', value: '98', color: '#FBBF24' },
//   { label: 'Evenness', value: '52', color: '#A78BFA' },
// ];

// // Product-specific detected conditions data with image
// const productDetectedConditions: DetectedCondition[] = [
//   {
//     id: 'ingredient_conflict',
//     title: 'Ingredient Conflict',
//     severity: 'High',
//     description: 'Retinol conflicts with AHA/BHA exfoliant in your night routine',
//     progressValue: 85,
//     progressColor: ['#F87171', '#DC2626'],
//     imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
//   },
//   {
//     id: 'allergy_risk',
//     title: 'Allergy Risk',
//     severity: 'Low',
//     description: 'Contains fragrance that may trigger sensitivity',
//     progressValue: 25,
//     progressColor: ['#FBBF24', '#D97706'],
//     imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
//   },
// ];

// // Product benefits/positive conditions with image
// const productBenefits: DetectedCondition[] = [
//   {
//     id: 'compatibility_high',
//     title: 'High Compatibility',
//     severity: 'Low',
//     description: 'Works well with your current hydrating toner',
//     progressValue: 95,
//     progressColor: ['#10B981', '#059669'],
//     imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
//   },
//   {
//     id: 'synergy',
//     title: 'Ingredient Synergy',
//     severity: 'Low',
//     description: 'Vitamin C and Ferulic acid enhance each other',
//     progressValue: 88,
//     progressColor: ['#10B981', '#059669'],
//     imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
//   },
// ];

// // Define your attention points data
// const attentionPoints: AttentionPoint[] = [
//   {
//     id: '1',
//     title: 'Advanced Retinol Serum 1%',
//   },
//   {
//     id: '2',
//     title: 'Do not layer with other fragranced products. Avoid mixing with active chemical peels.',
//   },
// ];

// const whatToDoPoints: WhatToDoPoint[] = [
//   {
//     id: '1',
//     title: 'Patch test on inner arm before full application.',
//   },
//   {
//     id: '2',
//     title: 'Consider fragrance-free alternatives.',
//   },
//   {
//     id: '3',
//     title: 'Monitor for any redness or itching.',
//   },
// ];

// const AiAnalysisCompleteScreen = () => {
//   const router = useRouter();
//   const productImageUri = require('@/assets/images/product_analysis_sample_image.jpg');
//   const productLearnMoreBgImage = require('@/assets/images/productLearnMoreBgImage.png');

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
//         <View className="px-container">
//           {/* Product Header */}
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
//               style={{
//                 borderWidth: 1,
//                 borderTopWidth: 1,
//                 borderBottomWidth: 1,
//                 borderColor: '#FFFFFF',
//               }}>
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
//                   }}>
//                   Advanced Retinol Serum 1%
//                 </Text>
//                 <PillowBadge
//                   title="Serum"
//                   textStyle={{ color: '#2E2117B2', fontSize: 10 }}
//                   style={{
//                     backgroundColor: '#FFFFFF',
//                     paddingVertical: 1,
//                     paddingHorizontal: 8,
//                   }}
//                 />
//               </View>
//               <Text
//                 className="mt-3 font-outfit text-[12px]"
//                 style={{
//                   color: '#2E211799',
//                   textShadowColor: '#FFFFFF',
//                   textShadowOffset: { width: 1, height: 1 },
//                   textShadowRadius: 2,
//                 }}>
//                 Generic Brand
//               </Text>
//             </View>
//           </View>

//           {/* Score Card */}
//           <AnalysingResultScoreCard stats={PRODUCT_STATS} title="Product Score Profile" />

//           {/* Detected Conditions Section for Product */}
//           <DetectedConditionsList
//             conditions={productDetectedConditions}
//             title="Compatibility Analysis"
//             showIcon={true}
//             showFaceImages={true}
//           />

//           {/* Alternative: Positive Benefits Section */}
//           <DetectedConditionsList
//             conditions={productBenefits}
//             title="Product Benefits"
//             showIcon={true}
//             showFaceImages={true}
//           />

//           <ProductAttentionPoints
//             title="Points of Attention — What to Stop"
//             points={attentionPoints}
//             showIcon={true}
//           />

//           <WhatToDoPoints title="What to Do?" points={whatToDoPoints} showIcon={true} />

//           <View className="mt-6">
//             <View className="flex-row items-center gap-3">
//               <BookIcon size={24} color="#977857" />
//               <Text
//                 className="flex-1 font-outfitMedium text-[16px]"
//                 style={{
//                   color: '#2E2117',
//                 }}>
//                 Learn More
//               </Text>
//             </View>

//             <ImageBackground
//               source={productLearnMoreBgImage}
//               className="mt-3 p-3"
//               style={{
//                 borderRadius: 24,
//                 borderWidth: 0.3,
//                 borderColor: '#FFFFFF77',
//                 borderTopWidth: 2,
//                 borderBottomWidth: 2,
//                 borderTopColor: '#dfd2c5',
//                 borderBottomColor: '#f9f7f4',
//                 overflow: 'hidden',
//                 minHeight: 134,
//               }}>
//               {/* Gradient Overlay */}
//               <LinearGradient
//                 colors={[
//                   '#F6E7D5',
//                   'rgba(242, 221, 197, 0.94)',
//                   'rgba(239, 222, 202, 0.6)',
//                   'rgba(255, 234, 208, 0.44)',
//                   'rgba(232, 221, 208, 0)',
//                 ]}
//                 locations={[0, 0.52, 0.67, 0.82, 1]}
//                 start={{ x: 0, y: 0.5 }}
//                 end={{ x: 1, y: 0.5 }}
//                 style={{
//                   position: 'absolute',
//                   left: 0,
//                   right: 0,
//                   top: 0,
//                   bottom: 0,
//                 }}
//               />
//               <Text className="font-outfit text-[14px]" style={{ color: '#2E2117CC' }}>
//                 Fragrance is one of the most common skin irritants. Even &apos;natural&apos;
//                 fragrances from essential oils can trigger reactions. Fragrance-free products are
//                 generally safer for sensitive or compromised skin barriers.
//               </Text>
//             </ImageBackground>
//           </View>

//           {/* Action Buttons */}
//           <PrimaryVariantButton
//             title="Generate Your Routine"
//             onPress={() => {
//               // router.push('/(flow)/ai-assistant');
//             }}
//             style={{ marginTop: 32, marginBottom: 4 }}
//           />
//           <TouchableOpacity
//             onPress={() => {
//               router.push('/(main)');
//             }}
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
  Image,
  ActivityIndicator,
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

const PRODUCT_STATS = [
  { label: 'Compatibility', value: '85', color: '#60A5FA' },
  { label: 'Safety', value: '60', color: '#4ADE80' },
  { label: 'Redness', value: '58', color: '#FB7185' },
  { label: 'Effectiveness', value: '98', color: '#FBBF24' },
  { label: 'Evenness', value: '52', color: '#A78BFA' },
];

// Product-specific detected conditions data with image
const productDetectedConditions: DetectedCondition[] = [
  {
    id: 'ingredient_conflict',
    title: 'Ingredient Conflict',
    severity: 'High',
    description: 'Retinol conflicts with AHA/BHA exfoliant in your night routine',
    progressValue: 85,
    progressColor: ['#F87171', '#DC2626'],
    imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
  },
  {
    id: 'allergy_risk',
    title: 'Allergy Risk',
    severity: 'Low',
    description: 'Contains fragrance that may trigger sensitivity',
    progressValue: 25,
    progressColor: ['#FBBF24', '#D97706'],
    imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
  },
];

// Product benefits/positive conditions with image
const productBenefits: DetectedCondition[] = [
  {
    id: 'compatibility_high',
    title: 'High Compatibility',
    severity: 'Low',
    description: 'Works well with your current hydrating toner',
    progressValue: 95,
    progressColor: ['#10B981', '#059669'],
    imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
  },
  {
    id: 'synergy',
    title: 'Ingredient Synergy',
    severity: 'Low',
    description: 'Vitamin C and Ferulic acid enhance each other',
    progressValue: 88,
    progressColor: ['#10B981', '#059669'],
    imageUri: require('@/assets/images/product_analysis_sample_image.jpg'),
  },
];

// Define your attention points data
const attentionPoints: AttentionPoint[] = [
  {
    id: '1',
    title: 'Advanced Retinol Serum 1%',
  },
  {
    id: '2',
    title: 'Do not layer with other fragranced products. Avoid mixing with active chemical peels.',
  },
];

const whatToDoPoints: WhatToDoPoint[] = [
  {
    id: '1',
    title: 'Patch test on inner arm before full application.',
  },
  {
    id: '2',
    title: 'Consider fragrance-free alternatives.',
  },
  {
    id: '3',
    title: 'Monitor for any redness or itching.',
  },
];

const AiAnalysisCompleteScreen = () => {
  const router = useRouter();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const productImageUri = require('@/assets/images/product_analysis_sample_image.jpg');
  const productLearnMoreBgImage = require('@/assets/images/productLearnMoreBgImage.png');

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  // Mock loading data - replace with actual API call
  useEffect(() => {
    loadProductData();
  }, []);

  const loadProductData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Add your actual data fetching here
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading product data:', err);
      setError('Failed to load analysis data');
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    loadProductData();
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
        <CustomHeader title="Product Analysis" height={50} backButton />
        <ErrorScreen message={renderError} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  // Show loading while data is being processed
  if (isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Product Analysis" height={50} backButton />
        <LoadingScreen loadingText="Preparing analysis results..." />
      </SafeAreaView>
    );
  }

  // Show error if data loading failed
  if (error) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Product Analysis" height={50} backButton />
        <ErrorScreen message={error} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

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
          {/* Product Header */}
          <View
            className="mb-4 flex-row items-center justify-between gap-3 bg-transparent p-3"
            style={{
              borderWidth: 1,
              borderColor: '#FFFFFF99',
              borderRadius: 24,
              borderTopWidth: 2,
              borderBottomWidth: 2,
            }}>
            {/* <View
              className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-[#e8e4e1]"
              style={{
                borderWidth: 1,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: '#FFFFFF',
              }}>
              <Image
                source={productImageUri}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View> */}

            <View
              className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#e8e4e1]"
              style={{
                borderWidth: 1,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: '#FFFFFF',
              }}>
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
                  }}>
                  Advanced Retinol Serum 1%
                </Text>
                <PillowBadge
                  title="Serum"
                  textStyle={{ color: '#2E2117B2', fontSize: 10 }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    paddingVertical: 1,
                    paddingHorizontal: 8,
                  }}
                />
              </View>
              <Text
                className="mt-3 font-outfit text-[12px]"
                style={{
                  color: '#2E211799',
                  textShadowColor: '#FFFFFF',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}>
                Generic Brand
              </Text>
            </View>
          </View>

          {/* Score Card */}
          <AnalysingResultScoreCard stats={PRODUCT_STATS} title="Product Score Profile" />

          {/* Detected Conditions Section for Product */}
          <DetectedConditionsList
            conditions={productDetectedConditions}
            title="Compatibility Analysis"
            showIcon={true}
            showFaceImages={true}
          />

          {/* Alternative: Positive Benefits Section */}
          <DetectedConditionsList
            conditions={productBenefits}
            title="Product Benefits"
            showIcon={true}
            showFaceImages={true}
          />

          <ProductAttentionPoints
            title="Points of Attention — What to Stop"
            points={attentionPoints}
            showIcon={true}
          />

          <WhatToDoPoints title="What to Do?" points={whatToDoPoints} showIcon={true} />

          <View className="mt-6">
            <View className="flex-row items-center gap-3">
              <BookIcon size={24} color="#977857" />
              <Text
                className="flex-1 font-outfitMedium text-[16px]"
                style={{
                  color: '#2E2117',
                }}>
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
              {/* Gradient Overlay */}
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
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              />
              <Text className="font-outfit text-[14px]" style={{ color: '#2E2117CC' }}>
                Fragrance is one of the most common skin irritants. Even &apos;natural&apos;
                fragrances from essential oils can trigger reactions. Fragrance-free products are
                generally safer for sensitive or compromised skin barriers.
              </Text>
            </ImageBackground>
          </View>

          {/* Action Buttons */}
          <PrimaryVariantButton
            title="Get Recommendations"
            onPress={() => {
              // router.push('/(flow)/ai-assistant');
            }}
            style={{ marginBottom: 4 }}
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
