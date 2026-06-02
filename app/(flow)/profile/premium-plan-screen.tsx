// import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
// import PrimaryButton from '@/components/buttons/PrimaryButton';
// import { SignInCircleWithFillIcon, SingleStarIcon } from '@/components/icons';
// import PillowBadge from '@/components/buttons/PillowBadge';
// import { useScreenReady } from '@/hooks/useScreenReady';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import ErrorScreen from '@/components/errors/ErrorScreen';

// const PremiumPlanScreen = () => {
//   const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDataReady, setIsDataReady] = useState(false);
//   const router = useRouter();

//   // Screen ready state for smooth transitions
//   const { isRendering, isContentReady, renderError } = useScreenReady({
//     dependencies: [],
//     delay: 100,
//     initialReady: false,
//   });

//   useEffect(() => {
//     // Small delay to ensure smooth transition
//     const timer = setTimeout(() => {
//       setIsDataReady(true);
//     }, 100);
//     return () => clearTimeout(timer);
//   }, []);

//   const premiumFeatures = [
//     'Unlimited AI Skin & Scalp Scans',
//     'Full Ingredient Compatibility Analysis',
//     'Hormone Cycle Routine Adjustments',
//     '1-on-1 AI Skincare Coaching',
//     'Early access to new features',
//   ];

//   const handleStartTrial = async () => {
//     setIsLoading(true);

//     // Simulate API call / payment processing
//     setTimeout(() => {
//       setIsLoading(false);
//       router.push('/(flow)/profile/loading-screen');
//     }, 4000);
//   };

//   const handleRetry = () => {
//     router.replace('/(flow)/profile/premium-plan-screen');
//   };

//   // Show initial render loading (useScreenReady)
//   if (isRendering) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Preparing premium plans..." />
//       </SafeAreaView>
//     );
//   }

//   // Show error if rendering failed
//   if (renderError) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Waxi Premium" height={50} backButton />
//         <ErrorScreen message={renderError} onRetry={handleRetry} />
//       </SafeAreaView>
//     );
//   }

//   // Show loading while data is being prepared
//   if (!isDataReady) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Loading premium plans..." />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader title="Waxi Premium" height={50} backButton />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           marginTop: LAYOUT.screen.scrollViewPaddingTop,
//           flexGrow: 1,
//         }}
//         className="flex-1">
//         <View
//           className="flex-1 items-center justify-center px-container"
//           style={{
//             opacity: isContentReady ? 1 : 0,
//             transform: [{ translateY: isContentReady ? 0 : 10 }],
//           }}>
//           {/* Premium Icon with Gradient */}
//           <LinearGradient
//             colors={['#977857', '#B89474', '#7A5D3E']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={{
//               width: 64,
//               height: 64,
//               borderRadius: 32,
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}>
//             <SingleStarIcon size={32} fillColor="#361A0D" strokeColor="#FFFFFF" />
//           </LinearGradient>

//           {/* Title & Description */}
//           <Text className="mt-3 font-outfitMedium text-[20px]" style={{ color: '#2E2117' }}>
//             Elevate Your Routine
//           </Text>
//           <Text
//             className="mt-[6px] text-center font-outfit text-[12px]"
//             style={{ color: '#2E2117B2', maxWidth: '90%' }}>
//             Unlock advanced AI diagnostics, unlimited product scans, and personalized coaching.
//           </Text>

//           {/* Pricing Card */}
//           <BorderlessShadowCard
//             b_tl={24}
//             b_tr={24}
//             b_bl={24}
//             b_br={24}
//             style={{
//               width: '100%',
//               marginTop: 24,
//               paddingHorizontal: 24,
//               paddingVertical: 24,
//               position: 'relative',
//             }}>
//             {/* Most Popular Badge */}
//             <View
//               style={{
//                 position: 'absolute',
//                 top: 0,
//                 right: 0,
//                 backgroundColor: '#977857',
//                 paddingHorizontal: 24,
//                 paddingVertical: 4,
//                 borderTopRightRadius: 24,
//                 borderBottomLeftRadius: 12,
//               }}>
//               <Text className="font-primous text-[12px] capitalize text-white">MOST POPULAR</Text>
//             </View>

