// // components/scans/PreScanInstructions.tsx
// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import PrimaryButton from '@/components/buttons/PrimaryButton';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import ErrorScreen from '@/components/errors/ErrorScreen';
// import { useScreenReady } from '@/hooks/useScreenReady';

// interface PreScanInstructionsProps {
//   onStart: () => void;
// }

// export const PreScanInstructions: React.FC<PreScanInstructionsProps> = ({ onStart }) => {
//   const insets = useSafeAreaInsets();
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Screen ready state for smooth transitions
//   const { isRendering, isContentReady, renderError } = useScreenReady({
//     dependencies: [],
//     delay: 100,
//     initialReady: false,
//   });

//   // Mark initial load as complete after first render
//   useEffect(() => {
//     if (isContentReady && isInitialLoad) {
//       setIsInitialLoad(false);
//     }
//   }, [isContentReady]);

//   const handleRetry = () => {
//     setError(null);
//     setIsInitialLoad(true);
//     // Force re-render
//     setTimeout(() => {
//       setIsInitialLoad(false);
//     }, 100);
//   };

//   // Show initial render loading (useScreenReady) - ONLY on first load
//   if (isRendering && isInitialLoad) {
//     return <LoadingScreen loadingText="Preparing instructions..." />;
//   }

//   // Show error if rendering failed
//   if (renderError) {
//     return <ErrorScreen message={renderError} onRetry={handleRetry} />;
//   }

//   return (
//     <View className="flex-1 bg-backgroundColor">
//       <View
//         className="px-container"
//         style={{
//           opacity: isContentReady ? 1 : 0,
//           transform: [{ translateY: isContentReady ? 0 : 10 }],
//           paddingTop: Math.max(insets.top, 16),
//         }}>
//         <TouchableOpacity
//           activeOpacity={1}
//           onPress={() => router.back()}
//           style={{ marginRight: 16 }}
//           hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
//           <LinearGradient
//             colors={['#F0E6D8', '#F0E6D8', '#F0E6D8', '#F0E6D8']}
//             locations={[0.03, 0.7, 1, 1]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={{
//               width: 40,
//               height: 40,
//               borderWidth: 0,
//               borderColor: '#E5E7EB',
//               borderRadius: 100,
//               justifyContent: 'center',
//               alignItems: 'center',
//               shadowColor: '#000',
//               shadowOffset: { width: 0, height: 3 },
//               shadowOpacity: 0.3,
//               shadowRadius: 7,
//               elevation: 7,
//             }}>
//             <Ionicons name="chevron-back" size={24} color="#2A2118" />
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>

//       <View
//         className="flex-1 justify-center px-container"
//         style={{
//           opacity: isContentReady ? 1 : 0,
//           transform: [{ translateY: isContentReady ? 0 : 10 }],
//           paddingBottom: 40,
//         }}>
//         <Text className="mb-1 text-center font-poppinsMedium text-[24px] text-titleTextColor">
//           Prepare Your Scan
//         </Text>
//         <Text className="mb-12 text-center font-outfit text-[14px] text-titleTextColor/70">
//           For the best results, please follow these guidelines
//         </Text>

//         <View className="gap-3">
//           {/* Natural Light */}
//           <BorderlessShadowCard className="flex-row items-center gap-4 p-4">
//             <View className="h-12 w-12 items-center justify-center rounded-full bg-[#7A8B6A]/20">
//               <Ionicons name="sunny" size={24} color="#7A8B6A" />
//             </View>
//             <View className="flex-1">
//               <Text className="font-outfitMedium text-[16px] text-titleTextColor">
//                 Natural Light
//               </Text>
//               <Text className="font-outfit text-[12px] text-titleTextColor/60">
//                 Position yourself near a window with soft, natural lighting
//               </Text>
//             </View>
//           </BorderlessShadowCard>

//           {/* No Makeup */}
//           <BorderlessShadowCard
//             b_tl={0}
//             b_tr={0}
//             b_bl={0}
//             b_br={0}
//             className="flex-row items-center gap-4 p-4">
//             <View className="h-12 w-12 items-center justify-center rounded-full bg-[#7A8B6A]/20">
//               <Ionicons name="brush-outline" size={24} color="#7A8B6A" />
//             </View>
//             <View className="flex-1">
//               <Text className="font-outfitMedium text-[16px] text-titleTextColor">No Makeup</Text>
//               <Text className="font-outfit text-[12px] text-titleTextColor/60">
//                 Remove all makeup for accurate skin analysis
//               </Text>
//             </View>
//           </BorderlessShadowCard>

