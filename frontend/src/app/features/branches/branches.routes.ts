import { Routes } from '@angular/router';

export const branchesRoutes: Routes = [
  {
    path: '',
    data: { titleKey: 'branchesTitle' },
    loadComponent: () => import('./branch-list.component').then((m) => m.BranchListComponent),
  },
  {
    path: 'new',
    data: { titleKey: 'newBranchTitle' },
    loadComponent: () => import('./branch-create.component').then((m) => m.BranchCreateComponent),
  },
  {
    path: ':id/edit',
    data: { titleKey: 'editBranchTitle' },
    loadComponent: () => import('./branch-edit.component').then((m) => m.BranchEditComponent),
  },
  {
    path: ':id',
    data: { titleKey: 'branchDetailTitle' },
    loadComponent: () => import('./branch-detail.component').then((m) => m.BranchDetailComponent),
  },
];
