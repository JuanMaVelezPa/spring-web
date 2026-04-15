import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { BranchApiService } from '../../core/branches/branch-api.service';
import { I18nService } from '../../core/i18n/i18n.service';
import type { Branch, PagedResponse } from '../../core/models/api-types';
import { problemDetailMessage } from '../../core/util/http-error';
import { InlineAlertComponent } from '../../shared/ui/inline-alert/inline-alert.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { PageNavComponent } from '../../shared/ui/page-nav/page-nav.component';
import { SortableThComponent } from '../../shared/ui/sortable-th/sortable-th.component';
import { formatSortQuery, toggleTableSort, type SortDirection } from '../../shared/util/table-sort';

@Component({
  selector: 'app-branch-list',
  imports: [
    RouterLink,
    InlineAlertComponent,
    LoadingStateComponent,
    PageNavComponent,
    SortableThComponent,
  ],
  templateUrl: './branch-list.component.html',
})
export class BranchListComponent implements OnInit {
  private readonly branches = inject(BranchApiService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly i18n = inject(I18nService);

  /** Cancels the previous in-flight list request when a new one starts (saves bandwidth; avoids races). */
  private listSubscription?: Subscription;

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly data = signal<PagedResponse<Branch> | null>(null);
  readonly page = signal(0);
  readonly pageSize = signal(20);
  /** API field names — must match backend branch list whitelist (code, name, city, active). */
  readonly sortColumn = signal<'code' | 'name' | 'city' | 'active'>('code');
  readonly sortDirection = signal<SortDirection>('asc');

  /**
   * Never show more rows than the requested page size (guards against race/stale responses
   * or contract drift); backend should already cap at `size`.
   */
  readonly visibleBranches = computed(() => {
    const d = this.data();
    if (!d?.content?.length) {
      return [] as Branch[];
    }
    const cap = Number(d.size);
    const limit = Number.isFinite(cap) && cap > 0 ? Math.min(d.content.length, cap) : d.content.length;
    return d.content.slice(0, limit);
  });

  private loadSeq = 0;

  ngOnInit(): void {
    this.load();
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
    const col = key as 'code' | 'name' | 'city' | 'active';
    const next = toggleTableSort(col, this.sortColumn(), this.sortDirection());
    this.sortColumn.set(next.column as 'code' | 'name' | 'city' | 'active');
    this.sortDirection.set(next.direction);
    this.page.set(0);
    this.load();
  }

  private load(): void {
    this.listSubscription?.unsubscribe();
    const seq = ++this.loadSeq;
    this.loading.set(true);
    this.error.set(null);

    this.listSubscription = this.branches
      .list(this.page(), this.pageSize(), formatSortQuery(this.sortColumn(), this.sortDirection()))
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
