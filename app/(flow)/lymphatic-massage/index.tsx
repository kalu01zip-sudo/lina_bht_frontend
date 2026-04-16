// import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
// import React, { useState } from 'react';
// import { useRouter } from 'expo-router';
// import { useScreenReady } from '@/hooks/useScreenReady';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import CustomHeader from '@/components/header/CustomHeader';
// import ErrorScreen from '@/components/errors/ErrorScreen';
// import { LAYOUT } from '@/constants/constants';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import ButtonWrapper from '@/components/buttons/ButtonWrapper';
// import { FlameIcon, LymphaticMassageIcon, ThreeStarsIcon } from '@/components/icons';
// import IconButton from '@/components/buttons/IconButton';
// import IconBadge from '@/components/icons/modified/IconBadge';

// const LymphaticMassageScreen = () => {
//   const router = useRouter();

//   // Screen ready state for smooth transitions
//   const { isRendering, isContentReady, renderError } = useScreenReady({
//     dependencies: [],
//     delay: 100,
//     initialReady: false,
//   });

//   const handleRetry = () => {};

//   // Show initial render loading (useScreenReady)
//   if (isRendering) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Preparing Lymphatic Massage..." />
//       </SafeAreaView>
//     );
//   }

//   // Show error if rendering failed
//   if (renderError) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Lymphatic Massage" height={50} backButton={true} />
//         <ErrorScreen message={renderError} onRetry={handleRetry} />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader title="Lymphatic Massage" height={50} backButton={true} />
//       <ScrollView
//         // showsVerticalScrollIndicator={false}
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
//           <BorderlessShadowCard
//             b_tl={24}
//             b_tr={24}
//             b_bl={0}
//             b_br={0}
//             style={{
//               paddingVertical: 16,
//               paddingHorizontal: 24,
//               marginVertical: 12,
//             }}>
//             {/* Data Protection Header */}
//             <View className="flex-row items-center justify-start gap-3">
//               <IconBadge
//                 size={32}
//                 // Keep borderRadius here to ensure the background clips correctly
//                 style={{
//                   // Container for the shadow
//                   borderWidth: 0,
//                   borderRadius: 6,
//                   backgroundColor: '#F0E6D8', // Match the badge color for Android elevation
//                   ...Platform.select({
//                     ios: {
//                       shadowColor: '#000',
//                       shadowOffset: { width: 0, height: 2 },
//                       shadowOpacity: 0.1,
//                       shadowRadius: 4,
//                     },
//                     android: {
//                       elevation: 4,
//                     },
//                   }),
//                 }}
//                 icon={<LymphaticMassageIcon size={24} color="#361A0D" />}
//               />

//               <Text className="font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
//                 What is it?
//               </Text>
//             </View>
//             <Text className="mt-3 font-outfit text-[14px] " style={{ color: '#2E2117B2' }}>
//               Pat gently.A gentle massage technique that encourages the movement of lymph fluids
//               around the body, helping to remove waste and toxins from bodily tissues.
//             </Text>
//           </BorderlessShadowCard>

//           <BorderlessShadowCard
//             b_tl={0}
//             b_tr={0}
//             b_bl={24}
//             b_br={24}
//             style={{
//               paddingVertical: 16,
//               paddingHorizontal: 24,
//             }}>
//             {/* Data Protection Header */}
//             <View className="flex-row items-center justify-start gap-3">
//               <IconBadge
//                 size={32}
//                 // Keep borderRadius here to ensure the background clips correctly
//                 style={{
//                   // Container for the shadow
//                   borderWidth: 0,
//                   borderRadius: 6,
//                   backgroundColor: '#F0E6D8', // Match the badge color for Android elevation
//                   ...Platform.select({
//                     ios: {
//                       shadowColor: '#000',
//                       shadowOffset: { width: 0, height: 2 },
//                       shadowOpacity: 0.1,
//                       shadowRadius: 4,
//                     },
//                     android: {
//                       elevation: 4,
//                     },
//                   }),
//                 }}
//                 icon={<ThreeStarsIcon size={24} color="#361A0D" />}
//               />

