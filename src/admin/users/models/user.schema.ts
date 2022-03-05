import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'shared/base.schema';
import { Document } from 'mongoose';
import { hashSync } from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User extends BaseSchema {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  pfp: string;

  @Prop({ required: true, set: (password: string) => hashSync(password, 10) })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
