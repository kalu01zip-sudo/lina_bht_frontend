

// components/onboarding/OnboardingHeader.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRightIcon } from '@/components/icons';
import OBSubtitle from '@/components/texts/onboarding/OBSubtitle';

interface OnboardingHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  onSkip: () => void;
  backIconColor?: string;
  skipIconColor?: string;
}

export default function OnboardingHeader({
  showBack = false,
  onBack,
  onSkip,
  backIconColor = '#361A0D',
  skipIconColor = '#361A0D',
}: OnboardingHeaderProps) {
  return (
    <SafeAreaView edges={['top']} className="bg-transparent">
      <View className={`flex-row ${showBack ? 'justify-between' : 'justify-end'} px-6 pt-2`}>
        {showBack && (
          <TouchableOpacity onPress={onBack} className="flex-row items-center gap-2">
            <ArrowRightIcon color={backIconColor} style={{ transform: [{ rotate: '180deg' }] }} />
            <OBSubtitle text={'Back'} />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={onSkip} className="flex-row items-center gap-2">
          <OBSubtitle text={'Skip'} />
          <ArrowRightIcon color={skipIconColor} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
