import { describe, expect, it } from 'vitest';
import { apiUrl } from './api-url';

describe('apiUrl', () => {
  it('returns path when base is empty', () => {
    expect(apiUrl('', '/api/v1/x')).toBe('/api/v1/x');
  });

  it('trims trailing slash on base', () => {
    expect(apiUrl('https://api.example.com/', '/api/v1/x')).toBe('https://api.example.com/api/v1/x');
  });

  it('adds leading slash to path when missing', () => {
    expect(apiUrl('https://api.example.com', 'api/v1/x')).toBe('https://api.example.com/api/v1/x');
  });
});
