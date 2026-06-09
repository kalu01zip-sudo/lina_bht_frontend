// app/(main)/scan/Scan.tsx
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LAYOUT } from '@/constants/constants';
import CustomHeader from '@/components/header/CustomHeader';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { FaceScanIcon } from '@/components/icons';
import { useRouter } from 'expo-router';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';

const Scan = () => {
  const router = useRouter();

  // Screen ready state for smooth transitions
  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  const handleScanPress = (scanType: string) => {
    let path = '';
    switch (scanType) {
      case 'Face Scan':
        path = '/(flow)/face-scan/camera-scan';
        break;
      case 'Hair & Scalp Scan':
        path = '/(flow)/hair-scan/camera-scan';
        break;
      case 'Product Match':
        path = '/(flow)/product-scan/camera-scan';
        break;
    }

    router.push({
      pathname: path,
      params: { scanType: scanType },
    });
  };

  const handleRetry = () => {
    router.replace('/(main)/scans');
  };

  // Show loading while screen is rendering
  if (isRendering) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading scan options..." />
      </SafeAreaView>
    );
  }

  // Show error if rendering failed
  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader
          title="Prepare for Scan"
          subtitle="Select what you would like to analyze today."
          backButton={true}
          height={71}
        />
        <ErrorScreen message={renderError} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader
        title="Prepare for Scan"
        subtitle="Select what you would like to analyze today."
        backButton={true}
        height={71}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 47,
        }}
        className="flex-1 px-container">
        <View
          style={{
            opacity: isContentReady ? 1 : 0,
            transform: [{ translateY: isContentReady ? 0 : 10 }],
          }}>
          {/* Face Scan */}
          <BorderlessShadowCard onPress={() => handleScanPress('Face Scan')}>
            <View className="flex-row items-center justify-between gap-3 px-3">
              <BorderlessShadowCard
                b_bl={12}
                b_br={12}
                b_tl={12}
                b_tr={12}
                style={{
                  width: 56,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FaceScanIcon size={26} />
              </BorderlessShadowCard>

              <View className="flex-1">
                <Text className="font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
                  Face Scan
                </Text>
                <Text className="font-outfit text-[12px] text-[#2A211899]">
                  Analyze hydration, redness, pores, and overall skin barrier health.
                </Text>
              </View>
            </View>
          </BorderlessShadowCard>

          {/* Hair & Scalp Scan */}
          <BorderlessShadowCard
            b_bl={0}
            b_br={0}
            b_tl={0}
            b_tr={0}
            style={{ marginTop: 16 }}
            onPress={() => handleScanPress('Hair & Scalp Scan')}>
            <View className="flex-row items-center justify-between gap-3 px-3">
              <BorderlessShadowCard
                b_bl={12}
                b_br={12}
                b_tl={12}
                b_tr={12}
                style={{
                  width: 56,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {/* <FaceScanIcon size={26} /> */}
                <Image
                  source={require('@/assets/images/hair-scalp-scan-icon.png')}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              </BorderlessShadowCard>

              <View className="flex-1">
                <Text className="font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
                  Hair & Scalp Scan
                </Text>
                <Text className="font-outfit text-[12px] text-[#2A211899]">
                  Check for dandruff, oiliness, and scalp irritation.
                </Text>
              </View>
            </View>
          </BorderlessShadowCard>

          {/* Scan Products for Match */}
          <BorderlessShadowCard
            b_bl={24}
            b_br={24}
            b_tl={0}
            b_tr={0}
            style={{ marginTop: 16 }}
            onPress={() => handleScanPress('Product Match')}>
            <View className="flex-row items-center justify-between gap-3 px-3">
              <BorderlessShadowCard
                b_bl={12}
                b_br={12}
                b_tl={12}
                b_tr={12}
                style={{
                  width: 56,
                  height: 56,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {/* <FaceScanIcon size={26} /> */}
                <Image
                  source={require('@/assets/images/product-scan-icon.png')}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              </BorderlessShadowCard>

              <View className="flex-1">
                <Text className="font-outfitMedium text-[16px]" style={{ color: '#2A2118' }}>
                  Scan Products for Match
                </Text>
                <Text className="font-outfit text-[12px] text-[#2A211899]">
                  Check for dandruff, oiliness, and scalp irritation.
                </Text>
              </View>
            </View>
          </BorderlessShadowCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Scan;
