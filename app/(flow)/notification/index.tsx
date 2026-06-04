import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/header/CustomHeader';
import { LAYOUT } from '@/constants/constants';
import LoadingScreen from '@/components/loading/LoadingScreen';
import ErrorScreen from '@/components/errors/ErrorScreen';
import BorderlessShadowCard from '@/components/cards/BorderlessShadowCard';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation, // Add this
  Notification,
} from '@/store/api/notificationApi';

const DEFAULT_LIMIT = 10;

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
    case 'inactivity_nudge':
      return { name: 'time-outline', color: '#977857' };
    default:
      return { name: 'notifications-outline', color: '#977857' };
  }
};

export default function NotificationScreen() {
  // ── Pagination state ───────────────────────────────────────────────────────
  const [offset, setOffset] = useState(0);
  const [accumulated, setAccumulated] = useState<Notification[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [paginationOffset, setPaginationOffset] = useState<number | null>(null);

  // ── Mark-all tracking ──────────────────────────────────────────────────────
  const markAllFiredRef = useRef(false);
  const [optimisticReadAll, setOptimisticReadAll] = useState(false);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  // ── Initial query ──────────────────────────────────────────────────────────
  const { data, isLoading, isError, refetch } = useGetNotificationsQuery(
    { limit: DEFAULT_LIMIT, unread_only: false },
    { refetchOnMountOrArgChange: true }
  );

  // ── Paginated query ────────────────────────────────────────────────────────
  const nextPageQuery = useGetNotificationsQuery(
    { limit: DEFAULT_LIMIT, unread_only: false },
    { skip: paginationOffset === null }
  );

  // ── Seed initial page ──────────────────────────────────────────────────────
  useEffect(() => {
    if (data?.notifications) {
      setAccumulated(data.notifications);
      setOffset(0);
      setPaginationOffset(null);
      setHasMore(
        data.notifications.length === DEFAULT_LIMIT && data.notifications.length < data.count
      );
    }
  }, [data]);

  // ── Append next pages ──────────────────────────────────────────────────────
  useEffect(() => {
    if (nextPageQuery.data?.notifications && nextPageQuery.isSuccess && !nextPageQuery.isFetching) {
      setAccumulated((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const fresh = nextPageQuery.data!.notifications.filter((n) => !existingIds.has(n.id));
        return [...prev, ...fresh];
      });
      const loadedSoFar =
        (paginationOffset ?? DEFAULT_LIMIT) + nextPageQuery.data.notifications.length;
      setHasMore(loadedSoFar < nextPageQuery.data.count);
      setOffset(paginationOffset ?? DEFAULT_LIMIT);
      setIsLoadingMore(false);
    }
  }, [nextPageQuery.data, nextPageQuery.isSuccess, nextPageQuery.isFetching]);

  // ── Handle individual notification press ───────────────────────────────────
  const handleNotificationPress = async (notification: Notification) => {
    // If already read, just return (or you could navigate somewhere)
    if (notification.is_read) return;

    // Optimistic update
    setAccumulated((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
    );

    try {
      await markNotificationRead(notification.id).unwrap();
      console.log('[Notifications] Marked as read:', notification.id);
    } catch (error) {
      console.error('[Notifications] Failed to mark as read:', error);
      // Revert on error
      setAccumulated((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: false } : n))
      );
    }
  };

  // ── Mark all read ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (markAllFiredRef.current) return;
    if (accumulated.length === 0) return;
    if (isLoading) return;

    const hasUnread = accumulated.some((n) => !n.is_read);
    if (!hasUnread) return;

    markAllFiredRef.current = true;
    setOptimisticReadAll(true);

    markAllRead()
      .unwrap()
      .then((res) => {
        console.log('[Notifications] markAllRead success:', res.marked_read, 'marked');
        // Update all notifications to read in accumulated state
        setAccumulated((prev) => prev.map((n) => ({ ...n, is_read: true })));
      })
      .catch((err) => {
        console.warn('[Notifications] markAllRead failed:', err);
        setOptimisticReadAll(false);
        markAllFiredRef.current = false;
      });
  }, [accumulated, isLoading]);

  // ── Reset on screen focus ──────────────────────────────────────────────────
  useFocusEffect(
    React.useCallback(() => {
      markAllFiredRef.current = false;
      setOptimisticReadAll(false);
      refetch();
    }, [refetch])
  );

  // ── Load more ──────────────────────────────────────────────────────────────
  const loadMore = () => {
    if (!hasMore || isLoadingMore || isLoading) return;
    setIsLoadingMore(true);
    setPaginationOffset(accumulated.length);
  };

  // ── Scroll handler ─────────────────────────────────────────────────────────
  const handleScroll = (e: any) => {
    if (!hasMore || isLoadingMore) return;
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const scrolled = (contentOffset.y + layoutMeasurement.height) / contentSize.height;
    if (scrolled >= 0.85) loadMore();
  };

  // ── Display list ───────────────────────────────────────────────────────────
  const displayNotifications = optimisticReadAll
    ? accumulated.map((n) => ({ ...n, is_read: true }))
    : accumulated;

  // ── Render ─────────────────────────────────────────────────────────────────
  if (isLoading && accumulated.length === 0) {
    return (
      <SafeAreaView edges={['top', 'right']} className="flex-1 bg-backgroundColor">
        <LoadingScreen loadingText="Loading notifications..." />
      </SafeAreaView>
    );
  }

  if (isError && accumulated.length === 0) {
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
        onScroll={handleScroll}
        scrollEventThrottle={200}
        contentContainerStyle={{
          paddingBottom: LAYOUT.screen.scrollViewPaddingBottom,
          paddingTop: 16,
          flexGrow: 1,
        }}
        className="flex-1">
        {/* Counter row */}
        <View className="mb-3 flex-row items-center justify-between px-container">
          <Text className="font-outfit text-[12px]" style={{ color: '#2E211799' }}>
            {displayNotifications.length > 0
              ? `${displayNotifications.length} notification${displayNotifications.length !== 1 ? 's' : ''}`
              : 'All caught up'}
          </Text>
        </View>

        {/* Empty state */}
        {displayNotifications.length === 0 && !isLoading && (
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
          {displayNotifications.map((notification, index) => {
            const icon = getTriggerIcon(notification.trigger);
            const isFirst = index === 0;
            const isLast = index === displayNotifications.length - 1 && !hasMore;

            return (
              <TouchableOpacity
                key={notification.id}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.7}>
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
                    {/* Icon */}
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

          {/* Load more spinner */}
          {isLoadingMore && (
            <View className="items-center py-4">
              <ActivityIndicator size="small" color="#7A8B6A" />
            </View>
          )}

          {/* End of list */}
          {!hasMore && displayNotifications.length > 0 && (
            <Text
              className="mt-3 text-center font-outfit text-[11px]"
              style={{ color: '#2E211750' }}>
              You&apos;re all caught up
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
