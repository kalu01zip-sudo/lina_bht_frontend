// // app/(main)/routines/step-details.tsx
// import React, { useCallback } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Image,
//   useWindowDimensions,
//   ImageSourcePropType,
// } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { Video, ResizeMode } from 'expo-av';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import { StarWithDoublePlusIcon } from '@/components/icons/StarWithDoublePlusIcon';
// import { BookIcon, CheckInCircleIcon, FlameIcon } from '@/components/icons';
// import { KeyNutrientsSection, Nutrient } from '@/components/scans/KeyNutrientsSection';
// import {
//   FoodRecommendationSection,
//   RecommendedFood,
// } from '@/components/scans/FoodRecommendationSection';
// import { RecipesSection, RecommendedRecipe } from '@/components/scans/RecipesSection';
// import { HydrationTargetCard } from '@/components/scans/HydrationTargetCard';
// import { useGetRoutineStepDetailsQuery } from '@/store/api/routineApi';

// // ── Helpers ───────────────────────────────────────────────────────────────────

// /** Wraps a remote URL string in { uri } for Image / Video source props */
// const remoteSource = (url: string | null | undefined) => (url ? { uri: url } : null);

// /**
//  * Maps API nutrition items → KeyNutrientsSection's Nutrient shape.
//  * icon_url is always a remote URL from the backend.
//  */
// const mapNutrients = (
//   items: { id: string; name: string; icon_url: string; benefit: string }[]
// ): Nutrient[] =>
//   items.map((n) => ({
//     id: n.id,
//     name: n.name,
//     description: n.benefit,
//     imageUrl: { uri: n.icon_url } as ImageSourcePropType,
//   }));

// /**
//  * Maps API food items → FoodRecommendationSection's RecommendedFood shape.
//  */
// const mapFoods = (
//   items: { id: string; name: string; icon_url: string; tags: string[] }[]
// ): RecommendedFood[] =>
//   items.map((f) => ({
//     id: f.id,
//     name: f.name,
//     description: f.tags.join(', '),
//     imageUrl: { uri: f.icon_url },
//   }));

// /**
//  * Maps API recipe items → RecipesSection's RecommendedRecipe shape.
//  */
// const mapRecipes = (
//   items: {
//     id: string;
//     name: string;
//     image_url: string;
//     description: string;
//     meal_type: string;
//     tags: string[];
//   }[]
// ): RecommendedRecipe[] =>
//   items.map((r) => ({
//     id: r.id,
//     title: r.name,
//     description: r.description,
//     imageUrl: { uri: r.image_url },
//     tags: r.tags,
//     duration: r.meal_type,
//   }));

// // ── Component ─────────────────────────────────────────────────────────────────

// export default function RoutineStepDetailsScreen() {
//   const router = useRouter();
//   const { width } = useWindowDimensions();
//   const params = useLocalSearchParams();

//   const routineType = params.routineType as string;
//   const stepId = params.stepId as string;
//   const stepNumber = Number(params.stepNumber);
//   const title = params.title as string;
//   const productCategory = params.productCategory as string | undefined;

//   // ── API ─────────────────────────────────────────────────────────────────────
//   const {
//     data: detail,
//     isLoading,
//     isError,
//     refetch,
//   } = useGetRoutineStepDetailsQuery({ routine_id: stepId }, { skip: !stepId });

//   // ── Derived display data ────────────────────────────────────────────────────
//   const nutrients = detail?.key_nutrients?.length ? mapNutrients(detail.key_nutrients) : [];
//   const foods = detail?.food_recommendation?.length ? mapFoods(detail.food_recommendation) : [];
//   const recipes = detail?.recipe_recommendation?.length
//     ? mapRecipes(detail.recipe_recommendation)
//     : [];

//   const productImageSource = remoteSource(detail?.product?.image_url);
//   const displayCategory = detail?.product?.category || productCategory || '';
//   const displayName = detail?.product?.name || title || '';

