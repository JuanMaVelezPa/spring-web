import { HttpBackend, HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, firstValueFrom, from, switchMap, throwError } from 'rxjs';
import { ApiPaths } from '../api/api-paths';
import { AuthService } from '../auth/auth.service';
import { API_BASE_URL } from '../config/api-base-url.token';
import type { LoginResponse } from '../models/api-types';
import { apiUrl } from '../util/api-url';

/** Prevents infinite refresh → retry → 401 → refresh loops on a single logical request. */
const RETRY_AFTER_REFRESH_HEADER = 'X-Retry-After-Refresh';

let refreshInFlight: Promise<string> | null = null;

function refreshAccessToken(rawHttp: HttpClient, url: string, auth: AuthService): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = firstValueFrom(
      rawHttp.post<LoginResponse>(url, {}, { withCredentials: true }),
    )
      .then((res) => {
        if (!res.token) {
          throw new Error('Refresh response missing token');
        }
        auth.token.set(res.token);
        return res.token;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

/**
 * On 401, attempts one cookie-based refresh (`POST /auth/refresh`) and retries the request with the new access token.
 * Uses `HttpBackend` so the refresh call does not recurse through interceptors.
 * Runs **before** {@link authErrorInterceptor} in the response chain (see `app.config` interceptor order).
 */
export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse) || err.status !== 401) {
        return throwError(() => err);
      }
      if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
        return throwError(() => err);
      }
      if (req.headers.has(RETRY_AFTER_REFRESH_HEADER)) {
        return throwError(() => err);
      }

      const auth = inject(AuthService);
      if (auth.token() == null) {
        return throwError(() => err);
      }

      const backend = inject(HttpBackend);
      const rawHttp = new HttpClient(backend);
      const refreshUrl = apiUrl(inject(API_BASE_URL), ApiPaths.authRefresh);

      return from(refreshAccessToken(rawHttp, refreshUrl, auth)).pipe(
        switchMap((token) =>
          next(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
                [RETRY_AFTER_REFRESH_HEADER]: '1',
              },
            }),
          ),
        ),
        catchError(() => throwError(() => err)),
      );
    }),
  );
};
