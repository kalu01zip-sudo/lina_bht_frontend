// components/routines/AnalysisActionButtons.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface AnalysisActionButtonsProps {
  style?: StyleProp<ViewStyle>;
}

/**
 * A horizontal row of two action buttons shown at the bottom of all
 * analysis-complete screens:
 *   Left:  "Check Routine"  → navigates to the routine check screen
 *   Right: "Ask Gixy AI"   → navigates to the AI assistant chat screen
 *
 * Button anatomy (left button):
 *   [icon]  label  [chevron-right]
 *
 * Button anatomy (right button):
 *   [icon]  label  [chevron-right]
 */
export const AnalysisActionButtons: React.FC<AnalysisActionButtonsProps> = ({ style }) => {
  const router = useRouter();

  const handleCheckRoutine = () => {
    router.push('/(flow)/routines/routine-check');
  };

  const handleAskGixy = () => {
    router.push('/(flow)/ai-assistant');
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          gap: 10,
          marginTop: 16,
        },
        style,
      ]}>
      {/* ── Check Routine ────────────────────────────────────────────────── */}
      <TouchableOpacity
        onPress={handleCheckRoutine}
        activeOpacity={0.75}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          backgroundColor: '#361A0D',
          borderRadius: 16,
          paddingVertical: 14,
          paddingHorizontal: 14,
          // subtle top highlight
          borderTopWidth: 1,
          borderTopColor: '#FFFFFF22',
        }}>
        {/* Leading icon */}
        <Ionicons name="shield-checkmark-outline" size={18} color="#FFFFFF" />

        {/* Label */}
        <Text
          style={{
            flex: 1,
            fontFamily: 'Outfit-Medium',
            fontSize: 13,
            color: '#FFFFFF',
            lineHeight: 18,
          }}
          numberOfLines={1}>
          {/* Check Routine */}
          Scan Routine
        </Text>

        {/* Trailing chevron */}
        <Ionicons name="chevron-forward" size={14} color="#FFFFFF88" />
      </TouchableOpacity>

      {/* ── Ask Gixy AI ──────────────────────────────────────────────────── */}
      <TouchableOpacity
        onPress={handleAskGixy}
        activeOpacity={0.75}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          backgroundColor: '#7A8B6A',
          borderRadius: 16,
          paddingVertical: 14,
          paddingHorizontal: 14,
          borderTopWidth: 1,
          borderTopColor: '#FFFFFF22',
        }}>
        {/* Leading icon */}
        <Ionicons name="sparkles-outline" size={18} color="#FFFFFF" />

        {/* Label */}
        <Text
          style={{
            flex: 1,
            fontFamily: 'Outfit-Medium',
            fontSize: 13,
            color: '#FFFFFF',
            lineHeight: 18,
          }}
          numberOfLines={1}>
          Ask Gixy AI
        </Text>

        {/* Trailing chevron */}
        <Ionicons name="chevron-forward" size={14} color="#FFFFFF88" />
      </TouchableOpacity>
    </View>
  );
};