//   // ── Loading ─────────────────────────────────────────────────────────────────
//   if (isLoading) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Step Details" height={50} backButton />
//         <View className="flex-1 items-center justify-center">
//           <ActivityIndicator size="large" color="#977857" />
//           <Text className="mt-4 font-outfit text-[14px]" style={{ color: '#2E211799' }}>
//             Loading step details...
//           </Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ── Error ───────────────────────────────────────────────────────────────────
//   if (isError || !detail) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Step Details" height={50} backButton />
//         <View className="flex-1 items-center justify-center px-8">
//           <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
//           <Text
//             className="mt-4 text-center font-outfitMedium text-[16px]"
//             style={{ color: '#2E2117' }}>
//             Could not load step details
//           </Text>
//           <TouchableOpacity
//             onPress={refetch}
//             className="mt-4 rounded-2xl px-8 py-3"
//             style={{ backgroundColor: '#361A0D' }}>
//             <Text className="font-outfitMedium text-[14px] text-white">Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ── Happy path ──────────────────────────────────────────────────────────────
//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader title="Step Details" height={50} backButton />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           paddingTop: 20,
//         }}
//         className="flex-1">
//         <View className="px-container">
//           {/* ── Video player (uploaded file URL, not YouTube) ────────────── */}
//           {detail.video_url ? (
//             <View
//               style={{
//                 width: '100%',
//                 height: (width - 32) * (9 / 16), // 16:9
//                 borderRadius: 16,
//                 overflow: 'hidden',
//                 backgroundColor: '#1A1A1A',
//                 marginBottom: 12,
//               }}>
//               <Video
//                 source={{ uri: detail.video_url }}
//                 style={{ flex: 1 }}
//                 useNativeControls
//                 resizeMode={ResizeMode.CONTAIN}
//                 shouldPlay={false}
//               />
//             </View>
//           ) : null}

//           {/* ── Meta row ────────────────────────────────────────────────── */}
//           <Text className="mb-2 font-outfitMedium text-[18px]" style={{ color: '#2E2117' }}>
//             {detail.video_title || displayName}
//           </Text>
//           <View className="flex-row items-center gap-3">
//             {detail.reading_duration ? (
//               <View className="flex-row items-center gap-1">
//                 <Ionicons name="time-outline" size={16} color="#2E2117" />
//                 <Text className="font-outfit text-[12px]" style={{ color: '#2E2117' }}>
//                   {detail.reading_duration}
//                 </Text>
//               </View>
//             ) : null}
//             {detail.video_url ? (
//               <View className="flex-row items-center gap-1">
//                 <Ionicons name="videocam-outline" size={16} color="#2E2117" />
//                 <Text className="font-outfit text-[12px]" style={{ color: '#2E2117' }}>
//                   Video
//                 </Text>
//               </View>
//             ) : null}
//           </View>

//           {/* ── Product card ─────────────────────────────────────────────── */}
//           <View className="mt-6 flex-row items-center gap-4">
//             {productImageSource ? (
//               <Image
//                 source={productImageSource}
//                 style={{
//                   width: 80,
//                   height: 80,
//                   borderRadius: 12,
//                   borderWidth: 0.5,
//                   borderColor: '#00000020',
//                   backgroundColor: '#E8DDD0',
//                 }}
//                 resizeMode="cover"
//               />
//             ) : (
//               // Placeholder when no product image
//               <View
//                 style={{
//                   width: 80,
//                   height: 80,
//                   borderRadius: 12,
//                   backgroundColor: '#E8DDD0',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   borderWidth: 0.5,
//                   borderColor: '#00000020',
//                 }}>
//                 <Ionicons name="cube-outline" size={32} color="#977857" />
//               </View>
//             )}
//             <View className="flex-1">
//               {displayCategory ? (
//                 <Text
//                   className="font-outfitMedium text-[14px]"
//                   style={{ color: '#977857' }}
//                   numberOfLines={2}>
//                   {displayCategory}
//                 </Text>
//               ) : null}
//               {displayName ? (
//                 <Text
//                   className="mt-1 font-outfitMedium text-[20px]"
//                   style={{ color: '#2E2117' }}
//                   numberOfLines={2}>
//                   {displayName}
//                 </Text>
//               ) : null}
//             </View>
//           </View>

