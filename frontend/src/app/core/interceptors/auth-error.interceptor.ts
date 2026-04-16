import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { I18nService } from '../i18n/i18n.service';
import { UiFeedbackService } from '../ui-feedback/ui-feedback.service';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const ui = inject(UiFeedbackService);
  const i18n = inject(I18nService);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) {
        return throwError(() => err);
      }

      if (err.status === 403 && req.url.includes('/api/v1/admin/')) {
        ui.warning(i18n.t('forbiddenAdmin'));
        void router.navigate(['/branches'], { replaceUrl: true });
        return EMPTY;
      }

      if (err.status !== 401) {
        return throwError(() => err);
      }
      if (req.url.includes('/auth/login')) {
        return throwError(() => err);
      }
      const hadSession = auth.token() != null;
      auth.clearSession();
      if (hadSession) {
        ui.warning(i18n.t('sessionExpiredToast'));
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
