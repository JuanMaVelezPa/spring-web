import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BranchApiService } from '../../core/branches/branch-api.service';
import { problemDetailMessage } from '../../core/util/http-error';
import { InlineAlertComponent } from '../../shared/ui/inline-alert/inline-alert.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';

@Component({
  selector: 'app-branch-create',
  imports: [ReactiveFormsModule, RouterLink, InlineAlertComponent, LoadingStateComponent],
  templateUrl: './branch-create.component.html',
})
export class BranchCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly branches = inject(BranchApiService);
  private readonly router = inject(Router);

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
