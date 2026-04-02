import React from 'react';
import { View, Text } from 'react-native';
import { NotificationIcon as BellSvg } from '@/components/icons';

type NotificationBellIconWithBgProps = {
  size?: number;
  iconSize?: number;
  color?: string;
  badgeCount?: number;
};

const NotificationBellIconWithBg: React.FC<NotificationBellIconWithBgProps> = ({
  size = 50,
  iconSize = 20,
  color = '#000000',
  badgeCount,
}) => {
  const showBadge = typeof badgeCount === 'number' && badgeCount > 0;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 100,

        alignItems: 'center',
        justifyContent: 'center',

        // 🎨 Background (same as your reference)
        backgroundColor: '#D9C9B9',

        // 🧊 Soft border lighting effect
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderTopColor: '#FFFFFF99',
        borderLeftColor: '#FFFFFF99',
        borderBottomColor: '#FFFFFF62',
        borderRightColor: '#FFFFFF62',

        // 🌑 Shadow (static, no focused state)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,

        position: 'relative',
      }}>
      {/* 🔔 Icon */}
      <BellSvg size={iconSize} color={color} />

      {/* 🔴 Badge */}
      {showBadge && (
        <View
          style={{
            position: 'absolute',
            top: -4,
            right: -2,
            minWidth: 16,
            height: 16,
            paddingHorizontal: 4,
            borderRadius: 100,
            backgroundColor: '#EF4444',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 9,
              fontWeight: '700',
            }}>
            {badgeCount! > 99 ? '99+' : badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
};

export default NotificationBellIconWithBg;
