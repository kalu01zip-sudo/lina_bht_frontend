// // // app/(flow)/hair-scan/ai-analysis-complete.tsx
// // import {
// //   ScrollView,
// //   StyleSheet,
// //   Text,
// //   View,
// //   Image,
// //   ActivityIndicator,
// //   useWindowDimensions,
// //   TouchableOpacity,
// // } from 'react-native';
// // import React, { useState, useEffect } from 'react';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { useLocalSearchParams, useRouter } from 'expo-router';
// // import CustomHeader from '@/components/header/CustomHeader';
// // import { LAYOUT } from '@/constants/constants';
// // import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// // import PrimaryButton from '@/components/buttons/PrimaryButton';
// // import { AngleCapture } from '@/components/scans/MultiAngleCameraScan';
// // import { useScreenReady } from '@/hooks/useScreenReady';
// // import LoadingScreen from '@/components/loading/LoadingScreen';
// // import ErrorScreen from '@/components/errors/ErrorScreen';
// // import AnalysingResultScoreCard from '@/components/scans/AnalysingResultScoreCard';
// // import { DetectedConditionsList } from '@/components/scans/DetectedConditionsList';
// // import { DetectedCondition } from '@/components/scans/DetectedConditionCard';
// // import { LifestyleFactors, LifestyleFactor } from '@/components/scans/LifestyleFactors';
// // import { PrognosticTimeline, TimelineDay } from '@/components/scans/PrognosticTimeline';

// // // Hair analysis stats
// // const HAIR_STATS = [
// //   { label: 'Scalp Health', value: '72', color: '#60A5FA' },
// //   { label: 'Hair Density', value: '68', color: '#4ADE80' },
// //   { label: 'Breakage', value: '45', color: '#FB7185' },
// //   { label: 'Oiliness', value: '55', color: '#FBBF24' },
// //   { label: 'Dandruff', value: '35', color: '#A78BFA' },
// // ];

// // // Static lifestyle factors data for hair
// // const LIFESTYLE_FACTORS: LifestyleFactor[] = [
// //   {
// //     id: 'stress',
// //     label: 'Stress Score',
// //     value: 62,
// //     gradientColors: ['#FBBF24', '#D97706'],
// //   },
// //   {
// //     id: 'water',
// //     label: 'Water Intake',
// //     value: 74,
// //     gradientColors: ['#60A5FA', '#2563EB'],
// //   },
// //   {
// //     id: 'sleep',
// //     label: 'Sleep Quality',
// //     value: 68,
// //     gradientColors: ['#7A8B6A', '#059669'],
// //   },
// // ];

// // const HairAnalysisCompleteScreen = () => {
// //   const router = useRouter();
// //   const { width } = useWindowDimensions();
// //   const { captures: capturesParam } = useLocalSearchParams();
// //   const [captures, setCaptures] = useState<AngleCapture[]>([]);
// //   const [isInitialLoad, setIsInitialLoad] = useState(true);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   const { isRendering, isContentReady, renderError } = useScreenReady({
// //     dependencies: [captures],
// //     delay: 100,
// //     initialReady: false,
// //   });

// //   useEffect(() => {
// //     loadCaptures();
// //   }, [capturesParam]);

// //   const loadCaptures = async () => {
// //     setIsLoading(true);
// //     setError(null);

// //     try {
// //       console.log('📊 HAIR ANALYSIS SCREEN - Received params:', {
// //         hasCaptures: !!capturesParam,
// //         capturesParam,
// //       });

// //       if (capturesParam) {
// //         const parsed = JSON.parse(capturesParam as string);
// //         setCaptures(parsed);
// //         console.log('✅ Parsed captures successfully:', parsed.length);
// //       } else {
// //         console.log('No captures found in params');
// //       }
// //     } catch (err) {
// //       console.error('Error parsing captures:', err);
// //       setError('Failed to load analysis data');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const handleRetry = () => {
// //     loadCaptures();
// //   };

// //   // Mark initial load as complete after first render
// //   useEffect(() => {
// //     if (isContentReady && isInitialLoad) {
// //       setIsInitialLoad(false);
// //     }
// //   }, [isContentReady]);

