import { Component, computed, inject, input } from '@angular/core';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  passwordRuleChecks,
} from '../../../core/validation/account-validation';
import { I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'app-password-rules-hint',
  templateUrl: './password-rules-hint.component.html',
})
export class PasswordRulesHintComponent {
  protected readonly i18n = inject(I18nService);
  readonly password = input<string>('');
  readonly checks = computed(() => passwordRuleChecks(this.password()));
  protected readonly min = PASSWORD_MIN_LENGTH;
  protected readonly max = PASSWORD_MAX_LENGTH;
}

