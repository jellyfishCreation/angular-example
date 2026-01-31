import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environments';

import { StrapiResponse } from '../models/strapi';
import { Movie } from '../models/movies';

@Injectable({
  providedIn: 'root',
})
export class Movies {
  private http = inject(HttpClient);

  getMovies(): Observable<StrapiResponse<Movie[]>> {
    return this.http.get<StrapiResponse<Movie[]>>(`${environment.apiUrl}/movies`);
  }
}