//             {/* Plan Tabs - Equal Distribution */}
//             <View className="mt-3 flex-row gap-4">
//               {/* Monthly Tab */}
//               <TouchableOpacity
//                 activeOpacity={1}
//                 onPress={() => setSelectedPlan('monthly')}
//                 style={{ flex: 1 }}>
//                 {selectedPlan === 'monthly' ? (
//                   <BorderlessShadowCard
//                     b_tl={6}
//                     b_tr={6}
//                     b_bl={6}
//                     b_br={6}
//                     style={{
//                       paddingVertical: 6,
//                       alignItems: 'center',
//                     }}>
//                     <Text className="font-outfitMedium text-[14px]" style={{ color: '#7A8B6A' }}>
//                       Monthly
//                     </Text>
//                   </BorderlessShadowCard>
//                 ) : (
//                   <View
//                     style={{
//                       paddingVertical: 6,
//                       alignItems: 'center',
//                       borderRadius: 6,
//                     }}>
//                     <Text className="font-outfitMedium text-[14px]" style={{ color: '#2E211780' }}>
//                       Monthly
//                     </Text>
//                   </View>
//                 )}
//               </TouchableOpacity>

//               {/* Yearly Tab */}
//               <TouchableOpacity
//                 activeOpacity={1}
//                 onPress={() => setSelectedPlan('yearly')}
//                 style={{ flex: 1 }}>
//                 {selectedPlan === 'yearly' ? (
//                   <BorderlessShadowCard
//                     b_tl={6}
//                     b_tr={6}
//                     b_bl={6}
//                     b_br={6}
//                     style={{
//                       paddingVertical: 6,
//                       alignItems: 'center',
//                     }}>
//                     <View className="flex-row items-center justify-center gap-2">
//                       <Text className="font-outfitMedium text-[14px]" style={{ color: '#7A8B6A' }}>
//                         Yearly
//                       </Text>
//                       <PillowBadge
//                         title="Save 20%"
//                         style={{
//                           paddingHorizontal: 8,
//                           paddingVertical: 2,
//                         }}
//                         textStyle={{
//                           color: '#361A0D',
//                           fontSize: 10,
//                         }}
//                       />
//                     </View>
//                   </BorderlessShadowCard>
//                 ) : (
//                   <View
//                     style={{
//                       paddingVertical: 6,
//                       alignItems: 'center',
//                       borderRadius: 6,
//                     }}>
//                     <Text className="font-outfitMedium text-[14px]" style={{ color: '#2E211780' }}>
//                       Yearly
//                     </Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             </View>

//             {/* Pricing Details */}
//             <View className="mt-6">
//               <Text className="font-didot text-[32px]" style={{ color: '#361A0D' }}>
//                 {selectedPlan === 'monthly' ? '$9.99' : '$119.88'}
//                 <Text className="font-primous text-[14px]" style={{ color: '#2E2117CC' }}>
//                   /{selectedPlan === 'monthly' ? 'month' : 'year'}
//                 </Text>
//               </Text>
//               <Text className="mt-[6px] font-outfit text-[16px]" style={{ color: '#361A0DCC' }}>
//                 {selectedPlan === 'monthly'
//                   ? 'Billed monthly'
//                   : 'Just $9.99/month, billed annually'}
//               </Text>
//             </View>

//             {/* Features List - Same for both plans */}
//             <View className="mt-6" style={{ gap: 16 }}>
//               {premiumFeatures.map((feature, index) => (
//                 <View key={index} className="flex-row items-center gap-3">
//                   <SignInCircleWithFillIcon size={20} fillColor="#7A8B6A33" strokeColor="#7A8B6A" />
//                   <Text className="flex-1 font-outfit text-[12px]" style={{ color: '#361A0DA3' }}>
//                     {feature}
//                   </Text>
//                 </View>
//               ))}
//             </View>

//             {/* CTA Button with Loading State */}
//             <PrimaryButton
//               title="Start 7-Day Free Trial"
//               onPress={handleStartTrial}
//               isLoading={isLoading}
//               loaderColor="#361A0D"
//               style={{ marginTop: 32, width: '100%' }}
//             />

//             {/* Footer Text */}
//             <Text
//               className="mt-4 text-center font-outfit text-[10px]"
//               style={{ color: '#2E211799' }}>
//               Cancel anytime • No commitment • Auto-renewable
//             </Text>
//           </BorderlessShadowCard>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default PremiumPlanScreen;

