import { Pipe, PipeTransform } from '@angular/core';

/**
 * Displays a readable account label.
 * - If value is an email, shows the local part (`admin@example.com` -> `admin`).
 * - Otherwise returns the trimmed value as-is.
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
    const at = trimmed.indexOf('@');
    if (at > 0) {
      return trimmed.slice(0, at);
    }
    return trimmed;
  }
}
