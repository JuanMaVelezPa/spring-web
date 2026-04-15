import { Component, computed, inject, input, output } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';

/** Offset pagination controls aligned with backend `page` (0-based), `size`, `totalPages`, `totalElements`. */
@Component({
  selector: 'app-page-nav',
  templateUrl: './page-nav.component.html',
})
export class PageNavComponent {
  protected readonly i18n = inject(I18nService);
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly totalElements = input.required<number>();

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  readonly sizeOptions = input<number[]>([10, 20, 50]);

  protected readonly summary = computed(() => {
    const te = this.totalElements();
    const tp = this.totalPages();
    const p = this.page();
    if (te === 0) {
      return this.i18n.t('noItems');
    }
    return this.i18n.t('pageSummary', {
      page: p + 1,
      pages: tp,
      total: te,
    });
  });

  protected readonly canPrev = computed(() => this.page() > 0);

  protected readonly canNext = computed(() => {
    const p = this.page();
    const tp = this.totalPages();
    return tp > 0 && p < tp - 1;
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