// //   // Show initial render loading (useScreenReady) - ONLY on first load
// //   if (isRendering && isInitialLoad) {
// //     return (
// //       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
// //         <LoadingScreen loadingText="Preparing analysis results..." />
// //       </SafeAreaView>
// //     );
// //   }

// //   // Show error if rendering failed
// //   if (renderError) {
// //     return (
// //       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
// //         <CustomHeader title="Hair Analysis Complete" height={50} backButton />
// //         <ErrorScreen message={renderError} onRetry={handleRetry} />
// //       </SafeAreaView>
// //     );
// //   }

// //   // Show loading while data is being processed
// //   if (isLoading) {
// //     return (
// //       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
// //         <CustomHeader title="Hair Analysis Complete" height={50} backButton />
// //         <View className="flex-1 items-center justify-center">
// //           <ActivityIndicator size="large" color="#95B287" />
// //           <Text className="mt-3 font-outfit text-[14px]" style={{ color: '#2E211799' }}>
// //             Loading analysis results...
// //           </Text>
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   // Show error if data loading failed
// //   if (error) {
// //     return (
// //       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
// //         <CustomHeader title="Hair Analysis Complete" height={50} backButton />
// //         <ErrorScreen message={error} onRetry={handleRetry} />
// //       </SafeAreaView>
// //     );
// //   }

// //   // Get the first captured image for hair preview
// //   const hairImageUri = captures.length > 0 ? captures[0].uri : undefined;

// //   // Define detected conditions data for hair
// //   const detectedConditions: DetectedCondition[] = [
// //     {
// //       id: 'dry_scalp',
// //       title: 'Dry Scalp',
// //       severity: 'Medium',
// //       description:
// //         'Visible flaking and dryness on the scalp surface. May benefit from moisturizing treatments.',
// //       progressValue: 65,
// //       progressColor: ['#FBBF24', '#D97706'],
// //       ImageUri: hairImageUri,
// //       faceArea: { x: 100, y: 150, width: 80, height: 80 },
// //     },
// //     {
// //       id: 'hair_fall',
// //       title: 'Hair Fall',
// //       severity: 'Medium',
// //       description: 'Increased hair shedding noticed. Consider strengthening treatments.',
// //       progressValue: 55,
// //       progressColor: ['#FBBF24', '#D97706'],
// //       ImageUri: hairImageUri,
// //     },
// //     {
// //       id: 'breakage',
// //       title: 'Breakage',
// //       severity: 'Low',
// //       description: 'Minor breakage observed at the ends. Regular trims recommended.',
// //       progressValue: 35,
// //       progressColor: ['#60A5FA', '#2563EB'],
// //       ImageUri: hairImageUri,
// //     },
// //   ];

// //   // Define prognostic days for hair
// //   const prognosticDays: TimelineDay[] = [
// //     {
// //       id: 'today',
// //       title: 'Today',
// //       subtitle: '(Current Condition)',
// //       imageUri: hairImageUri,
// //       isFuture: false,
// //     },
// //     {
// //       id: 'day7',
// //       title: '+7 Days',
// //       subtitle: '(Prediction 1)',
// //       metrics: [
// //         { label: 'Scalp Health', value: '+15%', color: '#10B981' },
// //         { label: 'Dandruff', value: '-10%', color: '#10B981' },
// //       ],
// //       imageUri: hairImageUri,
// //       isFuture: true,
// //       improvementPercentage: 15,
// //     },
// //     {
// //       id: 'day14',
// //       title: '+14 Days',
// //       subtitle: '(Prediction 2)',
// //       metrics: [
// //         { label: 'Hair Strength', value: '+20%', color: '#10B981' },
// //         { label: 'Breakage', value: '-25%', color: '#10B981' },
// //       ],
// //       imageUri: hairImageUri,
// //       isFuture: true,
// //       improvementPercentage: 20,
// //     },
// //   ];

// //   return (
// //     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
// //       <CustomHeader title="Hair Analysis Complete" height={50} backButton />

// //       <ScrollView
// //         showsVerticalScrollIndicator={false}
// //         contentContainerStyle={{
// //           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
// //           paddingTop: 10,
// //           flexGrow: 1,
// //         }}
// //         className="flex-1">
// //         <View
// //           className="px-container"
// //           style={{
// //             opacity: isContentReady ? 1 : 0,
// //             transform: [{ translateY: isContentReady ? 0 : 10 }],
// //           }}>
// //           {/* Score Card */}
// //           <AnalysingResultScoreCard stats={HAIR_STATS} title="Hair & Scalp Score Profile" />