//               <Text className="font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
//                 Key Benefits
//               </Text>
//             </View>
//             <View className=" mt-3 flex-row items-center gap-3 ">
//               <FlameIcon size={16} color="#7A8B6A" />
//               <Text className="flex-1 font-outfit text-[14px] " style={{ color: '#2E2117CC' }}>
//                 Reduces facial puffiness and swelling
//               </Text>
//             </View>
//             <View className=" mt-3 flex-row items-center gap-3 ">
//               <FlameIcon size={16} color="#7A8B6A" />
//               <Text className="flex-1 font-outfit text-[14px] " style={{ color: '#2E2117CC' }}>
//                 Promotes toxin removal
//               </Text>
//             </View>
//             <View className=" mt-3 flex-row items-center gap-3 ">
//               <FlameIcon size={16} color="#7A8B6A" />
//               <Text className="flex-1 font-outfit text-[14px] " style={{ color: '#2E2117CC' }}>
//                 Improves blood circulation for a natural glow
//               </Text>
//             </View>
//             <View className=" mt-3 flex-row items-center gap-3 ">
//               <FlameIcon size={16} color="#7A8B6A" />
//               <Text className="flex-1 font-outfit text-[14px] " style={{ color: '#2E2117CC' }}>
//                 Relieves tension in jaw and neck
//               </Text>
//             </View>
//           </BorderlessShadowCard>

//           {/* Tutorials */}
//           <Text className="mt-6 font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
//             Tutorials
//           </Text>
//           <BorderlessShadowCard
//             b_tl={24}
//             b_tr={24}
//             b_bl={0}
//             b_br={0}
//             style={{ paddingVertical: 16, paddingHorizontal: 24, marginTop: 12 }}>
//             <View className="flex-row items-start gap-3">
//               <View className="h-[70px] w-[70px] rounded-xl bg-red-400 " />
//               <View className="flex-1">
//                 <Text className="font-outfitSemi text-[12px] " style={{ color: '#977857' }}>
//                   Face Massage
//                 </Text>
//                 <Text
//                   className="font-outfitMedium text-[14px] "
//                   style={{ color: '#2E2117', lineHeight: 24 }}>
//                   Morning Depuffing
//                 </Text>

//                 <Text className="mt-3 font-outfit text-[12px] " style={{ color: '#2E211780' }}>
//                   3 mins
//                 </Text>
//               </View>
//             </View>
//           </BorderlessShadowCard>

//           <BorderlessShadowCard
//             b_tl={0}
//             b_tr={0}
//             b_bl={0}
//             b_br={0}
//             style={{ paddingVertical: 16, paddingHorizontal: 24, marginTop: 12 }}>
//             <View className="flex-row items-start gap-3">
//               <View className="h-[70px] w-[70px] rounded-xl bg-red-400 " />
//               <View className="flex-1">
//                 <Text className="font-outfitSemi text-[12px] " style={{ color: '#977857' }}>
//                   Face Massage
//                 </Text>
//                 <Text
//                   className="font-outfitMedium text-[14px] "
//                   style={{ color: '#2E2117', lineHeight: 24 }}>
//                   Jawline Sculpting
//                 </Text>

//                 <Text className="mt-3 font-outfit text-[12px] " style={{ color: '#2E211780' }}>
//                   3 mins
//                 </Text>
//               </View>
//             </View>
//           </BorderlessShadowCard>

//           <BorderlessShadowCard
//             b_tl={0}
//             b_tr={0}
//             b_bl={24}
//             b_br={24}
//             style={{ paddingVertical: 16, paddingHorizontal: 24, marginTop: 12 }}>
//             <View className="flex-row items-start gap-3">
//               <View className="h-[70px] w-[70px] rounded-xl bg-red-400 " />
//               <View className="flex-1">
//                 <Text className="font-outfitSemi text-[12px] " style={{ color: '#977857' }}>
//                   Body Massage
//                 </Text>
//                 <Text
//                   className="font-outfitMedium text-[14px] "
//                   style={{ color: '#2E2117', lineHeight: 24 }}>
//                   Neck & Collarbone Release
//                 </Text>

//                 <Text className="mt-3 font-outfit text-[12px] " style={{ color: '#2E211780' }}>
//                   3 mins
//                 </Text>
//               </View>
//             </View>
//           </BorderlessShadowCard>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default LymphaticMassageScreen;

// const styles = StyleSheet.create({});

