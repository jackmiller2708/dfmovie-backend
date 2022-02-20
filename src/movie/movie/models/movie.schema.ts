import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from 'shared/base.schema';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  translationKey: string;

  @Prop({ required: true })
  poster: string;

  @Prop({ required: true })
  description: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
