import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'branches' },
      {
        path: 'branches',
        loadComponent: () =>
          import('./features/branches/branch-list.component').then((m) => m.BranchListComponent),
      },
      {
        path: 'branches/new',
        loadComponent: () =>
          import('./features/branches/branch-create.component').then((m) => m.BranchCreateComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
