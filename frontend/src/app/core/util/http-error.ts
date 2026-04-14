import { HttpErrorResponse } from '@angular/common/http';
import type { ProblemDetail } from '../models/api-types';

export function problemDetailMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as ProblemDetail | undefined;
    if (body?.detail) {
      return body.detail;
    }
    if (typeof error.error === 'string' && error.error.length > 0) {
      return error.error;
    }
    return error.message || 'Request failed';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unexpected error';
}