// app/(flow)/lymphatic-massage/index.tsx
import React from 'react';
import { View, Text, ScrollView, FlatList, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { FlameIcon, LymphaticMassageIcon, ThreeStarsIcon } from '@/components/icons';
import IconBadge from '@/components/icons/modified/IconBadge';
import { TutorialCard } from '@/components/tutorials/TutorialCard';
import { useTutorials } from '@/hooks/useTutorials';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import { useScreenReady } from '@/hooks/useScreenReady';

const LymphaticMassageScreen = () => {
  const { tutorials, isLoading, error, refetch } = useTutorials();

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [tutorials],
    delay: 100,
    initialReady: false,
  });

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
          {/* What is it? Section */}
          <BorderlessShadowCard
            b_tl={24}
            b_tr={24}
            b_bl={0}
            b_br={0}
            style={{ paddingVertical: 16, paddingHorizontal: 24, marginVertical: 12 }}>
            <View className="flex-row items-center justify-start gap-3">
              <IconBadge
                size={32}
                style={{
                  borderWidth: 0,
                  borderRadius: 6,
                  backgroundColor: '#F0E6D8',
                  ...Platform.select({
                    ios: {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                    },
                    android: { elevation: 4 },
                  }),
                }}
                icon={<LymphaticMassageIcon size={24} color="#361A0D" />}
              />
              <Text className="font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
                What is it?
              </Text>
            </View>
            <Text className="mt-3 font-outfit text-[14px]" style={{ color: '#2E2117B2' }}>
              A gentle massage technique that encourages the movement of lymph fluids around the
              body, helping to remove waste and toxins from bodily tissues.
            </Text>
          </BorderlessShadowCard>

          {/* Key Benefits Section */}
          <BorderlessShadowCard
            b_tl={0}
            b_tr={0}
            b_bl={24}
            b_br={24}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 24,
            }}>
            {/* Data Protection Header */}
            <View className="flex-row items-center justify-start gap-3">
              <IconBadge
                size={32}
                // Keep borderRadius here to ensure the background clips correctly
                style={{
                  // Container for the shadow
                  borderWidth: 0,
                  borderRadius: 6,
                  backgroundColor: '#F0E6D8', // Match the badge color for Android elevation
                  ...Platform.select({
                    ios: {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                    },
                    android: {
                      elevation: 4,
                    },
                  }),
                }}
                icon={<ThreeStarsIcon size={24} color="#361A0D" />}
              />

              <Text className="font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
                Key Benefits
              </Text>
            </View>
            <View className=" mt-3 flex-row items-center gap-3 ">
              <FlameIcon size={16} color="#7A8B6A" />
              <Text className="flex-1 font-outfit text-[14px] " style={{ color: '#2E2117CC' }}>
                Reduces facial puffiness and swelling
              </Text>
            </View>
            <View className=" mt-3 flex-row items-center gap-3 ">
              <FlameIcon size={16} color="#7A8B6A" />
              <Text className="flex-1 font-outfit text-[14px] " style={{ color: '#2E2117CC' }}>
                Promotes toxin removal
              </Text>
            </View>
            <View className=" mt-3 flex-row items-center gap-3 ">
              <FlameIcon size={16} color="#7A8B6A" />
              <Text className="flex-1 font-outfit text-[14px] " style={{ color: '#2E2117CC' }}>
                Improves blood circulation for a natural glow
              </Text>
            </View>
            <View className=" mt-3 flex-row items-center gap-3 ">
              <FlameIcon size={16} color="#7A8B6A" />
              <Text className="flex-1 font-outfit text-[14px] " style={{ color: '#2E2117CC' }}>
                Relieves tension in jaw and neck
              </Text>
            </View>
          </BorderlessShadowCard>

          {/* Tutorials Section with FlatList */}
          <Text className="mt-6 font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
            Tutorials
          </Text>

          {tutorials.length === 0 ? (
            <BorderlessShadowCard
              b_tl={24}
              b_tr={24}
              b_bl={24}
              b_br={24}
              style={{ paddingVertical: 32, paddingHorizontal: 24, marginTop: 12 }}>
              <Text className="text-center font-outfit text-[14px]" style={{ color: '#2E211780' }}>
                No tutorials available yet
              </Text>
            </BorderlessShadowCard>
          ) : (
            tutorials.map((tutorial, index) => (
              <TutorialCard
                key={tutorial.id}
                tutorial={tutorial}
                isFirst={index === 0}
                isLast={index === tutorials.length - 1}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LymphaticMassageScreen;
