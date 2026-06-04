// // hooks/useProgressData.ts
// import { useMemo } from 'react';

// import { ScanType, BeforeAfterItem } from '@/types/progress';

// import {
//   useGetFaceAnalyticsQuery,
//   useGetFaceCompareQuery,
//   useGetFaceHistoryQuery,
//   useGetScalpAnalyticsQuery,
//   useGetScalpCompareQuery,
//   useGetScalpHistoryQuery,
//   CompareResponse,
// } from '@/store/api/progressApi';

// const mapCompareToBeforeAfter = (data: CompareResponse | undefined): BeforeAfterItem[] => {
//   if (!data) return [];
//   return [data.compare_1, data.compare_2, data.compare_3].filter(Boolean).map((item, index) => ({
//     id: String(index + 1),
//     before: item!.week_1_image_url,
//     after: item!.week_1_image_url,
//     date: `${item!.between[0]} → ${item!.between[1]}`,
//     message: item!.message,
//   }));
// };

// export const useProgressData = (scanType: ScanType) => {
//   const isFace = scanType === 'face';

//   // Common query options to ensure fresh data
//   const queryOptions = {
//     refetchOnMountOrArgChange: true, // Refetch when component mounts
//     refetchOnFocus: true, // Refetch when app comes to foreground
//     refetchOnReconnect: true, // Refetch when network reconnects
//   };

//   const faceAnalytics = useGetFaceAnalyticsQuery(undefined, {
//     skip: !isFace,
//     ...queryOptions,
//   });

//   const scalpAnalytics = useGetScalpAnalyticsQuery(undefined, {
//     skip: isFace,
//     ...queryOptions,
//   });

//   const analyticsData = isFace ? faceAnalytics : scalpAnalytics;

//   const faceCompare = useGetFaceCompareQuery(undefined, {
//     skip: !isFace,
//     ...queryOptions,
//   });

//   const scalpCompare = useGetScalpCompareQuery(undefined, {
//     skip: isFace,
//     ...queryOptions,
//   });

//   const compareData = isFace ? faceCompare : scalpCompare;

//   const faceHistory = useGetFaceHistoryQuery(undefined, {
//     skip: !isFace,
//     ...queryOptions,
//   });

//   const scalpHistory = useGetScalpHistoryQuery(undefined, {
//     skip: isFace,
//     ...queryOptions,
//   });

//   const historyData = isFace ? faceHistory : scalpHistory;

//   const chartData = useMemo(() => {
//     return (analyticsData.data?.weekly_scores ?? []).map((item) => ({
//       value: item.score,
//       label: item.week,
//       dataPointText: String(item.score),
//     }));
//   }, [analyticsData.data]);

//   const beforeAfterData = useMemo(
//     () => mapCompareToBeforeAfter(compareData.data),
//     [compareData.data]
//   );

//   return {
//     isLoading: analyticsData.isLoading || compareData.isLoading || historyData.isLoading,
//     isError: analyticsData.isError || compareData.isError || historyData.isError,
//     refetch: () => {
//       analyticsData.refetch();
//       compareData.refetch();
//       historyData.refetch();
//     },
//     chartData,
//     improvement: analyticsData.data?.improvement_percentage ?? 0,
//     beforeAfterData,
//     recentScans: historyData.data?.scans ?? [],
//   };
// };

import { useMemo, useState, useCallback, useEffect, useRef } from 'react';

import { ScanType, BeforeAfterItem } from '@/types/progress';

import {
  useGetFaceAnalyticsQuery,
  useGetFaceCompareQuery,
  useGetFaceHistoryQuery,
  useGetScalpAnalyticsQuery,
  useGetScalpCompareQuery,
  useGetScalpHistoryQuery,
  CompareResponse,
  ScanHistoryItem,
} from '@/store/api/progressApi';

const DEFAULT_LIMIT = 10;

// Extracts the image URL from a CompareItem regardless of which dynamic key
// the backend used (week_1_image_url, week_7_image_url, etc.)
const extractImageUrl = (item: CompareResponse[keyof CompareResponse]): string => {
  if (!item) return '';
  const imageKey = Object.keys(item).find(
    (k) => k.endsWith('_image_url') && typeof (item as Record<string, unknown>)[k] === 'string'
  );
  return imageKey ? (item as Record<string, string>)[imageKey] : '';
};