// const styles = StyleSheet.create({});

import { ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { SignInCircleWithFillIcon, SingleStarIcon } from '@/components/icons';
import PillowBadge from '@/components/buttons/PillowBadge';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import { useRevenueCat } from '@/hooks/useRevenueCat';
import { selectCurrentUser } from '@/store/slices/authSlice';

const premiumFeatures = [
  'Unlimited AI Skin & Scalp Scans',
  'Full Ingredient Compatibility Analysis',
  'Hormone Cycle Routine Adjustments',
  '1-on-1 AI Skincare Coaching',
  'Early access to new features',
];

const PremiumPlanScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const router = useRouter();

  const currentUser = useSelector(selectCurrentUser);
  const {
    isReady,
    isPremium,
    monthlyPackage,
    yearlyPackage,
    isLoading,
    error,
    purchasePackage,
    restorePurchases,
  } = useRevenueCat(currentUser?.id);

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  const activePackage = selectedPlan === 'monthly' ? monthlyPackage : yearlyPackage;

  // ── Pricing display from RevenueCat product ──────────────────────────────
  const monthlyPrice = monthlyPackage?.product.priceString ?? '$9.99';
  const yearlyPrice = yearlyPackage?.product.priceString ?? '$119.88';
  const activePrice = selectedPlan === 'monthly' ? monthlyPrice : yearlyPrice;

  const handlePurchase = async () => {
    if (!activePackage) {
      Alert.alert('Not available', 'This plan is not available right now. Please try again.');
      return;
    }

    const success = await purchasePackage(activePackage, selectedPlan);

    if (success) {
      router.replace('/(main)');
    }
  };

  const handleRestore = async () => {
    const success = await restorePurchases();
    if (success) {
      Alert.alert('Restored', 'Your subscription has been restored.');
      router.replace('/(main)');
    } else {
      Alert.alert('No purchases found', 'We could not find any previous purchases to restore.');
    }
  };

  // ── If already premium, redirect ─────────────────────────────────────────
  useEffect(() => {
    if (isReady && isPremium) {
      console.log('[PremiumPlan] User is already premium, redirecting to profile');
      router.replace('/(main)/profile');
    }
  }, [isReady, isPremium]);

  if (!isReady || isRendering) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading premium plans..." />
      </SafeAreaView>
    );
  }

  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Waxi Premium" height={50} backButton />
        <ErrorScreen
          message={renderError}
          onRetry={() => router.replace('/(flow)/profile/premium-plan-screen')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Waxi Premium" height={50} backButton />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: LAYOUT.screen.scrollViewPaddingTop,
          flexGrow: 1,
        }}
        className="flex-1">
        <View
          className="flex-1 items-center justify-center px-container"
          style={{
            opacity: isContentReady ? 1 : 0,
            transform: [{ translateY: isContentReady ? 0 : 10 }],
          }}>
          {/* Icon */}
          <LinearGradient
            colors={['#977857', '#B89474', '#7A5D3E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <SingleStarIcon size={32} fillColor="#361A0D" strokeColor="#FFFFFF" />
          </LinearGradient>

          <Text className="mt-3 font-outfitMedium text-[20px]" style={{ color: '#2E2117' }}>
            Elevate Your Routine
          </Text>
          <Text
            className="mt-[6px] text-center font-outfit text-[12px]"
            style={{ color: '#2E2117B2', maxWidth: '90%' }}>
            Unlock advanced AI diagnostics, unlimited product scans, and personalized coaching.
          </Text>

          {/* Error banner */}
          {error && (
            <View
              className="mt-4 w-full rounded-2xl px-4 py-3"
              style={{ backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' }}>
              <Text className="text-center font-outfit text-[12px]" style={{ color: '#DC2626' }}>
                {error}
              </Text>
            </View>
          )}

          {/* Pricing Card */}
          <BorderlessShadowCard
            b_tl={24}
            b_tr={24}
            b_bl={24}
            b_br={24}
            style={{
              width: '100%',
              marginTop: 24,
              paddingHorizontal: 24,
              paddingVertical: 24,
              position: 'relative',
            }}>
            {/* Most Popular Badge */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: '#977857',
                paddingHorizontal: 24,
                paddingVertical: 4,
                borderTopRightRadius: 24,
                borderBottomLeftRadius: 12,
              }}>
              <Text className="font-primous text-[12px] capitalize text-white">MOST POPULAR</Text>
            </View>

            {/* Plan Tabs */}
            <View className="mt-3 flex-row gap-4">
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setSelectedPlan('monthly')}
                style={{ flex: 1 }}>
                {selectedPlan === 'monthly' ? (
                  <BorderlessShadowCard
                    b_tl={6}
                    b_tr={6}
                    b_bl={6}
                    b_br={6}
                    style={{ paddingVertical: 6, alignItems: 'center' }}>
                    <Text className="font-outfitMedium text-[14px]" style={{ color: '#7A8B6A' }}>
                      Monthly
                    </Text>
                  </BorderlessShadowCard>
                ) : (
                  <View style={{ paddingVertical: 6, alignItems: 'center', borderRadius: 6 }}>
                    <Text className="font-outfitMedium text-[14px]" style={{ color: '#2E211780' }}>
                      Monthly
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setSelectedPlan('yearly')}
                style={{ flex: 1 }}>
                {selectedPlan === 'yearly' ? (
                  <BorderlessShadowCard
                    b_tl={6}
                    b_tr={6}
                    b_bl={6}
                    b_br={6}
                    style={{ paddingVertical: 6, alignItems: 'center' }}>
                    <View className="flex-row items-center justify-center gap-2">
                      <Text className="font-outfitMedium text-[14px]" style={{ color: '#7A8B6A' }}>
                        Yearly
                      </Text>
                      <PillowBadge
                        title="Save 20%"
                        style={{ paddingHorizontal: 8, paddingVertical: 2 }}
                        textStyle={{ color: '#361A0D', fontSize: 10 }}
                      />
                    </View>
                  </BorderlessShadowCard>
                ) : (
                  <View style={{ paddingVertical: 6, alignItems: 'center', borderRadius: 6 }}>
                    <Text className="font-outfitMedium text-[14px]" style={{ color: '#2E211780' }}>
                      Yearly
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Pricing — from RevenueCat product, not hardcoded */}
            <View className="mt-6">
              <Text className="font-didot text-[32px]" style={{ color: '#361A0D' }}>
                {activePrice}
                <Text className="font-primous text-[14px]" style={{ color: '#2E2117CC' }}>
                  /{selectedPlan === 'monthly' ? 'month' : 'year'}
                </Text>
              </Text>
              <Text className="mt-[6px] font-outfit text-[16px]" style={{ color: '#361A0DCC' }}>
                {selectedPlan === 'monthly'
                  ? 'Billed monthly'
                  : `Just ${monthlyPackage?.product.priceString ?? '$9.99'}/month, billed annually`}
              </Text>
            </View>

            {/* Features */}
            <View className="mt-6" style={{ gap: 16 }}>
              {premiumFeatures.map((feature, index) => (
                <View key={index} className="flex-row items-center gap-3">
                  <SignInCircleWithFillIcon size={20} fillColor="#7A8B6A33" strokeColor="#7A8B6A" />
                  <Text className="flex-1 font-outfit text-[12px]" style={{ color: '#361A0DA3' }}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>

            {/* Purchase CTA */}
            <PrimaryButton
              title={
                isLoading
                  ? 'Processing...'
                  : activePackage?.product.introPrice
                    ? 'Start 7-Day Free Trial'
                    : 'Subscribe Now'
              }
              onPress={handlePurchase}
              isLoading={isLoading}
              loaderColor="#361A0D"
              disabled={isLoading || !activePackage}
              style={{ marginTop: 32, width: '100%' }}
            />

            <Text
              className="mt-4 text-center font-outfit text-[10px]"
              style={{ color: '#2E211799' }}>
              Cancel anytime • No commitment • Auto-renewable
            </Text>
          </BorderlessShadowCard>

          {/* Restore Purchases */}
          <TouchableOpacity
            onPress={handleRestore}
            disabled={isLoading}
            className="mt-4 py-3"
            activeOpacity={0.6}>
            <Text className="font-outfit text-[12px]" style={{ color: '#2E211799' }}>
              Restore Purchases
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PremiumPlanScreen;
