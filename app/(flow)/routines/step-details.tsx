

// app/(main)/routines/step-details.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { HTMLRenderer } from '@/components/articles/HTMLRenderer';
import { routineSteps } from '@/constants/routineData';
import { useToast } from '@/hooks/useToast';

export default function RoutineStepDetailsScreen() {
  const router = useRouter();
  const { showError } = useToast();
  const params = useLocalSearchParams();
  const [stepDetail, setStepDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const routineType = params.routineType as string;
  const stepId = params.stepId as string;
  const stepNumber = params.stepNumber;
  const title = params.title;
  const isCustom = params.isCustom === 'true';

  useEffect(() => {
    fetchStepDetails();
  }, []);

  const fetchStepDetails = async () => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call
      // const response = await api.getRoutineStepDetail(routineType, stepId);
      // setStepDetail(response.data);

      // Find step from local data (mock)
      setTimeout(() => {
        const steps = routineSteps[routineType as keyof typeof routineSteps] || [];
        const step = steps.find((s) => s.id === stepId);

        if (step) {
          setStepDetail(step);
        } else if (isCustom) {
          // Custom step fallback
          setStepDetail({
            id: stepId,
            stepNumber: stepNumber,
            title: title,
            description: 'Your custom routine step',
            type: 'custom',
            detailedContent: `
              <h2>Custom Step</h2>
              <p>This is a custom step you added to your routine. You can edit the details in your routine settings.</p>
              <h2>Instructions</h2>
              <p>Follow the instructions you provided when adding this step.</p>
            `,
          });
        }
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching step details:', error);
      showError('Failed to load step details');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Step Details" height={50} backButton={true} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#977857" />
          <Text className="text-descriptionTextColor mt-4 font-outfit text-[14px]">
            Loading step details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!stepDetail) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Step Details" height={50} backButton={true} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-descriptionTextColor font-outfit text-[16px]">
            Step details not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Step Details" height={50} backButton={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 20,
        }}
        className="flex-1">
        <View className="px-container">
          {/* Header */}
          <View className="mb-6">
            <View className="mb-2 flex-row items-center gap-2">
              <Text className="font-outfitBold text-[14px] text-[#977857]">
                Step {stepDetail.stepNumber}
              </Text>
              {stepDetail.type === 'product' && (
                <View className="rounded-full bg-[#97785720] px-2 py-0.5">
                  <Text className="font-outfit text-[10px] text-[#977857]">Product</Text>
                </View>
              )}
              {stepDetail.type === 'wellness' && (
                <View className="rounded-full bg-[#4ADE8020] px-2 py-0.5">
                  <Text className="font-outfit text-[10px] text-[#4ADE80]">Wellness</Text>
                </View>
              )}
              {isCustom && (
                <View className="rounded-full bg-[#7A8B6A20] px-2 py-0.5">
                  <Text className="font-outfit text-[10px] text-[#7A8B6A]">Custom</Text>
                </View>
              )}
            </View>
            <Text className="font-outfitBold mb-2 text-[24px] text-titleTextColor">
              {stepDetail.title}
            </Text>
            <Text className="text-descriptionTextColor font-outfit text-[16px]">
              {stepDetail.description}
            </Text>
          </View>

          {/* Duration & Frequency Cards - Without Icons */}
          {(stepDetail.duration || stepDetail.frequency) && (
            <BorderlessShadowCard style={{ marginBottom: 10, padding: 20 }}>
              <View className="flex-row justify-between">
                {stepDetail.duration && (
                  <View className="flex-1 items-center ">
                    <Text
                      className="text-descriptionTextColor mb-1  font-outfitMedium text-[12px]"
                      style={{ color: '#7A8B6A' }}>
                      Duration
                    </Text>
                    <Text className="font-outfitMedium text-[14px] text-titleTextColor">
                      {stepDetail.duration}
                    </Text>
                  </View>
                )}
                {stepDetail.frequency && (
                  <View className="flex-1 items-center ">
                    <Text
                      className="text-descriptionTextColor mb-1 font-outfitMedium text-[12px]"
                      style={{ color: '#7A8B6A' }}>
                      Frequency
                    </Text>
                    <Text className="font-outfitMedium text-[14px] text-titleTextColor">
                      {stepDetail.frequency}
                    </Text>
                  </View>
                )}
              </View>
            </BorderlessShadowCard>
          )}

          {/* HTML Content */}
          {stepDetail.detailedContent && (
            <BorderlessShadowCard
              b_tl={0}
              b_tr={0}
              b_bl={24}
              b_br={24}
              style={{ marginBottom: 16, padding: 20 }}>
              <HTMLRenderer content={stepDetail.detailedContent} />
            </BorderlessShadowCard>
          )}

          {/* Tips Section (if not in HTML) */}
          {stepDetail.tips &&
            stepDetail.tips.length > 0 &&
            !stepDetail.detailedContent?.includes('Pro Tips') && (
              <BorderlessShadowCard style={{ marginBottom: 16, padding: 20 }}>
                <Text className="font-outfitSemiBold mb-3 text-[18px] text-titleTextColor">
                  Pro Tips
                </Text>
                {stepDetail.tips.map((tip: string, index: number) => (
                  <View key={index} className="mb-2 flex-row items-start gap-2">
                    <Text className="text-[16px]">•</Text>
                    <Text className="text-descriptionTextColor flex-1 font-outfit text-[14px]">
                      {tip}
                    </Text>
                  </View>
                ))}
              </BorderlessShadowCard>
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
