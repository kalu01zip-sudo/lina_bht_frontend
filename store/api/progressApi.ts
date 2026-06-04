// import { baseApi } from './baseApi';
// import { FaceScanResponse, HairScanResponse } from './scanApi';

// export interface WeeklyScore {
//   week: string;
//   score: number;
// }

// export interface AnalyticsResponse {
//   improvement_percentage: number;
//   weekly_scores: WeeklyScore[];
// }

// export interface ScanHistoryItem {
//   id: string;
//   overall_score: number;
//   images: string[];
//   created_at: string;
// }

// export interface ScanHistoryResponse {
//   total: number;
//   scans: ScanHistoryItem[];
// }

// export interface CompareItem {
//   between: [string, string];
//   week_1_image_url: string;
//   message: string;
// }

// export interface CompareResponse {
//   compare_1?: CompareItem;
//   compare_2?: CompareItem;
//   compare_3?: CompareItem;
// }

// // ── Face detail response (GET /scan/:id) ──────────────────────────────────────
// // The API returns scan_id at root but FaceScanResponse uses scan_id too — however
// // the history detail also returns `images[]` at root which FaceScanResponse doesn't
// // have. We extend it here.
// export interface FaceScanDetailResponse extends FaceScanResponse {
//   images: string[];
// }

// // ── Hair detail response (GET /scan/scalp/:id) ────────────────────────────────
// export interface HairScanDetailResponse extends HairScanResponse {
//   images: string[];
// }

// export const progressApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // ── Face ────────────────────────────────────────────────────────────────
//     getFaceAnalytics: builder.query<AnalyticsResponse, void>({
//       query: () => '/scan/analytics',
//       providesTags: [{ type: 'Scan', id: 'FACE_ANALYTICS' }],
//     }),
//     getFaceCompare: builder.query<CompareResponse, void>({
//       query: () => '/scan/compare/random',
//       providesTags: [{ type: 'Scan', id: 'FACE_COMPARE' }],
//     }),
//     getFaceHistory: builder.query<ScanHistoryResponse, void>({
//       query: () => '/scan/history',
//       providesTags: [{ type: 'Scan', id: 'FACE_HISTORY' }],
//     }),
//     getFaceScanById: builder.query<FaceScanDetailResponse, string>({
//       query: (id) => `/scan/${id}`,
//       providesTags: (_, __, id) => [{ type: 'Scan', id: `FACE_DETAIL_${id}` }],
//     }),

//     // ── Hair & Scalp ────────────────────────────────────────────────────────
//     getScalpAnalytics: builder.query<AnalyticsResponse, void>({
//       query: () => '/scan/scalp/analytics',
//       providesTags: [{ type: 'Scan', id: 'SCALP_ANALYTICS' }],
//     }),
//     getScalpCompare: builder.query<CompareResponse, void>({
//       query: () => '/scan/scalp/compare/random',
//       providesTags: [{ type: 'Scan', id: 'SCALP_COMPARE' }],
//     }),
//     getScalpHistory: builder.query<ScanHistoryResponse, void>({
//       query: () => '/scan/scalp/history',
//       providesTags: [{ type: 'Scan', id: 'SCALP_HISTORY' }],
//     }),
//     getScalpScanById: builder.query<HairScanDetailResponse, string>({
//       query: (id) => `/scan/scalp/${id}`,
//       providesTags: (_, __, id) => [{ type: 'Scan', id: `SCALP_DETAIL_${id}` }],
//     }),
//   }),
//   overrideExisting: false,
// });

// export const {
//   useGetFaceAnalyticsQuery,
//   useGetFaceCompareQuery,
//   useGetFaceHistoryQuery,
//   useGetFaceScanByIdQuery,
//   useGetScalpAnalyticsQuery,
//   useGetScalpCompareQuery,
//   useGetScalpHistoryQuery,
//   useGetScalpScanByIdQuery,
// } = progressApi;

import { baseApi } from './baseApi';
import { FaceScanResponse, HairScanResponse } from './scanApi';

export interface WeeklyScore {
  week: string;
  score: number;
}

export interface AnalyticsResponse {
  improvement_percentage: number;
  weekly_scores: WeeklyScore[];
}

export interface ScanHistoryItem {
  id: string;
  overall_score: number;
  images: string[];
  created_at: string;
}

export interface ScanHistoryResponse {
  total: number;
  limit: number;
  offset: number;
  scans: ScanHistoryItem[];
}

export interface ScanHistoryParams {
  limit?: number;
  offset?: number;
}

export interface CompareItem {
  between: [string, string];
  // The backend uses dynamic keys like week_1_image_url, week_7_image_url, etc.
  // We capture any string-keyed string values to handle this inconsistency.
  [key: string]: string | [string, string];
  message: string;
}

export interface CompareResponse {
  compare_1?: CompareItem;
  compare_2?: CompareItem;
  compare_3?: CompareItem;
}

export interface FaceScanDetailResponse extends FaceScanResponse {
  images: string[];
}

export interface HairScanDetailResponse extends HairScanResponse {
  images: string[];
}

export const progressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Face ────────────────────────────────────────────────────────────────
    getFaceAnalytics: builder.query<AnalyticsResponse, void>({
      query: () => '/scan/analytics',
      providesTags: [{ type: 'Scan', id: 'FACE_ANALYTICS' }],
    }),
    getFaceCompare: builder.query<CompareResponse, void>({
      query: () => '/scan/compare/random',
      providesTags: [{ type: 'Scan', id: 'FACE_COMPARE' }],
    }),
    getFaceHistory: builder.query<ScanHistoryResponse, ScanHistoryParams>({
      query: ({ limit = 10, offset = 0 } = {}) => ({
        url: '/scan/history',
        params: { limit, offset },
      }),
      // Each unique {limit, offset} pair gets its own cache entry
      providesTags: (_, __, { offset = 0 }) => [{ type: 'Scan', id: `FACE_HISTORY_${offset}` }],
    }),
    getFaceScanById: builder.query<FaceScanDetailResponse, string>({
      query: (id) => `/scan/${id}`,
      providesTags: (_, __, id) => [{ type: 'Scan', id: `FACE_DETAIL_${id}` }],
    }),

    // ── Hair & Scalp ────────────────────────────────────────────────────────
    getScalpAnalytics: builder.query<AnalyticsResponse, void>({
      query: () => '/scan/scalp/analytics',
      providesTags: [{ type: 'Scan', id: 'SCALP_ANALYTICS' }],
    }),
    getScalpCompare: builder.query<CompareResponse, void>({
      query: () => '/scan/scalp/compare/random',
      providesTags: [{ type: 'Scan', id: 'SCALP_COMPARE' }],
    }),
    getScalpHistory: builder.query<ScanHistoryResponse, ScanHistoryParams>({
      query: ({ limit = 10, offset = 0 } = {}) => ({
        url: '/scan/scalp/history',
        params: { limit, offset },
      }),
      providesTags: (_, __, { offset = 0 }) => [{ type: 'Scan', id: `SCALP_HISTORY_${offset}` }],
    }),
    getScalpScanById: builder.query<HairScanDetailResponse, string>({
      query: (id) => `/scan/scalp/${id}`,
      providesTags: (_, __, id) => [{ type: 'Scan', id: `SCALP_DETAIL_${id}` }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFaceAnalyticsQuery,
  useGetFaceCompareQuery,
  useGetFaceHistoryQuery,
  useGetFaceScanByIdQuery,
  useGetScalpAnalyticsQuery,
  useGetScalpCompareQuery,
  useGetScalpHistoryQuery,
  useGetScalpScanByIdQuery,
} = progressApi;
