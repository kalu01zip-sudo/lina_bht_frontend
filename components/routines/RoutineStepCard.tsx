// components/routines/RoutineStepCard.tsx
import React from 'react';
import { View, Text, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { RadioButton } from '@/components/buttons/RadioButton';

interface RoutineStepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
  onToggle: (completed: boolean) => void;
  isLast?: boolean;
  isFirst?: boolean;
  isCustom?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  routineType?: string; // Add this
  stepId?: string; // Add this for unique identification
}

export const RoutineStepCard: React.FC<RoutineStepCardProps> = ({
  stepNumber,
  title,
  description,
  isCompleted,
  onToggle,
  isLast = false,
  isFirst = false,
  isCustom = false,
  style,
  className = '',
  contentContainerStyle,
  routineType,
  stepId,
}) => {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push({
      pathname: '/(flow)/routines/step-details',
      params: {
        routineType: routineType,
        stepId: stepId,
        stepNumber: stepNumber,
        title: title,
        isCustom: String(isCustom),
      },
    });
  };

  return (
    <View
      className={className}
      style={[
        {
          marginTop: isFirst ? 0 : 12,
        },
        style,
      ]}>
      <BorderlessShadowCard
        b_tl={isFirst ? 24 : 0}
        b_tr={isFirst ? 24 : 0}
        b_bl={isLast ? 24 : 0}
        b_br={isLast ? 24 : 0}
        style={[
          {
            paddingVertical: 16,
            paddingHorizontal: 24,
          },
          contentContainerStyle,
        ]}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="font-OutfitBold text-[14px]" style={{ color: '#977857' }}>
              Step {stepNumber}
            </Text>
            {isCustom && (
              <View className="rounded-full bg-[#7A8B6A20] px-2 py-0.5">
                <Text className="font-outfit text-[10px]" style={{ color: '#7A8B6A' }}>
                  Custom
                </Text>
              </View>
            )}
          </View>
          <RadioButton value={isCompleted} onValueChange={onToggle} />
        </View>
        <Text
          className="font-outfit text-[12px] "
          style={{
            color: '#2E211780',
          }}>
          Gixy Essentials
        </Text>
        <View className="flex-row items-end justify-between">
          <View className="flex-1">
            <Text className="mt-1 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
              {title}
            </Text>
            <Text className="mt-[6px] font-outfit text-[14px]" style={{ color: '#2E2117B2' }}>
              {description}
            </Text>
          </View>
          {/* <TouchableOpacity activeOpacity={0.8} className="ms-[10px]" onPress={handleViewDetails}>
            <Text className="font-outfitSemi text-[14px]" style={{ color: '#2E2117' }}>
              View Details
            </Text>
          </TouchableOpacity> */}
        </View>
        <Text
          className="mt-[10px] bg-[#9778571A] px-3 py-[6px] font-outfit text-[12px] "
          style={{
            color: '#7A5D3E',
            borderWidth: 1,
            borderColor: '#97785733',
            borderRadius: 8,
          }}>
          💡 Tip : Use lukewarm water to avoid stripping natural oils.
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          className=" mt-4 w-full items-end "
          onPress={handleViewDetails}>
          <Text className="font-outfitSemi text-[14px]" style={{ color: '#2E2117' }}>
            View Tutorials
          </Text>
        </TouchableOpacity>
      </BorderlessShadowCard>
    </View>
  );
};
