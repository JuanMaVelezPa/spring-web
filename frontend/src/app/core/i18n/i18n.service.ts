import { Injectable, computed, signal } from '@angular/core';
import { UserPreferencesService } from '../preferences/user-preferences.service';

export type AppLocale = 'en' | 'es';
type TranslationKey = keyof typeof dictionary.en;

const dictionary = {
  en: {
    appTitle: 'Branches',
    logout: 'Logout',
    loginTitle: 'Sign in',
    sessionTitle: 'Session',
    sessionExpired: 'Your session expired. Please sign in again.',
    signInFailed: 'Sign-in failed',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    signingIn: 'Signing in…',
    branchesTitle: 'Branches',
    newBranch: 'New branch',
    warningTitle: 'Something went wrong',
    loadingBranches: 'Loading branches…',
    emptyBranches: 'No branches yet. Create one to get started.',
    code: 'Code',
    name: 'Name',
    city: 'City',
    active: 'Active',
    yes: 'Yes',
    no: 'No',
    back: 'Back',
    newBranchTitle: 'New branch',
    createFailed: 'Could not create branch',
    codeHint: 'Letters, numbers, underscore, hyphen',
    savingBranch: 'Saving branch…',
    create: 'Create',
    perPage: 'Per page',
    prev: 'Prev',
    next: 'Next',
    noItems: 'No items',
    pageSummary: 'Page {page} of {pages} · {total} total',
    language: 'Language',
    languageEnglish: 'English',
    languageSpanish: 'Spanish',
    themeToLight: 'Light theme',
    themeToDark: 'Dark theme',
    footerPortfolio: 'Spring portfolio',
    footerContact: 'Contact links',
    routeError: 'Unexpected navigation error. Please retry.',
    sessionExpiredToast: 'Session expired. Please sign in again.',
  },
  es: {
    appTitle: 'Sucursales',
    logout: 'Cerrar sesión',
    loginTitle: 'Iniciar sesión',
    sessionTitle: 'Sesión',
    sessionExpired: 'Tu sesión expiró. Inicia sesión de nuevo.',
    signInFailed: 'Error al iniciar sesión',
    username: 'Usuario',
    password: 'Contraseña',
    login: 'Entrar',
    signingIn: 'Ingresando…',
    branchesTitle: 'Sucursales',
    newBranch: 'Nueva sucursal',
    warningTitle: 'Algo salió mal',
    loadingBranches: 'Cargando sucursales…',
    emptyBranches: 'Aún no hay sucursales. Crea una para comenzar.',
    code: 'Código',
    name: 'Nombre',
    city: 'Ciudad',
    active: 'Activa',
    yes: 'Sí',
    no: 'No',
    back: 'Volver',
    newBranchTitle: 'Nueva sucursal',
    createFailed: 'No se pudo crear la sucursal',
    codeHint: 'Letras, números, guion bajo, guion medio',
    savingBranch: 'Guardando sucursal…',
    create: 'Crear',
    perPage: 'Por página',
    prev: 'Anterior',
    next: 'Siguiente',
    noItems: 'Sin elementos',
    pageSummary: 'Página {page} de {pages} · {total} total',
    language: 'Idioma',
    languageEnglish: 'Inglés',
    languageSpanish: 'Español',
    themeToLight: 'Tema claro',
    themeToDark: 'Tema oscuro',
    footerPortfolio: 'Portafolio Spring',
    footerContact: 'Enlaces de contacto',
    routeError: 'Error de navegación inesperado. Inténtalo de nuevo.',
    sessionExpiredToast: 'La sesión expiró. Inicia sesión de nuevo.',
  },
} as const;

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly localeSignal = signal<AppLocale>('en');
  readonly locale = this.localeSignal.asReadonly();
  readonly isSpanish = computed(() => this.localeSignal() === 'es');

  constructor(private readonly prefs: UserPreferencesService) {}

  initialize(): void {
    const stored = this.prefs.getLocale();
    if (stored === 'es' || stored === 'en') {
      this.setLocale(stored);
      return;
    }
    // Product decision: default locale is always English unless user explicitly changes it.
    this.setLocale('en');
  }

  setLocale(locale: AppLocale): void {
    this.localeSignal.set(locale);
    this.prefs.setLocale(locale);
    document.documentElement.setAttribute('lang', locale);
  }

  t(key: TranslationKey, vars?: Record<string, string | number>): string {
    let text: string = dictionary[this.localeSignal()][key];
    if (!vars) {
      return text;
    }
    for (const [name, value] of Object.entries(vars)) {
      text = text.replace(`{${name}}`, String(value));
    }
    return text;
  }
}
