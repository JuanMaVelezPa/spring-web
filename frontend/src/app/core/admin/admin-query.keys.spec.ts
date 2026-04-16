import { describe, expect, it } from 'vitest';
import { adminQueryKeys } from './admin-query.keys';

describe('adminQueryKeys', () => {
  it('builds user list key with paging and sorting', () => {
    expect(adminQueryKeys.userList(2, 10, 'email,asc')).toEqual([
      'admin',
      'users',
      'list',
      2,
      10,
      'email,asc',
    ]);
  });

  it('exposes stable roles key', () => {
    expect(adminQueryKeys.roles()).toEqual(['admin', 'roles']);
  });
});
