import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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
            documentId: searchParams.genreId ? { $eq: searchParams.genreId } : undefined,
          },
        },
        pagination: { page: searchParams.page, pageSize: 25 },
      },
      { encodeValuesOnly: true },
    );

    const params = new HttpParams({ fromString: queryParams });

    return this.http.get<StrapiResponse<Movie[]>>(`${environment.apiUrl}/movies`, { params });
  }

  getMovieById(id: string): Observable<Movie> {
    const queryParams = qs.stringify(
      {
        populate: this.populateValues,
      },
      { encodeValuesOnly: true },
    );

    const params = new HttpParams({ fromString: queryParams });

    return this.http
      .get<StrapiResponse<Movie>>(`${environment.apiUrl}/movies/${id}`, { params })
      .pipe(map((response) => response.data));
  }
}
