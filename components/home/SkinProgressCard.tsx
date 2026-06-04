// screens/home/components/SkinProgressCard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ShadowCard from '@/components/cards/ShadowCard';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import TextBodySmall from '@/components/texts/TextBodySmall';
import { SkinProgressIcon, DotWideIcon } from '@/components/icons';

interface SkinProgressCardProps {
  onPress: () => void;
}

export const SkinProgressCard: React.FC<SkinProgressCardProps> = ({ onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <ShadowCard
      b_bl={24}
      b_br={24}
      b_tl={24}
      b_tr={24}
      style={{ marginTop: 8, overflow: 'hidden' }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        className="flex-row items-start gap-3">
        <BorderlessShadowCard
          b_bl={6}
          b_br={6}
          b_tl={6}
          b_tr={6}
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isPressed ? '#E8DDD0' : '#F0E6D8',
          }}>
          <SkinProgressIcon size={18} color="#7A8B6A" />
        </BorderlessShadowCard>
        <View className="flex-1 flex-row items-center gap-3">
          <View style={{ maxWidth: '60%' }}>
            <Text className="font-outfitMedium text-[14px] text-[#2A2118]">Track Progress</Text>
            <TextBodySmall
              style={{ fontFamily: 'Outfit-Regular', color: '#7A8B6A' }}
              // text="+2 pts this week"
              text="Check out progress over time"
            />
          </View>
          <DotWideIcon strokeColor="#2A2118" fillColor="#C9A96E" width={60} height={18} />
        </View>
        <Ionicons name="chevron-forward" size={16} color="#C8A97E" />
      </TouchableOpacity>
    </ShadowCard>
  );
};
