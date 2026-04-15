import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { problemDetailMessage } from '../../core/util/http-error';
import { AppFooterComponent } from '../../shared/footer/app-footer.component';
import { BusySectionComponent } from '../../shared/ui/busy-section/busy-section.component';
import { InlineAlertComponent } from '../../shared/ui/inline-alert/inline-alert.component';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';
import { SettingsDropdownComponent } from '../../shared/ui/settings-dropdown/settings-dropdown.component';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    AppFooterComponent,
    InlineAlertComponent,
    BusySectionComponent,
    LoadingSpinnerComponent,
    SettingsDropdownComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly i18n = inject(I18nService);

  readonly error = signal<string | null>(null);
  readonly submitting = signal(false);

  readonly sessionNotice = toSignal(
    this.route.queryParamMap.pipe(
      map((p): string | null =>
        p.get('session') === 'expired' ? this.i18n.t('sessionExpired') : null,
      ),
    ),
    { initialValue: null as string | null },
  );

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.error.set(null);
    this.submitting.set(true);
    const { username, password } = this.form.getRawValue();
    this.auth
      .login(username, password)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/branches'),
        error: (err) => this.error.set(problemDetailMessage(err)),
      });
  }
}
