import { Injectable, signal } from '@angular/core';

export type UiToastLevel = 'info' | 'success' | 'warning' | 'error';

export interface UiToast {
  id: number;
  level: UiToastLevel;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class UiFeedbackService {
  private readonly nextId = signal(1);
  private readonly toastsSignal = signal<UiToast[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  info(message: string): void {
    this.push('info', message);
  }

  success(message: string): void {
    this.push('success', message);
  }

  warning(message: string): void {
    this.push('warning', message);
  }

  error(message: string): void {
    this.push('error', message);
  }

  dismiss(id: number): void {
    this.toastsSignal.update((items) => items.filter((item) => item.id !== id));
  }

  private push(level: UiToastLevel, message: string): void {
    const id = this.nextId();
    this.nextId.update((v) => v + 1);
    this.toastsSignal.update((items) => [...items, { id, level, message }]);

    // Keep global feedback ephemeral and non-blocking.
    setTimeout(() => this.dismiss(id), 4500);
  }
}
