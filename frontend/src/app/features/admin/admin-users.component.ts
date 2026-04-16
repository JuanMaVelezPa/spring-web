import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Subscription } from 'rxjs';
import { AdminApiService } from '../../core/admin/admin-api.service';
import { I18nService } from '../../core/i18n/i18n.service';
import type {
  AdminRole,
  AdminUser,
  CreateUserPayload,
  PagedResponse,
  SetUserEnabledPayload,
  SetUserRolesPayload,
} from '../../core/models/api-types';
import { problemDetailMessage } from '../../core/util/http-error';
import { InlineAlertComponent } from '../../shared/ui/inline-alert/inline-alert.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { PageNavComponent } from '../../shared/ui/page-nav/page-nav.component';
import { PasswordRulesHintComponent } from '../../shared/ui/password-rules-hint/password-rules-hint.component';
import { SortableThComponent } from '../../shared/ui/sortable-th/sortable-th.component';
import { formatSortQuery, toggleTableSort, type SortDirection } from '../../shared/util/table-sort';
import { isValidEmail, isValidPassword } from '../../core/validation/account-validation';

@Component({
  selector: 'app-admin-users',
  imports: [
    DatePipe,
    InlineAlertComponent,
    LoadingStateComponent,
    PageNavComponent,
    PasswordRulesHintComponent,
    SortableThComponent,
  ],
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
  readonly roles = signal<AdminRole[]>([]);

  // Create user modal state
  readonly createEmail = signal('');
  readonly createPassword = signal('');
  readonly createSelectedRoles = signal<Set<string>>(new Set(['APP_ADMIN']));
  readonly createEmailTouched = signal(false);
  readonly createPasswordTouched = signal(false);
  readonly createSubmitAttempted = signal(false);

  // Edit roles modal state
  readonly rolesUser = signal<AdminUser | null>(null);
  readonly rolesSelected = signal<Set<string>>(new Set());

  // Enable/disable confirm modal state
  readonly confirmUser = signal<AdminUser | null>(null);
  readonly page = signal(0);
  readonly pageSize = signal(20);
  /** API field names — must match backend whitelist (email, enabled, createdAt). */
  readonly sortColumn = signal<'email' | 'enabled' | 'createdAt'>('createdAt');
  readonly sortDirection = signal<SortDirection>('desc');

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
    this.admin
      .listRoles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.roles.set(res ?? []),
        error: () => this.roles.set([]),
      });
  }

  readonly roleNames = computed(() =>
    (this.roles() ?? [])
      .map((r) => r.name)
      .filter((x): x is string => typeof x === 'string' && x.length > 0)
      .sort(),
  );
  readonly createEmailValid = computed(() => isValidEmail(this.createEmail()));
  readonly createPasswordValid = computed(() => isValidPassword(this.createPassword()));

  openCreateModal(dialog: HTMLDialogElement): void {
    this.error.set(null);
    this.createEmail.set('');
    this.createPassword.set('');
    this.createEmailTouched.set(false);
    this.createPasswordTouched.set(false);
    this.createSubmitAttempted.set(false);
    this.createSelectedRoles.set(new Set(['APP_ADMIN']));
    dialog.showModal();
  }

  toggleCreateRole(role: string): void {
    const next = new Set(this.createSelectedRoles());
    if (next.has(role)) {
      next.delete(role);
    } else {
      next.add(role);
    }
    this.createSelectedRoles.set(next);
  }

  submitCreate(dialog: HTMLDialogElement): void {
    this.createSubmitAttempted.set(true);
    const email = this.createEmail().trim();
    const password = this.createPassword();
    if (!email || !password || !this.createEmailValid() || !this.createPasswordValid()) {
      return;
    }
    const roles = Array.from(this.createSelectedRoles());
    const payload: CreateUserPayload = { email, password, roles: roles.length ? roles : undefined };
    this.mutating.set(true);
    this.admin
      .createUser(payload)
      .pipe(finalize(() => this.mutating.set(false)))
      .subscribe({
        next: () => {
          dialog.close();
          this.load();
        },
        error: (err) => this.error.set(problemDetailMessage(err)),
      });
  }

  openEditRoles(dialog: HTMLDialogElement, user: AdminUser): void {
    this.error.set(null);
    this.rolesUser.set(user);
    this.rolesSelected.set(new Set(user.roles ?? []));
    dialog.showModal();
  }

  toggleEditRole(role: string): void {
    const next = new Set(this.rolesSelected());
    if (next.has(role)) {
      next.delete(role);
    } else {
      next.add(role);
    }
    this.rolesSelected.set(next);
  }

  submitEditRoles(dialog: HTMLDialogElement): void {
    const user = this.rolesUser();
    if (!user) {
      return;
    }
    const roles = Array.from(this.rolesSelected());
    if (roles.length === 0) {
      return;
    }
    const payload: SetUserRolesPayload = { roles };
    this.mutating.set(true);
    this.admin
      .setUserRoles(user.id, payload)
      .pipe(finalize(() => this.mutating.set(false)))
      .subscribe({
        next: () => {
          dialog.close();
          this.rolesUser.set(null);
          this.load();
        },
        error: (err) => this.error.set(problemDetailMessage(err)),
      });
  }

  openConfirmEnabled(dialog: HTMLDialogElement, user: AdminUser): void {
    this.error.set(null);
    this.confirmUser.set(user);
    dialog.showModal();
  }

  submitToggleEnabled(dialog: HTMLDialogElement): void {
    const user = this.confirmUser();
    if (!user) {
      return;
    }
    const payload: SetUserEnabledPayload = { enabled: !user.enabled };
    this.mutating.set(true);
    this.admin
      .setUserEnabled(user.id, payload)
      .pipe(finalize(() => this.mutating.set(false)))
      .subscribe({
        next: () => {
          dialog.close();
          this.confirmUser.set(null);
          this.load();
        },
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

