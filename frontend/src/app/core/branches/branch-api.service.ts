import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ApiPaths, branchByIdPath, branchDeactivatePath } from '../api/api-paths';
import { API_BASE_URL } from '../config/api-base-url.token';
import type { Branch, CreateBranchPayload, PagedResponse, UpdateBranchPayload } from '../models/api-types';
import { apiUrl } from '../util/api-url';

@Injectable({ providedIn: 'root' })
export class BranchApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  /**
   * Paged list. Query aligns with Spring {@code PageRequestParams}: {@code page}, {@code size}, {@code sort}.
   *
   * @param sort required for stable ordering — e.g. {@code code,asc} (must match API whitelist).
   */
  list(page = 0, size = 20, sort = 'code,asc') {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sort', sort);
    return this.http.get<PagedResponse<Branch>>(apiUrl(this.apiBaseUrl, ApiPaths.branches), { params });
  }

  create(payload: CreateBranchPayload) {
    return this.http.post<Branch>(apiUrl(this.apiBaseUrl, ApiPaths.branches), payload);
  }

  getById(id: string) {
    return this.http.get<Branch>(apiUrl(this.apiBaseUrl, branchByIdPath(id)));
  }

  update(id: string, payload: UpdateBranchPayload) {
    return this.http.put<Branch>(apiUrl(this.apiBaseUrl, branchByIdPath(id)), payload);
  }

  deactivate(id: string) {
    return this.http.patch<Branch>(apiUrl(this.apiBaseUrl, branchDeactivatePath(id)), {});
  }
}
