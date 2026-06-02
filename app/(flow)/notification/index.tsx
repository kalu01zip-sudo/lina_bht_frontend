// // app/(flow)/notification/index.tsx
// import { ScrollView, StyleSheet, RefreshControl, Alert, View } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { TouchableOpacity, Text } from 'react-native';
// import { useRouter } from 'expo-router';
// import CustomHeader from '@/components/header/CustomHeader';
// import { LAYOUT } from '@/constants/constants';
// import { useToast } from '@/hooks/useToast';
// import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
// import { DangerBanner } from '@/components/notifications/DangerBanner';
// import { NotificationList } from '@/components/notifications/NotificationList';
// import { EmptyState } from '@/components/notifications/EmptyState';
// import { SAMPLE_NOTIFICATIONS } from '@/constants/sampleNotifications';
// import { Notification } from '@/types/notification';
// import { useScreenReady } from '@/hooks/useScreenReady';
// import LoadingScreen from '@/components/loading/LoadingScreen';
// import ErrorScreen from '@/components/errors/ErrorScreen';

// export default function NotificationScreen() {
//   const router = useRouter();
//   const { showSuccess } = useToast();
//   const [refreshing, setRefreshing] = useState(false);
//   const [showClearConfirm, setShowClearConfirm] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [dangerCount, setDangerCount] = useState(0);
//   const [isDataLoading, setIsDataLoading] = useState(true);

//   // Screen ready state for smooth transitions
//   const { isRendering, isContentReady, renderError } = useScreenReady({
//     dependencies: [],
//     delay: 100,
//     initialReady: false,
//   });

//   useEffect(() => {
//     // Simulate loading notifications from API
//     loadNotifications();
//   }, []);

//   useEffect(() => {
//     const count = notifications.filter((n) => !n.read).length;
//     const danger = notifications.filter((n) => n.type === 'danger' && !n.read).length;
//     setUnreadCount(count);
//     setDangerCount(danger);
//   }, [notifications]);

//   const loadNotifications = async () => {
//     setIsDataLoading(true);
//     try {
//       // Simulate API call delay
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       setNotifications(SAMPLE_NOTIFICATIONS);
//     } catch (error) {
//       console.error('Error loading notifications:', error);
//     } finally {
//       setIsDataLoading(false);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadNotifications();
//     setRefreshing(false);
//     showSuccess('Notifications refreshed');
//   };

//   const markAsRead = (id: string) => {
//     setNotifications((prev) =>
//       prev.map((notification) =>
//         notification.id === id ? { ...notification, read: true } : notification
//       )
//     );
//   };

//   const markAllAsRead = () => {
//     setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
//     showSuccess('All notifications marked as read');
//   };

//   const clearAllNotifications = () => {
//     setShowClearConfirm(true);
//   };

//   const confirmClearAll = () => {
//     setNotifications([]);
//     showSuccess('All notifications cleared');
//     setShowClearConfirm(false);
//   };

//   const deleteNotification = (id: string) => {
//     setNotifications((prev) => prev.filter((notification) => notification.id !== id));
//     showSuccess('Notification deleted');
//   };

//   const handleNotificationPress = (notification: Notification) => {
//     if (!notification.read) {
//       markAsRead(notification.id);
//     }

//     if (notification.type === 'danger') {
//       Alert.alert(
//         '⚠️ Health Alert',
//         notification.message,
//         [
//           { text: 'Dismiss', style: 'cancel' },
//           { text: 'View Details', onPress: () => router.push('/(flow)/health-alert') },
//         ],
//         { cancelable: true }
//       );
//       return;
//     }

//     switch (notification.type) {
//       case 'scan':
//         router.push('/(flow)/face-scan/analysis-complete');
//         break;
//       case 'routine':
//         router.push('/(flow)/face-scan/analysis-compatibility-check');
//         break;
//       case 'product':
//         router.push('/(flow)/product-scan/analysis-complete');
//         break;
//       default:
//         break;
//     }
//   };

//   const handleRetry = () => {
//     loadNotifications();
//   };

//   // Show initial render loading (useScreenReady) - wrapped in SafeAreaView
//   if (isRendering) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Preparing notifications..." />
//       </SafeAreaView>
//     );
//   }

//   // Show error if rendering failed
//   if (renderError) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <CustomHeader title="Notifications" height={50} backButton={true} />
//         <ErrorScreen message={renderError} onRetry={handleRetry} />
//       </SafeAreaView>
//     );
//   }

//   // Show data loading state
//   if (isDataLoading) {
//     return (
//       <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//         <LoadingScreen loadingText="Loading your notifications..." />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
//       <CustomHeader
//         title="Notifications"
//         height={50}
//         backButton={true}
//         rightIcon={
//           notifications.length > 0 && (
//             <TouchableOpacity onPress={markAllAsRead} className="mr-2">
//               <Text className="font-outfitMedium text-[14px]" style={{ color: '#977857' }}>
//                 Mark all read
//               </Text>
//             </TouchableOpacity>
//           )
//         }
//       />

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
//           paddingTop: 10,
//           flexGrow: 1,
//         }}
//         className="flex-1"
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#7A8B6A']} />
//         }>
//         <View
//           style={{
//             opacity: isContentReady ? 1 : 0,
//             transform: [{ translateY: isContentReady ? 0 : 10 }],
//           }}>
//           {notifications.length === 0 ? (
//             <EmptyState />
//           ) : (
//             <>
//               <DangerBanner count={dangerCount} />
//               <NotificationList
//                 notifications={notifications}
//                 unreadCount={unreadCount}
//                 onNotificationPress={handleNotificationPress}
//                 onDelete={deleteNotification}
//               />
//               {/* Clear All Button */}
//               <TouchableOpacity
//                 onPress={clearAllNotifications}
//                 className="mb-8 mt-4 items-center justify-center py-3">
//                 <Text className="font-outfitMedium text-[14px]" style={{ color: '#2E211780' }}>
//                   Clear All Notifications
//                 </Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </ScrollView>

