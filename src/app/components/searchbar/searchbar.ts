import { Component, computed, inject, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounce, form, FormField } from '@angular/forms/signals';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GenreApi } from '../../api/genre-api';

import { Genre, MovieRequestParams, MovieSearchParams, MovieSortOption } from '../../models/movies';

@Component({
  selector: 'app-searchbar',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormField,
  ],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css',
})
export class Searchbar {
  protected readonly genreApi = inject(GenreApi);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);

  protected readonly searchChanged = output<MovieRequestParams>();

  protected genres = signal<Genre[] | null>(null);
  protected genresFailed = signal(false);

  protected queryParams = toSignal(this.route.queryParamMap);

  protected searchModel = signal<MovieSearchParams>({
    search: this.queryParams()?.get('search') || '',
    sort: (this.queryParams()?.get('sort') as MovieSortOption) || 'title:asc',
    genreId: this.queryParams()?.get('genreId') || '',
  });

  protected request = computed(() => ({
    search: this.searchForm.search().value(),
    sort: this.searchForm.sort().value(),
    genreId: this.searchForm.genreId().value(),
  }));

  protected searchForm = form(this.searchModel, (s) => {
    debounce(s.search, 300);
  });

  constructor() {
    this.onSearchChange();
    this.getGenres();
  }

  protected getGenres() {
    this.genreApi.getGenres().subscribe((response) => {
      this.genres.set(response);
    });
  }

  protected onSearchChange() {
    toObservable(this.request).subscribe((value) => {
      this.updateQueryParams();
      this.searchChanged.emit({ ...value, page: 1 });
    });
  }

  protected resetSearch() {
    this.searchForm.search().value.set('');
  }

  protected updateQueryParams() {
    this.router.navigate([], { queryParams: this.request(), queryParamsHandling: 'merge' });
  }
}
