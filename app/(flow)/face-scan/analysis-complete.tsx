// // app/(flow)/scans/face-scan/ai-analysis-complete.tsx
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
// import { SkinAnalysisCards } from '@/components/scans/faceScan/SkinAnalysisCards';
// import { DetectedConditionsList } from '@/components/scans/DetectedConditionsList';
// import { DetectedCondition } from '@/components/scans/DetectedConditionCard';
// import { LifestyleFactors, LifestyleFactor } from '@/components/scans/LifestyleFactors';
// import { PrognosticTimeline, TimelineDay } from '@/components/scans/PrognosticTimeline';
// import { NutritionIcon } from '@/components/icons/NutritionIcon';
// import { KeyNutrientsSection, Nutrient } from '@/components/scans/KeyNutrientsSection';

// const SKIN_STATS = [
//   { label: 'Hydration', value: '85', color: '#60A5FA' },
//   { label: 'Sebum', value: '60', color: '#4ADE80' },
//   { label: 'Redness', value: '38', color: '#FB7185' },
//   { label: 'Texture', value: '98', color: '#FBBF24' },
//   { label: 'Evenness', value: '52', color: '#A78BFA' },
// ];

// // Static lifestyle factors data
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

// const AiAnalysisCompleteScreen = () => {
//   const router = useRouter();
//   const { width } = useWindowDimensions();
//   const { captures: capturesParam } = useLocalSearchParams();
//   const [captures, setCaptures] = useState<AngleCapture[]>([]);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [nutrients, setNutrients] = useState<Nutrient[]>([]);
//   const [isLoadingNutrients, setIsLoadingNutrients] = useState(true);

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
//       console.log('📊 ANALYSIS SCREEN - Received params:', {
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
//         <CustomHeader title="Analysis Complete" height={50} backButton />
//         <ErrorScreen message={renderError} onRetry={handleRetry} />
//       </SafeAreaView>
//     );
//   }

//   // Show loading while data is being processed
//   if (isLoading) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Analysis Complete" height={50} backButton />
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
//         <CustomHeader title="Analysis Complete" height={50} backButton />
//         <ErrorScreen message={error} onRetry={handleRetry} />
//       </SafeAreaView>
//     );
//   }

//   // Get the first captured image for face preview
//   const faceImageUri = captures.length > 0 ? captures[0].uri : undefined;

//   // Define your detected conditions data
//   const detectedConditions: DetectedCondition[] = [
//     {
//       id: 'redness',
//       title: 'Mild Redness',
//       severity: 'Medium',
//       description: 'Your skin barrier is slightly compromised, likely due to over-exfoliation.',
//       progressValue: 45,
//       progressColor: ['#FBBF24', '#D97706'],
//       ImageUri: faceImageUri,
//       faceArea: { x: 100, y: 150, width: 80, height: 80 },
//     },
//     {
//       id: 'dehydration',
//       title: 'Dehydration',
//       severity: 'Low',
//       description: 'Requires attention and targeted care.',
//       progressValue: 25,
//       progressColor: ['#60A5FA', '#2563EB'],
//       ImageUri: faceImageUri,
//     },
//     {
//       id: 'pores',
//       title: 'Pores',
//       severity: 'Low',
//       description: 'Normal appearance, slight congestion on nose.',
//       progressValue: 25,
//       progressColor: ['#A78BFA', '#8B5CF6'],
//       ImageUri: faceImageUri,
//     },
//   ];

//   // In your main screen, define the prognostic days with future flags
//   const prognosticDays: TimelineDay[] = [
//     {
//       id: 'today',
//       title: 'Today',
//       subtitle: '(Fragile Barrier)',
//       imageUri: faceImageUri,
//       isFuture: false,
//     },
//     {
//       id: 'day7',
//       title: '+7 Days',
//       subtitle: '(Prediction 1)',
//       metrics: [
//         { label: 'Hydration', value: '+18%', color: '#10B981' },
//         { label: 'Redness', value: '-12%', color: '#10B981' },
//       ],
//       imageUri: faceImageUri,
//       isFuture: true,
//       improvementPercentage: 18,
//     },
//     {
//       id: 'day14',
//       title: '+14 Days',
//       subtitle: '(Prediction 2)',
//       metrics: [
//         { label: 'Barrier', value: '92%', color: '#10B981' },
//         { label: 'Evenness', value: '+25%', color: '#10B981' },
//       ],
//       imageUri: faceImageUri,
//       isFuture: true,
//       improvementPercentage: 25,
//     },
//   ];

