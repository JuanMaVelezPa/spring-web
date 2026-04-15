import { describe, expect, it } from 'vitest';
import { formatSortQuery, toggleTableSort } from './table-sort';

describe('toggleTableSort', () => {
  it('switches to asc when selecting a new column', () => {
    expect(toggleTableSort('name', 'code', 'desc')).toEqual({ column: 'name', direction: 'asc' });
  });

  it('toggles direction when same column is clicked', () => {
    expect(toggleTableSort('code', 'code', 'asc')).toEqual({ column: 'code', direction: 'desc' });
    expect(toggleTableSort('code', 'code', 'desc')).toEqual({ column: 'code', direction: 'asc' });
  });
});

describe('formatSortQuery', () => {
  it('builds API sort param', () => {
    expect(formatSortQuery('city', 'desc')).toBe('city,desc');
  });
});
