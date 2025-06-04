import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Config {
  @Prop()
  initialFee: number;

  @Prop()
  perKmFee: number;
}
