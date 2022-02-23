export type CreateCategoryDto = {
  name: string;
  translationKey: string;
}

export type UpdateCategoryDto = {
  name?: string;
  translationKey?: string;
}