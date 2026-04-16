import { Component, computed, input } from '@angular/core';

/** DaisyUI spinner; use inside buttons, overlays, or {@link LoadingStateComponent}. */
@Component({
  selector: 'app-loading-spinner',
  template: `<span [class]="spinnerClass()" aria-hidden="true"></span>`,
  host: { class: 'inline-flex shrink-0 items-center justify-center' },
})
export class LoadingSpinnerComponent {
  readonly size = input<'xs' | 'sm' | 'md' | 'lg'>('md');

  protected readonly spinnerClass = computed(() => {
    const s = this.size();
    const sizeClass =
      s === 'xs'
        ? 'loading loading-spinner loading-xs'
        : s === 'sm'
          ? 'loading loading-spinner loading-sm'
          : s === 'lg'
            ? 'loading loading-spinner loading-lg'
            : 'loading loading-spinner loading-md';
    return `${sizeClass} text-primary`;
  });
}
