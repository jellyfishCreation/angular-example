import { StrapiBaseData, StrapiImage } from './strapi';

export interface Movie extends StrapiBaseData {
  title: string;
  overview: string;
  tagline: string;
  releaseDate: string;
  rating: number;
  genres: Genre[];
  poster: StrapiImage;
}

export interface Genre extends StrapiBaseData {
  name: string;
}

export interface MovieSearchParams {
  search: string;
  sort: MovieSortOption;
  genreId: string;
}

export interface MovieRequestParams extends MovieSearchParams {
  page: number;
}

export type MovieSortOption = 'title:asc' | 'releaseDate:desc' | ['rating:desc', 'title:asc'];
