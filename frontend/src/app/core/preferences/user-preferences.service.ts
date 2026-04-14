import { Injectable, computed, inject, signal } from '@angular/core';
import { LocalPreferenceStore } from './local-preference-store';
import type { LocaleCode, ThemeMode } from './preference-keys';

/**
 * App-wide user preferences (theme, locale, …). Persists to localStorage via {@link LocalPreferenceStore}.
 *
 * Theme rules:
 * - If a value exists in storage, it wins.
 * - Otherwise the OS preference (`prefers-color-scheme`) is used.
 * - While there is no stored theme, OS changes are followed live.
 * - Calling {@link setTheme} or {@link toggleTheme} writes storage and stops following OS until cleared (future).
 */
@Injectable({ providedIn: 'root' })
export class UserPreferencesService {
  private readonly store = inject(LocalPreferenceStore);

  private readonly themeSignal = signal<ThemeMode>('light');
  private readonly followingSystem = signal(true);

  /** Current DaisyUI theme on `<html data-theme>`. */
  readonly theme = this.themeSignal.asReadonly();

  readonly isDark = computed(() => this.themeSignal() === 'dark');

  /** Label for a control that switches to the *other* theme. */
  readonly themeSwitchLabel = computed(() =>
    this.themeSignal() === 'dark' ? 'Light theme' : 'Dark theme',
  );

  private mediaQuery?: MediaQueryList;
  private boundOnSchemeChange?: () => void;

  /**
   * Call once at startup (e.g. `provideAppInitializer`) so the first paint matches stored or system theme.
   */
  initialize(): void {
    const stored = this.store.getTheme();
    if (stored != null) {
      this.followingSystem.set(false);
      this.applyTheme(stored);
      return;
    }

    this.followingSystem.set(true);
    this.applyTheme(this.readSystemTheme());

    if (typeof matchMedia === 'undefined') {
      return;
    }
    this.mediaQuery = matchMedia('(prefers-color-scheme: dark)');
    this.boundOnSchemeChange = () => {
      if (!this.followingSystem()) {
        return;
      }
      this.applyTheme(this.readSystemTheme());
    };
    this.mediaQuery.addEventListener('change', this.boundOnSchemeChange);
  }

  setTheme(mode: ThemeMode): void {
    this.followingSystem.set(false);
    this.store.setTheme(mode);
    this.applyTheme(mode);
    this.detachSchemeListener();
  }

  toggleTheme(): void {
    this.setTheme(this.themeSignal() === 'dark' ? 'light' : 'dark');
  }

  /** Use when i18n is added (e.g. ngx-translate / built-in). */
  getLocale(): LocaleCode | null {
    return this.store.getLocale();
  }

  setLocale(code: LocaleCode): void {
    this.store.setLocale(code);
  }

  private applyTheme(mode: ThemeMode): void {
    this.themeSignal.set(mode);
    document.documentElement.setAttribute('data-theme', mode);
  }

  private readSystemTheme(): ThemeMode {
    if (typeof matchMedia === 'undefined') {
      return 'light';
    }
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private detachSchemeListener(): void {
    if (this.mediaQuery && this.boundOnSchemeChange) {
      this.mediaQuery.removeEventListener('change', this.boundOnSchemeChange);
    }
    this.mediaQuery = undefined;
    this.boundOnSchemeChange = undefined;
  }
}