//           {/* ── Body text ────────────────────────────────────────────────── */}
//           {detail.text ? (
//             <Text className="mt-3 font-outfit text-[14px] leading-6" style={{ color: '#2E2117CC' }}>
//               {detail.text}
//             </Text>
//           ) : null}

//           {/* ── Key Benefits ─────────────────────────────────────────────── */}
//           {detail.key_benefits?.length > 0 && (
//             <BorderlessShadowCard
//               style={{ paddingVertical: 16, paddingHorizontal: 24, marginTop: 24 }}>
//               <View className="flex-row items-center gap-3">
//                 <View
//                   className="h-8 w-8 items-center justify-center bg-backgroundColor"
//                   style={{
//                     borderRadius: 6,
//                     shadowColor: '#000',
//                     shadowOffset: { width: 0, height: 1 },
//                     shadowOpacity: 0.15,
//                     shadowRadius: 2,
//                     elevation: 3,
//                   }}>
//                   <StarWithDoublePlusIcon size={20} color="#361A0D" />
//                 </View>
//                 <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
//                   Key Benefits
//                 </Text>
//               </View>
//               {detail.key_benefits.map((benefit, i) => (
//                 <View key={i} className="mt-3 flex-row items-start gap-3">
//                   <FlameIcon size={16} color="#7A8B6A" style={{ marginTop: 2 }} />
//                   <Text className="flex-1 font-outfit text-[14px]" style={{ color: '#2E2117CC' }}>
//                     {benefit}
//                   </Text>
//                 </View>
//               ))}
//             </BorderlessShadowCard>
//           )}

//           {/* ── What You'll Learn ─────────────────────────────────────────── */}
//           {detail.what_you_learn?.length > 0 && (
//             <BorderlessShadowCard
//               b_tl={0}
//               b_tr={0}
//               b_bl={24}
//               b_br={24}
//               style={{
//                 paddingVertical: 16,
//                 paddingHorizontal: 24,
//                 marginTop: detail.key_benefits?.length > 0 ? 12 : 24,
//               }}>
//               <View className="flex-row items-center gap-3">
//                 <View
//                   className="h-8 w-8 items-center justify-center bg-backgroundColor"
//                   style={{
//                     borderRadius: 6,
//                     shadowColor: '#000',
//                     shadowOffset: { width: 0, height: 1 },
//                     shadowOpacity: 0.15,
//                     shadowRadius: 2,
//                     elevation: 3,
//                   }}>
//                   <BookIcon size={20} color="#361A0D" />
//                 </View>
//                 <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
//                   What You&apos;ll Learn
//                 </Text>
//               </View>
//               {detail.what_you_learn.map((item, i) => (
//                 <View key={i} className="mt-3 flex-row items-start gap-3">
//                   <CheckInCircleIcon size={16} color="#2E2117" style={{ marginTop: 2 }} />
//                   <Text className="flex-1 font-outfit text-[14px]" style={{ color: '#2E2117CC' }}>
//                     {item}
//                   </Text>
//                 </View>
//               ))}
//             </BorderlessShadowCard>
//           )}

//           {/* ── Key Nutrients (only when API returns them) ────────────────── */}
//           {nutrients.length > 0 && (
//             <KeyNutrientsSection
//               nutrients={nutrients}
//               title="Key Nutrients for Your Skin"
//               showIcon
//             />
//           )}

//           {/* ── Food Recommendations (only when API returns them) ─────────── */}
//           {foods.length > 0 && (
//             <FoodRecommendationSection
//               recommendedFoods={foods}
//               title="Your Food Recommendations"
//               showIcon
//             />
//           )}

//           {/* ── Recipes (only when API returns them) ─────────────────────── */}
//           {recipes.length > 0 && (
//             <RecipesSection
//               recommendedRecipes={recipes}
//               title="Recipes for Your Skin"
//               showIcon
//               onRecipePress={(recipe) => console.log('Recipe pressed:', recipe.title)}
//             />
//           )}

