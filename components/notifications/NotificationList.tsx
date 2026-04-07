// components/notifications/NotificationList.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Notification } from '@/types/notification';
import { NotificationItem } from './NotificationItem';

interface NotificationListProps {
  notifications: Notification[];
  unreadCount: number;
  onNotificationPress: (notification: Notification) => void;
  onDelete: (id: string) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  unreadCount,
  onNotificationPress,
  onDelete,
}) => {
  return (
    <View className="px-container">
      {/* Unread Section Header */}
      {unreadCount > 0 && (
        <View className="mb-2 mt-2">
          <Text className="font-outfitMedium text-[12px]" style={{ color: '#7A8B6A' }}>
            NEW ({unreadCount})
          </Text>
        </View>
      )}

      {/* Notifications List */}
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          index={index}
          isFirst={index === 0}
          isLast={index === notifications.length - 1}
          onPress={onNotificationPress}
          onDelete={onDelete}
        />
      ))}
    </View>
  );
};