const mapCompareToBeforeAfter = (data: CompareResponse | undefined): BeforeAfterItem[] => {
  if (!data) return [];
  return [data.compare_1, data.compare_2, data.compare_3].filter(Boolean).map((item, index) => {
    const imageUrl = extractImageUrl(item);
    return {
      id: String(index + 1),
      before: imageUrl,
      after: imageUrl,
      date: `${item!.between[0]} → ${item!.between[1]}`,
      message: item!.message,
    };
  });
};

export const useProgressData = (scanType: ScanType) => {
  const isFace = scanType === 'face';

  // ── Pagination state (separate per scan type) ──────────────────────────────
  const [faceOffset, setFaceOffset] = useState(0);
  const [scalpOffset, setScalpOffset] = useState(0);
  const [faceScans, setFaceScans] = useState<ScanHistoryItem[]>([]);
  const [scalpScans, setScalpScans] = useState<ScanHistoryItem[]>([]);
  const [faceHasMore, setFaceHasMore] = useState(true);
  const [scalpHasMore, setScalpHasMore] = useState(true);
  const [isFaceLoadingMore, setIsFaceLoadingMore] = useState(false);
  const [isScalpLoadingMore, setIsScalpLoadingMore] = useState(false);

  // Reset pagination when scan type switches
  const prevScanType = useRef(scanType);
  useEffect(() => {
    if (prevScanType.current !== scanType) {
      prevScanType.current = scanType;
      // No need to reset accumulated arrays — they are separate per type
    }
  }, [scanType]);

  const queryOptions = {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  };

  // ── Analytics ──────────────────────────────────────────────────────────────
  const faceAnalytics = useGetFaceAnalyticsQuery(undefined, {
    skip: !isFace,
    ...queryOptions,
  });
  const scalpAnalytics = useGetScalpAnalyticsQuery(undefined, {
    skip: isFace,
    ...queryOptions,
  });
  const analyticsData = isFace ? faceAnalytics : scalpAnalytics;

  // ── Compare ────────────────────────────────────────────────────────────────
  const faceCompare = useGetFaceCompareQuery(undefined, {
    skip: !isFace,
    ...queryOptions,
  });
  const scalpCompare = useGetScalpCompareQuery(undefined, {
    skip: isFace,
    ...queryOptions,
  });
  const compareData = isFace ? faceCompare : scalpCompare;

  // ── History — initial load (offset 0) ─────────────────────────────────────
  const faceHistory = useGetFaceHistoryQuery(
    { limit: DEFAULT_LIMIT, offset: 0 },
    { skip: !isFace, ...queryOptions }
  );
  const scalpHistory = useGetScalpHistoryQuery(
    { limit: DEFAULT_LIMIT, offset: 0 },
    { skip: isFace, ...queryOptions }
  );

  // Seed accumulated arrays from the initial load
  useEffect(() => {
    if (faceHistory.data?.scans && faceOffset === 0) {
      setFaceScans(faceHistory.data.scans);
      setFaceHasMore(
        faceHistory.data.scans.length === DEFAULT_LIMIT &&
          faceHistory.data.scans.length < faceHistory.data.total
      );
    }
  }, [faceHistory.data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (scalpHistory.data?.scans && scalpOffset === 0) {
      setScalpScans(scalpHistory.data.scans);
      setScalpHasMore(
        scalpHistory.data.scans.length === DEFAULT_LIMIT &&
          scalpHistory.data.scans.length < scalpHistory.data.total
      );
    }
  }, [scalpHistory.data]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── History — paginated load (lazy queries) ────────────────────────────────
  // We trigger these with skip=true until loadMore is called
  const [facePaginationOffset, setFacePaginationOffset] = useState<number | null>(null);
  const [scalpPaginationOffset, setScalpPaginationOffset] = useState<number | null>(null);

  const faceNextPage = useGetFaceHistoryQuery(
    { limit: DEFAULT_LIMIT, offset: facePaginationOffset ?? DEFAULT_LIMIT },
    { skip: facePaginationOffset === null || !isFace }
  );
  const scalpNextPage = useGetScalpHistoryQuery(
    { limit: DEFAULT_LIMIT, offset: scalpPaginationOffset ?? DEFAULT_LIMIT },
    { skip: scalpPaginationOffset === null || isFace }
  );

  // Append new page results to accumulated arrays
  useEffect(() => {
    if (faceNextPage.data?.scans && faceNextPage.isSuccess && !faceNextPage.isFetching) {
      setFaceScans((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const newScans = faceNextPage.data!.scans.filter((s) => !existingIds.has(s.id));
        return [...prev, ...newScans];
      });
      const loadedSoFar = (facePaginationOffset ?? DEFAULT_LIMIT) + faceNextPage.data.scans.length;
      setFaceHasMore(loadedSoFar < faceNextPage.data.total);
      setFaceOffset(facePaginationOffset ?? DEFAULT_LIMIT);
      setIsFaceLoadingMore(false);
    }
  }, [faceNextPage.data, faceNextPage.isSuccess, faceNextPage.isFetching]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (scalpNextPage.data?.scans && scalpNextPage.isSuccess && !scalpNextPage.isFetching) {
      setScalpScans((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const newScans = scalpNextPage.data!.scans.filter((s) => !existingIds.has(s.id));
        return [...prev, ...newScans];
      });
      const loadedSoFar =
        (scalpPaginationOffset ?? DEFAULT_LIMIT) + scalpNextPage.data.scans.length;
      setScalpHasMore(loadedSoFar < scalpNextPage.data.total);
      setScalpOffset(scalpPaginationOffset ?? DEFAULT_LIMIT);
      setIsScalpLoadingMore(false);
    }
  }, [scalpNextPage.data, scalpNextPage.isSuccess, scalpNextPage.isFetching]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── loadMore ───────────────────────────────────────────────────────────────
  const loadMore = useCallback(() => {
    if (isFace) {
      if (!faceHasMore || isFaceLoadingMore || faceHistory.isLoading) return;
      const nextOffset = faceScans.length;
      setIsFaceLoadingMore(true);
      setFacePaginationOffset(nextOffset);
    } else {
      if (!scalpHasMore || isScalpLoadingMore || scalpHistory.isLoading) return;
      const nextOffset = scalpScans.length;
      setIsScalpLoadingMore(true);
      setScalpPaginationOffset(nextOffset);
    }
  }, [
    isFace,
    faceHasMore,
    isFaceLoadingMore,
    faceScans.length,
    scalpHasMore,
    isScalpLoadingMore,
    scalpScans.length,
    faceHistory.isLoading,
    scalpHistory.isLoading,
  ]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    return (analyticsData.data?.weekly_scores ?? []).map((item) => ({
      value: item.score,
      label: item.week,
      dataPointText: String(item.score),
    }));
  }, [analyticsData.data]);

  const beforeAfterData = useMemo(
    () => mapCompareToBeforeAfter(compareData.data),
    [compareData.data]
  );

  const historyInitialLoading = isFace ? faceHistory.isLoading : scalpHistory.isLoading;
  const historyError = isFace ? faceHistory.isError : scalpHistory.isError;

  const refetch = useCallback(() => {
    // Reset pagination and re-fetch from scratch
    if (isFace) {
      setFaceOffset(0);
      setFacePaginationOffset(null);
      setFaceScans([]);
      setFaceHasMore(true);
      setIsFaceLoadingMore(false);
      faceHistory.refetch();
    } else {
      setScalpOffset(0);
      setScalpPaginationOffset(null);
      setScalpScans([]);
      setScalpHasMore(true);
      setIsScalpLoadingMore(false);
      scalpHistory.refetch();
    }
    analyticsData.refetch();
    compareData.refetch();
  }, [isFace, analyticsData, compareData, faceHistory, scalpHistory]);

  return {
    isLoading: analyticsData.isLoading || compareData.isLoading || historyInitialLoading,
    isError: analyticsData.isError || compareData.isError || historyError,
    isLoadingMore: isFace ? isFaceLoadingMore : isScalpLoadingMore,
    hasMore: isFace ? faceHasMore : scalpHasMore,
    refetch,
    loadMore,
    chartData,
    improvement: analyticsData.data?.improvement_percentage ?? 0,
    beforeAfterData,
    recentScans: isFace ? faceScans : scalpScans,
  };
};