//   // Inside your component, after faceImageUri is defined:
//   // const prognosticDays = PROGNOSTIC_DAYS.map((day) => ({
//   //   ...day,
//   //   imageUri: faceImageUri,
//   // }));

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader title="Analysis Complete" height={50} backButton />

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
//           {/* NEW COMPONENT CALL */}
//           <AnalysingResultScoreCard stats={SKIN_STATS} title="Face Scan Score Profile" />

//           {/* Captured Angles Preview */}
//           {captures.length > 0 && (
//             <View className="">
//               <Text className="mb-2 mt-6 text-start font-outfitMedium text-[16px] text-[#2E2117]">
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

//           {/* Skin Analysis Cards - Face Image & Hydration Chart */}
//           <SkinAnalysisCards
//             imageUri={faceImageUri}
//             hydrationLevel={72}
//             rednessScore={24}
//             rednessProgress={38}
//             rednessLabel="Visible Redness (Cheeks)"
//           />

//           {/* Detected Conditions Section */}
//           <DetectedConditionsList
//             conditions={detectedConditions}
//             title="Detected Conditions"
//             showIcon={true}
//             showFaceImages={true}
//           />

//           {/* Lifestyle Factors Section */}
//           <LifestyleFactors factors={LIFESTYLE_FACTORS} title="Lifestyle Factors" showIcon={true} />

//           {/* Header */}
//           <PrognosticTimeline
//             days={prognosticDays}
//             duration="14 Days"
//             backgroundImage={require('@/assets/images/prognostic_timeline_bg_face.jpg')}
//             title="Prognostic Timeline"
//             showIcon={true}
//             onDayPress={(day) => {
//               console.log('Day pressed:', day.title);
//               // Navigate to day details
//             }}
//           />

