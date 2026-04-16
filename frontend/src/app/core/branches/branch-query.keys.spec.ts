import { describe, expect, it } from 'vitest';
import { branchQueryKeys } from './branch-query.keys';

describe('branchQueryKeys', () => {
  it('list key includes pagination and sort', () => {
    expect(branchQueryKeys.list(1, 25, 'name,desc')).toEqual([
      'branches',
      'list',
      1,
      25,
      'name,desc',
    ]);
  });

  it('detail key is stable per id', () => {
    expect(branchQueryKeys.detail('abc')).toEqual(['branches', 'detail', 'abc']);
  });

  it('uses distinct keys for list vs detail', () => {
    expect(branchQueryKeys.list(0, 10, 'code,asc')[1]).toBe('list');
    expect(branchQueryKeys.detail('x')[1]).toBe('detail');
  });
});
