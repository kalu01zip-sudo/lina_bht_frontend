// app/(flow)/settings/health-information/life-phase-health.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import { useToast } from '@/hooks/useToast';
import { useScreenReady } from '@/hooks/useScreenReady';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import PrimaryVariantButton from '@/components/buttons/PrimaryVariantButton';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { InfoRow } from '@/components/personalInfo/InfoRow';
import { MenoPauseIcon, PeriodIcon, PostpartumIcon, PregnantIcon } from '@/components/icons';
import VectorBg from '@/components/VectorBg';

const CURRENT_PHASE = [
  {
    id: 'period',
    label: 'On my period',
    value: 'period',
  },
  {
    id: 'pregnant',
    label: 'Pregnant',
    value: 'pregnant',
  },
  {
    id: 'postpartum',
    label: 'Postpartum',
    value: 'postpartum',
  },
  {
    id: 'menopause',
    label: 'Menopause',
    value: 'menopause',
  },
  {
    id: 'none',
    label: 'None',
    value: 'none',
  },
  {
    id: 'other',
    label: 'Other',
    value: 'other',
  },
];

export default function LifePhaseHealthScreen() {
  const router = useRouter();
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [customPhase, setCustomPhase] = useState<string | null>(null);
  const [pregnancyMonth, setPregnancyMonth] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Replace with actual user gender from API when integrating
  const userGender = 'Female'; // Change to 'Male' to test different scenarios
  const isFemale = userGender === 'Female';

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  useEffect(() => {
    loadPhase();
  }, []);

  const loadPhase = async () => {
    try {
      const savedPhase = await AsyncStorage.getItem('user_current_phase');
      const savedCustomPhase = await AsyncStorage.getItem('user_custom_phase');
      const savedPregnancyMonth = await AsyncStorage.getItem('user_pregnancy_month');

      if (savedPhase) {
        setSelectedPhase(savedPhase);
        if (savedPhase === 'other' && savedCustomPhase) {
          setCustomPhase(savedCustomPhase);
        }
        if (savedPhase === 'pregnant' && savedPregnancyMonth) {
          setPregnancyMonth(parseInt(savedPregnancyMonth));
        }
      }
    } catch (error) {
      console.error('Error loading phase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPhaseLabel = (phaseValue: string) => {
    if (phaseValue === 'other' && customPhase) {
      return customPhase;
    }
    const phase = CURRENT_PHASE.find((p) => p.value === phaseValue);
    return phase?.label || 'Not set';
  };

  const getPhaseIcon = () => {
    switch (selectedPhase) {
      case 'period':
        return <PeriodIcon width={20} height={20} color="#7A8B6A" />;
      case 'pregnant':
        return <PregnantIcon width={20} height={20} color="#7A8B6A" />;
      case 'postpartum':
        return <PostpartumIcon width={20} height={20} color="#7A8B6A" />;
      case 'menopause':
        return <MenoPauseIcon width={20} height={20} color="#7A8B6A" />;
      default:
        return null;
    }
  };

  const getPregnancyMonthText = (month: number) => {
    return `${month} month${month !== 1 ? 's' : ''} pregnant`;
  };

  const handleEdit = () => {
    router.push('/(flow)/settings/health-information/edit/edit-life-phase');
  };

  const handleRetry = () => {
    router.replace('/(flow)/settings/health-information/life-phase-health');
  };

  if (isRendering || isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1">
        {/* SVG Background */}
        <VectorBg />
        <LoadingScreen loadingText="Loading health information..." />
      </SafeAreaView>
    );
  }

  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Life Phase & Health" height={50} backButton={true} />
        <ErrorScreen message={renderError} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Life Phase & Health" height={50} backButton={true} />
      {/* SVG Background */}
      <VectorBg />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 30,
          flexGrow: 1,
        }}
        className="flex-1">
        <View
          className="px-container"
          style={{
            opacity: isContentReady ? 1 : 0,
            transform: [{ translateY: isContentReady ? 0 : 10 }],
          }}>
          {isFemale ? (
            <>
              <InfoRow
                label="Current Phase"
                value={selectedPhase ? getPhaseLabel(selectedPhase) : 'Not set'}
                isEditing={false}
                labelColor="#2E2117"
                valueColor="#2E2117B2"
              />

              {/* Show custom phase badge if applicable */}
              {selectedPhase === 'other' && customPhase && (
                <View className="mt-2 flex-row items-center gap-2">
                  {getPhaseIcon()}
                  <Text className="font-outfit text-[12px]" style={{ color: '#7A8B6A' }}>
                    Custom phase
                  </Text>
                </View>
              )}

              {/* Show pregnancy details if pregnant */}
              {/* {selectedPhase === 'pregnant' && pregnancyMonth && (
                <BorderlessShadowCard
                  b_tl={16}
                  b_tr={16}
                  b_bl={16}
                  b_br={16}
                  style={{
                    marginTop: 12,
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    backgroundColor: '#F5F0EB',
                  }}>
                  <View className="flex-row items-center gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-[#97785720]">
                      <PregnantIcon width={20} height={20} color="#977857" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-outfitMedium text-[14px]" style={{ color: '#2E2117' }}>
                        Pregnancy Details
                      </Text>
                      <Text className="font-outfit text-[12px]" style={{ color: '#2E2117B2' }}>
                        {getPregnancyMonthText(pregnancyMonth)}
                      </Text>
                    </View>
                  </View>
                </BorderlessShadowCard>
              )} */}

              {/* Show pregnancy details if pregnant */}
              {selectedPhase === 'pregnant' && pregnancyMonth && (
                <BorderlessShadowCard
                  b_tl={16}
                  b_tr={16}
                  b_bl={16}
                  b_br={16}
                  style={{
                    marginTop: 12,
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    backgroundColor: '#F5F0EB',
                    borderWidth: 1,
                    borderColor: '#E8DDD0',
                  }}>
                  <View className="flex-row items-center gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-[#97785720]">
                      <PregnantIcon width={24} height={24} color="#977857" />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-outfitSemiBold text-[15px]"
                        style={{ color: '#2E2117' }}>
                        Pregnancy Details
                      </Text>
                      <Text
                        className="mt-1 font-outfitMedium text-[14px]"
                        style={{ color: '#977857' }}>
                        {getPregnancyMonthText(pregnancyMonth)}
                      </Text>
                    </View>
                  </View>
                </BorderlessShadowCard>
              )}

              <PrimaryVariantButton
                onPress={handleEdit}
                borderTopLeftRadius={100}
                borderTopRightRadius={100}
                borderBottomLeftRadius={100}
                borderBottomRightRadius={100}
                title="Edit Phase"
                style={{ marginTop: 24 }}
              />
            </>
          ) : (
            <BorderlessShadowCard
              b_tl={24}
              b_tr={24}
              b_bl={24}
              b_br={24}
              style={{
                paddingVertical: 24,
                paddingHorizontal: 20,
                alignItems: 'center',
                marginTop: 12,
              }}>
              <Text className="text-center font-outfit text-[16px]" style={{ color: '#2E2117' }}>
                Life phase tracking is specifically designed for women&apos;s health cycles.
              </Text>
              <Text
                className="mt-2 text-center font-outfit text-[14px]"
                style={{ color: '#2E2117B2' }}>
                This feature helps track menstrual cycles, pregnancy, and menopause stages.
              </Text>
            </BorderlessShadowCard>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
