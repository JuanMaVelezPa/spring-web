export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  city: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface CreateBranchPayload {
  code: string;
  name: string;
  city: string;
}
