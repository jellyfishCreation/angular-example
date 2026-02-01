import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'movies',
    pathMatch: 'full',
  },
  {
    path: 'movies',
    loadComponent: () => import('./pages/movie-list/movie-list').then((m) => m.MovieList),
  },
  {
    path: 'movies/:id',
    loadComponent: () =>
      import('./pages/movie-overview/movie-overview').then((m) => m.MovieOverview),
  },
];