// //           {/* Captured Angles Preview */}
// //           {captures.length > 0 && (
// //             <View>
// //               <Text className="mb-2 text-start font-outfitMedium text-[16px] text-[#2E2117]">
// //                 Captured Angles
// //               </Text>
// //               <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
// //                 <View className="flex-row gap-2 p-2">
// //                   {captures.map((capture, idx) => (
// //                     <BorderlessShadowCard
// //                       key={idx}
// //                       b_tl={12}
// //                       b_tr={12}
// //                       b_bl={12}
// //                       b_br={12}
// //                       style={{
// //                         padding: 8,
// //                         width: 80,
// //                         alignItems: 'center',
// //                       }}>
// //                       <Image
// //                         source={{ uri: capture.uri }}
// //                         style={{ width: 60, height: 60, borderRadius: 30 }}
// //                       />
// //                       <Text className="mt-1 font-outfit text-[10px] capitalize text-[#2A2118]">
// //                         {capture.angle}
// //                       </Text>
// //                     </BorderlessShadowCard>
// //                   ))}
// //                 </View>
// //               </ScrollView>
// //             </View>
// //           )}

// //           {/* Detected Conditions Section */}
// //           <DetectedConditionsList
// //             conditions={detectedConditions}
// //             title="Detected Conditions"
// //             showIcon={true}
// //             showFaceImages={true}
// //           />

// //           {/* Lifestyle Factors Section */}
// //           <LifestyleFactors factors={LIFESTYLE_FACTORS} title="Lifestyle Factors" showIcon={true} />

// //           {/* Prognostic Timeline */}
// //           <PrognosticTimeline
// //             days={prognosticDays}
// //             duration="14 Days"
// //             backgroundImage={require('@/assets/images/prognostic_timeline_bg_hair.jpg')}
// //             title="Hair Prognostic Timeline"
// //             showIcon={true}
// //             onDayPress={(day) => {
// //               console.log('Day pressed:', day.title);
// //             }}
// //           />

// //           {/* Button */}
// //           <PrimaryButton
// //             title="Generate Your Routine"
// //             onPress={() => {
// //               router.push('/(main)/routines');
// //             }}
// //             style={{ marginTop: 32 }}
// //           />

// //           <TouchableOpacity
// //             onPress={() => {
// //               router.push('/(main)');
// //             }}
// //             activeOpacity={0.6}
// //             className="mt-4 py-5">
// //             <Text className="text-center font-outfitMedium text-[20px] text-[#361A0D]">
// //               Skip for now
// //             </Text>
// //           </TouchableOpacity>
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // export default HairAnalysisCompleteScreen;

// // const styles = StyleSheet.create({});

// // app/(flow)/hair-scan/ai-analysis-complete.tsx
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ActivityIndicator,
//   useWindowDimensions,
//   TouchableOpacity,
// } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import PrimaryButton from '@/components/buttons/PrimaryButton';
// import { AngleCapture } from '@/components/scans/MultiAngleCameraScan';
// import { useScreenReady } from '@/hooks/useScreenReady';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import ErrorScreen from '@/components/errors/ErrorScreen';
// import AnalysingResultScoreCard from '@/components/scans/AnalysingResultScoreCard';
// import { DetectedConditionsList } from '@/components/scans/DetectedConditionsList';
// import { DetectedCondition } from '@/components/scans/DetectedConditionCard';
// import { LifestyleFactors, LifestyleFactor } from '@/components/scans/LifestyleFactors';
// import { PrognosticTimeline, TimelineDay } from '@/components/scans/PrognosticTimeline';
// // import { HairAnalysisCards } from '@/components/scans/hairScan/HairAnalysisCards';
// import { SkinAnalysisCards } from '@/components/scans/faceScan/SkinAnalysisCards';