//           {/* Key Nutrients for Your Skin */}
//           <View className="mt-6">
//             <View className=" flex-row items-center gap-3 ">
//               <NutritionIcon size={32} />
//               <Text className="font-outfitMedium text-[16px] " style={{ color: '#2E2117' }}>
//                 Key Nutrients for Your Skin
//               </Text>
//             </View>
//             <View className="mt-3 flex-row items-center gap-4 ">
//               <View
//                 className=" w-100 items-center p-3    "
//                 style={{
//                   borderRadius: 24,
//                   borderWidth: 2,
//                   borderColor: '#FFFFFF99',
//                   borderLeftWidth: 1,
//                   borderRightWidth: 1,
//                   maxWidth: 155,
//                 }}>
//                 {/* <WaterIcon width={61} height={24} /> */}
//                 {/* Local Image from Assets */}
//                 <Image
//                   source={require('@/assets/images/nutrition_static_images/omega-3.png')} // Update path to your actual file
//                   className="h-[24px] w-[24px]"
//                   style={{
//                     borderRadius: 100,
//                     // backgroundColor: 'red',
//                   }}
//                   resizeMode="contain"
//                 />
//                 <Text
//                   className="text-center font-outfit text-[14px] "
//                   style={{
//                     color: '#1A1A1A',
//                     textShadowColor: '#FFFFFF',
//                     textShadowOffset: { width: 1, height: 2 },
//                     textShadowRadius: 2,
//                   }}>
//                   Omega-3
//                 </Text>
//                 <Text
//                   className="mt-1 text-center font-outfit text-[10px] "
//                   style={{
//                     color: '#666666',
//                     textShadowColor: '#FFFFFF',
//                     textShadowOffset: { width: 1, height: 1 },
//                     textShadowRadius: 2,
//                   }}>
//                   Reduces inflammation, strengthens the skin barrier and improves hydration.
//                 </Text>
//               </View>
//               <View
//                 className=" w-100 items-center p-3    "
//                 style={{
//                   borderRadius: 24,
//                   borderWidth: 2,
//                   borderColor: '#FFFFFF99',
//                   borderLeftWidth: 1,
//                   borderRightWidth: 1,
//                   maxWidth: 155,
//                 }}>
//                 {/* <WaterIcon width={61} height={24} /> */}
//                 {/* Local Image from Assets */}
//                 <Image
//                   source={require('@/assets/images/nutrition_static_images/zinc.png')} // Update path to your actual file
//                   className="h-[24px] w-[24px]"
//                   style={{
//                     borderRadius: 100,
//                     // backgroundColor: 'red',
//                   }}
//                   resizeMode="contain"
//                 />
//                 <Text
//                   className="text-center font-outfit text-[14px] "
//                   style={{
//                     color: '#1A1A1A',
//                     textShadowColor: '#FFFFFF',
//                     textShadowOffset: { width: 1, height: 2 },
//                     textShadowRadius: 2,
//                   }}>
//                   Zinc
//                 </Text>
//                 <Text
//                   className="mt-1 text-center font-outfit text-[10px] "
//                   style={{
//                     color: '#666666',
//                     textShadowColor: '#FFFFFF',
//                     textShadowOffset: { width: 1, height: 1 },
//                     textShadowRadius: 2,
//                   }}>
//                   Reduces inflammation, strengthens the skin barrier and improves hydration.
//                 </Text>
//               </View>
//               <View
//                 className=" w-100 items-center p-3    "
//                 style={{
//                   borderRadius: 24,
//                   borderWidth: 2,
//                   borderColor: '#FFFFFF99',
//                   borderLeftWidth: 1,
//                   borderRightWidth: 1,
//                   maxWidth: 155,
//                 }}>
//                 {/* <WaterIcon width={61} height={24} /> */}
//                 {/* Local Image from Assets */}
//                 <Image
//                   source={require('@/assets/images/nutrition_static_images/vitamin-c.png')} // Update path to your actual file
//                   className="h-[24px] w-[24px]"
//                   style={{
//                     borderRadius: 100,
//                     // backgroundColor: 'red',
//                   }}
//                   resizeMode="contain"
//                 />
//                 <Text
//                   className="text-center font-outfit text-[14px] "
//                   style={{
//                     color: '#1A1A1A',
//                     textShadowColor: '#FFFFFF',
//                     textShadowOffset: { width: 1, height: 2 },
//                     textShadowRadius: 2,
//                   }}>
//                   Vitamin-c
//                 </Text>
//                 <Text
//                   className="mt-1 text-center font-outfit text-[10px] "
//                   style={{
//                     color: '#666666',
//                     textShadowColor: '#FFFFFF',
//                     textShadowOffset: { width: 1, height: 1 },
//                     textShadowRadius: 2,
//                   }}>
//                   Reduces inflammation, strengthens the skin barrier and improves hydration.
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Button */}
//           <PrimaryButton
//             title="Generate Your Routine"
//             onPress={() => {
//               router.push('/(flow)/routines/ai-routine-generate/ai-routine');
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
import { KeyNutrientsSection, Nutrient } from '@/components/scans/KeyNutrientsSection';
import {
  FoodRecommendationSection,
  RecommendedFood,
} from '@/components/scans/FoodRecommendationSection';
import { RecipesSection, RecommendedRecipe } from '@/components/scans/RecipesSection';
import { FlameIcon } from '@/components/icons';
import { HydrationTargetCard } from '@/components/scans/HydrationTargetCard';

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

// Static nutrients data - just like the others!
const NUTRIENTS_DATA: Nutrient[] = [
  {
    id: 'omega-3',
    name: 'Omega-3',
    description: 'Reduces inflammation, strengthens the skin barrier and improves hydration.',
    imageUrl: require('@/assets/images/nutrition_static_images/omega-3.png'),
  },
  {
    id: 'zinc',
    name: 'Zinc',
    description: 'Supports skin healing, reduces inflammation, and helps with acne management.',
    imageUrl: require('@/assets/images/nutrition_static_images/zinc.png'),
  },
  {
    id: 'vitamin-c',
    name: 'Vitamin C',
    description: 'Boosts collagen production, brightens skin, and provides antioxidant protection.',
    imageUrl: require('@/assets/images/nutrition_static_images/vitamin-c.png'),
  },
  {
    id: 'magnesium',
    name: 'Magnesium',
    description:
      'Supports skin cell repair, balances the microbiome, and calms persistent inflammation.',
    imageUrl: require('@/assets/images/nutrition_static_images/magnesium.png'),
  },
];

