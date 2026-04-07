// components/notifications/NotificationItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { DangerIcon } from '@/components/icons';
import { Notification, getIconName, getIconColor, getSeverityColor } from '@/types/notification';

interface NotificationItemProps {
  notification: Notification;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onPress: (notification: Notification) => void;
  onDelete: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  index,
  isFirst,
  isLast,
  onPress,
  onDelete,
}) => {
  return (
    <TouchableOpacity onPress={() => onPress(notification)} activeOpacity={0.7}>
      <BorderlessShadowCard
        b_tl={isFirst ? 24 : 0}
        b_tr={isFirst ? 24 : 0}
        b_bl={isLast ? 24 : 0}
        b_br={isLast ? 24 : 0}
        style={{
          paddingVertical: 16,
          paddingHorizontal: 16,
          marginTop: index === 0 ? 0 : 1,
          backgroundColor: notification.read ? '#F0E6D8' : '#FEF9E8',
          marginBottom: 12,
          borderLeftWidth: notification.type === 'danger' ? 4 : 0,
          borderLeftColor:
            notification.type === 'danger'
              ? getSeverityColor(notification.severity)
              : 'transparent',
        }}>
        <View className="flex-row items-start gap-3">
          {/* Icon */}
          {notification.type === 'danger' ? (
            <DangerIcon size={20} color={getIconColor(notification.type)} />
          ) : (
            <Ionicons
              name={getIconName(notification.type)}
              size={20}
              color={getIconColor(notification.type)}
            />
          )}

          {/* Content */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text
                className={`flex-1 font-outfitMedium text-[16px] ${
                  notification.read ? 'text-[#2E2117]' : 'text-[#2E2117]'
                }`}>
                {notification.title}
              </Text>
            </View>

            <Text className="mt-[6px] font-outfit text-[12px]" style={{ color: '#2E211766' }}>
              {notification.message}
            </Text>

            <Text className="mt-[6px] font-outfit text-[10px]" style={{ color: '#2E211766' }}>
              {notification.time}
            </Text>
          </View>

          {/* Delete Button */}
          <TouchableOpacity onPress={() => onDelete(notification.id)} className="p-1">
            <Ionicons name="close" size={16} color="#2E211766" />
          </TouchableOpacity>
        </View>
      </BorderlessShadowCard>
    </TouchableOpacity>
  );
};
