import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../environments/environments';

import { StrapiResponse } from '../models/strapi';
import { Genre } from '../models/movies';

@Injectable({
  providedIn: 'root',
})
export class GenreApi {
  private http = inject(HttpClient);

  getGenres(): Observable<Genre[]> {
    return this.http
      .get<StrapiResponse<Genre[]>>(`${environment.apiUrl}/genres`)
      .pipe(map((response) => response.data));
  }
}
