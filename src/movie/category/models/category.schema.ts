import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'shared/base.schema';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category extends BaseSchema {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  translationKey: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
