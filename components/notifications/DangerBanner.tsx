// components/notifications/DangerBanner.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { DangerIcon } from '@/components/icons';

interface DangerBannerProps {
  count: number;
}

export const DangerBanner: React.FC<DangerBannerProps> = ({ count }) => {
  if (count === 0) return null;

  return (
    <View className="mx-container mb-4 mt-2 flex-row items-center gap-2 rounded-xl bg-red-50 p-3">
      <DangerIcon size={20} color="#DC2626" />
      <Text className="flex-1 font-outfit text-[12px]" style={{ color: '#DC2626' }}>
        You have {count} urgent health alert{count > 1 ? 's' : ''}
      </Text>
    </View>
  );
};
