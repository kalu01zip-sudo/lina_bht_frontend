// app/(main)/progress/index.tsx
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageView from 'react-native-image-viewing';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import { ScanTypeFilter } from '@/components/progress/ScanTypeFilter';
import { TabFilter } from '@/components/progress/TabFilter';
import { AnalyticsChart } from '@/components/progress/AnalyticsChart';
import { BeforeAfterCard } from '@/components/progress/BeforeAfterCard';
import { useProgressData } from '@/hooks/useProgressData';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import { TabType, ScanType } from '@/types/progress';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import ShadowCard from '@/components/cards/ShadowCard';
import { CurvedArrowTopRightIcon } from '@/components/icons';

const ProgressScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [activeScanType, setActiveScanType] = useState<ScanType>('face');
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState(0);

  const { beforeAfterData, chartData, improvement } = useProgressData(activeScanType);

  // Screen ready state for smooth transitions
  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [beforeAfterData, chartData],
    delay: 100,
    initialReady: false,
  });

  const handleImagePress = (imageUrl: string) => {
    setSelectedImages([imageUrl]);
    setImageIndex(0);
    setImageViewerVisible(true);
  };

  const handleRetry = () => {
    // Since data is static, just refresh by toggling scan type
    setActiveScanType(activeScanType === 'face' ? 'hair' : 'face');
    setTimeout(() => {
      setActiveScanType(activeScanType);
    }, 100);
  };

  // Mock data for recent scans
  const recentScans = [
    { id: 1, date: 'Mar 13, 2026', type: 'Face Scan', score: 78 },
    { id: 2, date: 'Mar 10, 2026', type: 'Hair Scan', score: 82 },
    { id: 3, date: 'Mar 7, 2026', type: 'Face Scan', score: 75 },
  ];

  // Show loading while screen is rendering
  if (isRendering) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading your progress..." />
      </SafeAreaView>
    );
  }

  // Show error if rendering failed
  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader
          title="Your Progress"
          subtitle="Track your skin's journey over time."
          height={70}
          backButton={false}
        />
        <ErrorScreen message={renderError} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader
        title="Your Progress"
        subtitle="Track your skin's journey over time."
        height={70}
        backButton={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 20,
          flexGrow: 1,
        }}
        className="flex-1">
        <View
          className="px-container"
          style={{
            opacity: isContentReady ? 1 : 0,
            transform: [{ translateY: isContentReady ? 0 : 10 }],
          }}>
          <ScanTypeFilter activeScanType={activeScanType} onSelect={setActiveScanType} />
          <TabFilter activeTab={activeTab} onSelect={setActiveTab} />

          {activeTab === 'analytics' && (
            <AnalyticsChart
              scanType={activeScanType}
              chartData={chartData}
              improvement={improvement}
            />
          )}

          {activeTab === 'beforeAfter' && (
            <View className="mt-3">
              {beforeAfterData.map((item, index) => (
                <BeforeAfterCard
                  key={item.id}
                  item={item}
                  isFirst={index === 0}
                  isLast={index === beforeAfterData.length - 1}
                  onImagePress={handleImagePress}
                />
              ))}
            </View>
          )}

          {/* Recent Scans Section */}
          <View className="mt-4">
            <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
              Recent Scans
            </Text>

            {recentScans.map((scan, index) => (
              <ShadowCard
                key={scan.id}
                className="mt-2"
                b_tl={index === 0 ? 24 : 0}
                b_tr={index === 0 ? 24 : 0}
                b_bl={index === recentScans.length - 1 ? 24 : 0}
                b_br={index === recentScans.length - 1 ? 24 : 0}>
                <View
                  style={{
                    borderTopLeftRadius: index === 0 ? 24 : 0,
                    borderTopRightRadius: index === 0 ? 24 : 0,
                    borderBottomLeftRadius: index === recentScans.length - 1 ? 24 : 0,
                    borderBottomRightRadius: index === recentScans.length - 1 ? 24 : 0,
                  }}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <BorderlessShadowCard
                        b_tl={6}
                        b_tr={6}
                        b_bl={6}
                        b_br={6}
                        style={{
                          width: 40,
                          height: 40,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <CurvedArrowTopRightIcon size={20} color="#7A8B6A" />
                      </BorderlessShadowCard>

                      <View>
                        <Text
                          className="font-outfitMedium text-[14px]"
                          style={{ color: '#2E2117' }}>
                          {scan.date}
                        </Text>
                        <Text className="font-outfit text-[12px]" style={{ color: '#2E211799' }}>
                          {scan.type}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="font-outfitMedium text-[14px]" style={{ color: '#7A5D3E' }}>
                        {scan.score}
                      </Text>
                      <Text className="font-outfit text-[12px]" style={{ color: '#2E211780' }}>
                        Score
                      </Text>
                    </View>
                  </View>
                </View>
              </ShadowCard>
            ))}
          </View>
        </View>
      </ScrollView>

      <ImageView
        images={selectedImages.map((uri) => ({ uri }))}
        imageIndex={imageIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
        animationType="slide"
        presentationStyle="overFullScreen"
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
    </SafeAreaView>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({});
