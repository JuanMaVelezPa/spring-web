import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'users' },
  {
    path: 'users',
    data: { titleKey: 'adminUsersTitle' },
    loadComponent: () => import('./admin-users.component').then((m) => m.AdminUsersComponent),
  },
  {
    path: 'roles',
    data: { titleKey: 'adminRolesTitle' },
    loadComponent: () => import('./admin-roles.component').then((m) => m.AdminRolesComponent),
  },
];
