import { Prop, Schema } from '@nestjs/mongoose';

@Schema({
  collection: 'otps',
  timestamps: true,
})
export class Otp {
  @Prop()
  phone?: string;

  @Prop()
  code?: string;

  @Prop({ type: Date, expires: '0' })
  expiresAt?: Date;
}
