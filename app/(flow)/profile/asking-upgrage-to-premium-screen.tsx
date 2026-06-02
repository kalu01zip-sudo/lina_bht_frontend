// // app/(flow)/face-scan/analysis-compatibility-check.tsx (Fixed scrolling)
// import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import React from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import PrimaryButton from '@/components/buttons/PrimaryButton';
// import { LockIcon } from '@/components/icons';
// import IconBadge from '@/components/icons/modified/IconBadge';
// import { StarWithDoublePlusIcon } from '@/components/icons/StarWithDoublePlusIcon';
// import { useRouter } from 'expo-router';

// const AskingUpgradeToPremiumScreen = () => {
//   const router = useRouter();

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader title="Go Premium" height={50} backButton />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           marginTop: LAYOUT.screen.scrollViewPaddingTop,
//           flexGrow: 1,
//         }}
//         className="flex-1">
//         <View className="flex-1 items-center justify-center px-container  ">
//           {/* very danger */}
//           <BorderlessShadowCard
//             b_tl={24}
//             b_tr={24}
//             b_bl={24}
//             b_br={24}
//             style={{
//               width: 123,
//               height: 124,
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: '#F0E6D8',
//             }}>
//             <View className="relative">
//               <LockIcon size={32} color="#361A0D" />
//               <IconBadge
//                 size={32}
//                 style={{
//                   backgroundColor: '#FFFFFF',

//                   // ✅ Bottom-right shadow
//                   shadowColor: '#000',
//                   shadowOffset: { width: 2, height: 2 },
//                   shadowOpacity: 0.25,
//                   shadowRadius: 3,
//                   elevation: 4, // Android

//                   position: 'absolute',
//                   bottom: -20,
//                   right: -24,
//                 }}
//                 icon={<StarWithDoublePlusIcon style={{}} size={16} color="#361A0D" />}
//               />
//             </View>
//           </BorderlessShadowCard>
//           <Text className="mt-6 font-outfitMedium text-[24px] " style={{ color: '#361A0D' }}>
//             Premium Feature
//           </Text>
//           <Text
//             className="mt-[6px] text-center font-outfit text-[14px] "
//             style={{ color: '#2E211799' }}>
//             Unlock 1-on-1 personalized skincare coaching with our advanced AI assistant.{' '}
//           </Text>
//           <PrimaryButton
//             onPress={() => {
//               router.push('/(flow)/profile/premium-plan-screen');
//             }}
//             title="Upgrade to Premium"
//             style={{ marginTop: 64, width: '100%' }}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default AskingUpgradeToPremiumScreen;

// const styles = StyleSheet.create({});

// app/(flow)/face-scan/analysis-compatibility-check.tsx (Fixed scrolling)
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { LockIcon } from '@/components/icons';
import IconBadge from '@/components/icons/modified/IconBadge';
import { StarWithDoublePlusIcon } from '@/components/icons/StarWithDoublePlusIcon';
import { useRouter } from 'expo-router';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';

const AskingUpgradeToPremiumScreen = () => {
  const router = useRouter();
  const [isDataReady, setIsDataReady] = useState(false);

  // Screen ready state for smooth transitions
  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  useEffect(() => {
    // Small delay to simulate any async operations (remove if not needed)
    const timer = setTimeout(() => {
      setIsDataReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    // router.replace('/(flow)/face-scan/analysis-compatibility-check');
    router.replace('/(flow)/profile/asking-upgrage-to-premium-screen');
  };

  // Show initial render loading (useScreenReady)
  if (isRendering) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Preparing premium features..." />
      </SafeAreaView>
    );
  }

  // Show error if rendering failed
  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Go Premium" height={50} backButton />
        <ErrorScreen message={renderError} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  // Show loading while data is being prepared
  if (!isDataReady) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading premium features..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Go Premium" height={50} backButton />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          marginTop: LAYOUT.screen.scrollViewPaddingTop,
          flexGrow: 1,
        }}
        className="flex-1">
        <View
          className="flex-1 items-center justify-center px-container"
          style={{
            opacity: isContentReady ? 1 : 0,
            transform: [{ translateY: isContentReady ? 0 : 10 }],
          }}>
          {/* Premium Feature Icon */}
          <BorderlessShadowCard
            b_tl={24}
            b_tr={24}
            b_bl={24}
            b_br={24}
            style={{
              width: 123,
              height: 124,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#F0E6D8',
            }}>
            <View className="relative">
              <LockIcon size={32} color="#361A0D" />
              <IconBadge
                size={32}
                style={{
                  backgroundColor: '#FFFFFF',
                  shadowColor: '#000',
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3,
                  elevation: 4,
                  position: 'absolute',
                  bottom: -20,
                  right: -24,
                }}
                icon={<StarWithDoublePlusIcon style={{}} size={16} color="#361A0D" />}
              />
            </View>
          </BorderlessShadowCard>

          {/* Title */}
          <Text className="mt-6 font-outfitMedium text-[24px]" style={{ color: '#361A0D' }}>
            Premium Feature
          </Text>

          {/* Description */}
          <Text
            className="mt-[6px] text-center font-outfit text-[14px]"
            style={{ color: '#2E211799' }}>
            Unlock 1-on-1 personalized skincare coaching with our advanced AI assistant.
          </Text>

          {/* Upgrade Button */}
          <PrimaryButton
            onPress={() => {
              router.push('/(flow)/profile/premium-plan-screen');
            }}
            title="Upgrade to Premium"
            style={{ marginTop: 64, width: '100%' }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AskingUpgradeToPremiumScreen;

const styles = StyleSheet.create({});
