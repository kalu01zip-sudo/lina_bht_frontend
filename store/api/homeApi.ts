// store/api/homeApi.ts
import { baseApi } from './baseApi';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface HomeScanCheckedArea {
  [key: string]: number;
}

export interface HomeScanAnalysis {
  overall_score: number;
  checked_area: HomeScanCheckedArea;
}

// store/api/homeApi.ts
export interface HomeRoutineItem {
  id: string;
  time: 'morning' | 'night' | 'weekly';
  product_name: string | null;
  product_category?: string;
}

export interface HomeScansResponse {
  face_scan: {
    analysis: HomeScanAnalysis;
  } | null;
  scalp_scan: {
    analysis: HomeScanAnalysis;
  } | null;
  routine: {
    count: number;
    completed: number;
    data: HomeRoutineItem[];
  };
}

// ── API slice ─────────────────────────────────────────────────────────────────

export const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /homepage/scans
     * Returns face scan, scalp scan scores, and routine summary.
     */
    getHomeScans: builder.query<HomeScansResponse, void>({
      query: () => ({
        url: '/homepage/scans',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetHomeScansQuery } = homeApi;