// // Hair analysis stats
// const HAIR_STATS = [
//   { label: 'Scalp Health', value: '72', color: '#60A5FA' },
//   { label: 'Hair Density', value: '68', color: '#4ADE80' },
//   { label: 'Breakage', value: '45', color: '#FB7185' },
//   { label: 'Oiliness', value: '55', color: '#FBBF24' },
//   { label: 'Dandruff', value: '35', color: '#A78BFA' },
// ];

// // Static lifestyle factors data for hair
// const LIFESTYLE_FACTORS: LifestyleFactor[] = [
//   {
//     id: 'stress',
//     label: 'Stress Score',
//     value: 62,
//     gradientColors: ['#FBBF24', '#D97706'],
//   },
//   {
//     id: 'water',
//     label: 'Water Intake',
//     value: 74,
//     gradientColors: ['#60A5FA', '#2563EB'],
//   },
//   {
//     id: 'sleep',
//     label: 'Sleep Quality',
//     value: 68,
//     gradientColors: ['#7A8B6A', '#059669'],
//   },
// ];

// const HairAnalysisCompleteScreen = () => {
//   const router = useRouter();
//   const { width } = useWindowDimensions();
//   const { captures: capturesParam } = useLocalSearchParams();
//   const [captures, setCaptures] = useState<AngleCapture[]>([]);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const { isRendering, isContentReady, renderError } = useScreenReady({
//     dependencies: [captures],
//     delay: 100,
//     initialReady: false,
//   });

//   useEffect(() => {
//     loadCaptures();
//   }, [capturesParam]);

//   const loadCaptures = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       console.log('📊 HAIR ANALYSIS SCREEN - Received params:', {
//         hasCaptures: !!capturesParam,
//         capturesParam,
//       });

//       if (capturesParam) {
//         const parsed = JSON.parse(capturesParam as string);
//         setCaptures(parsed);
//         console.log('✅ Parsed captures successfully:', parsed.length);
//       } else {
//         console.log('No captures found in params');
//       }
//     } catch (err) {
//       console.error('Error parsing captures:', err);
//       setError('Failed to load analysis data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRetry = () => {
//     loadCaptures();
//   };

//   // Mark initial load as complete after first render
//   useEffect(() => {
//     if (isContentReady && isInitialLoad) {
//       setIsInitialLoad(false);
//     }
//   }, [isContentReady]);

//   // Show initial render loading (useScreenReady) - ONLY on first load
//   if (isRendering && isInitialLoad) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Preparing analysis results..." />
//       </SafeAreaView>
//     );
//   }

//   // Show error if rendering failed
//   if (renderError) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Hair Analysis Complete" height={50} backButton />
//         <ErrorScreen message={renderError} onRetry={handleRetry} />
//       </SafeAreaView>
//     );
//   }

//   // Show loading while data is being processed
//   if (isLoading) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Hair Analysis Complete" height={50} backButton />
//         <View className="flex-1 items-center justify-center">
//           <ActivityIndicator size="large" color="#95B287" />
//           <Text className="mt-3 font-outfit text-[14px]" style={{ color: '#2E211799' }}>
//             Loading analysis results...
//           </Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // Show error if data loading failed
//   if (error) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Hair Analysis Complete" height={50} backButton />
//         <ErrorScreen message={error} onRetry={handleRetry} />
//       </SafeAreaView>
//     );
//   }

//   // Get the first captured image for hair preview
//   const hairImageUri = captures.length > 0 ? captures[0].uri : undefined;

//   // Define detected conditions data for hair
//   const detectedConditions: DetectedCondition[] = [
//     {
//       id: 'dry_scalp',
//       title: 'Dry Scalp',
//       severity: 'Medium',
//       description:
//         'Visible flaking and dryness on the scalp surface. May benefit from moisturizing treatments.',
//       progressValue: 65,
//       progressColor: ['#FBBF24', '#D97706'],
//       ImageUri: hairImageUri,
//     },
//     {
//       id: 'hair_fall',
//       title: 'Hair Fall',
//       severity: 'Medium',
//       description: 'Increased hair shedding noticed. Consider strengthening treatments.',
//       progressValue: 55,
//       progressColor: ['#FBBF24', '#D97706'],
//       ImageUri: hairImageUri,
//     },
//     {
//       id: 'breakage',
//       title: 'Breakage',
//       severity: 'Low',
//       description: 'Minor breakage observed at the ends. Regular trims recommended.',
//       progressValue: 35,
//       progressColor: ['#60A5FA', '#2563EB'],
//       ImageUri: hairImageUri,
//     },
//   ];

