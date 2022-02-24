export type CreateMovieDto = {
  title: string;
  poster: string;
  description: string;
  translationKey: string;
  categories?: string[];
}

export type UpdateMovieDto = {
  title?: string;
  poster?: string;
  description?: string;
  translationKey?: string;
  categories?: string[];
}