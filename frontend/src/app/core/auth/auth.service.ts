import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiPaths } from '../api/api-paths';
import { API_BASE_URL } from '../config/api-base-url.token';
import type { LoginRequest, LoginResponse } from '../models/api-types';
import { apiUrl } from '../util/api-url';
import { tryParseJwtPayload } from '../util/jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  readonly token = signal<string | null>(null);
  /** Display name from last successful login (memory only; refreshed with access token lifecycle). */
  readonly username = signal<string | null>(null);
  readonly roles = computed(() => tryParseJwtPayload(this.token())?.roles ?? []);

  login(username: string, password: string): Observable<LoginResponse> {
    const body: LoginRequest = { username, password };
    return this.http
      .post<LoginResponse>(apiUrl(this.apiBaseUrl, ApiPaths.authLogin), body)
      .pipe(
        tap((res) => {
          this.token.set(res.token);
          this.username.set(username);
        }),
      );
  }

  logout(): Observable<unknown> {
    return this.http
      .post(apiUrl(this.apiBaseUrl, ApiPaths.authLogout), {})
      .pipe(tap(() => this.clearSession()));
  }

  clearSession(): void {
    this.token.set(null);
    this.username.set(null);
  }

  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }
}
