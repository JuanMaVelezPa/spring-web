import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BranchApiService } from '../../core/branches/branch-api.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { problemDetailMessage } from '../../core/util/http-error';
import { BusySectionComponent } from '../../shared/ui/busy-section/busy-section.component';
import { InlineAlertComponent } from '../../shared/ui/inline-alert/inline-alert.component';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-branch-create',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InlineAlertComponent,
    BusySectionComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './branch-create.component.html',
})
export class BranchCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly branches = inject(BranchApiService);
  private readonly router = inject(Router);
  protected readonly i18n = inject(I18nService);

  readonly error = signal<string | null>(null);
  readonly saving = signal(false);

  readonly form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[A-Za-z0-9_-]+$/)]],
    name: ['', [Validators.required, Validators.maxLength(150)]],
    city: ['', [Validators.required, Validators.maxLength(120)]],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.error.set(null);
    this.saving.set(true);
    this.branches
      .create(this.form.getRawValue())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/branches'),
        error: (err) => this.error.set(problemDetailMessage(err)),
      });
  }
}