// Static recommendation food data
const RECOMMENDED_FOODS_DATA: RecommendedFood[] = [
  {
    id: 'avocado',
    name: 'Avocado',
    description: 'Healthy fats',
    imageUrl: require('@/assets/images/nutrition_static_images/avocado.png'),
  },
  {
    id: 'salmon',
    name: 'Salmon',
    description: 'Omega-3',
    imageUrl: require('@/assets/images/nutrition_static_images/salmon.png'),
  },
  {
    id: 'blueberries',
    name: 'Blueberries',
    description: 'Antioxidants',
    imageUrl: require('@/assets/images/nutrition_static_images/blueberries.png'),
  },
  {
    id: 'spinach',
    name: 'Spinach',
    description: 'Magnesium',
    imageUrl: require('@/assets/images/nutrition_static_images/spinach.png'),
  },
  {
    id: 'chiaseeds',
    name: 'Chia Seeds',
    description: 'Antioxidants',
    imageUrl: require('@/assets/images/nutrition_static_images/chiaseeds.png'),
  },
  {
    id: 'almonds',
    name: 'Almonds',
    description: 'Vitamin E',
    imageUrl: require('@/assets/images/nutrition_static_images/almonds.png'),
  },
];

const RECOMMENDED_RECIPES_DATA: RecommendedRecipe[] = [
  {
    id: 'avocado-smoothie',
    title: 'Avocado & Berry Smoothie',
    description: 'Packed with healthy fats and antioxidants for glowing skin.',
    imageUrl: require('@/assets/images/nutrition_static_images/recipe_1.jpg'),
    tags: ['Breakfast', 'Quick'],
  },
  {
    id: 'salmon-bowl',
    title: 'Omega-3 Salmon Bowl',
    description: 'Rich in omega-3 fatty acids to reduce inflammation.',
    imageUrl: require('@/assets/images/nutrition_static_images/recipe_2.jpg'),
    tags: ['Lunch', 'High Protein'],
  },
  {
    id: 'berry-parfait',
    title: 'Antioxidant Berry Parfait',
    description: 'Loaded with vitamin C and antioxidants for skin repair.',
    imageUrl: require('@/assets/images/nutrition_static_images/recipe_3.jpg'),
    tags: ['Breakfast', 'Dessert'],
  },
  {
    id: 'spinach-salad',
    title: 'Magnesium Rich Spinach Salad',
    description: 'Supports skin cell repair and reduces inflammation.',
    // imageUrl: require('@/assets/images/nutrition_static_images/recipe_2.jpg'),
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSviMY8z9K4g1wxRIUBbyTZ5B8lWTN6_ECvjQ&s',
    tags: ['Lunch', 'Vegetarian'],
  },
  {
    id: 'chia-pudding',
    title: 'Chia Seed Pudding',
    description: 'Rich in omega-3 and fiber for skin health.',
    imageUrl:
      'https://images.immediate.co.uk/production/volatile/sites/30/2022/08/Fish-Tacos-1337495.jpg?quality=90&resize=708,643',
    tags: ['Breakfast', 'Dairy-Free'],
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

  // Define prognostic days with future flags
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
          {/* Face Scan Score Profile */}
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

          {/* Prognostic Timeline */}
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

          {/* Key Nutrients for Your Skin - Using static data like the others */}
          <KeyNutrientsSection
            nutrients={NUTRIENTS_DATA}
            title="Key Nutrients for Your Skin"
            showIcon={true}
          />

          {/* Food Recommendations */}
          <FoodRecommendationSection
            recommendedFoods={RECOMMENDED_FOODS_DATA}
            title="Your Food Recommendations"
            showIcon={true}
          />

          {/* Recipes Skin */}
          <RecipesSection
            recommendedRecipes={RECOMMENDED_RECIPES_DATA}
            title="Recipes for Your Skin"
            showIcon={true}
            onRecipePress={(recipe) => {
              console.log('Recipe pressed:', recipe.title);
              // Navigate to recipe details
            }}
          />

          <HydrationTargetCard
            goal="2.4L of Water"
            description="Drinking enough water helps flush inflammatory markers and revitalizes areas detected in your scan."
            title="Hydration Target"
            iconSize={20}
            iconColor="#A68A61"
          />

          {/* Generate Routine Button */}
          <PrimaryButton
            title="Generate Your Routine"
            onPress={() => {
              router.push('/(flow)/routines/ai-routine-generate/ai-routine');
            }}
            style={{ marginTop: 32 }}
          />

          {/* Skip Button */}
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
