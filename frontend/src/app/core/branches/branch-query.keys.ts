import type { QueryClient } from '@tanstack/angular-query-experimental';

/**
 * TanStack Query keys for branches. Every part of the response identity must appear in the key
 * (page, size, sort for lists; id for detail).
 */
export const branchQueryKeys = {
  all: ['branches'] as const,
  lists: () => [...branchQueryKeys.all, 'list'] as const,
  list: (page: number, size: number, sort: string) =>
    [...branchQueryKeys.lists(), page, size, sort] as const,
  details: () => [...branchQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...branchQueryKeys.details(), id] as const,
} as const;

/** After create/update/delete, list pages must drop stale slices. */
export function invalidateBranchListQueries(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: branchQueryKeys.lists() });
}

export function invalidateBranchDetailQuery(queryClient: QueryClient, id: string): void {
  void queryClient.invalidateQueries({ queryKey: branchQueryKeys.detail(id) });
}
