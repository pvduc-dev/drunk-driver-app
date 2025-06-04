import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Admin {
  @Prop()
  name?: string;

  @Prop()
  email?: string;
}
