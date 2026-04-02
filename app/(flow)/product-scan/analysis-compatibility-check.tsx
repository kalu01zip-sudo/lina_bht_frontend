// app/(flow)/face-scan/analysis-compatibility-check.tsx (Fixed scrolling)
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import PillowBadge from '@/components/buttons/PillowBadge';
import { DangerIcon, FlameIcon } from '@/components/icons';
import IconBadge from '@/components/icons/modified/IconBadge';
import { CrossInCircleIcon } from '@/components/icons/CrossInCircleIcon';
import PrimaryVariantButton from '@/components/buttons/PrimaryVariantButton';

const AnalysisCompatibilityCheckScreen = () => {
  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Compatibility Check" height={50} backButton />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 10,
          flexGrow: 1,
        }}
        className="flex-1">
        <View className="px-container">
          {/* Progress Card */}
          <BorderlessShadowCard
            style={{
              paddingVertical: 24,
              paddingHorizontal: 24,
              alignItems: 'center',
            }}>
            <Text className="my-3 font-outfitMedium text-[22px] " style={{ color: '#2E2117' }}>
              Advanced Retinol Serum 1%
            </Text>
            <PillowBadge
              title="Compared against your current routine"
              textStyle={{ color: '#361A0D' }}
            />
            <View className="mt-3 h-[1px] w-full bg-[#CAA78933] " />

            {/* <CircularProgress progress={78} /> */}
            <View className="mt-6 items-center">
              <IconBadge
                size={64}
                style={{ backgroundColor: '#FFFFFF' }}
                icon={<CrossInCircleIcon size={32} color="#DC2626" />}
              />
              <Text className="mt-3 text-center font-outfitMedium text-[16px] text-[#DC2626] ">
                Routine Conflict
              </Text>
              <Text
                className="mt-[6px] text-center font-outfit text-[12px]"
                style={{ color: '#2E2117CC' }}>
                We found potential issues when combining this with your existing products.
              </Text>
            </View>
          </BorderlessShadowCard>

          {/* Detected Issues Section */}
          <View className="mt-3">
            <Text className="mb-2 text-start font-outfitMedium text-[16px] text-[#361A0D]">
              Detected Issues
            </Text>

            {/* very danger */}
            <BorderlessShadowCard
              b_tl={0}
              b_tr={0}
              b_bl={0}
              b_br={0}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 24,
                marginTop: 12,
              }}>
              <View className="flex-row items-start gap-3">
                <CrossInCircleIcon size={24} color="#DC2626" />
                <View className="flex-1">
                  <Text className="text-start font-OutfitBold text-[14px] text-[#2A2118]">
                    Retinol
                  </Text>

                  <Text className="mt-1.5 font-outfit text-[12px]" style={{ color: '#2A2118B2' }}>
                    Conflicts with AHA/BHA Exfoliant in your Night Routine
                  </Text>
                </View>
              </View>
            </BorderlessShadowCard>

            {/* danger */}
            <BorderlessShadowCard
              b_tl={0}
              b_tr={0}
              b_bl={0}
              b_br={0}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 24,
                marginTop: 12,
              }}>
              <View className="flex-row items-start gap-3">
                <DangerIcon size={24} color="#D97706" />
                <View className="flex-1">
                  <Text className="text-start font-OutfitBold text-[14px] text-[#2A2118]">
                    Retinol
                  </Text>

                  <Text className="mt-1.5 font-outfit text-[12px]" style={{ color: '#2A2118B2' }}>
                    May cause irritation with your sensitive skin profile
                  </Text>
                </View>
              </View>
            </BorderlessShadowCard>

            <BorderlessShadowCard
              b_tl={0}
              b_tr={0}
              b_bl={24}
              b_br={24}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 24,
                marginTop: 12,
              }}>
              <View className="flex-row items-start gap-3">
                <IconBadge
                  style={{ backgroundColor: '#361A0D1F' }}
                  size={32}
                  icon={<FlameIcon size={16} color="#361A0D" />}
                />
                <View className="flex-1">
                  <Text className="text-start font-outfitMedium text-[14px] text-[#2A2118]">
                    AI Recommendation
                  </Text>

                  <Text className="mt-1.5 font-outfit text-[12px]" style={{ color: '#2A2118B2' }}>
                    Do not use this product on the same night as your AHA/BHA exfoliant. Alternate
                    nights or use Vitamin C instead for brightening.
                  </Text>
                </View>
              </View>
            </BorderlessShadowCard>

            <PrimaryVariantButton
              title="Ask AI Assistant"
              leftIcon={<FlameIcon size={16} color="#361A0D" />}
              onPress={() => {}}
              style={{ marginTop: 32, marginBottom: 4 }}
            />
            <TouchableOpacity onPress={() => {}} activeOpacity={0.6} className="mt-4 py-5">
              <Text className="text-center font-outfitMedium text-[20px] text-[#361A0D]  ">
                Skip this product
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalysisCompatibilityCheckScreen;

const styles = StyleSheet.create({});
