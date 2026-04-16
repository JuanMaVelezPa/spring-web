import { Component, computed, inject, input, output } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';

/**
 * Offset pagination: `page` (0-based), `pageSize`, `totalElements`.
 * Page count is derived as `ceil(totalElements / pageSize)` so the summary stays consistent even if API `totalPages` drifts.
 */
@Component({
  selector: 'app-page-nav',
  templateUrl: './page-nav.component.html',
})
export class PageNavComponent {
  protected readonly i18n = inject(I18nService);
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly totalElements = input.required<number>();

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  readonly sizeOptions = input<number[]>([10, 20, 50]);

  /** Total pages from elements / pageSize (matches Spring `ceil` semantics). */
  protected readonly pageCount = computed(() => {
    const te = Number(this.totalElements());
    const ps = Number(this.pageSize());
    if (!Number.isFinite(te) || te <= 0 || !Number.isFinite(ps) || ps <= 0) {
      return 0;
    }
    return Math.ceil(te / ps);
  });

  protected readonly summary = computed(() => {
    const te = Number(this.totalElements());
    const p = this.page();
    const pc = this.pageCount();
    if (!Number.isFinite(te) || te === 0) {
      return this.i18n.t('noItems');
    }
    const humanPage = pc > 0 ? Math.min(p + 1, pc) : p + 1;
    return this.i18n.t('pageSummary', {
      page: humanPage,
      pages: pc,
      total: te,
    });
  });

  protected readonly canPrev = computed(() => this.page() > 0);

  protected readonly canNext = computed(() => {
    const p = this.page();
    const pc = this.pageCount();
    return pc > 0 && p < pc - 1;
  });

  prev(): void {
    if (this.canPrev()) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  next(): void {
    if (this.canNext()) {
      this.pageChange.emit(this.page() + 1);
    }
  }

  onSizeChange(event: Event): void {
    const v = Number((event.target as HTMLSelectElement).value);
    if (!Number.isNaN(v)) {
      this.pageSizeChange.emit(v);
    }
  }
}
