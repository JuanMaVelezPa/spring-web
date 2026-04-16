import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { AdminApiService } from '../../core/admin/admin-api.service';
import { adminQueryKeys } from '../../core/admin/admin-query.keys';
import { I18nService } from '../../core/i18n/i18n.service';
import type { AuditLogEntry } from '../../core/models/api-types';
import { problemDetailMessage } from '../../core/util/http-error';
import { InlineAlertComponent } from '../../shared/ui/inline-alert/inline-alert.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { PageNavComponent } from '../../shared/ui/page-nav/page-nav.component';
import { SortableThComponent } from '../../shared/ui/sortable-th/sortable-th.component';
import { formatSortQuery, toggleTableSort, type SortDirection } from '../../shared/util/table-sort';
import { AdminSubnavComponent } from './admin-subnav.component';

@Component({
  selector: 'app-admin-audit-log',
  imports: [
    DatePipe,
    InlineAlertComponent,
    LoadingStateComponent,
    PageNavComponent,
    SortableThComponent,
    AdminSubnavComponent,
  ],
  templateUrl: './admin-audit-log.component.html',
})
export class AdminAuditLogComponent {
  private readonly admin = inject(AdminApiService);
  protected readonly i18n = inject(I18nService);

  readonly error = signal<string | null>(null);
  readonly page = signal(0);
  readonly pageSize = signal(10);
  readonly sortColumn = signal<'createdAt' | 'action'>('createdAt');
  readonly sortDirection = signal<SortDirection>('desc');

  readonly visibleRows = computed(() => {
    const d = this.data();
    if (!d?.content?.length) {
      return [] as AuditLogEntry[];
    }
    const cap = Number(d.size);
    const limit = Number.isFinite(cap) && cap > 0 ? Math.min(d.content.length, cap) : d.content.length;
    return d.content.slice(0, limit);
  });

  readonly auditQuery = injectQuery(() => {
    const sort = formatSortQuery(this.sortColumn(), this.sortDirection());
    return {
      queryKey: adminQueryKeys.auditLogList(this.page(), this.pageSize(), sort),
      queryFn: () => lastValueFrom(this.admin.listAuditLogs(this.page(), this.pageSize(), sort)),
    };
  });

  readonly loading = computed(() => this.auditQuery.isPending());
  readonly data = computed(() => this.auditQuery.data() ?? null);

  constructor() {
    effect(() => {
      const err = this.auditQuery.error();
      this.error.set(err ? problemDetailMessage(err) : null);
    });
  }

  onSortColumn(key: string): void {
    const col = key as 'createdAt' | 'action';
    const next = toggleTableSort(col, this.sortColumn(), this.sortDirection());
    this.sortColumn.set(next.column as 'createdAt' | 'action');
    this.sortDirection.set(next.direction);
    this.page.set(0);
  }

  onPageChange(next: number): void {
    this.page.set(next);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.page.set(0);
  }
}
