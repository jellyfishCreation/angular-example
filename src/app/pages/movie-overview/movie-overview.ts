import { Component, inject, input, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MovieApi } from '../../api/movie-api';

import { StrapiResponse } from '../../models/strapi';
import { Movie } from '../../models/movies';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-overview',
  imports: [RouterModule, DatePipe],
  templateUrl: './movie-overview.html',
  styleUrl: './movie-overview.css',
})
export class MovieOverview implements OnInit {
  readonly movieApi = inject(MovieApi);

  id = input.required<string>();

  movie = signal<StrapiResponse<Movie> | null>(null);

  ngOnInit() {
    this.getMovie(this.id());
  }

  getMovie(id: string) {
    this.movieApi.getMovieById(id).subscribe((response) => {
      this.movie.set(response);
    });
  }
}
