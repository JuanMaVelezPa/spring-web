import type { QueryClient } from '@tanstack/angular-query-experimental';

export const adminQueryKeys = {
  all: ['admin'] as const,
  users: () => [...adminQueryKeys.all, 'users'] as const,
  userList: (page: number, size: number, sort: string) =>
    [...adminQueryKeys.users(), 'list', page, size, sort] as const,
  roles: () => [...adminQueryKeys.all, 'roles'] as const,
} as const;

export function invalidateAdminUsers(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() });
}

export function invalidateAdminRoles(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: adminQueryKeys.roles() });
}
