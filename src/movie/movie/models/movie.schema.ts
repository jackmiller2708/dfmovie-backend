import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  translationKey: string;

  @Prop({ required: true })
  poster: string;

  @Prop({ required: true })
  description: string;

  @Prop({ immutable: true, default: Date.now() })
  createdTime: Date;

  @Prop({ default: Date.now() })
  updatedTime: Date;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
