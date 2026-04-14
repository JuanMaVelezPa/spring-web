import { Component, inject } from '@angular/core';
import { UserPreferencesService } from '../../../core/preferences/user-preferences.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      type="button"
      class="btn btn-ghost btn-sm gap-2"
      (click)="prefs.toggleTheme()"
      [attr.aria-label]="prefs.themeSwitchLabel()"
    >
      <span class="text-lg leading-none" aria-hidden="true">{{ themeIcon() }}</span>
      <span class="hidden sm:inline">{{ prefs.themeSwitchLabel() }}</span>
    </button>
  `,
})
export class ThemeToggleComponent {
  protected readonly prefs = inject(UserPreferencesService);

  /** Sun when dark (switch to light), moon when light — Unicode escapes avoid template encoding issues. */
  protected themeIcon(): string {
    return this.prefs.isDark() ? '\u2600' : '\u263E';
  }
}
