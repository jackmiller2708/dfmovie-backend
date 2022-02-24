export type CreateCategoryDto = {
  name: string;
  translationKey: string;
  movies?: string[]
}

export type UpdateCategoryDto = {
  name?: string;
  translationKey?: string;
  movies?: string[];
}