import { Component, input } from '@angular/core';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

/**
 * Wraps content and shows a non-blocking overlay while `busy` is true (forms, cards).
 */
@Component({
  selector: 'app-busy-section',
  imports: [LoadingSpinnerComponent],
  templateUrl: './busy-section.component.html',
  host: { class: 'relative isolate block' },
})
export class BusySectionComponent {
  readonly busy = input(false);

  readonly label = input<string | undefined>(undefined);

  /** Spinner size on the overlay. */
  readonly spinnerSize = input<'sm' | 'md'>('md');
}
