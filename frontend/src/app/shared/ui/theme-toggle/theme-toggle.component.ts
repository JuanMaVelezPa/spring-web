import { Component, inject } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';
import { UserPreferencesService } from '../../../core/preferences/user-preferences.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
})
export class ThemeToggleComponent {
  protected readonly prefs = inject(UserPreferencesService);
  private readonly i18n = inject(I18nService);

  /** Sun when dark (switch to light), moon when light — Unicode escapes avoid template encoding issues. */
  protected themeIcon(): string {
    return this.prefs.isDark() ? '\u2600' : '\u263E';
  }

  protected themeLabel(): string {
    return this.prefs.isDark()
      ? this.i18n.t('themeToLight')
      : this.i18n.t('themeToDark');
  }
}
