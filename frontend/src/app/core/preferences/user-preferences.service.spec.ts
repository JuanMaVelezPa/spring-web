import { TestBed } from '@angular/core/testing';
import { LocalPreferenceStore } from './local-preference-store';
import { UserPreferencesService } from './user-preferences.service';

type MockMediaQuery = {
  matches: boolean;
  addEventListener: (type: 'change', listener: EventListenerOrEventListenerObject) => void;
  removeEventListener: (type: 'change', listener: EventListenerOrEventListenerObject) => void;
};

describe('UserPreferencesService', () => {
  let service: UserPreferencesService;
  let store: {
    getTheme: ReturnType<typeof vi.fn>;
    setTheme: ReturnType<typeof vi.fn>;
    getLocale: ReturnType<typeof vi.fn>;
    setLocale: ReturnType<typeof vi.fn>;
  };
  let mediaQuery: MockMediaQuery;

  beforeEach(() => {
    store = {
      getTheme: vi.fn().mockReturnValue(null),
      setTheme: vi.fn(),
      getLocale: vi.fn().mockReturnValue(null),
      setLocale: vi.fn(),
    };

    mediaQuery = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn(() => mediaQuery as MediaQueryList),
    });

    document.documentElement.setAttribute('data-theme', 'light');

    TestBed.configureTestingModule({
      providers: [{ provide: LocalPreferenceStore, useValue: store }],
    });

    service = TestBed.inject(UserPreferencesService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with stored theme when present', () => {
    store.getTheme.mockReturnValue('dark');

    service.initialize();

    expect(service.theme()).toBe('dark');
    expect(service.isDark()).toBe(true);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(mediaQuery.addEventListener).not.toHaveBeenCalled();
  });

  it('follows system theme when no stored theme exists', () => {
    store.getTheme.mockReturnValue(null);
    mediaQuery.matches = true;

    service.initialize();

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(mediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('setTheme persists and detaches system listener', () => {
    store.getTheme.mockReturnValue(null);
    service.initialize();

    service.setTheme('dark');

    expect(store.setTheme).toHaveBeenCalledWith('dark');
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(mediaQuery.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('toggleTheme switches to opposite theme and updates label', () => {
    store.getTheme.mockReturnValue('light');
    service.initialize();

    service.toggleTheme();
    expect(service.theme()).toBe('dark');
    expect(service.themeSwitchLabel()).toBe('Light theme');

    service.toggleTheme();
    expect(service.theme()).toBe('light');
    expect(service.themeSwitchLabel()).toBe('Dark theme');
  });

  it('delegates locale get/set to preference store', () => {
    store.getLocale.mockReturnValue('es-CO');
    expect(service.getLocale()).toBe('es-CO');

    service.setLocale('en-US');
    expect(store.setLocale).toHaveBeenCalledWith('en-US');
  });
});
