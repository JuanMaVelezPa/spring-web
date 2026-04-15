import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a login or display name as camelCase segments (e.g. `john_doe` → `johnDoe`).
 */
@Pipe({
  name: 'displayUsername',
  standalone: true,
})
export class DisplayUsernamePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (value == null) {
      return '';
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return '';
    }
    const parts = trimmed.split(/[\s._-]+/).filter(Boolean);
    if (parts.length === 0) {
      return '';
    }
    const first = parts[0]!.toLowerCase();
    const rest = parts.slice(1).map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
    return [first, ...rest].join('');
  }
}
