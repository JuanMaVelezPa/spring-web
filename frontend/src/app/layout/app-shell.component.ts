import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { AppFooterComponent } from '../shared/footer/app-footer.component';
import { ThemeToggleComponent } from '../shared/ui/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterOutlet, AppFooterComponent, ThemeToggleComponent],
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly loggingOut = signal(false);

  logout(): void {
    if (this.loggingOut()) {
      return;
    }
    this.loggingOut.set(true);
    this.auth
      .logout()
      .pipe(finalize(() => this.loggingOut.set(false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/login'),
        error: () => {
          this.auth.clearSession();
          void this.router.navigateByUrl('/login');
        },
      });
  }
}
