import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import { useRouter } from 'expo-router';

// const LOAD_MORE_THRESHOLD = 0.85; // trigger when 85% scrolled
const LOAD_MORE_THRESHOLD = 0.85; // trigger when 85% scrolled

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const ProgressScreen = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [activeScanType, setActiveScanType] = useState<ScanType>('face');
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageIndex, setImageIndex] = useState(0);

  const {
    isLoading,
    isError,
    isLoadingMore,
    hasMore,
    refetch,
    loadMore,
    beforeAfterData,
    chartData,
    improvement,
    recentScans,
  } = useProgressData(activeScanType);

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [chartData, beforeAfterData, recentScans],
    delay: 100,
    initialReady: false,
  });

  // Detect scroll-to-near-bottom and trigger loadMore
  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!hasMore || isLoadingMore) return;
      const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
      const scrolled = (contentOffset.y + layoutMeasurement.height) / contentSize.height;
      if (scrolled >= LOAD_MORE_THRESHOLD) {
        loadMore();
      }
    },
    [hasMore, isLoadingMore, loadMore]
  );

  const handleImagePress = (imageUrl: string) => {
    setSelectedImages([imageUrl]);
    setImageIndex(0);
    setImageViewerVisible(true);
  };

  const handleScanPress = (scanId: string) => {
    const pathname =
      activeScanType === 'face' ? '/(flow)/face-scan/scan-detail' : '/(flow)/hair-scan/scan-detail';
    router.push({ pathname, params: { id: scanId } });
  };

  if (isRendering || isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading your progress..." />
      </SafeAreaView>
    );
  }

  if (renderError || isError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader
          title="Your Progress"
          subtitle="Track your skin's journey over time."
          height={70}
          backButton={false}
        />
        <ErrorScreen message={renderError ?? 'Failed to load progress data.'} onRetry={refetch} />
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
        onScroll={handleScroll}
        scrollEventThrottle={200}
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
              {beforeAfterData.length === 0 ? (
                <BorderlessShadowCard
                  b_tl={24}
                  b_tr={24}
                  b_bl={24}
                  b_br={24}
                  style={{ paddingVertical: 48, paddingHorizontal: 24, alignItems: 'center' }}>
                  <Text
                    className="font-outfitMedium text-[14px]"
                    style={{ color: '#2E2117', marginBottom: 8 }}>
                    No comparisons yet
                  </Text>
                  <Text
                    className="text-center font-outfit text-[12px]"
                    style={{ color: '#2E211799' }}>
                    Complete more scans to see your before & after progress.
                  </Text>
                </BorderlessShadowCard>
              ) : (
                beforeAfterData.map((item, index) => (
                  <BeforeAfterCard
                    key={item.id}
                    item={item}
                    isFirst={index === 0}
                    isLast={index === beforeAfterData.length - 1}
                    onImagePress={handleImagePress}
                  />
                ))
              )}
            </View>
          )}

          {/* Recent Scans Section */}
          <View className="mt-4">
            <Text className="font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
              Recent Scans
            </Text>

            {recentScans.length === 0 ? (
              <Text className="mt-2 font-outfit text-[12px]" style={{ color: '#2E211799' }}>
                No recent scans found.
              </Text>
            ) : (
              recentScans.map((scan, index) => (
                <TouchableOpacity
                  key={scan.id}
                  activeOpacity={1}
                  onPress={() => handleScanPress(scan.id)}>
                  <ShadowCard
                    className="mt-2"
                    b_tl={index === 0 ? 24 : 0}
                    b_tr={index === 0 ? 24 : 0}
                    b_bl={index === recentScans.length - 1 && !hasMore ? 24 : 0}
                    b_br={index === recentScans.length - 1 && !hasMore ? 24 : 0}>
                    <View
                      style={{
                        borderTopLeftRadius: index === 0 ? 24 : 0,
                        borderTopRightRadius: index === 0 ? 24 : 0,
                        borderBottomLeftRadius:
                          index === recentScans.length - 1 && !hasMore ? 24 : 0,
                        borderBottomRightRadius:
                          index === recentScans.length - 1 && !hasMore ? 24 : 0,
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
                              {formatDate(scan.created_at)}
                            </Text>
                            <Text
                              className="font-outfit text-[12px]"
                              style={{ color: '#2E211799' }}>
                              {activeScanType === 'face' ? 'Face Scan' : 'Hair & Scalp Scan'}
                            </Text>
                          </View>
                        </View>

                        <View className="items-end">
                          <Text
                            className="font-outfitMedium text-[14px]"
                            style={{ color: '#7A5D3E' }}>
                            {scan.overall_score}
                          </Text>
                          <Text className="font-outfit text-[12px]" style={{ color: '#2E211780' }}>
                            Score
                          </Text>
                        </View>
                      </View>
                    </View>
                  </ShadowCard>
                </TouchableOpacity>
              ))
            )}

            {/* Pagination footer */}
            {isLoadingMore && (
              <View className="mt-3 items-center py-4">
                <ActivityIndicator size="small" color="#7A8B6A" />
              </View>
            )}
            {!hasMore && recentScans.length > 0 && (
              <Text
                className="mt-3 text-center font-outfit text-[12px]"
                style={{ color: '#2E211760' }}>
                All scans loaded
              </Text>
            )}
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
