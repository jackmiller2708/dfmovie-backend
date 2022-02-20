import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class BaseSchema {
  @Prop({ immutable: true, default: Date.now() })
  createdTime: Date;

  @Prop({ default: Date.now() })
  updatedTime: Date;

  @Prop({ default: false })
  isDeleted: boolean;
}
