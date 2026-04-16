import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    data: { titleKey: 'loginTitle' },
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'branches' },
      {
        path: 'admin',
        canActivate: [roleGuard(['SUPER_ADMIN'])],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'users' },
          {
            path: 'users',
            data: { titleKey: 'adminUsersTitle' },
            loadComponent: () =>
              import('./features/admin/admin-users.component').then((m) => m.AdminUsersComponent),
          },
          {
            path: 'roles',
            data: { titleKey: 'adminRolesTitle' },
            loadComponent: () =>
              import('./features/admin/admin-roles.component').then((m) => m.AdminRolesComponent),
          },
        ],
      },
      {
        path: 'branches',
        data: { titleKey: 'branchesTitle' },
        loadComponent: () =>
          import('./features/branches/branch-list.component').then((m) => m.BranchListComponent),
      },
      {
        path: 'branches/new',
        data: { titleKey: 'newBranchTitle' },
        loadComponent: () =>
          import('./features/branches/branch-create.component').then((m) => m.BranchCreateComponent),
      },
      {
        path: 'branches/:id/edit',
        data: { titleKey: 'editBranchTitle' },
        loadComponent: () =>
          import('./features/branches/branch-edit.component').then((m) => m.BranchEditComponent),
      },
      {
        path: 'branches/:id',
        data: { titleKey: 'branchDetailTitle' },
        loadComponent: () =>
          import('./features/branches/branch-detail.component').then((m) => m.BranchDetailComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
