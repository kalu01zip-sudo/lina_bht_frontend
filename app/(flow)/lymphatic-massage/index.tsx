// // app/(flow)/lymphatic-massage/index.tsx
// import React from 'react';
// import { View, Text, ScrollView, FlatList, RefreshControl, Platform } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import { FlameIcon, LymphaticMassageIcon, ThreeStarsIcon } from '@/components/icons';
// import IconBadge from '@/components/icons/modified/IconBadge';
// import { TutorialCard } from '@/components/tutorials/TutorialCard';
// import { useTutorials } from '@/hooks/useTutorials';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import ErrorScreen from '@/components/errors/ErrorScreen';
// import { useScreenReady } from '@/hooks/useScreenReady';

// const LymphaticMassageScreen = () => {
//   const { tutorials, isLoading, error, refetch } = useTutorials();

//   const { isRendering, isContentReady, renderError } = useScreenReady({
//     dependencies: [tutorials],
//     delay: 100,
//     initialReady: false,
//   });

//   if (isRendering || isLoading) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Preparing Lymphatic Massage..." />
//       </SafeAreaView>
//     );
//   }

//   if (renderError || error) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Lymphatic Massage" height={50} backButton={true} />
//         <ErrorScreen message={error || renderError || 'Failed to load'} onRetry={refetch} />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader title="Lymphatic Massage" height={50} backButton={true} />

//       <ScrollView
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           paddingTop: 10,
//           flexGrow: 1,
//         }}
//         className="flex-1"
//         refreshControl={
//           <RefreshControl refreshing={isLoading} onRefresh={refetch} colors={['#977857']} />
//         }>
//         <View
//           className="px-container"
//           style={{
//             opacity: isContentReady ? 1 : 0,
//             transform: [{ translateY: isContentReady ? 0 : 10 }],
//           }}>
//           {/* Tutorials Section with FlatList */}
//           <Text className="mt-0 font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
//             Tutorials
//           </Text>

//           {tutorials.length === 0 ? (
//             <BorderlessShadowCard
//               b_tl={24}
//               b_tr={24}
//               b_bl={24}
//               b_br={24}
//               style={{ paddingVertical: 32, paddingHorizontal: 24, marginTop: 12 }}>
//               <Text className="text-center font-outfit text-[14px]" style={{ color: '#2E211780' }}>
//                 No tutorials available yet
//               </Text>
//             </BorderlessShadowCard>
//           ) : (
//             tutorials.map((tutorial, index) => (
//               <TutorialCard
//                 key={tutorial.id}
//                 tutorial={tutorial}
//                 isFirst={index === 0}
//                 isLast={index === tutorials.length - 1}
//               />
//             ))
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default LymphaticMassageScreen;

// app/(flow)/lymphatic-massage/index.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import InputField from '@/components/inputs/Input';
import { TutorialCard } from '@/components/tutorials/TutorialCard';
import { CategoryFilter } from '@/components/articles/CategoryFilter';
import { useTutorials } from '@/hooks/useTutorials';

import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import { Category } from '@/types/article';

// Define tutorial categories
const TUTORIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'All' },
  { id: '2', name: 'Face' },
  { id: '3', name: 'Neck' },
  { id: '4', name: 'Arms' },
  { id: '5', name: 'Abdomen' },
];

const LymphaticMassageScreen = () => {
  const { tutorials, isLoading, error, refetch } = useTutorials();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [tutorials],
    delay: 100,
    initialReady: false,
  });

  // Filter tutorials based on search query and selected category
  const filteredTutorials = useMemo(() => {
    let filtered = [...tutorials];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (tutorial) => tutorial.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (tutorial) =>
          tutorial.title.toLowerCase().includes(query) ||
          tutorial.description.toLowerCase().includes(query) ||
          tutorial.benefits.some((benefit) => benefit.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [tutorials, selectedCategory, searchQuery]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  if (isRendering || isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Preparing Lymphatic Massage..." />
      </SafeAreaView>
    );
  }

  if (renderError || error) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Lymphatic Massage" height={50} backButton={true} />
        <ErrorScreen message={error || renderError || 'Failed to load'} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Lymphatic Massage" height={50} backButton={true} />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 10,
          flexGrow: 1,
        }}
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} colors={['#977857']} />
        }>
        <View
          className="px-container"
          style={{
            opacity: isContentReady ? 1 : 0,
            transform: [{ translateY: isContentReady ? 0 : 10 }],
          }}>
          {/* Search Bar */}
          <View className="mb-1">
            <InputField
              value={searchQuery}
              handler={(_, value) => handleSearch(value)}
              placeHolder="Search tutorials..."
              showLabel={false}
              height={56}
              gradientColors={['#E8DDD0', '#E8DDD0']}
              withShadow={true}
              borderTopLeftRadius={24}
              borderTopRightRadius={24}
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
            />
          </View>

          {/* Categories Filter */}
          <CategoryFilter
            categories={TUTORIAL_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />

          {/* Tutorials Section */}
          <View className="mt-3">
            <Text className="mb-0 font-outfitMedium text-[18px]" style={{ color: '#361A0D' }}>
              {selectedCategory === 'All' ? 'All Tutorials' : `${selectedCategory} Tutorials`}
            </Text>

            {filteredTutorials.length === 0 ? (
              <BorderlessShadowCard
                b_tl={24}
                b_tr={24}
                b_bl={24}
                b_br={24}
                style={{ paddingVertical: 32, paddingHorizontal: 24, marginTop: 12 }}>
                <View className="items-center justify-center">
                  <Ionicons name="search-outline" size={48} color="#2E211733" />
                  <Text className="mt-3 font-outfit text-[14px]" style={{ color: '#2E211766' }}>
                    No tutorials found
                  </Text>
                  <Text className="font-outfit text-[12px]" style={{ color: '#2E211766' }}>
                    Try adjusting your search or filter
                  </Text>
                </View>
              </BorderlessShadowCard>
            ) : (
              filteredTutorials.map((tutorial, index) => (
                <TutorialCard
                  key={tutorial.id}
                  tutorial={tutorial}
                  isFirst={index === 0}
                  isLast={index === filteredTutorials.length - 1}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LymphaticMassageScreen;
