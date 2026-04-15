import { Component, inject } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';

/** Toggles locale with the same button pattern as theme (Light / Dark). */
@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
})
export class LanguageSwitcherComponent {
  protected readonly i18n = inject(I18nService);
}
