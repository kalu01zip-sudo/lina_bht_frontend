// import { useState, useCallback, useEffect, useRef } from 'react';
// import { useGetAllRoutinesQuery } from '@/store/api/routineApi';

// const PAGE_SIZE = 10;

// export const useRoutines = () => {
//   const [offset, setOffset] = useState(0);
//   const loadingMoreRef = useRef(false);

//   const {
//     data: routinesData,
//     isLoading,
//     isFetching,
//     isError,
//     error,
//     refetch,
//   } = useGetAllRoutinesQuery({ limit: PAGE_SIZE, offset }, { refetchOnMountOrArgChange: true });

//   if (!isFetching) {
//     loadingMoreRef.current = false;
//   }

//   const allSteps = routinesData?.data ?? [];
//   const total = routinesData?.total ?? 0;
//   const hasMore = total > allSteps.length;

//   const handleLoadMore = useCallback(() => {
//     if (loadingMoreRef.current || isFetching || !hasMore) return;
//     loadingMoreRef.current = true;
//     setOffset((prev) => prev + PAGE_SIZE);
//   }, [isFetching, hasMore]);

//   const handleRefresh = useCallback(async () => {
//     setOffset(0);
//     await refetch();
//   }, [refetch]);

//   const resetAndRefetch = useCallback(async () => {
//     setOffset(0);
//     await refetch();
//   }, [refetch]);

//   return {
//     allSteps,
//     total,
//     hasMore,
//     isLoading,
//     isFetching,
//     isError,
//     error,
//     handleLoadMore,
//     handleRefresh,
//     resetAndRefetch,
//   };
// };

import { useState, useCallback, useRef } from 'react';
import { useGetAllRoutinesQuery, routineApi } from '@/store/api/routineApi';
import { useDispatch } from 'react-redux';

const PAGE_SIZE = 10;

export const useRoutines = () => {
  const [offset, setOffset] = useState(0);
  const loadingMoreRef = useRef(false);
  const dispatch = useDispatch();

  const {
    data: routinesData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllRoutinesQuery({ limit: PAGE_SIZE, offset }, { refetchOnMountOrArgChange: true });

  if (!isFetching) {
    loadingMoreRef.current = false;
  }

  const allSteps = routinesData?.data ?? [];
  const total = routinesData?.total ?? 0;
  const hasMore = total > allSteps.length;

  const handleLoadMore = useCallback(() => {
    if (loadingMoreRef.current || isFetching || !hasMore) return;
    loadingMoreRef.current = true;
    setOffset((prev) => prev + PAGE_SIZE);
  }, [isFetching, hasMore]);

  const handleRefresh = useCallback(async () => {
    setOffset(0);
    await refetch();
  }, [refetch]);

  const resetAndRefetch = useCallback(async () => {
    // Invalidate the entire getAllRoutines cache so merge starts fresh
    dispatch(routineApi.util.invalidateTags(['Routine']));
    setOffset(0);
  }, [dispatch]);

  return {
    allSteps,
    total,
    hasMore,
    isLoading,
    isFetching,
    isError,
    error,
    handleLoadMore,
    handleRefresh,
    resetAndRefetch,
  };
};
