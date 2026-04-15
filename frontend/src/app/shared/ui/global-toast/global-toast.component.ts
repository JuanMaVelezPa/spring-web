import { Component, inject } from '@angular/core';
import { UiFeedbackService, UiToast } from '../../../core/ui-feedback/ui-feedback.service';

@Component({
  selector: 'app-global-toast',
  templateUrl: './global-toast.component.html',
})
export class GlobalToastComponent {
  protected readonly ui = inject(UiFeedbackService);

  protected toastClass(item: UiToast): string {
    if (item.level === 'error') {
      return 'alert-error';
    }
    if (item.level === 'warning') {
      return 'alert-warning';
    }
    if (item.level === 'success') {
      return 'alert-success';
    }
    return 'alert-info';
  }
}
