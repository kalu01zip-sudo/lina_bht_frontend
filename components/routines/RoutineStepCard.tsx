import React, { useRef, useState } from 'react';
import { View, Text, StyleProp, ViewStyle, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { RadioButton } from '@/components/buttons/RadioButton';
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
  disabled?: boolean;
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
  disabled = false,
}) => {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.985,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  const handleViewDetails = () => {
    router.push({
      pathname: '/(flow)/routines/step-details',
      params: {
        routineType,
        stepId,
        stepNumber,
        title,
        productCategory,
      },
    });
  };

  const handleToggle = (value: boolean) => {
    if (disabled) return;
    onToggle(value);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    onDelete?.(stepId || '');
  };

  return (
    <>
      <Pressable
        onPress={handleViewDetails}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ marginTop: isFirst ? 0 : 12 }}>
        <Animated.View
          className={className}
          style={[
            {
              transform: [{ scale: scaleAnim }],
              opacity: 1,
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
                paddingVertical: 18,
                paddingHorizontal: 20,
              },
              contentContainerStyle,
            ]}>
            {/* Header */}
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="font-OutfitBold text-[13px]" style={{ color: '#977857' }}>
                  Step {stepNumber}
                </Text>

                <Text className="mt-1 font-outfit text-[11px]" style={{ color: '#2E211766' }}>
                  {productCategory || 'Gixy Essentials'}
                </Text>
              </View>

              {/* Radio Button */}
              <Pressable onPress={(e) => e.stopPropagation()}>
                <RadioButton value={isCompleted} onValueChange={handleToggle} />
              </Pressable>
            </View>

            {/* Content */}
            <View className="mt-3">
              <Text
                className="font-outfitMedium text-[17px]"
                style={{ color: '#2E2117' }}
                numberOfLines={2}>
                {title}
              </Text>

              <Text
                className="mt-2 font-outfit text-[13px]"
                style={{ color: '#2E211799' }}
                numberOfLines={3}>
                {description}
              </Text>
            </View>

            {/* Footer */}
            <View className="mt-5 flex-row items-center justify-between">
              {/* Delete Button */}
              <View>
                {onDelete ? (
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      setShowDeleteModal(true);
                    }}
                    hitSlop={10}
                    className="flex-row items-center">
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />

                    <Text className="ml-1 font-outfitSemi text-[14px]" style={{ color: '#EF4444' }}>
                      Remove
                    </Text>
                  </Pressable>
                ) : (
                  <View />
                )}
              </View>

              {/* View Details */}
              <View className="flex-row items-center">
                <Text className="font-outfitSemi text-[14px]" style={{ color: '#977857' }}>
                  View Details
                </Text>

                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#977857"
                  style={{ marginLeft: 4 }}
                />
              </View>
            </View>
          </BorderlessShadowCard>
        </Animated.View>
      </Pressable>

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
