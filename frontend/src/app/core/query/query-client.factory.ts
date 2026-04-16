import { QueryClient } from '@tanstack/angular-query-experimental';

/** Fresh window for branch (and future) list/detail GETs — stale-while-revalidate after this. */
export const DEFAULT_QUERY_STALE_TIME_MS = 5 * 60 * 1000;

export const DEFAULT_QUERY_GC_TIME_MS = 30 * 60 * 1000;

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_QUERY_STALE_TIME_MS,
        gcTime: DEFAULT_QUERY_GC_TIME_MS,
        refetchOnWindowFocus: true,
        retry: 1,
      },
    },
  });
}
