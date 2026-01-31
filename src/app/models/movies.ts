import { StrapiBaseData, StrapiImage } from './strapi';

export interface Movie extends StrapiBaseData {
  title: string;
  overview: string;
  tagline: string;
  releaseDate: string;
  rating: number;
  genre: Genre[];
  poster: StrapiImage;
}

export interface Genre extends StrapiBaseData {
  name: string;
}
