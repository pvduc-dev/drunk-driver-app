import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class DeviceToken {
  @Prop()
  userId?: string;

  @Prop()
  token?: string;
}
