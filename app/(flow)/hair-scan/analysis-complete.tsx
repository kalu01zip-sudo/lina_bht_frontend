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

  // Use captured image if available, else fallback to sample
  const hairImageUri =
    captures.length > 0
      ? { uri: captures[0].uri }
      : require('@/assets/images/hair_scalp_analysis_sample_image.jpg');

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

          <View className="mt-6" />
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
          {/* <HairAnalysisCards hairImageUri={hairImageUri} scalpHealth={72} /> */}

          <HairAnalysisCards
            hairImageUri={hairImageUri}
            scalpHealth={72}
            flakinessScore={35}
            flakinessProgress={35}
            flakinessLabel="Flakiness Pattern"
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

          {/* Button */}
          <PrimaryButton
            title="Generate Your Routine"
            onPress={() => {
              router.push('/(flow)/routines/ai-routine-generate/ai-routine');
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
