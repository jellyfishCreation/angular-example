import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounce, form, FormField } from '@angular/forms/signals';
import { toObservable } from '@angular/core/rxjs-interop';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { MovieApi } from '../../api/movie-api';
import { GenreApi } from '../../api/genre-api';

import { StrapiResponse } from '../../models/strapi';
import { Genre, Movie, MovieSearchParams } from '../../models/movies';

@Component({
  selector: 'app-movie-list',
  imports: [
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormField,
    DatePipe,
  ],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList {
  movieApi = inject(MovieApi);
  genreApi = inject(GenreApi);

  searchModel = signal<MovieSearchParams>({
    search: '',
    sort: 'title:asc',
    filters: { genreId: '' },
  });
  searchForm = form(this.searchModel, (s) => {
    debounce(s.search, 300);
  });

  loading = signal(false);
  movies = signal<StrapiResponse<Movie[]> | null>(null);
  genres = signal<StrapiResponse<Genre[]> | null>(null);

  request = computed(() => ({
    search: this.searchForm.search().value(),
    sort: this.searchForm.sort().value(),
    filters: { genreId: this.searchForm.filters.genreId().value() },
  }));

  constructor() {
    this.onSearchChange();
    this.getGenres();
  }

  onSearchChange() {
    toObservable(this.request).subscribe((value) => {
      console.log('Search Params Changed:', value);
      this.getMovies(value);
    });
  }

  getMovies(searchParams: MovieSearchParams) {
    // this.loading.set(true);
    this.movieApi.getMovies(searchParams).subscribe((response) => {
      this.movies.set(response);
      // this.loading.set(false);
    });
  }

  getGenres() {
    this.genreApi.getGenres().subscribe((response) => {
      this.genres.set(response);
    });
  }

  resetSearch() {
    this.searchForm.search().value.set('');
  }
}
