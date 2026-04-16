import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from '../api/api-paths';
import { API_BASE_URL } from '../config/api-base-url.token';
import type {
  AdminRole,
  AdminUser,
  CreateUserPayload,
  PagedResponse,
  SetUserEnabledPayload,
  SetUserRolesPayload,
} from '../models/api-types';
import { apiUrl } from '../util/api-url';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  listRoles(): Observable<AdminRole[]> {
    return this.http.get<AdminRole[]>(apiUrl(this.apiBaseUrl, ApiPaths.adminRoles));
  }

  listUsers(page: number, size: number, sort?: string): Observable<PagedResponse<AdminUser>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      params = params.set('sort', sort);
    }
    return this.http.get<PagedResponse<AdminUser>>(apiUrl(this.apiBaseUrl, ApiPaths.adminUsers), { params });
  }

  createUser(payload: CreateUserPayload): Observable<AdminUser> {
    return this.http.post<AdminUser>(apiUrl(this.apiBaseUrl, ApiPaths.adminUsers), payload);
  }

  setUserEnabled(id: string, payload: SetUserEnabledPayload): Observable<AdminUser> {
    return this.http.patch<AdminUser>(apiUrl(this.apiBaseUrl, `${ApiPaths.adminUsers}/${encodeURIComponent(id)}/enabled`), payload);
  }

  setUserRoles(id: string, payload: SetUserRolesPayload): Observable<AdminUser> {
    return this.http.patch<AdminUser>(apiUrl(this.apiBaseUrl, `${ApiPaths.adminUsers}/${encodeURIComponent(id)}/roles`), payload);
  }
}