//           {/* ── Hydration target — always shown ──────────────────────────── */}
//           <HydrationTargetCard
//             goal="2.4L of Water"
//             description="Drinking enough water helps flush inflammatory markers and revitalizes areas detected in your scan."
//             title="Hydration Target"
//             iconSize={20}
//             iconColor="#A68A61"
//           />
//         </View>
//         <View className="py-3" />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// app/(main)/routines/step-details.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  useWindowDimensions,
  ImageSourcePropType,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { StarWithDoublePlusIcon } from '@/components/icons/StarWithDoublePlusIcon';
import { BookIcon, CheckInCircleIcon, FlameIcon } from '@/components/icons';
import { KeyNutrientsSection, Nutrient } from '@/components/scans/KeyNutrientsSection';
import {
  FoodRecommendationSection,
  RecommendedFood,
} from '@/components/scans/FoodRecommendationSection';
import { RecipesSection, RecommendedRecipe } from '@/components/scans/RecipesSection';
import { HydrationTargetCard } from '@/components/scans/HydrationTargetCard';
import { useGetRoutineStepDetailsQuery } from '@/store/api/routineApi';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Wraps a remote URL string in { uri } for Image / Video source props */
const remoteSource = (url: string | null | undefined) => (url ? { uri: url } : null);

/**
 * Maps API `nutritions` items → KeyNutrientsSection's Nutrient shape.
 *
 * Actual API shape (from /routine/details/:id):
 * {
 *   _id: string
 *   id: string
 *   name: string
 *   "main ingredient": string
 *   "how to improves": string
 *   "image url": string        ← note: space-separated key
 *   detected_condition: string[]
 * }
 */
const mapNutrients = (
  items: {
    id: string;
    name: string;
    'image url': string; // actual API field name
    'how to improves': string; // actual API field name
    // legacy shape from RoutineStepDetailNutrition — kept for backwards compat
    icon_url?: string;
    benefit?: string;
    tags?: string[];
    priority?: number;
  }[]
): Nutrient[] =>
  items.map((n) => ({
    id: n.id,
    name: n.name,
    description: n['how to improves'] ?? n.benefit ?? '',
    imageUrl: { uri: n['image url'] ?? n.icon_url ?? '' } as ImageSourcePropType,
  }));

/**
 * Maps API `foods` items → FoodRecommendationSection's RecommendedFood shape.
 *
 * Actual API shape:
 * {
 *   _id: string
 *   id: string
 *   name: string
 *   ingredients: string[]
 *   detected_condition: string[]
 *   benefits: string
 *   icon_url: string
 *   tags: string[]
 *   score: number
 * }
 */
const mapFoods = (
  items: {
    id: string;
    name: string;
    icon_url: string;
    tags: string[];
    benefits?: string;
    // legacy shape
    description?: string;
  }[]
): RecommendedFood[] =>
  items.map((f) => ({
    id: f.id,
    name: f.name,
    description: f.benefits ?? f.tags.join(', '),
    imageUrl: { uri: f.icon_url },
  }));

/**
 * Maps API `recipes` items → RecipesSection's RecommendedRecipe shape.
 *
 * Actual API shape:
 * {
 *   _id: string
 *   id: string
 *   name: string
 *   main_ingredients: string[]
 *   detected_condition: string[]
 *   how_it_improves: string
 *   tags: string[]              ← e.g. ["#glow #collagen #brightening"]
 *   image_url: string
 *   score: number
 * }
 */
const mapRecipes = (
  items: {
    id: string;
    name: string;
    image_url: string;
    how_it_improves?: string;
    tags: string[];
    main_ingredients?: string[];
    // legacy shape
    description?: string;
    meal_type?: string;
  }[]
): RecommendedRecipe[] =>
  items.map((r) => ({
    id: r.id,
    title: r.name,
    description: r.how_it_improves ?? r.description ?? '',
    imageUrl: { uri: r.image_url },
    tags: r.tags,
    duration: r.meal_type ?? r.main_ingredients?.join(', ') ?? '',
  }));

// ── Component ─────────────────────────────────────────────────────────────────

