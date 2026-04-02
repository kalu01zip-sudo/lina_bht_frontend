// components/dev/FloatingDevButton.tsx
import React from 'react';
import { TouchableOpacity, Text, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface FloatingDevButtonProps {
  onPress: () => void;
}

export const FloatingDevButton: React.FC<FloatingDevButtonProps> = ({ onPress }) => {
  if (!__DEV__) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 120 : 100,
        right: 20,
        zIndex: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
      }}>
      <LinearGradient
        // colors={['#FF6B35', '#FF8C42']}
        colors={['#FF6B35', '#FF8C42']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: 'rgba(255,255,255,0.3)',
        }}>
        <Ionicons name="construct" size={28} color="#FFFFFF" />
      </LinearGradient>
    </TouchableOpacity>
  );
};
