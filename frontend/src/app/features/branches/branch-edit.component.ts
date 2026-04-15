import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BranchApiService } from '../../core/branches/branch-api.service';
import { I18nService } from '../../core/i18n/i18n.service';
import { problemDetailMessage } from '../../core/util/http-error';
import { BusySectionComponent } from '../../shared/ui/busy-section/busy-section.component';
import { InlineAlertComponent } from '../../shared/ui/inline-alert/inline-alert.component';
import { LoadingSpinnerComponent } from '../../shared/ui/loading-spinner/loading-spinner.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';

@Component({
  selector: 'app-branch-edit',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    InlineAlertComponent,
    BusySectionComponent,
    LoadingSpinnerComponent,
    LoadingStateComponent,
  ],
  templateUrl: './branch-edit.component.html',
})
export class BranchEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly branches = inject(BranchApiService);
  protected readonly i18n = inject(I18nService);

  readonly loadError = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly code = signal<string>('');

  protected branchId = '';

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    city: ['', [Validators.required, Validators.maxLength(120)]],
  });

  ngOnInit(): void {
    this.branchId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.branchId) {
      this.loadError.set(this.i18n.t('branchNotFound'));
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    this.loadError.set(null);
    this.branches
      .getById(this.branchId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (b) => {
          this.code.set(b.code);
          this.form.patchValue({ name: b.name, city: b.city });
        },
        error: (err) => {
          this.loadError.set(problemDetailMessage(err));
          if (err instanceof HttpErrorResponse && err.status === 404) {
            void this.router.navigate(['/branches'], { replaceUrl: true });
          }
        },
      });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.saveError.set(null);
    this.saving.set(true);
    this.branches
      .update(this.branchId, this.form.getRawValue())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => void this.router.navigate(['/branches', this.branchId]),
        error: (err) => this.saveError.set(problemDetailMessage(err)),
      });
  }
}
