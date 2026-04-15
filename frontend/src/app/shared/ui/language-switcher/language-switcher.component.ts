import { Component, inject } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
})
export class LanguageSwitcherComponent {
  protected readonly i18n = inject(I18nService);

  protected onLocaleChange(event: Event): void {
    const locale = (event.target as HTMLSelectElement).value;
    this.i18n.setLocale(locale === 'es' ? 'es' : 'en');
  }
}
