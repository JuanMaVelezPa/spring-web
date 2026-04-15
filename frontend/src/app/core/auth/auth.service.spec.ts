import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiPaths } from '../api/api-paths';
import { API_BASE_URL } from '../config/api-base-url.token';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: '' },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('stores token on successful login', () => {
    service.login('admin', 'Admin_ChangeMe_2026!').subscribe();

    const req = httpMock.expectOne(ApiPaths.authLogin);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'admin',
      password: 'Admin_ChangeMe_2026!',
    });

    req.flush({ token: 'jwt-token' });
    expect(service.token()).toBe('jwt-token');
    expect(service.username()).toBe('admin');
  });

  it('clears token on logout', () => {
    service.token.set('existing-token');

    service.logout().subscribe();

    const req = httpMock.expectOne(ApiPaths.authLogout);
    expect(req.request.method).toBe('POST');
    req.flush({});

    expect(service.token()).toBeNull();
    expect(service.username()).toBeNull();
  });

  it('clears token when clearSession is called', () => {
    service.token.set('existing-token');
    service.username.set('admin');
    service.clearSession();
    expect(service.token()).toBeNull();
    expect(service.username()).toBeNull();
  });
});