//       {/* Confirmation Modal */}
//       <ConfirmationModal
//         visible={showClearConfirm}
//         onClose={() => setShowClearConfirm(false)}
//         onConfirm={confirmClearAll}
//         title="Clear All Notifications"
//         message="Are you sure you want to delete all notifications? This action cannot be undone."
//         confirmText="Clear All"
//         cancelText="Cancel"
//         iconName="trash-outline"
//         iconColor="#EF4444"
//         confirmButtonColor="#EF4444"
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({});

import React, { useCallback } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { Ionicons } from '@expo/vector-icons';

import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  Notification,
} from '@/store/api/notificationApi';

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getTriggerIcon = (trigger: string): { name: any; color: string } => {
  switch (trigger) {
    case 'morning_routine':
      return { name: 'sunny-outline', color: '#F59E0B' };
    case 'evening_routine':
      return { name: 'moon-outline', color: '#8B5CF6' };
    case 'post_scan_alert':
      return { name: 'scan-outline', color: '#7A8B6A' };
    case 'streak_celebration':
      return { name: 'trophy-outline', color: '#F59E0B' };
    default:
      return { name: 'notifications-outline', color: '#977857' };
  }
};

export default function NotificationScreen() {
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useGetNotificationsQuery({
    limit: 50,
    unread_only: false,
  });

  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();

  const notifications = data?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleNotificationPress = useCallback(
    async (notification: Notification) => {
      if (!notification.is_read) {
        await markRead(notification.id);
      }
    },
    [markRead]
  );

  const handleMarkAllRead = useCallback(async () => {
    await markAllRead();
  }, [markAllRead]);

  if (isLoading) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading notifications..." />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <CustomHeader title="Notifications" height={50} backButton />
        <ErrorScreen message="Failed to load notifications." onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
      <CustomHeader title="Notifications" height={50} backButton />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 16,
          flexGrow: 1,
        }}
        className="flex-1">
        {/* Header row */}
        <View className="mb-3 flex-row items-center justify-between px-container">
          {unreadCount > 0 ? (
            <Text className="font-outfitMedium text-[12px]" style={{ color: '#7A8B6A' }}>
              NEW ({unreadCount})
            </Text>
          ) : (
            <Text className="font-outfit text-[12px]" style={{ color: '#2E211799' }}>
              All caught up
            </Text>
          )}

          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead} disabled={isMarkingAll}>
              <Text className="font-outfitMedium text-[12px]" style={{ color: '#977857' }}>
                {isMarkingAll ? 'Marking...' : 'Mark all read'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Empty state */}
        {notifications.length === 0 && (
          <View className="flex-1 items-center justify-center px-container py-20">
            <Ionicons name="notifications-off-outline" size={48} color="#2E211733" />
            <Text className="mt-4 font-outfitMedium text-[16px]" style={{ color: '#2E2117' }}>
              No notifications yet
            </Text>
            <Text
              className="mt-2 text-center font-outfit text-[13px]"
              style={{ color: '#2E211799' }}>
              You&apos;ll see scan alerts, routine reminders, and tips here.
            </Text>
          </View>
        )}

        {/* Notification list */}
        <View className="px-container">
          {notifications.map((notification, index) => {
            const icon = getTriggerIcon(notification.trigger);
            const isFirst = index === 0;
            const isLast = index === notifications.length - 1;

            return (
              <TouchableOpacity
                key={notification.id}
                activeOpacity={0.75}
                onPress={() => handleNotificationPress(notification)}>
                <BorderlessShadowCard
                  b_tl={isFirst ? 24 : 0}
                  b_tr={isFirst ? 24 : 0}
                  b_bl={isLast ? 24 : 0}
                  b_br={isLast ? 24 : 0}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    marginTop: index === 0 ? 0 : 1,
                    backgroundColor: notification.is_read ? '#F0E6D8' : '#FFFBF5',
                  }}>
                  <View className="flex-row items-start gap-3">
                    {/* Icon badge */}
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: `${icon.color}1A`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 2,
                      }}>
                      <Ionicons name={icon.name} size={18} color={icon.color} />
                    </View>

                    {/* Content */}
                    <View className="flex-1">
                      <View className="flex-row items-start justify-between gap-2">
                        <Text
                          className="flex-1 font-outfitMedium text-[14px]"
                          style={{ color: '#2E2117' }}>
                          {notification.title}
                        </Text>

                        {/* Unread dot */}
                        {!notification.is_read && (
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#7A8B6A',
                              marginTop: 4,
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </View>

                      <Text
                        className="mt-1 font-outfit text-[12px]"
                        style={{ color: '#2E211799', lineHeight: 18 }}>
                        {notification.message}
                      </Text>

                      <Text className="mt-2 font-outfit text-[10px]" style={{ color: '#2E211766' }}>
                        {formatDate(notification.created_at)}
                      </Text>
                    </View>
                  </View>
                </BorderlessShadowCard>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
