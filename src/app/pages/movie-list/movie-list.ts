import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MovieApi } from '../../api/movie-api';

import { Movie, MovieRequestParams } from '../../models/movies';

import { Searchbar } from '../../components/searchbar/searchbar';

@Component({
  selector: 'app-movie-list',
  imports: [RouterModule, MatIconModule, MatProgressSpinnerModule, Searchbar, DatePipe],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList {
  protected movieApi = inject(MovieApi);

  protected searchModel = signal<MovieRequestParams>({
    search: '',
    sort: 'title:asc',
    genreId: '',
    page: 1,
  });
  protected pageCount = signal<number | null>(null);

  protected initialLoad = signal(false);
  protected movies = signal<Movie[] | null>(null);
  protected moviesFailed = signal(false);

  protected setSearchModel(searchParams: MovieRequestParams) {
    this.searchModel.set(searchParams);
    this.getMovies(this.searchModel());
  }

  private getMovies(searchParams: MovieRequestParams, append = false) {
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

  protected onScroll(event: Event) {
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
