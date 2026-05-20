// components/routines/RoutineStepCard.tsx
import React, { useState } from 'react';
import { View, Text, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { RadioButton } from '@/components/buttons/RadioButton';
import { Ionicons } from '@expo/vector-icons';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

interface RoutineStepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
  onToggle: (completed: boolean) => void;
  isLast?: boolean;
  isFirst?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  routineType?: string;
  stepId?: string;
  onDelete?: (stepId: string) => void;
  productCategory?: string;
}

export const RoutineStepCard: React.FC<RoutineStepCardProps> = ({
  stepNumber,
  title,
  description,
  isCompleted,
  onToggle,
  isLast = false,
  isFirst = false,
  style,
  className = '',
  contentContainerStyle,
  routineType,
  stepId,
  onDelete,
  productCategory,
}) => {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleViewDetails = () => {
    router.push({
      pathname: '/(flow)/routines/step-details',
      params: {
        routineType: routineType,
        stepId: stepId,
        stepNumber: stepNumber,
        title: title,
        productCategory: productCategory,
      },
    });
  };

  const handleDeletePress = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    onDelete?.(stepId || '');
  };

  return (
    <>
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
            <Text className="font-OutfitBold text-[14px]" style={{ color: '#977857' }}>
              Step {stepNumber}
            </Text>
            <View className="flex-row items-center gap-3">
              {onDelete && (
                <TouchableOpacity
                  onPress={handleDeletePress}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>
              )}
              <RadioButton value={isCompleted} onValueChange={onToggle} />
            </View>
          </View>

          {/* <Text className="font-outfit text-[12px]" style={{ color: '#2E211780' }}>
            Gixy Essentials
          </Text> */}
          <Text className="font-outfit text-[12px]" style={{ color: '#2E211780' }}>
            {productCategory || 'Gixy Essentials'}
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
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            className="mt-4 w-full items-end"
            onPress={handleViewDetails}>
            <Text className="font-outfitSemi text-[14px]" style={{ color: '#2E2117' }}>
              View Details
            </Text>
          </TouchableOpacity>
        </BorderlessShadowCard>
      </View>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Step"
        message={`Are you sure you want to remove "${title}" from your routine?`}
        confirmText="Remove"
        cancelText="Cancel"
        iconName="trash-outline"
        iconColor="#EF4444"
        confirmButtonColor="#EF4444"
      />
    </>
  );
};
