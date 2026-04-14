import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { API_BASE_URL } from './core/config/api-base-url.token';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { authErrorInterceptor } from './core/interceptors/auth-error.interceptor';
import { UserPreferencesService } from './core/preferences/user-preferences.service';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => {
      inject(UserPreferencesService).initialize();
    }),
    provideRouter(routes),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    provideHttpClient(withInterceptors([apiInterceptor, authErrorInterceptor])),
  ],
};
