import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address } from './address';

@Schema()
export class Customer {
  @Prop()
  fullName?: string;

  @Prop()
  phone?: string;

  @Prop(raw([SchemaFactory.createForClass(Address)]))
  addresses?: Address[];
}
