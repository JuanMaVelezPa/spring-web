import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_BASE_URL } from '../config/api-base-url.token';
import type { Branch, CreateBranchPayload, PagedResponse } from '../models/api-types';
import { apiUrl } from '../util/api-url';

@Injectable({ providedIn: 'root' })
export class BranchApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  list(page = 0, size = 20) {
    const params = new HttpParams().set('page', String(page)).set('size', String(size));
    return this.http.get<PagedResponse<Branch>>(apiUrl(this.apiBaseUrl, '/api/v1/branches'), { params });
  }

  create(payload: CreateBranchPayload) {
    return this.http.post<Branch>(apiUrl(this.apiBaseUrl, '/api/v1/branches'), payload);
  }
}
