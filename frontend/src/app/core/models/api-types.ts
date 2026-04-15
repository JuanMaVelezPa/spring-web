import type { components } from './openapi.generated';

export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}

type OpenApiBranch = components['schemas']['BranchResponse'];
export type Branch = {
  id: NonNullable<OpenApiBranch['id']>;
  code: NonNullable<OpenApiBranch['code']>;
  name: NonNullable<OpenApiBranch['name']>;
  city: NonNullable<OpenApiBranch['city']>;
  isActive: NonNullable<OpenApiBranch['isActive']>;
  createdAt: NonNullable<OpenApiBranch['createdAt']>;
  updatedAt: NonNullable<OpenApiBranch['updatedAt']>;
};

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export type CreateBranchPayload = components['schemas']['CreateBranchRequest'];

export type UpdateBranchPayload = components['schemas']['UpdateBranchRequest'];

type OpenApiLoginResponse = components['schemas']['LoginResponse'];
export type LoginResponse = {
  token: NonNullable<OpenApiLoginResponse['token']>;
};

export type LoginRequest = components['schemas']['LoginRequest'];
