// import { baseApi } from './baseApi';

// export interface SubscriptionStatus {
//   success: boolean;
//   plan: 'free' | 'premium' | 'trial';
//   plan_type: 'monthly' | 'yearly' | null;
//   status: 'active' | 'inactive' | 'cancelled' | 'expired';
//   is_trial: boolean;
//   expires_at: string | null;
//   days_remaining: number | null;
//   will_renew: boolean;
//   cancel_at_period_end: boolean;
//   plan_info: Record<string, any> | null;
// }

// export interface WebhookSyncRequest {
//   platform: 'ios' | 'android';
//   product_id: string;
//   transaction_id: string;
//   original_transaction_id?: string;
//   purchase_token?: string; // Android only
//   plan_type: 'monthly' | 'yearly';
// }

// export interface WebhookSyncResponse {
//   success: boolean;
// }

// export const subscriptionApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getSubscriptionStatus: builder.query<SubscriptionStatus, void>({
//       query: () => '/subscription/status',
//       providesTags: [{ type: 'User', id: 'SUBSCRIPTION' }],
//     }),

//     // Called after a successful RevenueCat purchase to sync to your backend
//     syncSubscription: builder.mutation<WebhookSyncResponse, WebhookSyncRequest>({
//       query: (body) => ({
//         url: '/subscription/webhook',
//         method: 'POST',
//         headers: {
//           // Authorization: 'whk_01H5V6Q9JZ2V8R7N4T1K8P2M9L6S3X4',
//           Authorization:
//             process.env.EXPO_PUBLIC_REVENUECAT_WEBHOOK_KEY ?? 'whk_01H5V6Q9JZ2V8R7N4T1K8P2M9L6S3X4',
//         },
//         body,
//       }),
//       invalidatesTags: [{ type: 'User', id: 'SUBSCRIPTION' }],
//     }),
//   }),
//   overrideExisting: false,
// });

// export const { useGetSubscriptionStatusQuery, useSyncSubscriptionMutation } = subscriptionApi;

import { baseApi } from './baseApi';

export interface SubscriptionStatus {
  success: boolean;
  plan: 'free' | 'premium' | 'trial';
  plan_type: 'monthly' | 'yearly' | null;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  is_trial: boolean;
  expires_at: string | null;
  days_remaining: number | null;
  will_renew: boolean;
  cancel_at_period_end: boolean;
  plan_info: Record<string, any> | null;
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Poll this after purchase to confirm backend has updated
    getSubscriptionStatus: builder.query<SubscriptionStatus, void>({
      query: () => '/subscription/status',
      providesTags: [{ type: 'Subscription', id: 'STATUS' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSubscriptionStatusQuery } = subscriptionApi;
