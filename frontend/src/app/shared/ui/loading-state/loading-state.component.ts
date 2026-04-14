import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  templateUrl: './loading-state.component.html',
})
export class LoadingStateComponent {
  readonly active = input(false);

  readonly label = input<string | undefined>('Loading…');

  readonly size = input<'sm' | 'md' | 'lg'>('md');

  protected readonly spinnerClass = computed(() => {
    const s = this.size();
    if (s === 'sm') {
      return 'loading loading-spinner loading-sm text-primary';
    }
    if (s === 'lg') {
      return 'loading loading-spinner loading-lg text-primary';
    }
    return 'loading loading-spinner loading-md text-primary';
  });

  protected readonly paddingClass = computed(() =>
    this.size() === 'lg' ? 'py-12' : 'py-8',
  );
}
