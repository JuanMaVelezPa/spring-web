import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api-base-url.token';
import { apiUrl } from '../util/api-url';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  readonly token = signal<string | null>(null);

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(apiUrl(this.apiBaseUrl, '/api/v1/auth/login'), { username, password })
      .pipe(tap((res) => this.token.set(res.token)));
  }

  logout(): Observable<unknown> {
    return this.http.post(apiUrl(this.apiBaseUrl, '/api/v1/auth/logout'), {}).pipe(tap(() => this.token.set(null)));
  }

  clearSession(): void {
    this.token.set(null);
  }
}
