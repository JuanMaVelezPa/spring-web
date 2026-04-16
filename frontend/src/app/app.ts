import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs';
import { I18nService, isTranslationKey } from './core/i18n/i18n.service';
import { GlobalToastComponent } from './shared/ui/global-toast/global-toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly i18n = inject(I18nService);

  /** Re-run tab title when route or locale changes. */
  private readonly titleTick = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  constructor() {
    effect(() => {
      this.titleTick();
      this.i18n.locale();
      this.syncDocumentTitle();
    });
  }

  private syncDocumentTitle(): void {
    let route = this.router.routerState.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const raw = route.snapshot.data['titleKey'];
    const key = isTranslationKey(raw) ? raw : 'appTitle';
    const head = this.i18n.t(key);
    this.title.setTitle(`${head} · ${this.i18n.t('browserTabBrand')}`);
  }
}
