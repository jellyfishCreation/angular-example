import { Routes } from '@angular/router';

import { MovieList } from './features/movie-list/movie-list';

export const routes: Routes = [
  {
    path: '',
    component: MovieList,
  },
];
