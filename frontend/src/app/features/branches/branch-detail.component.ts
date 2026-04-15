import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { BranchApiService } from '../../core/branches/branch-api.service';
import { I18nService } from '../../core/i18n/i18n.service';
import type { Branch } from '../../core/models/api-types';
import { problemDetailMessage } from '../../core/util/http-error';
import { InlineAlertComponent } from '../../shared/ui/inline-alert/inline-alert.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';

@Component({
  selector: 'app-branch-detail',
  imports: [RouterLink, InlineAlertComponent, LoadingStateComponent, DatePipe],
  templateUrl: './branch-detail.component.html',
})
export class BranchDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly branches = inject(BranchApiService);
  protected readonly i18n = inject(I18nService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly branch = signal<Branch | null>(null);
  readonly actionBusy = signal(false);
  private branchId = '';

  private readonly deactivateDialogEl = viewChild<ElementRef<HTMLDialogElement>>('deactivateDialog');

  ngOnInit(): void {
    this.branchId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.branchId) {
      this.error.set(this.i18n.t('branchNotFound'));
      this.loading.set(false);
      return;
    }
    this.load();
  }

  openDeactivateDialog(): void {
    const b = this.branch();
    if (!b?.isActive || this.actionBusy()) {
      return;
    }
    const el = this.deactivateDialogEl()?.nativeElement;
    if (el && !el.open) {
      el.showModal();
    }
  }

  closeDeactivateDialog(): void {
    this.deactivateDialogEl()?.nativeElement.close();
  }

  executeDeactivate(): void {
    const b = this.branch();
    if (!b?.isActive || this.actionBusy()) {
      this.closeDeactivateDialog();
      return;
    }
    this.closeDeactivateDialog();
    this.actionBusy.set(true);
    this.error.set(null);
    this.branches
      .deactivate(this.branchId)
      .pipe(finalize(() => this.actionBusy.set(false)))
      .subscribe({
        next: (updated) => this.branch.set(updated),
        error: (err) => this.error.set(problemDetailMessage(err)),
      });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.branches
      .getById(this.branchId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (b) => this.branch.set(b),
        error: (err) => {
          this.error.set(problemDetailMessage(err));
          if (err instanceof HttpErrorResponse && err.status === 404) {
            void this.router.navigate(['/branches'], { replaceUrl: true });
          }
        },
      });
  }
}
