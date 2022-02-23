export type CreateMovieDto = {
  name: string;
  translationKey: string;
  poster: string;
  description: string;
  categories?: string[];
};

export type UpdateMovieDto = {
  name?: string;
  translationey?: string;
  poster?: string;
  description?: string;
  categories?: string[];
};
