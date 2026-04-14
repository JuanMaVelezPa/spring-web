import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse) || err.status !== 401) {
        return throwError(() => err);
      }
      if (req.url.includes('/auth/login')) {
        return throwError(() => err);
      }
      const hadSession = auth.token() != null;
      auth.clearSession();
      if (hadSession) {
        void router.navigate(['/login'], {
          queryParams: { session: 'expired' },
          replaceUrl: true,
        });
        return EMPTY;
      }
      return throwError(() => err);
    }),
  );
};
