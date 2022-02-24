import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Movie } from 'src/movie/movie/models/movie.schema';
import { Category } from 'src/movie/category/models/category.schema';

import * as mongoose from 'mongoose';

export type MovieCategoryDocument = MovieCategory & Document;

@Schema()
export class MovieCategory {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' })
  movie: Movie;
}

export const MovieCategorySchema = SchemaFactory.createForClass(MovieCategory);
