import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounce, form, FormField } from '@angular/forms/signals';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MovieApi } from '../../api/movie-api';
import { GenreApi } from '../../api/genre-api';

import { Genre, Movie, MovieSearchParams, MovieSortOption } from '../../models/movies';

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
    MatProgressSpinnerModule,
    FormField,
    DatePipe,
  ],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList {
  router = inject(Router);
  route = inject(ActivatedRoute);
  movieApi = inject(MovieApi);
  genreApi = inject(GenreApi);

  queryParams = toSignal(this.route.queryParamMap);

  searchModel = signal<MovieSearchParams>({
    search: this.queryParams()?.get('search') || '',
    sort: (this.queryParams()?.get('sort') as MovieSortOption) || 'title:asc',
    genreId: this.queryParams()?.get('genreId') || '',
    page: 1,
  });

  page = signal(1);
  pageCount = signal<number | null>(null);

  isMoviesLoading = signal(false);
  movies = signal<Movie[] | null>(null);
  genres = signal<Genre[] | null>(null);

  request = computed(() => ({
    search: this.searchForm.search().value(),
    sort: this.searchForm.sort().value(),
    genreId: this.searchForm.genreId().value(),
  }));

  searchForm = form(this.searchModel, (s) => {
    debounce(s.search, 300);
  });

  constructor() {
    this.onSearchChange();
    this.getGenres();
  }

  getMovies(searchParams: MovieSearchParams, append = false) {
    if (this.pageCount() && searchParams.page > this.pageCount()!) return;

    if (this.movies() === null) {
      this.isMoviesLoading.set(true);
    }

    this.movieApi.getMovies(searchParams).subscribe((response) => {
      this.pageCount.set(response.meta.pagination?.pageCount || null);

      if (append) {
        this.movies.update((prev) => [...(prev || []), ...response.data]);
      } else {
        this.movies.set(response.data);
      }

      this.isMoviesLoading.set(false);
    });
  }

  getGenres() {
    this.genreApi.getGenres().subscribe((response) => {
      this.genres.set(response);
    });
  }

  onSearchChange() {
    toObservable(this.request).subscribe((value) => {
      this.page.set(1);
      this.resetQueryParams();
      this.getMovies({ ...value, page: this.page() });
    });
  }

  resetSearch() {
    this.searchForm.search().value.set('');
  }

  resetQueryParams() {
    this.router.navigate([], { queryParams: this.request(), queryParamsHandling: 'merge' });
  }

  onScroll(event: Event) {
    if (!this.atBottom(event)) {
      return;
    }

    this.page.update((prev) => prev + 1);
    this.getMovies({ ...this.request(), page: this.page() }, true);
  }

  private atBottom(event: Event) {
    const tracker = event.target as HTMLElement;
    const limit = tracker.scrollHeight - tracker.clientHeight;
    return Math.ceil(tracker.scrollTop) === limit;
  }
}
