/** Shared table header sort toggle (server-driven sort). */

export type SortDirection = 'asc' | 'desc';

export function toggleTableSort(
  clickedColumn: string,
  currentColumn: string,
  currentDir: SortDirection,
): { column: string; direction: SortDirection } {
  if (clickedColumn !== currentColumn) {
    return { column: clickedColumn, direction: 'asc' };
  }
  return {
    column: clickedColumn,
    direction: currentDir === 'asc' ? 'desc' : 'asc',
  };
}

export function formatSortQuery(column: string, direction: SortDirection): string {
  return `${column},${direction}`;
}
