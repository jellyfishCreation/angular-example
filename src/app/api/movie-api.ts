import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as qs from 'qs';

import { environment } from '../../environments/environments';

import { StrapiResponse } from '../models/strapi';
import { Movie, MovieSearchParams } from '../models/movies';

@Injectable({
  providedIn: 'root',
})
export class MovieApi {
  private http = inject(HttpClient);

  populateValues = ['genres', 'poster'];

  getMovies(searchParams: MovieSearchParams): Observable<StrapiResponse<Movie[]>> {
    const queryParams = qs.stringify(
      {
        sort: searchParams.sort,
        populate: this.populateValues,
        filters: {
          title: searchParams.search ? { $containsi: searchParams.search } : undefined,
          genres: {
            documentId: searchParams.filters.genreId
              ? { $eq: searchParams.filters.genreId }
              : undefined,
          },
        },
      },
      { encodeValuesOnly: true },
    );

    const params = new HttpParams({ fromString: queryParams });

    return this.http.get<StrapiResponse<Movie[]>>(`${environment.apiUrl}/movies`, { params });
  }

  getMovieById(id: string): Observable<StrapiResponse<Movie>> {
    const queryParams = qs.stringify(
      {
        populate: this.populateValues,
      },
      { encodeValuesOnly: true },
    );

    const params = new HttpParams({ fromString: queryParams });

    return this.http.get<StrapiResponse<Movie>>(`${environment.apiUrl}/movies/${id}`, { params });
  }
}
