// components/notifications/EmptyState.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const EmptyState: React.FC = () => {
  return (
    <View className="flex-1 items-center justify-center px-container pt-20">
      <View className="h-24 w-24 items-center justify-center rounded-full bg-[#F0E6D8]">
        <Ionicons name="notifications-off-outline" size={48} color="#2E211733" />
      </View>
      <Text className="mt-4 font-outfitMedium text-[18px]" style={{ color: '#2E2117' }}>
        No Notifications
      </Text>
      <Text className="mt-2 text-center font-outfit text-[14px]" style={{ color: '#2E211766' }}>
        You&apos;re all caught up! Check back later for updates.
      </Text>
    </View>
  );
};