//   // Define prognostic days for hair
//   const prognosticDays: TimelineDay[] = [
//     {
//       id: 'today',
//       title: 'Today',
//       subtitle: '(Current Condition)',
//       imageUri: hairImageUri,
//       isFuture: false,
//     },
//     {
//       id: 'day7',
//       title: '+7 Days',
//       subtitle: '(Prediction 1)',
//       metrics: [
//         { label: 'Scalp Health', value: '+15%', color: '#10B981' },
//         { label: 'Dandruff', value: '-10%', color: '#10B981' },
//       ],
//       imageUri: hairImageUri,
//       isFuture: true,
//       improvementPercentage: 15,
//     },
//     {
//       id: 'day14',
//       title: '+14 Days',
//       subtitle: '(Prediction 2)',
//       metrics: [
//         { label: 'Hair Strength', value: '+20%', color: '#10B981' },
//         { label: 'Breakage', value: '-25%', color: '#10B981' },
//       ],
//       imageUri: hairImageUri,
//       isFuture: true,
//       improvementPercentage: 20,
//     },
//   ];

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader title="Hair Analysis Complete" height={50} backButton />

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
//           {/* Score Card */}
//           <AnalysingResultScoreCard stats={HAIR_STATS} title="Hair & Scalp Score Profile" />

//           {/* Captured Angles Preview */}
//           {captures.length > 0 && (
//             <View>
//               <Text className="mb-2 text-start font-outfitMedium text-[16px] text-[#2E2117]">
//                 Captured Angles
//               </Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
//                 <View className="flex-row gap-2 p-2">
//                   {captures.map((capture, idx) => (
//                     <BorderlessShadowCard
//                       key={idx}
//                       b_tl={12}
//                       b_tr={12}
//                       b_bl={12}
//                       b_br={12}
//                       style={{
//                         padding: 8,
//                         width: 80,
//                         alignItems: 'center',
//                       }}>
//                       <Image
//                         source={{ uri: capture.uri }}
//                         style={{ width: 60, height: 60, borderRadius: 30 }}
//                       />
//                       <Text className="mt-1 font-outfit text-[10px] capitalize text-[#2A2118]">
//                         {capture.angle}
//                       </Text>
//                     </BorderlessShadowCard>
//                   ))}
//                 </View>
//               </ScrollView>
//             </View>
//           )}

//           {/* Hair Analysis Cards - Similar to Skin Analysis Cards */}

//           {/* Detected Conditions Section */}
//           <DetectedConditionsList
//             conditions={detectedConditions}
//             title="Detected Conditions"
//             showIcon={true}
//             showFaceImages={true}
//           />

//           {/* Lifestyle Factors Section */}
//           <LifestyleFactors factors={LIFESTYLE_FACTORS} title="Lifestyle Factors" showIcon={true} />

//           {/* Prognostic Timeline */}
//           <PrognosticTimeline
//             days={prognosticDays}
//             duration="14 Days"
//             backgroundImage={require('@/assets/images/prognostic_timeline_bg_hair.jpg')}
//             title="Hair Prognostic Timeline"
//             showIcon={true}
//             onDayPress={(day) => {
//               console.log('Day pressed:', day.title);
//             }}
//           />

//           {/* Button */}
//           <PrimaryButton
//             title="Generate Your Routine"
//             onPress={() => {
//               router.push('/(main)/routines');
//             }}
//             style={{ marginTop: 32 }}
//           />

//           <TouchableOpacity
//             onPress={() => {
//               router.push('/(main)');
//             }}
//             activeOpacity={0.6}
//             className="mt-4 py-5">
//             <Text className="text-center font-outfitMedium text-[20px] text-[#361A0D]">
//               Skip for now
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default HairAnalysisCompleteScreen;

// const styles = StyleSheet.create({});

// app/(flow)/hair-scan/ai-analysis-complete.tsx
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
import { DetectedConditionsList } from '@/components/scans/DetectedConditionsList';
import { DetectedCondition } from '@/components/scans/DetectedConditionCard';
import { LifestyleFactors, LifestyleFactor } from '@/components/scans/LifestyleFactors';
import { PrognosticTimeline, TimelineDay } from '@/components/scans/PrognosticTimeline';
import { HairAnalysisCards } from '@/components/scans/faceScan/HairAnalysisCards';

