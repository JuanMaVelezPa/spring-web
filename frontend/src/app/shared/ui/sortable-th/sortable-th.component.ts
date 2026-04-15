import { Component, computed, inject, input, output } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';
import { IconComponent } from '../icon/icon.component';

/** Clickable column header for server-side sort; parent applies `toggleTableSort` and reloads. */
@Component({
  selector: 'app-sortable-th',
  imports: [IconComponent],
  templateUrl: './sortable-th.component.html',
})
export class SortableThComponent {
  protected readonly i18n = inject(I18nService);

  readonly label = input.required<string>();
  readonly columnKey = input.required<string>();
  readonly activeKey = input<string | null>(null);
  readonly direction = input<'asc' | 'desc'>('asc');

  readonly sortActivate = output<string>();

  protected readonly ariaLabel = computed(() => {
    const col = this.label();
    if (this.activeKey() !== this.columnKey()) {
      return this.i18n.t('tableSortAriaInactive', { label: col });
    }
    return this.direction() === 'asc'
      ? this.i18n.t('tableSortAriaActiveAsc', { label: col })
      : this.i18n.t('tableSortAriaActiveDesc', { label: col });
  });

  protected onClick(): void {
    this.sortActivate.emit(this.columnKey());
  }
}
