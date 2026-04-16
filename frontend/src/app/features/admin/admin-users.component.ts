import { Component, computed, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Subscription } from 'rxjs';
import { AdminApiService } from '../../core/admin/admin-api.service';
import { I18nService } from '../../core/i18n/i18n.service';
import type { AdminUser, CreateUserPayload, PagedResponse, SetUserEnabledPayload, SetUserRolesPayload } from '../../core/models/api-types';
import { problemDetailMessage } from '../../core/util/http-error';
import { InlineAlertComponent } from '../../shared/ui/inline-alert/inline-alert.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { PageNavComponent } from '../../shared/ui/page-nav/page-nav.component';
import { SortableThComponent } from '../../shared/ui/sortable-th/sortable-th.component';
import { formatSortQuery, toggleTableSort, type SortDirection } from '../../shared/util/table-sort';

@Component({
  selector: 'app-admin-users',
  imports: [InlineAlertComponent, LoadingStateComponent, PageNavComponent, SortableThComponent],
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit {
  private readonly admin = inject(AdminApiService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly i18n = inject(I18nService);

  private listSubscription?: Subscription;

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly data = signal<PagedResponse<AdminUser> | null>(null);
  readonly mutating = signal(false);
  readonly page = signal(0);
  readonly pageSize = signal(20);
  /** API field names — must match backend whitelist (email, enabled, createdAt). */
  readonly sortColumn = signal<'email' | 'enabled' | 'createdAt'>('email');
  readonly sortDirection = signal<SortDirection>('asc');

  readonly visibleUsers = computed(() => {
    const d = this.data();
    if (!d?.content?.length) {
      return [] as AdminUser[];
    }
    const cap = Number(d.size);
    const limit = Number.isFinite(cap) && cap > 0 ? Math.min(d.content.length, cap) : d.content.length;
    return d.content.slice(0, limit);
  });

  private loadSeq = 0;

  ngOnInit(): void {
    this.load();
  }

  onCreateUser(): void {
    const email = (prompt('Email') ?? '').trim();
    if (!email) {
      return;
    }
    const password = prompt('Temporary password') ?? '';
    if (!password) {
      return;
    }
    const rolesRaw = (prompt('Roles (comma separated)', 'APP_ADMIN') ?? '').trim();
    const roles = rolesRaw
      ? rolesRaw
          .split(',')
          .map((r) => r.trim())
          .filter(Boolean)
      : [];
    const payload: CreateUserPayload = { email, password, roles: roles.length ? roles : undefined };
    this.mutating.set(true);
    this.admin
      .createUser(payload)
      .pipe(finalize(() => this.mutating.set(false)))
      .subscribe({
        next: () => this.load(),
        error: (err) => this.error.set(problemDetailMessage(err)),
      });
  }

  onToggleEnabled(user: AdminUser): void {
    const payload: SetUserEnabledPayload = { enabled: !user.enabled };
    this.mutating.set(true);
    this.admin
      .setUserEnabled(user.id, payload)
      .pipe(finalize(() => this.mutating.set(false)))
      .subscribe({
        next: () => this.load(),
        error: (err) => this.error.set(problemDetailMessage(err)),
      });
  }

  onEditRoles(user: AdminUser): void {
    const rolesRaw = (prompt('Roles (comma separated)', user.roles.join(', ')) ?? '').trim();
    const roles = rolesRaw
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);
    if (roles.length === 0) {
      return;
    }
    const payload: SetUserRolesPayload = { roles };
    this.mutating.set(true);
    this.admin
      .setUserRoles(user.id, payload)
      .pipe(finalize(() => this.mutating.set(false)))
      .subscribe({
        next: () => this.load(),
        error: (err) => this.error.set(problemDetailMessage(err)),
      });
  }

  onPageChange(nextPage: number): void {
    this.page.set(nextPage);
    this.load();
  }

  onPageSizeChange(nextSize: number): void {
    this.pageSize.set(nextSize);
    this.page.set(0);
    this.load();
  }

  onSortColumn(key: string): void {
    const col = key as 'email' | 'enabled' | 'createdAt';
    const next = toggleTableSort(col, this.sortColumn(), this.sortDirection());
    this.sortColumn.set(next.column as 'email' | 'enabled' | 'createdAt');
    this.sortDirection.set(next.direction);
    this.page.set(0);
    this.load();
  }

  private load(): void {
    this.listSubscription?.unsubscribe();
    const seq = ++this.loadSeq;
    this.loading.set(true);
    this.error.set(null);
    this.listSubscription = this.admin
      .listUsers(this.page(), this.pageSize(), formatSortQuery(this.sortColumn(), this.sortDirection()))
      .pipe(
        finalize(() => {
          if (seq === this.loadSeq) {
            this.loading.set(false);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          if (seq !== this.loadSeq) {
            return;
          }
          this.data.set(res);
          if (typeof res.page === 'number') {
            this.page.set(res.page);
          }
          if (typeof res.size === 'number') {
            this.pageSize.set(res.size);
          }
        },
        error: (err) => {
          if (seq !== this.loadSeq) {
            return;
          }
          this.error.set(problemDetailMessage(err));
        },
      });
  }
}