//           {/* No Filters */}
//           <BorderlessShadowCard
//             b_tl={0}
//             b_tr={0}
//             b_bl={24}
//             b_br={24}
//             className="flex-row items-center gap-4 p-4">
//             <View className="h-12 w-12 items-center justify-center rounded-full bg-[#7A8B6A]/20">
//               <Ionicons name="options-outline" size={24} color="#7A8B6A" />
//             </View>
//             <View className="flex-1">
//               <Text className="font-outfitMedium text-[16px] text-titleTextColor">No Filters</Text>
//               <Text className="font-outfit text-[12px] text-titleTextColor/60">
//                 Avoid using any camera filters or effects
//               </Text>
//             </View>
//           </BorderlessShadowCard>
//         </View>

//         <PrimaryButton
//           onPress={onStart}
//           title="Start Scan"
//           style={{ paddingVertical: 24, marginTop: 12 }}
//         />
//       </View>
//     </View>
//   );
// };
// components/scans/PreScanInstructions.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import { useScreenReady } from '@/hooks/useScreenReady';
import CustomHeader from '@/components/header/CustomHeader';
import { ScrollView } from 'react-native-gesture-handler';
import { LAYOUT } from '@/constants/constants';

const { width } = Dimensions.get('window');

interface PreScanInstructionsProps {
  onStart: () => void;
}

export const PreScanInstructions: React.FC<PreScanInstructionsProps> = ({ onStart }) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Screen ready state for smooth transitions
  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  // Mark initial load as complete after first render
  useEffect(() => {
    if (isContentReady && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isContentReady]);

  const handleRetry = () => {
    setIsInitialLoad(true);
    // Force re-render
    setTimeout(() => {
      setIsInitialLoad(false);
    }, 100);
  };

  // Show initial render loading (useScreenReady) - ONLY on first load
  if (isRendering && isInitialLoad) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Preparing instructions..." />
      </SafeAreaView>
    );
  }

  // Show error if rendering failed
  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Face Scan Instructions" height={50} backButton />
        <ErrorScreen message={renderError} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  // Responsive animation size (40% of screen width, max 200px)
  const animationSize = Math.min(width * 0.4, 200);

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Face Scan Instructions" height={50} backButton />

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
            paddingBottom: 40,
            marginTop: 30,
          }}>
          {/* Animation with rounded border and border color */}
          <View className="mb-6 items-center justify-center">
            <View
              style={{
                width: animationSize + 20,
                height: animationSize + 20,
                borderRadius: (animationSize + 20) / 2,
                borderWidth: 2,
                borderColor: '#361A0D',
                backgroundColor: '#F0E6D8',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('@/assets/face_scan_animation.gif')}
                style={{
                  width: animationSize,
                  height: animationSize,
                  borderRadius: animationSize / 2,
                  resizeMode: 'contain',
                }}
              />
            </View>
          </View>

          <Text className="mb-1 text-center font-poppinsMedium text-[24px] text-titleTextColor">
            Prepare Your Scan
          </Text>
          <Text className="mb-12 text-center font-outfit text-[14px] text-titleTextColor/70">
            For the best results, please follow these guidelines
          </Text>

          <View className="gap-3">
            {/* Natural Light */}
            <BorderlessShadowCard className="flex-row items-center gap-4 p-4">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-[#7A8B6A]/20">
                <Text className="text-[20px]">☀️</Text>
              </View>
              <View className="flex-1">
                <Text className="font-outfitMedium text-[16px] text-titleTextColor">
                  Natural Light
                </Text>
                <Text className="font-outfit text-[12px] text-titleTextColor/60">
                  Position yourself near a window with soft, natural lighting
                </Text>
              </View>
            </BorderlessShadowCard>

            {/* No Makeup */}
            <BorderlessShadowCard
              b_tl={0}
              b_tr={0}
              b_bl={0}
              b_br={0}
              className="flex-row items-center gap-4 p-4">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-[#7A8B6A]/20">
                <Text className="text-[20px]">💄</Text>
              </View>
              <View className="flex-1">
                <Text className="font-outfitMedium text-[16px] text-titleTextColor">No Makeup</Text>
                <Text className="font-outfit text-[12px] text-titleTextColor/60">
                  Remove all makeup for accurate skin analysis
                </Text>
              </View>
            </BorderlessShadowCard>

            {/* No Filters */}
            <BorderlessShadowCard
              b_tl={0}
              b_tr={0}
              b_bl={24}
              b_br={24}
              className="flex-row items-center gap-4 p-4">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-[#7A8B6A]/20">
                <Text className="text-[20px]">🔍</Text>
              </View>
              <View className="flex-1">
                <Text className="font-outfitMedium text-[16px] text-titleTextColor">
                  No Filters
                </Text>
                <Text className="font-outfit text-[12px] text-titleTextColor/60">
                  Avoid using any camera filters or effects
                </Text>
              </View>
            </BorderlessShadowCard>
          </View>

          <PrimaryButton
            onPress={onStart}
            title="Start Scan"
            style={{ paddingVertical: 24, marginTop: 12 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
