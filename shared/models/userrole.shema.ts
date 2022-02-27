import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/admin/roles/models/roles.schema';
import { User } from 'src/admin/users/models/user.schema';
import * as mongoose from 'mongoose';

export type UserRoleDocument = UserRole & Document;

@Schema()
export class UserRole {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