// Hair analysis stats
const HAIR_STATS = [
  { label: 'Scalp Health', value: '72', color: '#60A5FA' },
  { label: 'Hair Density', value: '68', color: '#4ADE80' },
  { label: 'Breakage', value: '45', color: '#FB7185' },
  { label: 'Oiliness', value: '55', color: '#FBBF24' },
  { label: 'Dandruff', value: '35', color: '#A78BFA' },
];

// Static lifestyle factors data for hair
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

const HairAnalysisCompleteScreen = () => {
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

  // ... (rest of the loading logic remains the same)

  // Get the first captured image for hair preview
  const hairImageUri = captures.length > 0 ? captures[0].uri : undefined;

  // Define detected conditions data for hair
  const detectedConditions: DetectedCondition[] = [
    {
      id: 'dry_scalp',
      title: 'Dry Scalp',
      severity: 'Medium',
      description: 'Visible flaking and dryness on the scalp surface.',
      progressValue: 65,
      progressColor: ['#FBBF24', '#D97706'],
      ImageUri: hairImageUri,
    },
    {
      id: 'hair_fall',
      title: 'Hair Fall',
      severity: 'Medium',
      description: 'Increased hair shedding noticed.',
      progressValue: 55,
      progressColor: ['#FBBF24', '#D97706'],
      ImageUri: hairImageUri,
    },
    {
      id: 'breakage',
      title: 'Breakage',
      severity: 'Low',
      description: 'Minor breakage observed at the ends.',
      progressValue: 35,
      progressColor: ['#60A5FA', '#2563EB'],
      ImageUri: hairImageUri,
    },
  ];

  // Define prognostic days for hair
  const prognosticDays: TimelineDay[] = [
    {
      id: 'today',
      title: 'Today',
      subtitle: '(Current Condition)',
      imageUri: hairImageUri,
      isFuture: false,
    },
    {
      id: 'day7',
      title: '+7 Days',
      subtitle: '(Prediction 1)',
      metrics: [
        { label: 'Scalp Health', value: '+15%', color: '#10B981' },
        { label: 'Dandruff', value: '-10%', color: '#10B981' },
      ],
      imageUri: hairImageUri,
      isFuture: true,
      improvementPercentage: 15,
    },
    {
      id: 'day14',
      title: '+14 Days',
      subtitle: '(Prediction 2)',
      metrics: [
        { label: 'Hair Strength', value: '+20%', color: '#10B981' },
        { label: 'Breakage', value: '-25%', color: '#10B981' },
      ],
      imageUri: hairImageUri,
      isFuture: true,
      improvementPercentage: 20,
    },
  ];

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Hair Analysis Complete" height={50} backButton />

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
          <AnalysingResultScoreCard stats={HAIR_STATS} title="Hair & Scalp Score Profile" />

          {/* Captured Angles Preview */}
          {captures.length > 0 && (
            <View>
              <Text className="mb-2 text-start font-outfitMedium text-[16px] text-[#2E2117]">
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

          {/* Hair Analysis Cards */}
          <HairAnalysisCards
            hairImageUri={hairImageUri}
            scalpHealth={72}
            dandruffLevel={35}
            dandruffProgress={35}
            breakageLevel={45}
            breakageProgress={45}
            oilinessLevel={55}
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

          {/* Prognostic Timeline */}
          <PrognosticTimeline
            days={prognosticDays}
            duration="14 Days"
            backgroundImage={require('@/assets/images/prognostic_timeline_bg_hair.jpg')}
            title="Hair Prognostic Timeline"
            showIcon={true}
            onDayPress={(day) => {
              console.log('Day pressed:', day.title);
            }}
          />

          {/* Button */}
          <PrimaryButton
            title="Generate Your Routine"
            onPress={() => {
              router.push('/(main)/routines');
            }}
            style={{ marginTop: 32 }}
          />

          <TouchableOpacity
            onPress={() => {
              router.push('/(main)');
            }}
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

const styles = StyleSheet.create({});
