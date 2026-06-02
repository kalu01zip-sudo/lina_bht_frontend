import { baseApi } from './baseApi';

export interface Notification {
  id: string;
  user_id: string;
  trigger: string;
  title: string;
  message: string;
  data: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  success: boolean;
  count: number;
  notifications: Notification[];
}

export interface UnreadCountResponse {
  success: boolean;
  unread_count: number;
}

export interface MarkReadResponse {
  success: boolean;
  notification_id: string;
}

export interface MarkAllReadResponse {
  success: boolean;
  marked_read: number;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationsResponse,
      { limit?: number; unread_only?: boolean }
    >({
      query: ({ limit = 20, unread_only = false } = {}) =>
        `/lia/notifications?limit=${limit}&unread_only=${unread_only}`,
      providesTags: [{ type: 'User', id: 'NOTIFICATIONS' }],
    }),

    getUnreadCount: builder.query<UnreadCountResponse, void>({
      query: () => '/lia/notifications/unread-count',
      providesTags: [{ type: 'User', id: 'UNREAD_COUNT' }],
    }),

    markNotificationRead: builder.mutation<MarkReadResponse, string>({
      query: (id) => ({
        url: `/lia/notifications/${id}/read`,
        method: 'POST',
      }),
      invalidatesTags: [
        { type: 'User', id: 'NOTIFICATIONS' },
        { type: 'User', id: 'UNREAD_COUNT' },
      ],
    }),

    markAllNotificationsRead: builder.mutation<MarkAllReadResponse, void>({
      query: () => ({
        url: '/lia/notifications/read-all',
        method: 'POST',
      }),
      invalidatesTags: [
        { type: 'User', id: 'NOTIFICATIONS' },
        { type: 'User', id: 'UNREAD_COUNT' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApi;
