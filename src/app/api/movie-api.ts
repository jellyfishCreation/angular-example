import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environments';

import { StrapiResponse } from '../models/strapi';
import { Movie } from '../models/movies';

@Injectable({
  providedIn: 'root',
})
export class MovieApi {
  private http = inject(HttpClient);

  getMovies(): Observable<StrapiResponse<Movie[]>> {
    const params = new HttpParams().set('populate[0]', 'genres').set('populate[1]', 'poster');

    return this.http.get<StrapiResponse<Movie[]>>(`${environment.apiUrl}/movies`, { params });
  }

  getMovieById(id: number): Observable<StrapiResponse<Movie>> {
    return this.http.get<StrapiResponse<Movie>>(`${environment.apiUrl}/movies/${id}`);
  }
}
