import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'shared/base.schema';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie extends BaseSchema {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  poster: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  translationKey: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
