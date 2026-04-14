import { HttpErrorResponse } from '@angular/common/http';
import { describe, expect, it } from 'vitest';
import { problemDetailMessage } from './http-error';

describe('problemDetailMessage', () => {
  it('prefers Problem Details detail field', () => {
    const err = new HttpErrorResponse({
      status: 400,
      error: { type: 'about:blank', title: 'Bad Request', detail: 'Invalid payload' },
    });
    expect(problemDetailMessage(err)).toBe('Invalid payload');
  });

  it('uses string body when present', () => {
    const err = new HttpErrorResponse({ status: 500, error: 'Server exploded' });
    expect(problemDetailMessage(err)).toBe('Server exploded');
  });

  it('falls back to Error.message for generic Error', () => {
    expect(problemDetailMessage(new Error('oops'))).toBe('oops');
  });

  it('returns generic copy for unknown errors', () => {
    expect(problemDetailMessage({})).toBe('Unexpected error');
  });
});
