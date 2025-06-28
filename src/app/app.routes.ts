import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard/dashboard.component'),

    children: [
      {
        path: 'persons',
        loadComponent: () =>
          import('./dashboard/pages/persons/persons.component'),
      },
     
      {
        path: 'config',
        loadComponent: () =>
          import(
            './dashboard/pages/config/config.component'
          ),
      },

      
      {
        path: '**',
        redirectTo: 'persons',
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
