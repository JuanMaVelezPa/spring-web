import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { AdminApiService } from '../../core/admin/admin-api.service';
import { I18nService } from '../../core/i18n/i18n.service';
import type { AdminRole } from '../../core/models/api-types';
import { problemDetailMessage } from '../../core/util/http-error';
import { InlineAlertComponent } from '../../shared/ui/inline-alert/inline-alert.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';

@Component({
  selector: 'app-admin-roles',
  imports: [InlineAlertComponent, LoadingStateComponent],
  templateUrl: './admin-roles.component.html',
})
export class AdminRolesComponent implements OnInit {
  private readonly admin = inject(AdminApiService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly i18n = inject(I18nService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly roles = signal<AdminRole[]>([]);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.admin
      .listRoles()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => this.roles.set(res ?? []),
        error: (err) => this.error.set(problemDetailMessage(err)),
      });
  }
}

