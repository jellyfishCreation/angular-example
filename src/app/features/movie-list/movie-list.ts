import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { MovieApi } from '../../api/movie-api';

import { StrapiResponse } from '../../models/strapi';
import { Movie } from '../../models/movies';

@Component({
  selector: 'app-movie-list',
  imports: [[MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule]],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList implements OnInit {
  movieApi = inject(MovieApi);

  movies = signal<StrapiResponse<Movie[]> | null>(null);

  search = '';

  ngOnInit() {
    this.movieApi.getMovies().subscribe((response) => {
      this.movies.set(response);
    });
  }
}
