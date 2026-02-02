import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { debounce, form, FormField } from '@angular/forms/signals';
// import { toObservable, toSignal } from '@angular/core/rxjs-interop';

// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MovieApi } from '../../api/movie-api';
// import { GenreApi } from '../../api/genre-api';

import { Movie, MovieRequestParams } from '../../models/movies';

import { Searchbar } from '../../components/searchbar/searchbar';

@Component({
  selector: 'app-movie-list',
  imports: [RouterModule, MatIconModule, MatProgressSpinnerModule, Searchbar, DatePipe],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList {
  movieApi = inject(MovieApi);

  searchModel = signal<MovieRequestParams>({
    search: '',
    sort: 'title:asc',
    genreId: '',
    page: 1,
  });
  pageCount = signal<number | null>(null);

  initialLoad = signal(false);
  movies = signal<Movie[] | null>(null);
  moviesFailed = signal(false);

  setSearchModel(searchParams: MovieRequestParams) {
    this.searchModel.set(searchParams);
    this.getMovies(this.searchModel());
  }

  getMovies(searchParams: MovieRequestParams, append = false) {
    if (this.pageCount() && searchParams.page > this.pageCount()!) return;

    if (this.movies() === null) {
      this.initialLoad.set(true);
    }

    this.movieApi.getMovies(searchParams).subscribe({
      next: (response) => {
        this.pageCount.set(response.meta.pagination?.pageCount || null);

        if (append) {
          this.movies.update((prev) => [...(prev || []), ...response.data]);
        } else {
          this.movies.set(response.data);
        }

        this.initialLoad.set(false);
      },
      error: () => {
        this.moviesFailed.set(true);
        this.initialLoad.set(false);
      },
    });
  }

  onScroll(event: Event) {
    if (!this.atBottom(event)) {
      return;
    }

    this.searchModel.update((s) => ({ ...s, page: s.page + 1 }));
    this.getMovies(this.searchModel(), true);
  }

  private atBottom(event: Event) {
    const tracker = event.target as HTMLElement;
    const limit = tracker.scrollHeight - tracker.clientHeight;
    return Math.ceil(tracker.scrollTop) === limit;
  }
}
