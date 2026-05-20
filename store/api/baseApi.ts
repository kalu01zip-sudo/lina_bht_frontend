// store/api/baseApi.ts
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearCredentials, setCredentials } from '../slices/authSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
  prepareHeaders: async (headers) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Wraps rawBaseQuery with automatic token refresh on 401
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Try to refresh
    const refreshToken = await AsyncStorage.getItem('refresh_token');

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { access_token, refresh_token, user } = refreshResult.data as any;

        await AsyncStorage.setItem('access_token', access_token);
        await AsyncStorage.setItem('refresh_token', refresh_token);

        api.dispatch(
          setCredentials({ user, accessToken: access_token, refreshToken: refresh_token })
        );

        // Retry original request with new token
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // Refresh failed — force logout
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
        api.dispatch(clearCredentials());
      }
    } else {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

// Single base API — all feature slices inject into this
export const baseApi = createApi({
  // refetchOnMountOrArgChange: true,  // ✅ applies to all queries
  // refetchOnFocus: true,
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth', 'CyclePhase', 'Stress', 'Scan', 'Routine'],
  endpoints: () => ({}), // endpoints live in feature files via injectEndpoints
});
