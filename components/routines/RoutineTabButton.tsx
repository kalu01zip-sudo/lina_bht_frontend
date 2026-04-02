// components/routines/RoutineTabButton.tsx
import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';

type RoutineType = 'morning' | 'night' | 'weekly';

interface RoutineTabButtonProps {
  isActive: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
}

export const RoutineTabButton: React.FC<RoutineTabButtonProps> = ({
  isActive,
  onPress,
  icon,
  label,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: isActive ? '#F0E6D8' : 'transparent',
        marginRight: 8,
      }}>
      <View className="flex-row items-center gap-1">
        {icon}
        <Text
          className="font-outfitMedium text-[14px]"
          style={{ color: isActive ? '#7A8B6A' : '#2E211780' }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// New component for the tab bar with horizontal scrolling
interface RoutineTabBarProps {
  tabs: Array<{
    id: RoutineType;
    label: string;
    icon: React.ReactNode;
  }>;
  activeTab: RoutineType;
  onTabPress: (tabId: RoutineType) => void;
}

export const RoutineTabBar: React.FC<RoutineTabBarProps> = ({ tabs, activeTab, onTabPress }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {tabs.map((tab) => (
        <RoutineTabButton
          key={tab.id}
          isActive={activeTab === tab.id}
          onPress={() => onTabPress(tab.id)}
          icon={tab.icon}
          label={tab.label}
        />
      ))}
    </ScrollView>
  );
};
