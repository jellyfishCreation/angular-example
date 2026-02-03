import { Component, inject, input, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { MovieApi } from '../../api/movie-api';

import { Movie } from '../../models/movies';

@Component({
  selector: 'app-movie-overview',
  imports: [RouterModule, MatIconModule, DatePipe],
  templateUrl: './movie-overview.html',
  styleUrl: './movie-overview.css',
})
export class MovieOverview implements OnInit {
  protected readonly movieApi = inject(MovieApi);

  protected id = input.required<string>();

  protected movie = signal<Movie | null>(null);

  ngOnInit() {
    this.getMovie(this.id());
  }

  protected getMovie(id: string) {
    this.movieApi.getMovieById(id).subscribe((response) => {
      this.movie.set(response);
    });
  }
}
