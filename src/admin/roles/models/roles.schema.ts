import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'shared/base.schema';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema()
export class Role extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop()
  permissions: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
