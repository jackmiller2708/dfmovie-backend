import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'shared/base.schema';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  translationKey: string;

  @Prop({ required: true })
  description: string;

}

export const MovieSchema = SchemaFactory.createForClass(Category);