export default function RoutineStepDetailsScreen() {
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams();

  const routineType = params.routineType as string;
  const stepId = params.stepId as string;
  const stepNumber = Number(params.stepNumber);
  const title = params.title as string;
  const productCategory = params.productCategory as string | undefined;

  // ── API ─────────────────────────────────────────────────────────────────────
  const {
    data: detail,
    isLoading,
    isError,
    refetch,
  } = useGetRoutineStepDetailsQuery({ routine_id: stepId }, { skip: !stepId });

  // ── Derived display data ────────────────────────────────────────────────────
  // Support both the legacy typed shape (key_nutrients / food_recommendation /
  // recipe_recommendation) AND the actual API shape (nutritions / foods / recipes).
  const rawDetail = detail as any;

  const nutrients: Nutrient[] = (() => {
    const src = rawDetail?.nutritions ?? rawDetail?.key_nutrients ?? [];
    return src.length ? mapNutrients(src) : [];
  })();

  const foods: RecommendedFood[] = (() => {
    const src = rawDetail?.foods ?? rawDetail?.food_recommendation ?? [];
    return src.length ? mapFoods(src) : [];
  })();

  const recipes: RecommendedRecipe[] = (() => {
    const src = rawDetail?.recipes ?? rawDetail?.recipe_recommendation ?? [];
    return src.length ? mapRecipes(src) : [];
  })();

  const productImageSource = remoteSource(detail?.product?.image_url);
  const displayCategory = detail?.product?.category || productCategory || '';
  const displayName = detail?.product?.name || title || '';

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Step Details" height={50} backButton />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#977857" />
          <Text className="mt-4 font-outfit text-[14px]" style={{ color: '#2E211799' }}>
            Loading step details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (isError || !detail) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Step Details" height={50} backButton />
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text
            className="mt-4 text-center font-outfitMedium text-[16px]"
            style={{ color: '#2E2117' }}>
            Could not load step details
          </Text>
          <TouchableOpacity
            onPress={refetch}
            className="mt-4 rounded-2xl px-8 py-3"
            style={{ backgroundColor: '#361A0D' }}>
            <Text className="font-outfitMedium text-[14px] text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Happy path ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Step Details" height={50} backButton />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 20,
        }}
        className="flex-1">
        <View className="px-container">
          {/* ── Video player ────────────────────────────────────────────── */}
          {detail.video_url ? (
            <View
              style={{
                width: '100%',
                height: (width - 32) * (9 / 16),
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: '#1A1A1A',
                marginBottom: 12,
              }}>
              <Video
                source={{ uri: detail.video_url }}
                style={{ flex: 1 }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={false}
              />
            </View>
          ) : null}

          {/* ── Meta row ────────────────────────────────────────────────── */}
          <Text className="mb-2 font-outfitMedium text-[18px]" style={{ color: '#2E2117' }}>
            {detail.video_title || displayName}
          </Text>
          <View className="flex-row items-center gap-3">
            {detail.reading_duration ? (
              <View className="flex-row items-center gap-1">
                <Ionicons name="time-outline" size={16} color="#2E2117" />
                <Text className="font-outfit text-[12px]" style={{ color: '#2E2117' }}>
                  {detail.reading_duration}
                </Text>
              </View>
            ) : null}
            {detail.video_url ? (
              <View className="flex-row items-center gap-1">
                <Ionicons name="videocam-outline" size={16} color="#2E2117" />
                <Text className="font-outfit text-[12px]" style={{ color: '#2E2117' }}>
                  Video
                </Text>
              </View>
            ) : null}
          </View>

          {/* ── Product card ─────────────────────────────────────────────── */}
          <View className="mt-6 flex-row items-center gap-4">
            {productImageSource ? (
              <Image
                source={productImageSource}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  borderWidth: 0.5,
                  borderColor: '#00000020',
                  backgroundColor: '#E8DDD0',
                }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  backgroundColor: '#E8DDD0',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 0.5,
                  borderColor: '#00000020',
                }}>
                <Ionicons name="cube-outline" size={32} color="#977857" />
              </View>
            )}
            <View className="flex-1">
              {displayCategory ? (
                <Text
                  className="font-outfitMedium text-[14px]"
                  style={{ color: '#977857' }}
                  numberOfLines={2}>
                  {displayCategory}
                </Text>
              ) : null}
              {displayName ? (
                <Text
                  className="mt-1 font-outfitMedium text-[20px]"
                  style={{ color: '#2E2117' }}
                  numberOfLines={2}>
                  {displayName}
                </Text>
              ) : null}
            </View>
          </View>

          {/* ── Body text ────────────────────────────────────────────────── */}
          {detail.text ? (
            <Text className="mt-3 font-outfit text-[14px] leading-6" style={{ color: '#2E2117CC' }}>
              {detail.text}
            </Text>
          ) : null}

          {/* ── Key Benefits ─────────────────────────────────────────────── */}
          {detail.key_benefits?.length > 0 && (
            <BorderlessShadowCard
              style={{ paddingVertical: 16, paddingHorizontal: 24, marginTop: 24 }}>
              <View className="flex-row items-center gap-3">
                <View
                  className="h-8 w-8 items-center justify-center bg-backgroundColor"
                  style={{
                    borderRadius: 6,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.15,
                    shadowRadius: 2,
                    elevation: 3,
                  }}>
                  <StarWithDoublePlusIcon size={20} color="#361A0D" />
                </View>
                <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
                  Key Benefits
                </Text>
              </View>
              {detail.key_benefits.map((benefit, i) => (
                <View key={i} className="mt-3 flex-row items-start gap-3">
                  <FlameIcon size={16} color="#7A8B6A" style={{ marginTop: 2 }} />
                  <Text className="flex-1 font-outfit text-[14px]" style={{ color: '#2E2117CC' }}>
                    {benefit}
                  </Text>
                </View>
              ))}
            </BorderlessShadowCard>
          )}

          {/* ── What You'll Learn ─────────────────────────────────────────── */}
          {detail.what_you_learn?.length > 0 && (
            <BorderlessShadowCard
              b_tl={0}
              b_tr={0}
              b_bl={24}
              b_br={24}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 24,
                marginTop: detail.key_benefits?.length > 0 ? 12 : 24,
              }}>
              <View className="flex-row items-center gap-3">
                <View
                  className="h-8 w-8 items-center justify-center bg-backgroundColor"
                  style={{
                    borderRadius: 6,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.15,
                    shadowRadius: 2,
                    elevation: 3,
                  }}>
                  <BookIcon size={20} color="#361A0D" />
                </View>
                <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
                  What You&apos;ll Learn
                </Text>
              </View>
              {detail.what_you_learn.map((item, i) => (
                <View key={i} className="mt-3 flex-row items-start gap-3">
                  <CheckInCircleIcon size={16} color="#2E2117" style={{ marginTop: 2 }} />
                  <Text className="flex-1 font-outfit text-[14px]" style={{ color: '#2E2117CC' }}>
                    {item}
                  </Text>
                </View>
              ))}
            </BorderlessShadowCard>
          )}

          {/* ── Key Nutrients ─────────────────────────────────────────────── */}
          {nutrients.length > 0 && (
            <KeyNutrientsSection
              nutrients={nutrients}
              title="Key Nutrients for Your Skin"
              showIcon
            />
          )}

          {/* ── Food Recommendations ──────────────────────────────────────── */}
          {foods.length > 0 && (
            <FoodRecommendationSection
              recommendedFoods={foods}
              title="Your Food Recommendations"
              showIcon
            />
          )}

          {/* ── Recipes ───────────────────────────────────────────────────── */}
          {recipes.length > 0 && (
            <RecipesSection
              recommendedRecipes={recipes}
              title="Recipes for Your Skin"
              showIcon
              onRecipePress={(recipe) => console.log('Recipe pressed:', recipe.title)}
            />
          )}

          {/* ── Hydration target ──────────────────────────────────────────── */}
          <HydrationTargetCard
            goal="2.4L of Water"
            description="Drinking enough water helps flush inflammatory markers and revitalizes areas detected in your scan."
            title="Hydration Target"
            iconSize={20}
            iconColor="#A68A61"
          />
        </View>
        <View className="py-3" />
      </ScrollView>
    </SafeAreaView>
  );
}
