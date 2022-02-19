import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnimeDocument = Anime & Document;

@Schema()
export class Anime {
  @Prop({ required: true })
  name: string;

  @Prop({required: true})
  translationKey: string;

  @Prop({required: true})
  poster: string;

  @Prop({required: true})
  description: string;

  @Prop({default: false})
  isDeleted: boolean;
}

export const AnimeSchema = SchemaFactory.createForClass(Anime);
