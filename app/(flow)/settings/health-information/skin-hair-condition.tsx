// app/(flow)/settings/health-information/skin-hair-condition.tsx
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
import VectorBg from '@/components/VectorBg';

// Skin type mapping for display
const SKIN_TYPE_LABELS: Record<string, string> = {
  dry: 'Dry',
  combination: 'Combination',
  normal: 'Normal',
  oily: 'Oily',
  sensitive: 'Sensitive',
};

// Hair type mapping for display
const HAIR_TYPE_LABELS: Record<string, string> = {
  wavy: 'Wavy',
  straight: 'Straight',
  curly: 'Curly',
  coily_or_kinky: 'Coily or Kinky',
};

// Skin concerns mapping for display (including custom)
const SKIN_CONCERNS_LABELS: Record<string, string> = {
  acne_pimple: 'Acne, Pimple',
  irritation_redness: 'Irritation, redness',
  pigmentation: 'Pigmentation',
  dullness: 'Dullness',
};

// Hair concerns mapping for display (including custom)
const HAIR_CONCERNS_LABELS: Record<string, string> = {
  hair_fall: 'Hair fall',
  dandruff: 'Dandruff',
  oily_scalp: 'Oily Scalp',
  dry_scalp: 'Dry Scalp',
};

export default function SkinHairConditionSettingsScreen() {
  const router = useRouter();

  const [skinType, setSkinType] = useState<string | null>(null);
  const [skinConcerns, setSkinConcerns] = useState<string[]>([]);
  const [skinCustomConcerns, setSkinCustomConcerns] = useState<string[]>([]);
  const [hairType, setHairType] = useState<string | null>(null);
  const [hairConcerns, setHairConcerns] = useState<string[]>([]);
  const [hairCustomConcerns, setHairCustomConcerns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isRendering, isContentReady, renderError } = useScreenReady({
    dependencies: [],
    delay: 100,
    initialReady: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        savedSkinType,
        savedSkinConcerns,
        savedSkinCustom,
        savedHairType,
        savedHairConcerns,
        savedHairCustom,
      ] = await Promise.all([
        AsyncStorage.getItem('user_skin_type'),
        AsyncStorage.getItem('user_skin_concerns'),
        AsyncStorage.getItem('user_skin_custom_concerns'),
        AsyncStorage.getItem('user_hair_type'),
        AsyncStorage.getItem('user_hair_concerns'),
        AsyncStorage.getItem('user_hair_custom_concerns'),
      ]);

      if (savedSkinType) setSkinType(savedSkinType);
      if (savedSkinConcerns) setSkinConcerns(JSON.parse(savedSkinConcerns));
      if (savedSkinCustom) setSkinCustomConcerns(JSON.parse(savedSkinCustom));
      if (savedHairType) setHairType(savedHairType);
      if (savedHairConcerns) setHairConcerns(JSON.parse(savedHairConcerns));
      if (savedHairCustom) setHairCustomConcerns(JSON.parse(savedHairCustom));
    } catch (error) {
      console.error('Error loading skin/hair data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSkinTypeDisplay = () => {
    return skinType ? SKIN_TYPE_LABELS[skinType] || skinType : 'Not set';
  };

  const getHairTypeDisplay = () => {
    return hairType ? HAIR_TYPE_LABELS[hairType] || hairType : 'Not set';
  };

  const getSkinConcernsDisplay = () => {
    const allConcerns = [...skinConcerns, ...skinCustomConcerns];
    if (allConcerns.length === 0) return 'None';
    const labels = allConcerns.map((c) => SKIN_CONCERNS_LABELS[c] || c);
    if (labels.length <= 3) return labels.join(', ');
    return `${labels.slice(0, 3).join(', ')} +${labels.length - 3} more`;
  };

  const getHairConcernsDisplay = () => {
    const allConcerns = [...hairConcerns, ...hairCustomConcerns];
    if (allConcerns.length === 0) return 'None';
    const labels = allConcerns.map((c) => HAIR_CONCERNS_LABELS[c] || c);
    if (labels.length <= 3) return labels.join(', ');
    return `${labels.slice(0, 3).join(', ')} +${labels.length - 3} more`;
  };

  const handleEdit = () => {
    router.push('/(flow)/settings/health-information/edit/edit-skin-hair-condition');
  };

  const handleRetry = () => {
    router.replace('/(flow)/settings/health-information/skin-hair-condition');
  };

  if (isRendering || isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1">
        {/* Vector BG */}
        <VectorBg />
        <LoadingScreen loadingText="Loading skin & hair information..." />
      </SafeAreaView>
    );
  }

  if (renderError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Skin & Hair Condition" height={50} backButton={true} />
        <ErrorScreen message={renderError} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Skin & Hair Condition" height={50} backButton={true} />
      {/* Vector BG */}
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
          {/* Skin Section */}
          <BorderlessShadowCard
            b_tl={24}
            b_tr={24}
            b_bl={0}
            b_br={0}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 20,
              marginBottom: 16,
              gap: 12,
            }}>
            <Text className="mb-3 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
              Skin
            </Text>
            <InfoRow
              label="Skin Type"
              value={getSkinTypeDisplay()}
              isEditing={false}
              labelColor="#2E211766"
              valueColor="#2E2117B2"
            />

            <InfoRow
              label="Skin Concerns"
              value={getSkinConcernsDisplay()}
              isEditing={false}
              labelColor="#2E211766"
              valueColor="#2E2117B2"
            />
          </BorderlessShadowCard>

          {/* Hair Section */}
          <BorderlessShadowCard
            b_tl={0}
            b_tr={0}
            b_bl={0}
            b_br={0}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 20,
              gap: 12,
            }}>
            <Text className="mb-3 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
              Hair
            </Text>
            <InfoRow
              label="Hair Type"
              value={getHairTypeDisplay()}
              isEditing={false}
              labelColor="#2E211766"
              valueColor="#2E2117B2"
            />

            <InfoRow
              label="Hair Concerns"
              value={getHairConcernsDisplay()}
              isEditing={false}
              labelColor="#2E211766"
              valueColor="#2E2117B2"
            />
          </BorderlessShadowCard>

          <PrimaryVariantButton
            onPress={handleEdit}
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            borderBottomLeftRadius={24}
            borderBottomRightRadius={24}
            title="Edit Skin & Hair"
            style={{ marginTop: 16 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
